import { QFactoryMachineDef, QFactoryMachineModeDef, QFactoryModeIngredient } from './QFactoryMachineSchema';
import { QFactoryBuilding, QFactoryItemType } from './QFactoryTypes';

export class QFactoryWorkshopStep {
  public static stepWorkshopBuilding(bld: QFactoryBuilding, def: QFactoryMachineDef, deltaSec: number): number {
    this.drainInputQueueIntoCounts(bld);
    const mode = this.resolveActiveMode(bld, def);
    bld.powerUsageMW = mode.powerMW;
    bld.cycleDurationSec = mode.cycleSec;
    if (def.category !== 'harvest') {
      bld.producesItem = mode.producesItem;
    }

    const powered = bld.status !== 'off' && bld.status !== 'shutting down' && bld.status !== 'tripped';
    const hasSpace = bld.outputBufferCount < bld.outStackCapacity;
    const hasIngredients = this.canSatisfyInputs(bld, mode.inputs);
    const shouldSpinUp = powered && hasSpace && hasIngredients;

    const spin = this.advanceSpinRatio(bld, def, shouldSpinUp, powered, deltaSec);
    if (spin <= 0 || !shouldSpinUp) {
      return 0;
    }

    bld.productionProgress += deltaSec * spin;
    let giftCreditEarned = 0;

    while (bld.productionProgress >= mode.cycleSec) {
      if (bld.outputBufferCount >= bld.outStackCapacity || !this.canSatisfyInputs(bld, mode.inputs)) {
        break;
      }
      bld.productionProgress -= mode.cycleSec;
      this.consumeInputs(bld, mode.inputs);
      const outItem = bld.producesItem ? bld.producesItem : mode.producesItem;
      bld.outputBufferCount++;
      bld.storedCount++;
      bld.lastItemType = outItem;

      if (mode.giftCredit) {
        giftCreditEarned += mode.giftCredit;
      }
      this.tryEmitBasketByproduct(bld, def, mode);
    }

    bld.isOutStackFull = bld.outputBufferCount >= bld.outStackCapacity;
    bld.isInStackFull = bld.inputBufferCount >= bld.inStackCapacity;
    return giftCreditEarned;
  }

  private static drainInputQueueIntoCounts(bld: QFactoryBuilding): void {
    if (!bld.ingredientCounts) {
      bld.ingredientCounts = {};
    }
    if (!bld.inputQueue || bld.inputQueue.length === 0) {
      return;
    }
    while (bld.inputQueue.length > 0) {
      const item = bld.inputQueue.shift() as QFactoryItemType;
      const prev = bld.ingredientCounts[item];
      bld.ingredientCounts[item] = (prev !== undefined ? prev : 0) + 1;
    }
  }

  private static resolveActiveMode(bld: QFactoryBuilding, def: QFactoryMachineDef): QFactoryMachineModeDef {
    const found = def.modes.find((m) => m.id === bld.activeModeId);
    if (found) return found;
    bld.activeModeId = def.modes[0].id;
    return def.modes[0];
  }

  private static advanceSpinRatio(
    bld: QFactoryBuilding,
    def: QFactoryMachineDef,
    shouldSpinUp: boolean,
    powered: boolean,
    deltaSec: number
  ): number {
    const current = bld.spinRatio !== undefined ? bld.spinRatio : 0;
    let next = current;
    if (shouldSpinUp) {
      const step = def.spinUpSec > 0 ? deltaSec / def.spinUpSec : 1;
      next = Math.min(1, current + step);
      bld.status = next < 0.99 ? 'powering up' : 'powered on';
    } else {
      const step = def.spinDownSec > 0 ? deltaSec / def.spinDownSec : 1;
      next = Math.max(0, current - step);
      if (!powered) {
        bld.status = next > 0.01 ? 'shutting down' : 'off';
      } else {
        bld.status = 'powered on';
      }
    }
    bld.spinRatio = next;
    return next;
  }

  private static findMatchingItem(
    counts: Partial<Record<QFactoryItemType, number>>,
    req: QFactoryModeIngredient
  ): QFactoryItemType | null {
    const candidates = req.acceptedItems ? req.acceptedItems : [req.itemType];
    for (const candidate of candidates) {
      const have = counts[candidate];
      if (have !== undefined && have >= req.count) {
        return candidate;
      }
    }
    return null;
  }

  private static canSatisfyInputs(bld: QFactoryBuilding, inputs: QFactoryModeIngredient[]): boolean {
    if (inputs.length === 0) return true;
    const counts = bld.ingredientCounts ? bld.ingredientCounts : {};
    for (const req of inputs) {
      if (!this.findMatchingItem(counts, req)) return false;
    }
    return true;
  }

  private static consumeInputs(bld: QFactoryBuilding, inputs: QFactoryModeIngredient[]): void {
    if (!bld.ingredientCounts) return;
    let totalConsumed = 0;
    for (const req of inputs) {
      const match = this.findMatchingItem(bld.ingredientCounts, req);
      if (match) {
        const cur = bld.ingredientCounts[match] as number;
        bld.ingredientCounts[match] = cur - req.count;
        totalConsumed += req.count;
      }
    }
    bld.inputBufferCount = Math.max(0, bld.inputBufferCount - totalConsumed);
  }

  private static tryEmitBasketByproduct(
    bld: QFactoryBuilding,
    def: QFactoryMachineDef,
    mode: QFactoryMachineModeDef
  ): void {
    if (!def.basket || !mode.byproductEveryCycles) return;
    if (bld.storedCount % mode.byproductEveryCycles !== 0) return;
    const current = bld.basketCount !== undefined ? bld.basketCount : 0;
    if (current < def.basket.capacity) {
      bld.basketCount = current + 1;
    }
  }
}
