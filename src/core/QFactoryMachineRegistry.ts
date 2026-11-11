import colorExtractorJson from '../data/machines/color-extractor.json';
import giftWrapperJson from '../data/machines/gift-wrapper.json';
import partLatheJson from '../data/machines/part-lathe.json';
import sugarHarvesterJson from '../data/machines/sugar-harvester.json';
import sweetMakerJson from '../data/machines/sweet-maker.json';
import toyAssemblerJson from '../data/machines/toy-assembler.json';
import { QFactoryMachineDef, validateMachineDef } from './QFactoryMachineSchema';
import { QFactoryBuildingType } from './QFactoryTypes';

const RAW_MACHINE_JSONS: unknown[] = [
  sugarHarvesterJson,
  colorExtractorJson,
  sweetMakerJson,
  partLatheJson,
  toyAssemblerJson,
  giftWrapperJson,
];

export class QFactoryMachineRegistry {
  private static _byId: Map<string, QFactoryMachineDef> | null = null;
  private static _list: QFactoryMachineDef[] | null = null;

  private static ensureLoaded(): Map<string, QFactoryMachineDef> {
    if (!this._byId) {
      const map = new Map<string, QFactoryMachineDef>();
      const list: QFactoryMachineDef[] = [];
      for (const raw of RAW_MACHINE_JSONS) {
        const validated = validateMachineDef(raw);
        map.set(validated.id, validated);
        list.push(validated);
      }
      this._byId = map;
      this._list = list;
    }
    return this._byId;
  }

  public static has(type: QFactoryBuildingType | string): boolean {
    return this.ensureLoaded().has(type);
  }

  public static getById(id: string): QFactoryMachineDef {
    const found = this.ensureLoaded().get(id);
    if (!found) {
      throw new Error(`Unknown Workshop MachineDefinition id: "${id}".`);
    }
    return found;
  }

  public static getAll(): QFactoryMachineDef[] {
    this.ensureLoaded();
    return this._list as QFactoryMachineDef[];
  }

  public static registerDynamic(def: QFactoryMachineDef): void {
    const validated = validateMachineDef(def);
    const map = this.ensureLoaded();
    map.set(validated.id, validated);
    const list = this._list as QFactoryMachineDef[];
    const idx = list.findIndex((d) => d.id === validated.id);
    if (idx >= 0) {
      list[idx] = validated;
    } else {
      list.push(validated);
    }
  }
}
