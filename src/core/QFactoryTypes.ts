export type QFactoryBuiltinBuildingType =
  | 'miner'
  | 'miner-mk2'
  | 'smelter'
  | 'smelter-mk2'
  | 'constructor'
  | 'constructor-mk2'
  | 'sugar-harvester'
  | 'color-extractor'
  | 'sweet-maker'
  | 'part-lathe'
  | 'toy-assembler'
  | 'gift-wrapper'
  | 'goo-spice-refinery'
  | 'smart-brain-stamper'
  | 'support-pole'
  | 'container'
  | 'container-mk2'
  | 'container-1'
  | 'container-2'
  | 'container-3'
  | 'container-4'
  | 'container-5'
  | 'container-6'
  | 'splitter'
  | 'merger'
  | 'connector'
  | 'foundation'
  | 'foundation-1m'
  | 'foundation-2m'
  | 'foundation-3m'
  | 'sunken-pit'
  | 'tower';

export type QFactoryBuildingType = QFactoryBuiltinBuildingType | (string & {});

export type QFactoryVisualMode = 'detailed' | 'anime' | 'vinyl' | 'blockout';
export type QFactoryThemePack = 'sweet-toy' | 'smart-brain-toys';

export type QFactoryToolId =
  | 'select'
  | QFactoryBuildingType
  | 'belt'
  | 'dismantle'
  | 'starter-chain';

export type QFactoryItemType =
  | 'iron-ore'
  | 'copper-ore'
  | 'limestone'
  | 'coal'
  | 'iron-ingot'
  | 'copper-ingot'
  | 'iron-plate'
  | 'iron-rod'
  | 'wire'
  | 'cable'
  | 'concrete'
  | 'screw'
  | 'red-goo'
  | 'gold-goo'
  | 'blue-goo'
  | 'spice-pinch'
  | 'sugar-cube'
  | 'rainbow-dye'
  | 'wood-block'
  | 'tin-ingot'
  | 'swirl-lollipop'
  | 'star-cupcake'
  | 'cog'
  | 'wheel'
  | 'widget'
  | 'toy-brain'
  | 'idea-bulb'
  | 'smart-teddy-toy'
  | 'toy-train'
  | 'spinning-top'
  | 'toy-rocket'
  | 'gift-box'
  | 'sprinkles'
  | 'spare-parts';

export type QFactoryMachineStatus =
  | 'powered on'
  | 'powering up'
  | 'shutting down'
  | 'tripped'
  | 'off'
  | string;

export interface QFactoryResourceNode {
  id: string;
  name: string;
  oreType: QFactoryItemType;
  x: number;
  z: number;
  radius: number;
}

export interface QFactorySupportPoleSpan {
  x: number;
  z: number;
  bottomY: number;
  topY: number;
}

export interface QFactoryFoundationFloor {
  id: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  width: number;
  depth: number;
  thickness: number;
  levelIndex: number;
  y: number;
  topY: number;
  poles: QFactorySupportPoleSpan[];
}

export type QFactoryBeltShape = 'default' | 'straight' | 'curved';

export interface QFactoryPoint3D {
  x: number;
  y: number;
  z: number;
}

export interface QFactoryPort {
  id: string;
  type: 'input' | 'output';
  worldPosition: QFactoryPoint3D;
  connectedBeltId?: string;
}

export interface QFactoryRecipe {
  name: string;
  consumesItem?: QFactoryItemType;
  producesItem?: QFactoryItemType;
  cycleDurationSec: number;
}

export interface QFactoryModeOptionSummary {
  id: string;
  label: string;
  producesItem: QFactoryItemType;
  inputsSummary: string;
}

export interface QFactoryMachineDetails {
  id: string;
  name: string;
  type: QFactoryBuildingType;
  status: QFactoryMachineStatus;
  productionRatePerMin: number;
  powerUsageMW: number;
  recipeName?: string;
  inputBufferCount: number;
  outputBufferCount: number;
  inStackCapacity: number;
  outStackCapacity: number;
  isInStackFull: boolean;
  isOutStackFull: boolean;
  storedCount: number;
  consumesItem?: QFactoryItemType;
  producesItem?: QFactoryItemType;
  lastItemType?: QFactoryItemType;
  activeModeId?: string;
  availableModes?: QFactoryModeOptionSummary[];
  spinRatio?: number;
  basketLabel?: string;
  basketCount?: number;
  basketCapacity?: number;
  ingredientCounts?: Partial<Record<QFactoryItemType, number>>;
}

export interface QFactoryToolVariant {
  toolId: QFactoryToolId;
  name: string;
  subtitle: string;
  icon: string;
}

export interface QFactoryHotbarSlot {
  slotIndex: number;
  key: string;
  toolId: QFactoryToolId;
  name: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  variants: QFactoryToolVariant[];
  activeVariantIndex: number;
}

export interface QFactoryBuilding {
  id: string;
  type: QFactoryBuildingType;
  name: string;
  x: number;
  y: number;
  z: number;
  rotationDeg: number;
  width: number;
  depth: number;
  height: number;
  ports: QFactoryPort[];
  inputPorts: QFactoryPort[];
  outputPorts: QFactoryPort[];
  inputPort?: QFactoryPoint3D;
  outputPort?: QFactoryPoint3D;
  status: QFactoryMachineStatus;
  powerUsageMW: number;
  recipeName?: string;
  inputBufferCount: number;
  outputBufferCount: number;
  inStackCapacity: number;
  outStackCapacity: number;
  isInStackFull?: boolean;
  isOutStackFull?: boolean;
  storedCount: number;
  productionProgress: number;
  cycleDurationSec: number;
  producesItem?: QFactoryItemType;
  consumesItem?: QFactoryItemType;
  lastItemType?: QFactoryItemType;
  nextSplitterOutIndex?: number;
  inputQueue?: QFactoryItemType[];
  activeOreType?: QFactoryItemType;
  pendingOreType?: QFactoryItemType;
  warmupTimerSec?: number;
  switchTimerSec?: number;
  activeModeId?: string;
  spinRatio?: number;
  basketLabel?: string;
  basketCount?: number;
  basketCapacity?: number;
  ingredientCounts?: Partial<Record<QFactoryItemType, number>>;
}

export interface QFactoryBeltItem {
  id: string;
  itemType: QFactoryItemType;
  progress: number;
}

export interface QFactoryBelt {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePortId?: string;
  targetPortId?: string;
  startPoint: QFactoryPoint3D;
  endPoint: QFactoryPoint3D;
  shape: QFactoryBeltShape;
  pathPoints: QFactoryPoint3D[];
  lengthMeters: number;
  speedMetersPerSec: number;
  isStopped?: boolean;
  items: QFactoryBeltItem[];
}

export const QFACTORY_HOTBAR_SLOTS: QFactoryHotbarSlot[] = [
  {
    slotIndex: 1, key: '1', toolId: 'miner', name: 'Miner Mk.1', subtitle: 'Extracts Raw Ore', icon: '⛏️', accentColor: '#f59e0b',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'miner', name: 'Miner Mk.1', subtitle: 'Extracts Raw Ore (1 Out)', icon: '⛏️' },
      { toolId: 'miner-mk2', name: 'Miner Mk.2', subtitle: '2x Size (2 Out Ports)', icon: '⛏️' },
    ],
  },
  {
    slotIndex: 2, key: '2', toolId: 'smelter', name: 'Smelter Mk.1', subtitle: 'Ore → Ingots', icon: '🔥', accentColor: '#ef4444',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'smelter', name: 'Smelter Mk.1', subtitle: 'Ore → Ingots (1 In/1 Out)', icon: '🔥' },
      { toolId: 'smelter-mk2', name: 'Smelter Mk.2', subtitle: '2x Size (2 In/2 Out)', icon: '🔥' },
    ],
  },
  {
    slotIndex: 3, key: '3', toolId: 'constructor', name: 'Constructor Mk.1', subtitle: 'Ingots → Parts', icon: '⚙️', accentColor: '#3b82f6',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'constructor', name: 'Constructor Mk.1', subtitle: 'Ingots → Parts (1 In/1 Out)', icon: '⚙️' },
      { toolId: 'constructor-mk2', name: 'Assembler Mk.2', subtitle: '2x Size (2 In/2 Out)', icon: '🏭' },
    ],
  },
  {
    slotIndex: 4, key: '4', toolId: 'container', name: 'Storage Container', subtitle: 'Stores Parts', icon: '📦', accentColor: '#10b981',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'container', name: 'Storage Box', subtitle: '1 In / 1 Out Port', icon: '📦' },
      { toolId: 'container-mk2', name: 'Industrial Box', subtitle: '2x Size (2 In / 2 Out)', icon: '📦' },
    ],
  },
  {
    slotIndex: 5, key: '5', toolId: 'belt', name: 'Conveyor Belt Mk.1', subtitle: 'Transport Items', icon: '➡️', accentColor: '#eab308',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'belt', name: 'Mk.1 Belt', subtitle: 'Click Source → Target', icon: '➡️' },
      { toolId: 'splitter', name: 'Splitter', subtitle: '1 In → 3 Out Cube', icon: '🔀' },
      { toolId: 'merger', name: 'Merger', subtitle: '3 In → 1 Out Cube', icon: '🔁' },
      { toolId: 'connector', name: 'Connector', subtitle: '1x1x2 Belt Joiner', icon: '🔗' },
    ],
  },
  {
    slotIndex: 6, key: '6', toolId: 'foundation', name: 'Concrete Floor 8m', subtitle: 'Industrial Deck', icon: '🧱', accentColor: '#94a3b8',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'foundation', name: 'Floor 8m', subtitle: '8x8 Concrete Deck', icon: '🧱' },
    ],
  },
  {
    slotIndex: 7, key: '7', toolId: 'sunken-pit', name: 'Abyssal Ore Pit', subtitle: 'Deep Shaft', icon: '🕳️', accentColor: '#a855f7',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'sunken-pit', name: 'Abyssal Pit', subtitle: 'Deep Extraction Shaft', icon: '🕳️' },
    ],
  },
  {
    slotIndex: 8, key: '8', toolId: 'tower', name: 'Headframe Tower', subtitle: 'Heavy Hoist', icon: '🏗️', accentColor: '#06b6d4',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'tower', name: 'Tower', subtitle: 'Heavy Hoist Rig', icon: '🏗️' },
    ],
  },
  {
    slotIndex: 9, key: '9', toolId: 'dismantle', name: 'Dismantle Tool', subtitle: 'Remove Object', icon: '🛠️', accentColor: '#f43f5e',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'dismantle', name: 'Dismantle', subtitle: 'Click to Remove', icon: '🛠️' },
    ],
  },
  {
    slotIndex: 10, key: '0', toolId: 'starter-chain', name: 'Auto-Build Line', subtitle: '4 Machines + Belts', icon: '⚡', accentColor: '#22c55e',
    activeVariantIndex: 0,
    variants: [
      { toolId: 'starter-chain', name: 'Starter Line', subtitle: 'Full Chain in 1 Click', icon: '⚡' },
    ],
  },
];
