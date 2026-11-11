import { QFactoryBuilding } from './QFactoryTypes';

export class QFactorySmelterLogic {
  public static stepSmelter(bld: QFactoryBuilding, deltaSec: number): void {
    if (bld.type !== 'smelter' && bld.type !== 'smelter-mk2') return;
    if (bld.status === 'off' || bld.status === 'tripped' || bld.status === 'shutting down') return;

    if (!bld.inputQueue) bld.inputQueue = [];
    while (bld.inputQueue.length < bld.inputBufferCount) {
      bld.inputQueue.push(bld.consumesItem || bld.activeOreType || 'iron-ore');
    }
    bld.inputBufferCount = bld.inputQueue.length;

    if (bld.inputQueue.length === 0 && !bld.activeOreType) {
      bld.status = 'powered on';
      return;
    }

    const nextOre = bld.inputQueue[0] || bld.activeOreType;
    if (!nextOre) return;

    // 1. Initial 15s Spin-up Warmup
    if (!bld.activeOreType) {
      bld.activeOreType = nextOre;
      bld.warmupTimerSec = 15.0;
      bld.status = 'powering up';
    }

    if (bld.warmupTimerSec !== undefined && bld.warmupTimerSec > 0) {
      bld.status = 'powering up';
      if (deltaSec < bld.warmupTimerSec) {
        bld.warmupTimerSec -= deltaSec;
        return;
      }
      deltaSec -= bld.warmupTimerSec;
      bld.warmupTimerSec = 0;
      bld.status = 'powered on';
    }

    // 2. Ore Type Switching Check
    if (nextOre !== bld.activeOreType) {
      bld.status = `switching to smelting ${nextOre}`;
      // Wait for output queue to empty first!
      if (bld.outputBufferCount > 0) {
        return;
      }
      if (bld.switchTimerSec === undefined) {
        bld.switchTimerSec = 15.0;
      }
      if (deltaSec < bld.switchTimerSec) {
        bld.switchTimerSec -= deltaSec;
        return;
      }
      deltaSec -= bld.switchTimerSec;
      bld.activeOreType = nextOre;
      bld.switchTimerSec = undefined;
      bld.status = 'powered on';
    }

    // 3. Process Active Ore
    if (bld.isOutStackFull) return;
    if (bld.inputQueue.length === 0 || bld.inputQueue[0] !== bld.activeOreType) return;

    bld.status = 'powered on';
    bld.productionProgress += deltaSec;
    while (bld.productionProgress >= bld.cycleDurationSec) {
      if (bld.isOutStackFull) break;
      if (bld.inputQueue.length === 0 || bld.inputQueue[0] !== bld.activeOreType) break;
      bld.productionProgress -= bld.cycleDurationSec;
      const consumed = bld.inputQueue.shift();
      bld.inputBufferCount = bld.inputQueue.length;
      bld.outputBufferCount++;
      bld.storedCount++;
      bld.lastItemType = consumed === 'copper-ore' ? 'copper-ingot' : 'iron-ingot';
      bld.producesItem = bld.lastItemType;
      bld.isOutStackFull = bld.outputBufferCount >= bld.outStackCapacity;
      bld.isInStackFull = bld.inputBufferCount >= bld.inStackCapacity;
    }
  }
}
