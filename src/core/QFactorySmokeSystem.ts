import * as THREE from 'three';
import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFactorySimManager } from './QFactorySimManager';

interface QFactorySmokePuff {
  x: number;
  y: number;
  z: number;
  age: number;
  life: number;
  vx: number;
  vz: number;
}

export class QFactorySmokeSystem {
  private _maxPuffs = 120;
  private _mesh: THREE.InstancedMesh;
  private _puffs: QFactorySmokePuff[] = [];
  private _dummy = new THREE.Object3D();
  private _emitCarry = 0;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.SphereGeometry(0.55, 8, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.96,
      metalness: 0.0,
    });
    this._mesh = new THREE.InstancedMesh(geo, mat, this._maxPuffs);
    this._mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._mesh.count = 0;
    scene.add(this._mesh);
  }

  public step(sim: QFactorySimManager, deltaSec: number): void {
    this._emitCarry += deltaSec;
    if (this._emitCarry >= 0.22) {
      this._emitCarry = 0;
      this.spawnFromActiveStacks(sim);
    }

    for (let i = this._puffs.length - 1; i >= 0; i--) {
      const p = this._puffs[i];
      p.age += deltaSec;
      if (p.age >= p.life) {
        this._puffs.splice(i, 1);
        continue;
      }
      p.y += deltaSec * 2.4;
      p.x += p.vx * deltaSec;
      p.z += p.vz * deltaSec;
    }

    const activeCount = Math.min(this._puffs.length, this._maxPuffs);
    this._mesh.count = activeCount;
    for (let i = 0; i < activeCount; i++) {
      const p = this._puffs[i];
      const t = p.age / p.life;
      const scale = (0.55 + Math.sin(t * Math.PI) * 0.95) * (1 - t * 0.35);
      this._dummy.position.set(p.x, p.y, p.z);
      this._dummy.scale.set(scale * 1.15, scale * 0.9, scale);
      this._dummy.updateMatrix();
      this._mesh.setMatrixAt(i, this._dummy.matrix);
    }
    this._mesh.instanceMatrix.needsUpdate = true;
  }

  private spawnFromActiveStacks(sim: QFactorySimManager): void {
    for (const bld of sim.getBuildings()) {
      if (!QFactoryMachineRegistry.has(bld.type)) continue;
      if ((bld.spinRatio ?? 0) < 0.25) continue;
      const def = QFactoryMachineRegistry.getById(bld.type);
      const rad = (-bld.rotationDeg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      for (const off of def.detailed.smokeOffsets) {
        if (this._puffs.length >= this._maxPuffs) return;
        const wx = bld.x + off.x * cos + off.z * sin;
        const wz = bld.z - off.x * sin + off.z * cos;
        this._puffs.push({
          x: wx,
          y: bld.y + off.y,
          z: wz,
          age: 0,
          life: 2.2,
          vx: 0.65 + (this._puffs.length % 3) * 0.15,
          vz: ((this._puffs.length % 5) - 2) * 0.08,
        });
      }
    }
  }
}
