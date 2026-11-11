import { QFACTORY_BLUEPRINTS, QFactoryPortDef } from './QFactoryBlueprints';
import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFactoryMachineDef, QFactoryMachineModeDef } from './QFactoryMachineSchema';

export type QFactoryFrontSide = '+Z' | '-Z' | '+X' | '-X';

export type QFactoryEditorAddonType =
  | 'gear'
  | 'cog'
  | 'robot-stamper'
  | 'wire'
  | 'light'
  | 'button'
  | 'lever'
  | 'smokestack'
  | 'awning';

export type QFactoryConnectorKind = 'belt-in' | 'belt-out' | 'wire-in' | 'wire-out';

export interface QFactoryEditorCube {
  id: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  d: number;
  colorHex: string;
  cutawayFront?: boolean;
}

export interface QFactoryEditorAddon {
  id: string;
  type: QFactoryEditorAddonType;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotationDeg: number;
  colorHex: string;
}

export interface QFactoryEditorConnector {
  id: string;
  kind: QFactoryConnectorKind;
  face: QFactoryFrontSide;
  offsetAlongFace: number;
  heightY: number;
}

export interface QFactoryCustomMachineSpec {
  id: string;
  name: string;
  frontSide: QFactoryFrontSide;
  frameCubes: QFactoryEditorCube[];
  addons: QFactoryEditorAddon[];
  connectors: QFactoryEditorConnector[];
  buildCost: { cardboard: number; clay: number; metal: number };
  spinUpSec: number;
  spinDownSec: number;
  modes: QFactoryMachineModeDef[];
  basketLabel?: string;
}

export class QFactoryCustomMachineStore {
  private static _specs = new Map<string, QFactoryCustomMachineSpec>();
  private static _seq = 1;
  private static _bootstrapped = false;

  public static ensurePresetsRegistered(): void {
    if (this._bootstrapped) return;
    this._bootstrapped = true;

    const gooRefinery = this.createGooSpiceRefineryPreset();
    const smartStamper = this.createSmartBrainStamperPreset();
    this.saveAndRegister(gooRefinery);
    this.saveAndRegister(smartStamper);
  }

  public static hasCustomSpec(id: string): boolean {
    this.ensurePresetsRegistered();
    return this._specs.has(id);
  }

  public static getCustomSpec(id: string): QFactoryCustomMachineSpec | undefined {
    this.ensurePresetsRegistered();
    return this._specs.get(id);
  }

  public static getAllCustomSpecs(): QFactoryCustomMachineSpec[] {
    this.ensurePresetsRegistered();
    return Array.from(this._specs.values());
  }

  public static createBlankDraft(id: string, name: string): QFactoryCustomMachineSpec {
    return {
      id,
      name,
      frontSide: '+Z',
      frameCubes: [
        { id: 'cube_base', x: 0, y: 3.2, z: 0, w: 8, h: 6.4, d: 7, colorHex: '#ede0ce', cutawayFront: true },
      ],
      addons: [
        { id: 'add_gear_1', type: 'gear', x: 1.8, y: 4.5, z: -2.2, scale: 1.0, rotationDeg: 0, colorHex: '#8c8275' },
        { id: 'add_stamp_1', type: 'robot-stamper', x: 0.4, y: 2.0, z: 0, scale: 1.0, rotationDeg: 0, colorHex: '#64748b' },
        { id: 'add_lever_1', type: 'lever', x: 3.0, y: 1.4, z: 3.5, scale: 1.0, rotationDeg: 0, colorHex: '#d97706' },
      ],
      connectors: [
        { id: 'conn_in_0', kind: 'belt-in', face: '-X', offsetAlongFace: 0, heightY: 1.0 },
        { id: 'conn_out_0', kind: 'belt-out', face: '+X', offsetAlongFace: 0, heightY: 1.0 },
        { id: 'wire_in_0', kind: 'wire-in', face: '-Z', offsetAlongFace: -1.5, heightY: 2.2 },
      ],
      buildCost: { cardboard: 6, clay: 18, metal: 12 },
      spinUpSec: 1.2,
      spinDownSec: 2.0,
      basketLabel: 'EXTRA BITS',
      modes: [
        {
          id: 'mode_sugar_spice',
          label: 'Goo → Sweet Sugar & Spice',
          powerMW: 5,
          cycleSec: 1.5,
          inputs: [{ itemType: 'rainbow-dye', acceptedItems: ['rainbow-dye', 'red-goo', 'gold-goo', 'blue-goo'], count: 1 }],
          producesItem: 'spice-pinch',
        },
      ],
    };
  }

  public static addFrameCube(
    spec: QFactoryCustomMachineSpec,
    cube: Omit<QFactoryEditorCube, 'id'>
  ): QFactoryCustomMachineSpec {
    const id = `cube_${this._seq++}`;
    return { ...spec, frameCubes: [...spec.frameCubes, { ...cube, id }] };
  }

  public static updateFrameCube(
    spec: QFactoryCustomMachineSpec,
    cubeId: string,
    patch: Partial<QFactoryEditorCube>
  ): QFactoryCustomMachineSpec {
    return {
      ...spec,
      frameCubes: spec.frameCubes.map((c) => (c.id === cubeId ? { ...c, ...patch } : c)),
    };
  }

  public static removeFrameCube(spec: QFactoryCustomMachineSpec, cubeId: string): QFactoryCustomMachineSpec {
    if (spec.frameCubes.length <= 1) return spec;
    return { ...spec, frameCubes: spec.frameCubes.filter((c) => c.id !== cubeId) };
  }

  public static addAddon(
    spec: QFactoryCustomMachineSpec,
    type: QFactoryEditorAddonType,
    pos: { x: number; y: number; z: number },
    colorHex = '#f59e0b'
  ): QFactoryCustomMachineSpec {
    const id = `addon_${this._seq++}`;
    return {
      ...spec,
      addons: [...spec.addons, { id, type, x: pos.x, y: pos.y, z: pos.z, scale: 1.0, rotationDeg: 0, colorHex }],
    };
  }

  public static updateAddon(
    spec: QFactoryCustomMachineSpec,
    addonId: string,
    patch: Partial<QFactoryEditorAddon>
  ): QFactoryCustomMachineSpec {
    return {
      ...spec,
      addons: spec.addons.map((a) => (a.id === addonId ? { ...a, ...patch } : a)),
    };
  }

  public static removeAddon(spec: QFactoryCustomMachineSpec, addonId: string): QFactoryCustomMachineSpec {
    return { ...spec, addons: spec.addons.filter((a) => a.id !== addonId) };
  }

  public static addConnector(
    spec: QFactoryCustomMachineSpec,
    kind: QFactoryConnectorKind,
    face: QFactoryFrontSide,
    offsetAlongFace = 0,
    heightY = 1.0
  ): QFactoryCustomMachineSpec {
    const id = `conn_${this._seq++}`;
    return { ...spec, connectors: [...spec.connectors, { id, kind, face, offsetAlongFace, heightY }] };
  }

  public static removeConnector(spec: QFactoryCustomMachineSpec, connId: string): QFactoryCustomMachineSpec {
    return { ...spec, connectors: spec.connectors.filter((c) => c.id !== connId) };
  }

  public static setFrontSide(spec: QFactoryCustomMachineSpec, frontSide: QFactoryFrontSide): QFactoryCustomMachineSpec {
    return { ...spec, frontSide };
  }

  public static saveAndRegister(spec: QFactoryCustomMachineSpec): QFactoryMachineDef {
    if (!spec.id || !spec.name || spec.frameCubes.length === 0) {
      throw new Error('Custom Machine requires id, name, and at least one frame cube.');
    }
    const bounds = this.computeFootprint(spec.frameCubes);
    const beltConns = spec.connectors.filter((c) => c.kind === 'belt-in' || c.kind === 'belt-out');
    const ports: QFactoryPortDef[] = beltConns.map((c) => this.connectorToPortDef(c, bounds.width, bounds.depth));
    if (ports.length === 0) {
      ports.push({ id: 'out_0', type: 'output', relDepth: 0.5, relWidth: 0, height: 1.0 });
    }

    const def: QFactoryMachineDef = {
      id: spec.id,
      name: spec.name,
      category: 'toys',
      placementRule: 'open-ground',
      footprint: bounds,
      spinUpSec: spec.spinUpSec,
      spinDownSec: spec.spinDownSec,
      inStackCapacity: 100,
      outStackCapacity: 100,
      ports,
      modes: spec.modes,
      basket: spec.basketLabel
        ? { id: `basket_${spec.id}`, label: spec.basketLabel, itemType: 'sprinkles', capacity: 40, offset: { x: -1.0, y: 0, z: bounds.width * 0.52 } }
        : undefined,
      blockout: spec.frameCubes.map((c) => ({
        shape: 'box',
        size: [c.w, c.h, c.d],
        position: [c.x, c.y, c.z],
        colorHex: c.colorHex,
      })),
      detailed: {
        shellColorHex: spec.frameCubes[0].colorHex,
        trimColorHex: '#f59e0b',
        roofStyle: 'striped-awning',
        interiorTheme: 'toy-assembly',
        hasCutawayWindow: Boolean(spec.frameCubes[0].cutawayFront),
        smokeOffsets: spec.addons.filter((a) => a.type === 'smokestack').map((a) => ({ x: a.x, y: a.y + 1.4, z: a.z })),
        helperTeddySide: 'none',
      },
    };

    this._specs.set(spec.id, spec);
    QFactoryMachineRegistry.registerDynamic(def);
    QFACTORY_BLUEPRINTS[spec.id] = {
      name: def.name,
      width: bounds.width,
      depth: bounds.depth,
      height: bounds.height,
      cycleDurationSec: def.modes[0].cycleSec,
      powerUsageMW: def.modes[0].powerMW,
      inStackCapacity: 100,
      outStackCapacity: 100,
      producesItem: def.modes[0].producesItem,
      consumesItem: def.modes[0].inputs[0]?.itemType,
      ports,
    };
    return def;
  }

  private static computeFootprint(cubes: QFactoryEditorCube[]): { width: number; depth: number; height: number } {
    let minX = Infinity, maxX = -Infinity, maxY = 4, minZ = Infinity, maxZ = -Infinity;
    for (const c of cubes) {
      minX = Math.min(minX, c.x - c.w / 2);
      maxX = Math.max(maxX, c.x + c.w / 2);
      maxY = Math.max(maxY, c.y + c.h / 2);
      minZ = Math.min(minZ, c.z - c.d / 2);
      maxZ = Math.max(maxZ, c.z + c.d / 2);
    }
    return {
      depth: Math.max(4, Math.round(maxX - minX)),
      width: Math.max(4, Math.round(maxZ - minZ)),
      height: Math.max(4, Math.round(maxY)),
    };
  }

  private static connectorToPortDef(c: QFactoryEditorConnector, width: number, depth: number): QFactoryPortDef {
    const type = c.kind === 'belt-in' ? 'input' : 'output';
    if (c.face === '-X') return { id: c.id, type, relDepth: -0.5, relWidth: c.offsetAlongFace / width, height: c.heightY };
    if (c.face === '+X') return { id: c.id, type, relDepth: 0.5, relWidth: c.offsetAlongFace / width, height: c.heightY };
    if (c.face === '-Z') return { id: c.id, type, relDepth: c.offsetAlongFace / depth, relWidth: -0.5, height: c.heightY };
    return { id: c.id, type, relDepth: c.offsetAlongFace / depth, relWidth: 0.5, height: c.heightY };
  }

  private static createGooSpiceRefineryPreset(): QFactoryCustomMachineSpec {
    const base = this.createBlankDraft('goo-spice-refinery', 'Goo Sugar & Spice Refinery');
    return {
      ...base,
      frameCubes: [
        { id: 'c_main', x: 0, y: 3.0, z: 0, w: 8, h: 6.0, d: 6.8, colorHex: '#fde68a', cutawayFront: true },
        { id: 'c_vat', x: -1.8, y: 6.8, z: 0, w: 3.2, h: 2.0, d: 3.2, colorHex: '#fb7185' },
      ],
      addons: [
        ...base.addons,
        { id: 'a_smoke', type: 'smokestack', x: 1.8, y: 6.6, z: 0, scale: 1.0, rotationDeg: 0, colorHex: '#eab308' },
        { id: 'a_btns', type: 'button', x: -4.0, y: 4.8, z: 0, scale: 1.0, rotationDeg: 0, colorHex: '#38bdf8' },
      ],
      basketLabel: 'SPICE DUST',
      modes: [
        {
          id: 'goo-to-sugar',
          label: 'Refine Goo → Sparkling Sugar',
          powerMW: 5,
          cycleSec: 1.4,
          inputs: [{ itemType: 'rainbow-dye', acceptedItems: ['rainbow-dye', 'red-goo', 'gold-goo', 'blue-goo'], count: 1 }],
          producesItem: 'sugar-cube',
          byproductItem: 'sprinkles',
          byproductEveryCycles: 2,
        },
        {
          id: 'goo-to-spice',
          label: 'Refine Goo → Cinnamon & Star Spice',
          powerMW: 5,
          cycleSec: 1.5,
          inputs: [{ itemType: 'rainbow-dye', acceptedItems: ['rainbow-dye', 'red-goo', 'gold-goo', 'blue-goo'], count: 1 }],
          producesItem: 'spice-pinch',
          byproductItem: 'sprinkles',
          byproductEveryCycles: 2,
        },
      ],
    };
  }

  private static createSmartBrainStamperPreset(): QFactoryCustomMachineSpec {
    const base = this.createBlankDraft('smart-brain-stamper', 'Toy-Smarts Brain Stamper');
    return {
      ...base,
      frameCubes: [
        { id: 'c_hull', x: 0, y: 3.4, z: 0, w: 8.6, h: 6.8, d: 7.0, colorHex: '#e7d8c5', cutawayFront: true },
      ],
      addons: [
        { id: 'a_g1', type: 'gear', x: 2.0, y: 4.8, z: -2.2, scale: 1.15, rotationDeg: 0, colorHex: '#8c8275' },
        { id: 'a_c1', type: 'cog', x: 0.7, y: 5.2, z: -2.2, scale: 0.85, rotationDeg: 15, colorHex: '#eab308' },
        { id: 'a_st', type: 'robot-stamper', x: 0.6, y: 2.1, z: 0, scale: 1.1, rotationDeg: 0, colorHex: '#64748b' },
        { id: 'a_wr', type: 'wire', x: -1.4, y: 5.4, z: -1.6, scale: 1.0, rotationDeg: 0, colorHex: '#ef4444' },
        { id: 'a_lt', type: 'light', x: 1.4, y: 7.2, z: 0, scale: 1.0, rotationDeg: 0, colorHex: '#fb7185' },
        { id: 'a_lv', type: 'lever', x: 3.1, y: 1.4, z: 3.6, scale: 1.0, rotationDeg: 0, colorHex: '#d97706' },
      ],
      connectors: [
        { id: 'in_0', kind: 'belt-in', face: '-X', offsetAlongFace: -1.4, heightY: 1.0 },
        { id: 'in_1', kind: 'belt-in', face: '-X', offsetAlongFace: 1.4, heightY: 1.0 },
        { id: 'out_0', kind: 'belt-out', face: '+X', offsetAlongFace: 0, heightY: 1.0 },
        { id: 'w_in', kind: 'wire-in', face: '-Z', offsetAlongFace: -2.0, heightY: 2.5 },
        { id: 'w_out', kind: 'wire-out', face: '-Z', offsetAlongFace: 2.0, heightY: 2.5 },
      ],
      basketLabel: 'SILLY THOUGHTS',
      modes: [
        {
          id: 'craft-toy-brain',
          label: 'Mould Toy-Smarts Curiosity Brain',
          powerMW: 6,
          cycleSec: 1.6,
          inputs: [{ itemType: 'rainbow-dye', acceptedItems: ['rainbow-dye', 'red-goo', 'gold-goo', 'blue-goo', 'sugar-cube'], count: 1 }],
          producesItem: 'toy-brain',
          byproductItem: 'sprinkles',
          byproductEveryCycles: 1,
        },
        {
          id: 'craft-idea-bulb',
          label: 'Spark Bright Idea Bulb',
          powerMW: 6,
          cycleSec: 1.5,
          inputs: [{ itemType: 'cog', acceptedItems: ['cog', 'tin-ingot', 'widget'], count: 1 }],
          producesItem: 'idea-bulb',
          byproductItem: 'spare-parts',
          byproductEveryCycles: 2,
        },
        {
          id: 'awaken-smart-toy',
          label: 'Bring Smart Talking Toy to Life!',
          powerMW: 8,
          cycleSec: 2.0,
          inputs: [
            { itemType: 'toy-brain', acceptedItems: ['toy-brain', 'idea-bulb'], count: 1 },
            { itemType: 'toy-train', acceptedItems: ['toy-train', 'spinning-top', 'toy-rocket', 'wheel'], count: 1 },
          ],
          producesItem: 'smart-teddy-toy',
          giftCredit: 2,
          byproductItem: 'sprinkles',
          byproductEveryCycles: 1,
        },
      ],
    };
  }
}
