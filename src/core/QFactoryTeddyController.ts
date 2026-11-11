import { QFactorySimManager } from './QFactorySimManager';
import { QFactoryItemType } from './QFactoryTypes';

export interface QFactoryTeddyInput {
  forward: number;
  right: number;
}

export interface QFactoryTeddyCharacter {
  id: string;
  name: string;
  furHex: string;
  padHex: string;
  accentHex: string;
  x: number;
  z: number;
  headingRad: number;
  walkPhase: number;
  isMoving: boolean;
}

export interface QFactoryTeddyState extends QFactoryTeddyCharacter {
  carriedItems: Partial<Record<QFactoryItemType, number>>;
  sprinklesCollected: number;
}

export class QFactoryTeddyController {
  private _squad: QFactoryTeddyCharacter[] = [
    { id: 'teddy_gold', name: 'Honey Bear', furHex: '#d98a2b', padHex: '#f6d5a3', accentHex: '#fb7185', x: 0, z: 8, headingRad: 0, walkPhase: 0, isMoving: false },
    { id: 'teddy_pink', name: 'Berry Bear', furHex: '#f472b6', padHex: '#fce7f3', accentHex: '#facc15', x: -12, z: -6, headingRad: 1.2, walkPhase: 1.4, isMoving: false },
    { id: 'teddy_blue', name: 'Sky Bear', furHex: '#38bdf8', padHex: '#e0f2fe', accentHex: '#fb923c', x: 10, z: 14, headingRad: -0.8, walkPhase: 2.8, isMoving: false },
    { id: 'teddy_mint', name: 'Clover Bear', furHex: '#34d399', padHex: '#d1fae5', accentHex: '#c084fc', x: 18, z: -10, headingRad: 2.1, walkPhase: 4.1, isMoving: false },
  ];
  private _activeIndex = 0;
  private _patrolClock = 0;
  private _speedMetersPerSec = 15.0;
  private _carriedItems: Partial<Record<QFactoryItemType, number>> = {
    'sugar-cube': 5,
    'rainbow-dye': 5,
    'spice-pinch': 4,
    'toy-brain': 3,
    'swirl-lollipop': 2,
  };
  private _sprinklesCollected = 0;

  public getSquad(): QFactoryTeddyCharacter[] {
    return this._squad;
  }

  public getActiveTeddyIndex(): number {
    return this._activeIndex;
  }

  public selectActiveTeddy(index: number): void {
    if (index < 0 || index >= this._squad.length) {
      throw new Error(`Invalid Teddy character index: ${index}`);
    }
    this._activeIndex = index;
  }

  public cycleActiveTeddy(): QFactoryTeddyCharacter {
    this._activeIndex = (this._activeIndex + 1) % this._squad.length;
    return this._squad[this._activeIndex];
  }

  public getState(): QFactoryTeddyState {
    const active = this._squad[this._activeIndex];
    return {
      ...active,
      carriedItems: { ...this._carriedItems },
      sprinklesCollected: this._sprinklesCollected,
    };
  }

  public setPosition(x: number, z: number): void {
    const active = this._squad[this._activeIndex];
    active.x = Math.max(-105, Math.min(105, x));
    active.z = Math.max(-105, Math.min(105, z));
  }

  public stepMovement(input: QFactoryTeddyInput, deltaSec: number, cameraYawRad = 0): void {
    const active = this._squad[this._activeIndex];
    const mag = Math.hypot(input.forward, input.right);
    if (mag < 0.01 || deltaSec <= 0) {
      active.isMoving = false;
      return;
    }
    const nx = input.right / mag;
    const nz = -input.forward / mag;
    const cos = Math.cos(cameraYawRad);
    const sin = Math.sin(cameraYawRad);
    const worldDx = nx * cos + nz * sin;
    const worldDz = -nx * sin + nz * cos;

    active.x = Math.max(-105, Math.min(105, active.x + worldDx * this._speedMetersPerSec * deltaSec));
    active.z = Math.max(-105, Math.min(105, active.z + worldDz * this._speedMetersPerSec * deltaSec));
    active.headingRad = Math.atan2(worldDx, worldDz);
    active.walkPhase += deltaSec * 11.0;
    active.isMoving = true;
  }

  public stepCompanionPatrol(deltaSec: number): void {
    if (deltaSec <= 0) return;
    this._patrolClock += deltaSec;
    const anchors = [
      { cx: -6, cz: -12, rx: 9, rz: 5 },
      { cx: -8, cz: 14, rx: 10, rz: 6 },
      { cx: 16, cz: 4, rx: 8, rz: 9 },
      { cx: 6, cz: -4, rx: 11, rz: 6 },
    ];
    for (let i = 0; i < this._squad.length; i++) {
      if (i === this._activeIndex) continue;
      const bear = this._squad[i];
      const a = anchors[i % anchors.length];
      const t = this._patrolClock * 0.55 + i * 1.7;
      const targetX = a.cx + Math.cos(t) * a.rx;
      const targetZ = a.cz + Math.sin(t * 1.3) * a.rz;
      const dx = targetX - bear.x;
      const dz = targetZ - bear.z;
      bear.x += dx * Math.min(1, deltaSec * 2.5);
      bear.z += dz * Math.min(1, deltaSec * 2.5);
      bear.headingRad = Math.atan2(dx, dz);
      bear.walkPhase += deltaSec * 8.5;
      bear.isMoving = true;
    }
  }

  public addCarriedItem(itemType: QFactoryItemType, count: number): void {
    if (count <= 0) return;
    const prev = this._carriedItems[itemType];
    this._carriedItems[itemType] = (prev !== undefined ? prev : 0) + count;
  }

  public collectNearbyBaskets(sim: QFactorySimManager, radius = 9.5): number {
    const active = this._squad[this._activeIndex];
    let total = 0;
    for (const bld of sim.getBuildings()) {
      if (Math.hypot(bld.x - active.x, bld.z - active.z) <= radius) {
        total += sim.collectMachineBasket(bld.id);
      }
    }
    this._sprinklesCollected += total;
    return total;
  }

  public handFeedMachine(sim: QFactorySimManager, buildingId: string): number {
    return sim.feedMachineFromPouch(buildingId, this._carriedItems);
  }
}
