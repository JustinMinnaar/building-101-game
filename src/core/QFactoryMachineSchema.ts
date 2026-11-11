import { QFactoryBuildingType, QFactoryItemType, QFactoryPoint3D } from './QFactoryTypes';

export interface QFactoryModeIngredient {
  itemType: QFactoryItemType;
  acceptedItems?: QFactoryItemType[];
  count: number;
}

export interface QFactoryMachineModeDef {
  id: string;
  label: string;
  powerMW: number;
  cycleSec: number;
  inputs: QFactoryModeIngredient[];
  producesItem: QFactoryItemType;
  giftCredit?: number;
  byproductItem?: QFactoryItemType;
  byproductEveryCycles?: number;
}

export interface QFactoryPortSpec {
  id: string;
  type: 'input' | 'output';
  relDepth: number;
  relWidth: number;
  height: number;
}

export interface QFactoryBasketSpec {
  id: string;
  label: string;
  itemType: QFactoryItemType;
  capacity: number;
  offset: QFactoryPoint3D;
}

export interface QFactoryBlockoutPartSpec {
  shape: 'box' | 'cylinder' | 'cone';
  size: [number, number, number];
  position: [number, number, number];
  colorHex: string;
}

export type QFactoryRoofStyle = 'striped-awning' | 'bunting-and-stacks' | 'ribbon-arch' | 'candy-dome' | 'prism-spout';
export type QFactoryInteriorTheme = 'sweet-swirl' | 'toy-assembly' | 'gizmo-lathe' | 'gift-wrap' | 'sugar-mill' | 'color-pump';

export interface QFactoryDetailedStyleSpec {
  shellColorHex: string;
  trimColorHex: string;
  roofStyle: QFactoryRoofStyle;
  interiorTheme: QFactoryInteriorTheme;
  hasCutawayWindow: boolean;
  smokeOffsets: QFactoryPoint3D[];
  helperTeddySide?: 'right' | 'left' | 'none';
}

export interface QFactoryMachineDef {
  id: QFactoryBuildingType;
  name: string;
  category: 'harvest' | 'sweets' | 'parts' | 'toys' | 'wrapping';
  placementRule: 'resource-node' | 'open-ground';
  acceptedNodeTypes?: QFactoryItemType[];
  footprint: { width: number; depth: number; height: number };
  spinUpSec: number;
  spinDownSec: number;
  inStackCapacity: number;
  outStackCapacity: number;
  ports: QFactoryPortSpec[];
  modes: QFactoryMachineModeDef[];
  basket?: QFactoryBasketSpec;
  blockout: QFactoryBlockoutPartSpec[];
  detailed: QFactoryDetailedStyleSpec;
}

export function validateMachineDef(raw: unknown): QFactoryMachineDef {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid MachineDefinition: expected JSON object.');
  }
  const obj = raw as Partial<QFactoryMachineDef>;
  if (!obj.id || typeof obj.id !== 'string') {
    throw new Error('Invalid MachineDefinition: missing string "id".');
  }
  if (!obj.name || typeof obj.name !== 'string') {
    throw new Error(`Invalid MachineDefinition (${obj.id}): missing "name".`);
  }
  if (!obj.footprint || obj.footprint.width <= 0 || obj.footprint.depth <= 0 || obj.footprint.height <= 0) {
    throw new Error(`Invalid MachineDefinition (${obj.id}): invalid "footprint".`);
  }
  if (typeof obj.spinUpSec !== 'number' || obj.spinUpSec < 0 || typeof obj.spinDownSec !== 'number' || obj.spinDownSec < 0) {
    throw new Error(`Invalid MachineDefinition (${obj.id}): invalid "spinUpSec" or "spinDownSec".`);
  }
  if (!Array.isArray(obj.ports) || obj.ports.length === 0) {
    throw new Error(`Invalid MachineDefinition (${obj.id}): must define at least one port.`);
  }
  if (!Array.isArray(obj.modes) || obj.modes.length === 0) {
    throw new Error(`Invalid MachineDefinition (${obj.id}): must define at least one operating mode.`);
  }
  if (!Array.isArray(obj.blockout) || obj.blockout.length === 0) {
    throw new Error(`Invalid MachineDefinition (${obj.id}): must define "blockout" primitives.`);
  }
  if (!obj.detailed || typeof obj.detailed.shellColorHex !== 'string') {
    throw new Error(`Invalid MachineDefinition (${obj.id}): must define "detailed" visual spec.`);
  }
  return obj as QFactoryMachineDef;
}
