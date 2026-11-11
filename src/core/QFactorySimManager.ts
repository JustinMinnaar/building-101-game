import { QFactoryBeltMath } from './QFactoryBeltMath';
import { QFACTORY_BLUEPRINTS } from './QFactoryBlueprints';
import { QFactoryCustomMachineStore } from './QFactoryCustomMachineStore';
import { QFactoryEconomyManager } from './QFactoryEconomyManager';
import { QFactoryFloorPoleMath } from './QFactoryFloorPoleMath';
import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFactoryPlacementValidator } from './QFactoryPlacementValidator';
import { QFACTORY_RESOURCE_NODES } from './QFactoryResourceNodes';
import { QFactorySmelterLogic } from './QFactorySmelterLogic';
import { QFactoryStarterLineBuilder } from './QFactoryStarterLineBuilder';
import { QFactoryWorkshopStep } from './QFactoryWorkshopStep';
import {
  QFACTORY_HOTBAR_SLOTS,
  QFactoryBelt,
  QFactoryBeltShape,
  QFactoryBuilding,
  QFactoryBuildingType,
  QFactoryFoundationFloor,
  QFactoryHotbarSlot,
  QFactoryItemType,
  QFactoryMachineDetails,
  QFactoryPort,
  QFactoryRecipe,
  QFactoryResourceNode,
  QFactoryThemePack,
  QFactoryToolId,
} from './QFactoryTypes';

export class QFactorySimManager {
  private _activeSlotKey = '';
  private _activeToolId: QFactoryToolId = 'miner';
  private _beltShapeMode: QFactoryBeltShape = 'default';
  private _selectedBuildingId: string | null = null;
  private _selectedBuildingIds = new Set<string>();
  private _selectedBeltIds = new Set<string>();
  private _foundationFloors = new Map<string, QFactoryFoundationFloor>();
  private _buildings = new Map<string, QFactoryBuilding>();
  private _belts = new Map<string, QFactoryBelt>();
  private _nextId = 1;
  private _totalGiftBoxesWrapped = 0;
  private _activeFloorLevel = 0;
  private _themePack: QFactoryThemePack = 'sweet-toy';
  private _economy = new QFactoryEconomyManager();

  constructor() {
    QFactoryCustomMachineStore.ensurePresetsRegistered();
  }

  public getEconomy(): QFactoryEconomyManager { return this._economy; }
  public getActiveFloorLevel(): number { return this._activeFloorLevel; }
  public setActiveFloorLevel(level: number): void { this._activeFloorLevel = Math.max(0, Math.min(3, Math.round(level))); }
  public getThemePack(): QFactoryThemePack { return this._themePack; }
  public setThemePack(pack: QFactoryThemePack): void { this._themePack = pack; }

  public getResourceNodes(): QFactoryResourceNode[] { return QFACTORY_RESOURCE_NODES; }
  public getHotbarSlots(): QFactoryHotbarSlot[] { return QFACTORY_HOTBAR_SLOTS; }
  public getActiveSlot(): QFactoryHotbarSlot {
    return QFACTORY_HOTBAR_SLOTS.find((s) => s.key === this._activeSlotKey) || QFACTORY_HOTBAR_SLOTS[0];
  }
  public getActiveTool(): QFactoryToolId { return this._activeToolId; }

  public selectSlotByKey(key: string): QFactoryHotbarSlot {
    const slot = QFACTORY_HOTBAR_SLOTS.find((s) => s.key === key);
    if (!slot) throw new Error(`Unknown hotbar key: ${key}`);
    if (this._activeSlotKey === key && this._activeToolId !== 'select') {
      slot.activeVariantIndex = (slot.activeVariantIndex + 1) % slot.variants.length;
    }
    this._activeSlotKey = key;
    const variant = slot.variants[slot.activeVariantIndex] || slot.variants[0];
    this._activeToolId = variant.toolId;
    slot.toolId = variant.toolId;
    slot.name = variant.name;
    slot.subtitle = variant.subtitle;
    slot.icon = variant.icon;
    return slot;
  }

  public setSelectTool(): void { this._activeToolId = 'select'; }
  public setActiveTool(toolId: QFactoryToolId): void { this._activeToolId = toolId; }
  public setBeltShapeMode(shape: QFactoryBeltShape): void { this._beltShapeMode = shape; }
  public getBeltShapeMode(): QFactoryBeltShape { return this._beltShapeMode; }

  public getSelectedBuildingIds(): string[] { return Array.from(this._selectedBuildingIds); }
  public getSelectedBeltIds(): string[] { return Array.from(this._selectedBeltIds); }

  public selectItem(id: string, isCtrl = false): void {
    if (!isCtrl) {
      this._selectedBuildingIds.clear();
      this._selectedBeltIds.clear();
    }
    if (this._buildings.has(id)) {
      if (isCtrl && this._selectedBuildingIds.has(id)) {
        this._selectedBuildingIds.delete(id);
      } else {
        this._selectedBuildingIds.add(id);
      }
      this._selectedBuildingId = id;
    } else if (this._belts.has(id)) {
      if (isCtrl && this._selectedBeltIds.has(id)) {
        this._selectedBeltIds.delete(id);
      } else {
        this._selectedBeltIds.add(id);
      }
      this._selectedBuildingId = null;
    }
  }

  public selectInRect(minX: number, minZ: number, maxX: number, maxZ: number, isCtrl = false): void {
    if (!isCtrl) {
      this._selectedBuildingIds.clear();
      this._selectedBeltIds.clear();
    }
    const x1 = Math.min(minX, maxX);
    const x2 = Math.max(minX, maxX);
    const z1 = Math.min(minZ, maxZ);
    const z2 = Math.max(minZ, maxZ);

    for (const [id, b] of this._buildings.entries()) {
      if (b.x >= x1 && b.x <= x2 && b.z >= z1 && b.z <= z2) {
        this._selectedBuildingIds.add(id);
      }
    }
    for (const [id, belt] of this._belts.entries()) {
      const inStart = belt.startPoint.x >= x1 && belt.startPoint.x <= x2 && belt.startPoint.z >= z1 && belt.startPoint.z <= z2;
      const inEnd = belt.endPoint.x >= x1 && belt.endPoint.x <= x2 && belt.endPoint.z >= z1 && belt.endPoint.z <= z2;
      if (inStart || inEnd) {
        this._selectedBeltIds.add(id);
      }
    }
  }

  public deleteSelected(): { buildingsDeleted: number; beltsDeleted: number } {
    let buildingsDeleted = 0;
    let beltsDeleted = 0;
    const bldIds = Array.from(this._selectedBuildingIds);
    const beltIds = Array.from(this._selectedBeltIds);

    for (const id of beltIds) {
      if (this._belts.has(id)) {
        this.removeBuildingOrBelt(id);
        beltsDeleted++;
      }
    }
    for (const id of bldIds) {
      if (this._buildings.has(id)) {
        this.removeBuildingOrBelt(id);
        buildingsDeleted++;
      }
    }
    this._selectedBuildingIds.clear();
    this._selectedBeltIds.clear();
    this._selectedBuildingId = null;
    return { buildingsDeleted, beltsDeleted };
  }

  public selectBuilding(id: string): void {
    this.selectItem(id, false);
  }
  public deselectBuilding(): void {
    this._selectedBuildingId = null;
    this._selectedBuildingIds.clear();
    this._selectedBeltIds.clear();
  }
  public getSelectedBuildingId(): string | null { return this._selectedBuildingId; }

  public getMachineDetails(id: string): QFactoryMachineDetails | undefined {
    const b = this._buildings.get(id);
    if (!b) return undefined;
    const rate = b.cycleDurationSec > 0 ? Math.round(60 / b.cycleDurationSec) : 0;
    const def = QFactoryMachineRegistry.has(b.type) ? QFactoryMachineRegistry.getById(b.type) : null;
    const availableModes = def?.modes.map((m) => ({
      id: m.id,
      label: m.label,
      producesItem: m.producesItem,
      inputsSummary: m.inputs.length === 0 ? 'Resource Patch' : m.inputs.map((inp) => `${inp.count}x ${inp.itemType}`).join(' + '),
    }));
    return {
      id: b.id, name: b.name, type: b.type, status: b.status,
      productionRatePerMin: rate, powerUsageMW: b.powerUsageMW, recipeName: b.recipeName,
      inputBufferCount: b.inputBufferCount, outputBufferCount: b.outputBufferCount,
      inStackCapacity: b.inStackCapacity, outStackCapacity: b.outStackCapacity,
      isInStackFull: b.inputBufferCount >= b.inStackCapacity,
      isOutStackFull: b.outputBufferCount >= b.outStackCapacity,
      storedCount: b.storedCount, consumesItem: b.consumesItem,
      producesItem: b.producesItem, lastItemType: b.lastItemType,
      activeModeId: b.activeModeId,
      availableModes,
      spinRatio: b.spinRatio,
      basketLabel: b.basketLabel,
      basketCount: b.basketCount,
      basketCapacity: b.basketCapacity,
      ingredientCounts: b.ingredientCounts ? { ...b.ingredientCounts } : undefined,
    };
  }

  public selectMachineMode(id: string, modeId: string): void {
    const b = this._buildings.get(id);
    if (!b) throw new Error(`Building "${id}" not found.`);
    const def = QFactoryMachineRegistry.getById(b.type);
    const mode = def.modes.find((m) => m.id === modeId);
    if (!mode) throw new Error(`Mode "${modeId}" does not exist on ${def.name}.`);
    b.activeModeId = mode.id;
    b.recipeName = mode.label;
    b.cycleDurationSec = mode.cycleSec;
    b.powerUsageMW = mode.powerMW;
    if (def.category !== 'harvest') {
      b.producesItem = mode.producesItem;
    }
    b.consumesItem = mode.inputs[0]?.itemType;
  }

  public collectMachineBasket(id: string): number {
    const b = this._buildings.get(id);
    if (!b || !b.basketCount) return 0;
    const collected = b.basketCount;
    b.basketCount = 0;
    return collected;
  }

  public feedMachineFromPouch(
    id: string,
    pouch: Partial<Record<QFactoryItemType, number>>
  ): number {
    const b = this._buildings.get(id);
    if (!b || !QFactoryMachineRegistry.has(b.type)) return 0;
    const def = QFactoryMachineRegistry.getById(b.type);
    const mode = def.modes.find((m) => m.id === b.activeModeId) ?? def.modes[0];
    if (!b.ingredientCounts) b.ingredientCounts = {};
    let totalFed = 0;

    for (const req of mode.inputs) {
      const candidates = req.acceptedItems ? req.acceptedItems : [req.itemType];
      for (const item of candidates) {
        const avail = pouch[item];
        if (avail !== undefined && avail > 0 && b.inputBufferCount < b.inStackCapacity) {
          const give = Math.min(avail, 2, b.inStackCapacity - b.inputBufferCount);
          pouch[item] = avail - give;
          const prev = b.ingredientCounts[item];
          b.ingredientCounts[item] = (prev !== undefined ? prev : 0) + give;
          b.inputBufferCount += give;
          totalFed += give;
          break;
        }
      }
    }
    return totalFed;
  }

  public getTotalGiftBoxesWrapped(): number {
    return this._totalGiftBoxesWrapped;
  }

  public toggleBuildingPower(id: string): void {
    const b = this._buildings.get(id);
    if (!b) return;
    b.status = b.status === 'powered on' || b.status === 'powering up' ? 'shutting down' : 'powering up';
  }

  public setBuildingRecipe(id: string, recipe: QFactoryRecipe): void {
    const b = this._buildings.get(id);
    if (!b) return;
    b.recipeName = recipe.name;
    b.consumesItem = recipe.consumesItem;
    b.producesItem = recipe.producesItem;
    b.cycleDurationSec = recipe.cycleDurationSec;
  }

  public snapToGrid(x: number, z: number, gridSize = 2): { x: number; z: number } {
    return { x: Math.round(x / gridSize) * gridSize, z: Math.round(z / gridSize) * gridSize };
  }

  public getFoundationFloors(): QFactoryFoundationFloor[] {
    return Array.from(this._foundationFloors.values());
  }

  public findFoundationAt(x: number, z: number): QFactoryFoundationFloor | undefined {
    let highest: QFactoryFoundationFloor | undefined;
    for (const f of this._foundationFloors.values()) {
      if (x >= f.minX && x <= f.maxX && z >= f.minZ && z <= f.maxZ) {
        if (!highest || f.topY >= highest.topY) {
          highest = f;
        }
      }
    }
    return highest;
  }

  public validatePlacement(
    type: QFactoryBuildingType,
    x: number,
    z: number,
    requireFoundation = false
  ): { valid: boolean; reason?: string } {
    const snapped = this.snapToGrid(x, z);
    return QFactoryPlacementValidator.validate(
      type,
      snapped.x,
      snapped.z,
      this._buildings.values(),
      requireFoundation,
      this._foundationFloors.values()
    );
  }

  public placeFoundationRect(
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    thickness = 1,
    levelIndex = this._activeFloorLevel
  ): QFactoryFoundationFloor {
    const minX = Math.round(Math.min(x1, x2));
    let maxX = Math.round(Math.max(x1, x2));
    const minZ = Math.round(Math.min(z1, z2));
    let maxZ = Math.round(Math.max(z1, z2));
    if (maxX === minX) maxX = minX + 1;
    if (maxZ === minZ) maxZ = minZ + 1;

    const lvl = Math.max(0, Math.round(levelIndex));
    const y = QFactoryFloorPoleMath.computeDeckElevation(lvl);
    const id = `floor_${this._nextId++}`;
    const floor: QFactoryFoundationFloor = {
      id,
      minX,
      maxX,
      minZ,
      maxZ,
      width: maxX - minX,
      depth: maxZ - minZ,
      thickness,
      y,
      topY: y + thickness,
      levelIndex: lvl,
      poles: QFactoryFloorPoleMath.computeSupportPoles(minX, maxX, minZ, maxZ, y),
    };
    this._foundationFloors.set(id, floor);
    return floor;
  }

  public placeBuilding(
    type: QFactoryBuildingType,
    x: number,
    z: number,
    rotationDeg = 0,
    bypassTerrainCheck = false,
    requireFoundation = false
  ): QFactoryBuilding {
    const bp = QFACTORY_BLUEPRINTS[type];
    if (!bp) throw new Error(`Unsupported building type: ${type}`);
    const snapped = this.snapToGrid(x, z);

    if (!bypassTerrainCheck) {
      const check = this.validatePlacement(type, snapped.x, snapped.z, requireFoundation);
      if (!check.valid) {
        throw new Error(check.reason);
      }
    }

    const floor = this.findFoundationAt(snapped.x, snapped.z);
    const floorY = floor ? floor.topY : 0;

    const id = `bld_${this._nextId++}`;
    const rad = (rotationDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const ports: QFactoryPort[] = bp.ports.map((p) => {
      const lx = p.relDepth * bp.depth;
      const lz = p.relWidth * bp.width;
      const wx = snapped.x + lx * cos - lz * sin;
      const wz = snapped.z + lx * sin + lz * cos;
      return { id: p.id, type: p.type, worldPosition: { x: wx, y: floorY + p.height, z: wz } };
    });

    let producesItem = bp.producesItem;
    const workshopDef = QFactoryMachineRegistry.has(type) ? QFactoryMachineRegistry.getById(type) : null;
    if (type === 'miner' || type === 'miner-mk2' || workshopDef?.placementRule === 'resource-node') {
      const near = QFACTORY_RESOURCE_NODES.find((n) => Math.hypot(n.x - snapped.x, n.z - snapped.z) <= n.radius);
      if (near) producesItem = near.oreType;
    }

    const building: QFactoryBuilding = {
      id, type, name: bp.name, x: snapped.x, y: floorY, z: snapped.z, rotationDeg,
      width: bp.width, depth: bp.depth, height: bp.height,
      ports, inputPorts: ports.filter((p) => p.type === 'input'), outputPorts: ports.filter((p) => p.type === 'output'),
      inputPort: ports.find((p) => p.type === 'input')?.worldPosition, outputPort: ports.find((p) => p.type === 'output')?.worldPosition,
      status: (type === 'smelter' || type === 'smelter-mk2') ? 'powering up' : 'powered on',
      powerUsageMW: bp.powerUsageMW,
      recipeName: workshopDef?.modes[0].label,
      inputBufferCount: 0, outputBufferCount: 0,
      inStackCapacity: bp.inStackCapacity, outStackCapacity: bp.outStackCapacity,
      isInStackFull: false, isOutStackFull: false, storedCount: 0,
      productionProgress: 0, cycleDurationSec: bp.cycleDurationSec,
      consumesItem: bp.consumesItem, producesItem,
      nextSplitterOutIndex: 0, inputQueue: [],
      activeModeId: workshopDef?.modes[0].id,
      spinRatio: workshopDef ? 0 : undefined,
      basketLabel: workshopDef?.basket?.label,
      basketCount: workshopDef?.basket ? 0 : undefined,
      basketCapacity: workshopDef?.basket?.capacity,
      ingredientCounts: workshopDef ? {} : undefined,
    };
    this._buildings.set(id, building);
    return building;
  }

  public connectBelt(sourceId: string, targetId: string, shape?: QFactoryBeltShape, srcPortId?: string, tgtPortId?: string): QFactoryBelt {
    if (sourceId === targetId) throw new Error('Cannot connect a building belt to itself.');
    const source = this._buildings.get(sourceId);
    const target = this._buildings.get(targetId);
    if (!source || !target) throw new Error('Source or target building does not exist.');

    const sourcePort = srcPortId ? source.outputPorts.find((p) => p.id === srcPortId) : source.outputPorts.find((p) => !p.connectedBeltId);
    if (!sourcePort) throw new Error(`Building ${source.name} output port already has a connected belt.`);

    const targetPort = tgtPortId ? target.inputPorts.find((p) => p.id === tgtPortId) : target.inputPorts.find((p) => !p.connectedBeltId);
    if (!targetPort) throw new Error(`Building ${target.name} input port already has a connected belt.`);

    const beltId = `belt_${this._nextId++}`;
    const beltShape = shape || this._beltShapeMode;
    const { pathPoints, lengthMeters } = QFactoryBeltMath.computeBeltPath(sourcePort.worldPosition, targetPort.worldPosition, beltShape);
    if (lengthMeters > 100) {
      throw new Error(`Conveyor belt length (${Math.round(lengthMeters)}m) exceeds maximum allowable length of 100 meters.`);
    }
    const belt: QFactoryBelt = {
      id: beltId, sourceId, targetId, sourcePortId: sourcePort.id, targetPortId: targetPort.id,
      startPoint: { ...sourcePort.worldPosition }, endPoint: { ...targetPort.worldPosition },
      shape: beltShape, pathPoints, lengthMeters, speedMetersPerSec: 6.0, items: [],
    };
    sourcePort.connectedBeltId = beltId;
    targetPort.connectedBeltId = beltId;
    this._belts.set(belt.id, belt);
    return belt;
  }

  public removeBuildingOrBelt(id: string): void {
    const belt = this._belts.get(id);
    if (belt) { this.disconnectBeltPorts(belt); this._belts.delete(id); return; }
    const bld = this._buildings.get(id);
    if (bld) {
      if (this._selectedBuildingId === id) this._selectedBuildingId = null;
      this._buildings.delete(id);
      for (const [bId, b] of this._belts.entries()) {
        if (b.sourceId === id || b.targetId === id) { this.disconnectBeltPorts(b); this._belts.delete(bId); }
      }
    }
  }

  private disconnectBeltPorts(belt: QFactoryBelt): void {
    const src = this._buildings.get(belt.sourceId);
    const tgt = this._buildings.get(belt.targetId);
    src?.outputPorts.forEach((p) => { if (p.connectedBeltId === belt.id) p.connectedBeltId = undefined; });
    tgt?.inputPorts.forEach((p) => { if (p.connectedBeltId === belt.id) p.connectedBeltId = undefined; });
  }

  public buildStarterProductionLine(centerZ = 0): void {
    QFactoryStarterLineBuilder.build(this, centerZ);
  }

  public buildToyAndSweetShowcase(): void {
    QFactoryStarterLineBuilder.buildToyAndSweetShowcase(this);
  }

  public buildThemeShowcase(): void {
    this.clearAll();
    if (this._themePack === 'smart-brain-toys') {
      QFactoryStarterLineBuilder.buildSmartBrainToyShowcase(this);
    } else {
      QFactoryStarterLineBuilder.buildMultiLevelSweetToyShowcase(this);
    }
  }

  public stepSimulation(deltaSec: number): void {
    const prevGifts = this._totalGiftBoxesWrapped;
    this.stepBuildings(deltaSec);
    this.stepBelts(deltaSec);
    let activeGooExtractors = 0;
    for (const b of this._buildings.values()) {
      if (b.type === 'color-extractor' && b.status === 'powered on') activeGooExtractors++;
    }
    this._economy.tickPassiveHarvest(deltaSec, activeGooExtractors, this._totalGiftBoxesWrapped - prevGifts);
  }

  private stepBuildings(deltaSec: number): void {
    for (const bld of this._buildings.values()) {
      if (QFactoryMachineRegistry.has(bld.type)) {
        const def = QFactoryMachineRegistry.getById(bld.type);
        this._totalGiftBoxesWrapped += QFactoryWorkshopStep.stepWorkshopBuilding(bld, def, deltaSec);
        continue;
      }
      if (bld.type === 'smelter' || bld.type === 'smelter-mk2') {
        QFactorySmelterLogic.stepSmelter(bld, deltaSec);
        continue;
      }
      if (bld.status === 'powering up') bld.status = 'powered on';
      if (bld.status === 'shutting down') bld.status = 'off';
      bld.isOutStackFull = bld.outputBufferCount >= bld.outStackCapacity;
      bld.isInStackFull = bld.inputBufferCount >= bld.inStackCapacity;

      if (bld.type === 'splitter' || bld.type === 'merger' || bld.type === 'connector') {
        if (bld.inputBufferCount > 0 && bld.outputBufferCount < bld.outStackCapacity) {
          bld.inputBufferCount--;
          bld.outputBufferCount++;
          if (bld.inputQueue && bld.inputQueue.length > 0) {
            bld.lastItemType = bld.inputQueue.shift();
            bld.producesItem = bld.lastItemType;
          }
        }
        continue;
      }

      if (bld.status !== 'powered on' || bld.cycleDurationSec <= 0 || !bld.producesItem) continue;
      if (bld.isOutStackFull || (bld.consumesItem && bld.inputBufferCount <= 0)) continue;

      bld.productionProgress += deltaSec;
      if (bld.productionProgress >= bld.cycleDurationSec) {
        bld.productionProgress -= bld.cycleDurationSec;
        if (bld.consumesItem) bld.inputBufferCount--;
        bld.outputBufferCount++;
        bld.storedCount++;
        bld.lastItemType = bld.producesItem;
        bld.isOutStackFull = bld.outputBufferCount >= bld.outStackCapacity;
        bld.isInStackFull = bld.inputBufferCount >= bld.inStackCapacity;
      }
    }
  }

  private stepBelts(deltaSec: number): void {
    for (const belt of this._belts.values()) {
      const target = this._buildings.get(belt.targetId);
      if (!target) continue;

      belt.isStopped = target.type !== 'container' && target.inputBufferCount >= target.inStackCapacity;
      if (belt.isStopped) continue;

      const step = (belt.speedMetersPerSec * deltaSec) / belt.lengthMeters;
      for (let i = belt.items.length - 1; i >= 0; i--) {
        const item = belt.items[i];
        const maxP = i === belt.items.length - 1 ? 1.0 : belt.items[i + 1].progress - 0.14;
        item.progress = Math.min(maxP, item.progress + step);
        if (item.progress >= 0.995) {
          if (target.type === 'container') {
            target.storedCount++;
            target.lastItemType = item.itemType;
          } else {
            if (!target.inputQueue) target.inputQueue = [];
            target.inputQueue.push(item.itemType);
            target.inputBufferCount = target.inputQueue.length;
            target.isInStackFull = target.inputBufferCount >= target.inStackCapacity;
          }
          belt.items.splice(i, 1);
        }
      }
    }
    this.feedBeltsFromSources();
  }

  private feedBeltsFromSources(): void {
    for (const bld of this._buildings.values()) {
      if (bld.outputBufferCount <= 0) continue;
      const outBelts = Array.from(this._belts.values()).filter((b) => b.sourceId === bld.id && !b.isStopped);
      if (outBelts.length === 0) continue;

      if (bld.type === 'splitter') {
        const idx = (bld.nextSplitterOutIndex || 0) % outBelts.length;
        const targetBelt = outBelts[idx];
        const firstP = targetBelt.items.length > 0 ? targetBelt.items[0].progress : 1.0;
        if (firstP >= 0.16 && targetBelt.items.length < 12) {
          bld.outputBufferCount--;
          bld.nextSplitterOutIndex = (idx + 1) % outBelts.length;
          targetBelt.items.unshift({ id: `itm_${this._nextId++}`, itemType: bld.lastItemType || 'iron-ore', progress: 0 });
        }
      } else {
        for (const belt of outBelts) {
          if (bld.outputBufferCount <= 0) break;
          const firstP = belt.items.length > 0 ? belt.items[0].progress : 1.0;
          if (firstP >= 0.16 && belt.items.length < 12) {
            bld.outputBufferCount--;
            const itemType = bld.producesItem ?? bld.lastItemType ?? 'iron-ore';
            belt.items.unshift({ id: `itm_${this._nextId++}`, itemType, progress: 0 });
          }
        }
      }
    }
  }

  public getBuildings(): QFactoryBuilding[] { return Array.from(this._buildings.values()); }
  public getBuildingById(id: string): QFactoryBuilding | undefined { return this._buildings.get(id); }
  public getBelts(): QFactoryBelt[] { return Array.from(this._belts.values()); }
  public clearAll(): void {
    this._buildings.clear();
    this._belts.clear();
    this._foundationFloors.clear();
    this._selectedBuildingId = null;
    this._totalGiftBoxesWrapped = 0;
  }
}
