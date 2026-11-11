import { QFactoryBuildingType, QFactoryToolId } from './QFactoryTypes';

export interface QFactoryMatrixCell {
  row: number; // 1-8
  col: number; // 1-8
  toolId?: QFactoryToolId;
  name: string;
  subtitle?: string;
  floorThickness?: number;
}

export interface QFactoryCategoryDef {
  key: string; // '1', '2', '3', '4', '5'
  name: string;
  icon: string;
  cells: QFactoryMatrixCell[][]; // 8 rows x 8 cols
}

export function createEmptyMatrix(): QFactoryMatrixCell[][] {
  const grid: QFactoryMatrixCell[][] = [];
  for (let r = 1; r <= 8; r++) {
    const row: QFactoryMatrixCell[] = [];
    for (let c = 1; c <= 8; c++) {
      row.push({ row: r, col: c, name: 'Empty Slot' });
    }
    grid.push(row);
  }
  return grid;
}

export const QFACTORY_CATEGORIES: Record<string, QFactoryCategoryDef> = {
  '1': {
    key: '1',
    name: 'Sweet & Toy Workshop',
    icon: '🍭',
    cells: (() => {
      const g = createEmptyMatrix();
      g[0][0] = { row: 1, col: 1, toolId: 'sugar-harvester', name: 'Sugar & Wood Harvester', subtitle: 'Sugar / Wood / Brass' };
      g[0][1] = { row: 1, col: 2, toolId: 'color-extractor', name: 'Rainbow Color Pump', subtitle: 'Color River Dye' };
      g[0][2] = { row: 1, col: 3, toolId: 'sweet-maker', name: 'Swirl-O-Matic Sweet Maker', subtitle: 'Lollipops & Cupcakes' };
      g[0][3] = { row: 1, col: 4, toolId: 'part-lathe', name: 'Cog, Wheel & Widget Lathe', subtitle: 'Toy Parts & Widgets' };
      g[0][4] = { row: 1, col: 5, toolId: 'toy-assembler', name: 'Wonder-Toy Assembler', subtitle: 'Trains, Tops & Rockets' };
      g[0][5] = { row: 1, col: 6, toolId: 'gift-wrapper', name: 'Ribbon Gift-Box Wrapper', subtitle: 'Wraps Finished Gifts' };

      g[1][0] = { row: 2, col: 1, toolId: 'miner', name: 'Miner Mk.1', subtitle: 'Extracts Raw Ore' };
      g[1][1] = { row: 2, col: 2, toolId: 'miner-mk2', name: 'Miner Mk.2', subtitle: '2x Size, Dual Port' };
      g[1][2] = { row: 2, col: 3, toolId: 'smelter', name: 'Smelter Mk.1', subtitle: 'Ore → Ingots' };
      g[1][3] = { row: 2, col: 4, toolId: 'smelter-mk2', name: 'Smelter Mk.2', subtitle: 'Dual Core Smelter' };
      g[1][4] = { row: 2, col: 5, toolId: 'constructor', name: 'Constructor', subtitle: 'Ingots → Parts' };
      g[1][5] = { row: 2, col: 6, toolId: 'constructor-mk2', name: 'Assembler Mk.2', subtitle: 'Advanced Assembler' };
      return g;
    })(),
  },
  '2': {
    key: '2',
    name: 'Belts & Logistics',
    icon: '➡️',
    cells: (() => {
      const g = createEmptyMatrix();
      g[0][0] = { row: 1, col: 1, toolId: 'belt', name: 'Conveyor Mk.1', subtitle: 'Transport Items' };
      g[0][1] = { row: 1, col: 2, toolId: 'splitter', name: 'Splitter (2x2)', subtitle: '1 In → 3 Out' };
      g[0][2] = { row: 1, col: 3, toolId: 'merger', name: 'Merger (2x2)', subtitle: '3 In → 1 Out' };
      g[0][3] = { row: 1, col: 4, toolId: 'connector', name: 'Connector (1x1x2)', subtitle: 'Belt Join Pillar' };
      return g;
    })(),
  },
  '3': {
    key: '3',
    name: 'Storage',
    icon: '📦',
    cells: (() => {
      const g = createEmptyMatrix();
      g[0][0] = { row: 1, col: 1, toolId: 'container-1' as QFactoryBuildingType, name: 'Box 1 (6x6x6)', subtitle: '100 Capacity' };
      g[0][1] = { row: 1, col: 2, toolId: 'container-2' as QFactoryBuildingType, name: 'Box 2 (12x6x6)', subtitle: '200 Capacity' };
      g[0][2] = { row: 1, col: 3, toolId: 'container-3' as QFactoryBuildingType, name: 'Box 3 (18x6x6)', subtitle: '300 Capacity' };
      g[0][3] = { row: 1, col: 4, toolId: 'container-4' as QFactoryBuildingType, name: 'Box 4 (6x6x12)', subtitle: 'Double Height' };
      g[0][4] = { row: 1, col: 5, toolId: 'container-5' as QFactoryBuildingType, name: 'Box 5 (12x6x12)', subtitle: 'Double Height' };
      g[0][5] = { row: 1, col: 6, toolId: 'container-6' as QFactoryBuildingType, name: 'Box 6 (18x6x12)', subtitle: 'Double Height' };
      return g;
    })(),
  },
  '4': {
    key: '4',
    name: 'Foundations',
    icon: '🧱',
    cells: (() => {
      const g = createEmptyMatrix();
      g[0][0] = { row: 1, col: 1, toolId: 'foundation-1m', name: 'Floor 1m (8x8)', subtitle: '1m Thickness', floorThickness: 1 };
      g[0][1] = { row: 1, col: 2, toolId: 'foundation-2m', name: 'Floor 2m (8x8)', subtitle: '2m Thickness', floorThickness: 2 };
      g[0][2] = { row: 1, col: 3, toolId: 'foundation-3m', name: 'Floor 3m (8x8)', subtitle: '3m Thickness', floorThickness: 3 };
      g[0][3] = { row: 1, col: 4, toolId: 'foundation-1m', name: 'Drag Rect (1m)', subtitle: 'Draw Area Multiples of 8m', floorThickness: 1 };
      g[0][4] = { row: 1, col: 5, toolId: 'foundation-2m', name: 'Drag Rect (2m)', subtitle: 'Draw Area Multiples of 8m', floorThickness: 2 };
      g[0][5] = { row: 1, col: 6, toolId: 'foundation-3m', name: 'Drag Rect (3m)', subtitle: 'Draw Area Multiples of 8m', floorThickness: 3 };
      return g;
    })(),
  },
  '5': {
    key: '5',
    name: 'Power & Special',
    icon: '⚡',
    cells: (() => {
      const g = createEmptyMatrix();
      g[0][0] = { row: 1, col: 1, toolId: 'starter-chain', name: 'Auto-Line', subtitle: '4 Machines + Belts' };
      g[0][1] = { row: 1, col: 2, toolId: 'dismantle', name: 'Dismantle Tool', subtitle: 'Remove Target' };
      return g;
    })(),
  },
};
