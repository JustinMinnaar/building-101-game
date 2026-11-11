import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFactoryBuildingType, QFactoryItemType } from './QFactoryTypes';

export interface QFactoryPortDef {
  id: string;
  type: 'input' | 'output';
  relDepth: number; // along depth (front: +0.5, back: -0.5)
  relWidth: number; // along width (left: -0.5, right: +0.5)
  height: number;
}

export interface QFactoryBlueprint {
  name: string;
  width: number;
  depth: number;
  height: number;
  cycleDurationSec: number;
  powerUsageMW: number;
  inStackCapacity: number;
  outStackCapacity: number;
  ports: QFactoryPortDef[];
  consumesItem?: QFactoryItemType;
  producesItem?: QFactoryItemType;
}

export const QFACTORY_BLUEPRINTS: Record<QFactoryBuildingType, QFactoryBlueprint> = {
  miner: {
    name: 'Miner Mk.1', width: 6, depth: 8, height: 7,
    cycleDurationSec: 1.0, powerUsageMW: 5, inStackCapacity: 100, outStackCapacity: 100,
    producesItem: 'iron-ore',
    ports: [{ id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 }],
  },
  'miner-mk2': {
    name: 'Miner Mk.2', width: 12, depth: 16, height: 14,
    cycleDurationSec: 0.5, powerUsageMW: 12, inStackCapacity: 100, outStackCapacity: 100,
    producesItem: 'iron-ore',
    ports: [
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: -0.22, height: 1.0 },
      { id: 'out_1', type: 'output', relDepth: 0.5, relWidth: 0.22, height: 1.0 },
    ],
  },
  smelter: {
    name: 'Smelter Mk.1', width: 6, depth: 9, height: 8,
    cycleDurationSec: 2.0, powerUsageMW: 4, inStackCapacity: 100, outStackCapacity: 100,
    consumesItem: 'iron-ore', producesItem: 'iron-ingot',
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'smelter-mk2': {
    name: 'Smelter Mk.2', width: 12, depth: 18, height: 16,
    cycleDurationSec: 1.0, powerUsageMW: 10, inStackCapacity: 100, outStackCapacity: 100,
    consumesItem: 'iron-ore', producesItem: 'iron-ingot',
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: -0.125, height: 1.0 },
      { id: 'in_1', type: 'input', relDepth: -0.5, relWidth: 0.125, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: -0.125, height: 1.0 },
      { id: 'out_1', type: 'output', relDepth: 0.5, relWidth: 0.125, height: 1.0 },
    ],
  },
  constructor: {
    name: 'Constructor Mk.1', width: 8, depth: 8, height: 6,
    cycleDurationSec: 3.0, powerUsageMW: 4, inStackCapacity: 100, outStackCapacity: 100,
    consumesItem: 'iron-ingot', producesItem: 'iron-plate',
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'constructor-mk2': {
    name: 'Assembler Mk.2', width: 16, depth: 16, height: 12,
    cycleDurationSec: 1.5, powerUsageMW: 12, inStackCapacity: 100, outStackCapacity: 100,
    consumesItem: 'iron-ingot', producesItem: 'iron-plate',
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: -0.22, height: 1.0 },
      { id: 'in_1', type: 'input', relDepth: -0.5, relWidth: 0.22, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: -0.22, height: 1.0 },
      { id: 'out_1', type: 'output', relDepth: 0.5, relWidth: 0.22, height: 1.0 },
    ],
  },
  container: {
    name: 'Storage Box 1', width: 6, depth: 6, height: 6,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 100, outStackCapacity: 100,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'container-1': {
    name: 'Storage Box 1 (6x6x6)', width: 6, depth: 6, height: 6,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 100, outStackCapacity: 100,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'container-2': {
    name: 'Storage Box 2 (12x6x6)', width: 6, depth: 12, height: 6,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 200, outStackCapacity: 200,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'container-3': {
    name: 'Storage Box 3 (18x6x6)', width: 6, depth: 18, height: 6,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 300, outStackCapacity: 300,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'container-4': {
    name: 'Storage Box 4 (6x6x12)', width: 6, depth: 6, height: 12,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 200, outStackCapacity: 200,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'container-5': {
    name: 'Storage Box 5 (12x6x12)', width: 6, depth: 12, height: 12,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 400, outStackCapacity: 400,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'container-6': {
    name: 'Storage Box 6 (18x6x12)', width: 6, depth: 18, height: 12,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 600, outStackCapacity: 600,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'container-mk2': {
    name: 'Industrial Storage', width: 6, depth: 12, height: 12,
    cycleDurationSec: 0.5, powerUsageMW: 0, inStackCapacity: 400, outStackCapacity: 400,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: -0.22, height: 1.0 },
      { id: 'in_1', type: 'input', relDepth: -0.5, relWidth: 0.22, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: -0.22, height: 1.0 },
      { id: 'out_1', type: 'output', relDepth: 0.5, relWidth: 0.22, height: 1.0 },
    ],
  },
  splitter: {
    name: 'Conveyor Splitter', width: 2, depth: 2, height: 2,
    cycleDurationSec: 0.2, powerUsageMW: 0, inStackCapacity: 100, outStackCapacity: 100,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
      { id: 'out_1', type: 'output', relDepth: 0, relWidth: -0.5, height: 1.0 },
      { id: 'out_2', type: 'output', relDepth: 0, relWidth: 0.5, height: 1.0 },
    ],
  },
  merger: {
    name: 'Conveyor Merger', width: 2, depth: 2, height: 2,
    cycleDurationSec: 0.2, powerUsageMW: 0, inStackCapacity: 100, outStackCapacity: 100,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'in_1', type: 'input', relDepth: 0, relWidth: -0.5, height: 1.0 },
      { id: 'in_2', type: 'input', relDepth: 0, relWidth: 0.5, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  connector: {
    name: 'Belt Connector', width: 1, depth: 1, height: 2,
    cycleDurationSec: 0.1, powerUsageMW: 0, inStackCapacity: 20, outStackCapacity: 20,
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  foundation: {
    name: 'Concrete Floor 8m (1m)', width: 8, depth: 8, height: 1,
    cycleDurationSec: 0, powerUsageMW: 0, inStackCapacity: 0, outStackCapacity: 0, ports: [],
  },
  'foundation-1m': {
    name: 'Concrete Floor 8m (1m)', width: 8, depth: 8, height: 1,
    cycleDurationSec: 0, powerUsageMW: 0, inStackCapacity: 0, outStackCapacity: 0, ports: [],
  },
  'foundation-2m': {
    name: 'Concrete Floor 8m (2m)', width: 8, depth: 8, height: 2,
    cycleDurationSec: 0, powerUsageMW: 0, inStackCapacity: 0, outStackCapacity: 0, ports: [],
  },
  'foundation-3m': {
    name: 'Concrete Floor 8m (3m)', width: 8, depth: 8, height: 3,
    cycleDurationSec: 0, powerUsageMW: 0, inStackCapacity: 0, outStackCapacity: 0, ports: [],
  },
  'sunken-pit': {
    name: 'Abyssal Ore Pit', width: 12, depth: 12, height: 2,
    cycleDurationSec: 0, powerUsageMW: 0, inStackCapacity: 0, outStackCapacity: 0, ports: [],
  },
  tower: {
    name: 'Headframe Tower', width: 10, depth: 10, height: 18,
    cycleDurationSec: 1.0, powerUsageMW: 12, inStackCapacity: 100, outStackCapacity: 100, producesItem: 'iron-ore',
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'support-pole': {
    name: 'Cardboard Deck Support Pole', width: 2, depth: 2, height: 8.5,
    cycleDurationSec: 0, powerUsageMW: 0, inStackCapacity: 0, outStackCapacity: 0, ports: [],
  },
  'goo-spice-refinery': {
    name: 'Goo Sugar & Spice Refinery', width: 7, depth: 8, height: 8,
    cycleDurationSec: 1.4, powerUsageMW: 5, inStackCapacity: 100, outStackCapacity: 100,
    consumesItem: 'rainbow-dye', producesItem: 'sugar-cube',
    ports: [
      { id: 'conn_in_0', type: 'input', relDepth: -0.5, relWidth: 0, height: 1.0 },
      { id: 'conn_out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  'smart-brain-stamper': {
    name: 'Toy-Smarts Brain Stamper', width: 7, depth: 9, height: 8,
    cycleDurationSec: 1.6, powerUsageMW: 6, inStackCapacity: 100, outStackCapacity: 100,
    consumesItem: 'rainbow-dye', producesItem: 'toy-brain',
    ports: [
      { id: 'in_0', type: 'input', relDepth: -0.5, relWidth: -0.2, height: 1.0 },
      { id: 'in_1', type: 'input', relDepth: -0.5, relWidth: 0.2, height: 1.0 },
      { id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 },
    ],
  },
  ...Object.fromEntries(
    QFactoryMachineRegistry.getAll().map((def) => [
      def.id,
      {
        name: def.name,
        width: def.footprint.width,
        depth: def.footprint.depth,
        height: def.footprint.height,
        cycleDurationSec: def.modes[0].cycleSec,
        powerUsageMW: def.modes[0].powerMW,
        inStackCapacity: def.inStackCapacity,
        outStackCapacity: def.outStackCapacity,
        producesItem: def.modes[0].producesItem,
        consumesItem: def.modes[0].inputs[0]?.itemType,
        ports: def.ports,
      } satisfies QFactoryBlueprint,
    ])
  ) as Record<
    'sugar-harvester' | 'color-extractor' | 'sweet-maker' | 'part-lathe' | 'toy-assembler' | 'gift-wrapper',
    QFactoryBlueprint
  >,
};
