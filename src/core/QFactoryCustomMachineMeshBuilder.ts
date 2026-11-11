import * as THREE from 'three';
import { QFactoryBasketAndSignBuilder } from './QFactoryBasketAndSignBuilder';
import {
  QFactoryCustomMachineSpec,
  QFactoryEditorAddon,
  QFactoryEditorConnector,
  QFactoryEditorCube,
  QFactoryFrontSide,
} from './QFactoryCustomMachineStore';
import { QFactoryStyleMaterialLibrary } from './QFactoryStyleMaterialLibrary';
import { QFactoryBuilding, QFactoryVisualMode } from './QFactoryTypes';

export class QFactoryCustomMachineMeshBuilder {
  private static _voidMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
  private static _boxGeo = new THREE.BoxGeometry(1, 1, 1);
  private static _cylGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);
  private static _sphereGeo = new THREE.SphereGeometry(0.5, 8, 7);

  public static buildCustomMachine(
    spec: QFactoryCustomMachineSpec,
    bld: QFactoryBuilding,
    visualMode: QFactoryVisualMode
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = bld.id;
    group.userData = { buildingId: bld.id, buildingType: bld.type, visualMode, isCustomMachine: true };
    group.position.set(bld.x, bld.y, bld.z);
    group.rotation.y = (-bld.rotationDeg * Math.PI) / 180;

    for (const cube of spec.frameCubes) {
      this.addFrameCubeMesh(group, cube, visualMode);
    }

    let gearIdx = 1;
    for (const addon of spec.addons) {
      this.addAddonMesh(group, addon, visualMode, gearIdx);
      if (addon.type === 'gear' || addon.type === 'cog') gearIdx = Math.min(3, gearIdx + 1);
    }

    const bounds = this.measureBounds(spec.frameCubes);
    for (const conn of spec.connectors) {
      this.addConnectorMesh(group, conn, bounds, visualMode);
    }

    this.addFrontSideMarker(group, spec.frontSide, bounds, visualMode);

    if (spec.basketLabel && visualMode !== 'blockout') {
      const basketDef = {
        id: `basket_${spec.id}`,
        label: spec.basketLabel,
        itemType: 'sprinkles' as const,
        capacity: bld.basketCapacity ?? 40,
        offset: { x: -1.0, y: 0, z: bounds.maxZ + 0.9 },
      };
      QFactoryBasketAndSignBuilder.buildFrontBasketAndFlag(group, basketDef);
      QFactoryBasketAndSignBuilder.syncBasketFill(group, bld.basketCount ?? 0, basketDef.capacity);
    }

    if (visualMode === 'anime') {
      QFactoryStyleMaterialLibrary.applyArtStylePostPass(group, 'anime');
    }
    return group;
  }

  private static addFrameCubeMesh(group: THREE.Group, cube: QFactoryEditorCube, mode: QFactoryVisualMode): void {
    const mat = QFactoryStyleMaterialLibrary.getSurface(cube.colorHex, mode);
    if (!cube.cutawayFront || mode === 'blockout') {
      const box = new THREE.Mesh(this._boxGeo, mat);
      box.scale.set(cube.w, cube.h, cube.d);
      box.position.set(cube.x, cube.y, cube.z);
      group.add(box);
      return;
    }

    // Open-front cutaway frame built from 5 crisp slabs so inside gears & stamper are visible!
    const t = Math.min(0.65, cube.w * 0.12);
    const recessMat = QFactoryStyleMaterialLibrary.getSurface('#3b332c', mode);
    const floor = new THREE.Mesh(this._boxGeo, mat);
    floor.scale.set(cube.w, t * 1.4, cube.d);
    floor.position.set(cube.x, cube.y - cube.h / 2 + t * 0.7, cube.z);

    const roof = new THREE.Mesh(this._boxGeo, mat);
    roof.scale.set(cube.w, t * 1.3, cube.d);
    roof.position.set(cube.x, cube.y + cube.h / 2 - t * 0.65, cube.z);

    const leftW = new THREE.Mesh(this._boxGeo, mat);
    leftW.scale.set(t, cube.h, cube.d);
    leftW.position.set(cube.x - cube.w / 2 + t / 2, cube.y, cube.z);

    const rightW = new THREE.Mesh(this._boxGeo, mat);
    rightW.scale.set(t, cube.h, cube.d);
    rightW.position.set(cube.x + cube.w / 2 - t / 2, cube.y, cube.z);

    const backW = new THREE.Mesh(this._boxGeo, recessMat);
    backW.scale.set(cube.w - t, cube.h - t, t);
    backW.position.set(cube.x, cube.y, cube.z - cube.d / 2 + t / 2);

    group.add(floor, roof, leftW, rightW, backW);
  }

  private static addAddonMesh(group: THREE.Group, a: QFactoryEditorAddon, mode: QFactoryVisualMode, gearIdx: number): void {
    const mat = QFactoryStyleMaterialLibrary.getSurface(a.colorHex, mode);
    const pivot = new THREE.Group();
    pivot.position.set(a.x, a.y, a.z);
    pivot.scale.setScalar(a.scale);
    pivot.rotation.y = (a.rotationDeg * Math.PI) / 180;

    if (a.type === 'gear' || a.type === 'cog') {
      pivot.name = `anim_gear_${gearIdx}`;
      const wheel = new THREE.Mesh(this._cylGeo, mat);
      wheel.rotation.x = Math.PI / 2;
      wheel.scale.set(a.type === 'gear' ? 1.8 : 1.25, 0.32, a.type === 'gear' ? 1.8 : 1.25);
      pivot.add(wheel);
      const teeth = a.type === 'gear' ? 8 : 6;
      for (let i = 0; i < teeth; i++) {
        const ang = (i / teeth) * Math.PI * 2;
        const tooth = new THREE.Mesh(this._boxGeo, mat);
        tooth.scale.set(0.28, 0.34, 0.3);
        const r = a.type === 'gear' ? 0.95 : 0.68;
        tooth.position.set(Math.cos(ang) * r, Math.sin(ang) * r, 0);
        tooth.rotation.z = ang;
        pivot.add(tooth);
      }
    } else if (a.type === 'robot-stamper') {
      const base = new THREE.Mesh(this._cylGeo, mat);
      base.scale.set(1.2, 0.9, 1.2);
      const upper = new THREE.Group();
      upper.name = 'anim_arm_upper';
      upper.position.y = 0.5;
      const boom = new THREE.Mesh(this._boxGeo, mat);
      boom.scale.set(1.8, 0.42, 0.42);
      boom.position.set(-0.65, 0.65, 0);
      boom.rotation.z = -0.45;
      const head = new THREE.Mesh(this._sphereGeo, QFactoryStyleMaterialLibrary.getSurface('#fb7185', mode));
      head.scale.setScalar(0.85);
      head.position.set(-1.45, 0.95, 0);
      upper.add(boom, head);
      pivot.add(base, upper);
    } else if (a.type === 'lever') {
      pivot.name = 'anim_lever';
      const stick = new THREE.Mesh(this._cylGeo, mat);
      stick.scale.set(0.2, 1.0, 0.2);
      stick.rotation.x = 0.45;
      const knob = new THREE.Mesh(this._sphereGeo, QFactoryStyleMaterialLibrary.getSurface('#ef4444', mode));
      knob.scale.setScalar(0.45);
      knob.position.set(0, 0.42, 0.25);
      pivot.add(stick, knob);
    } else if (a.type === 'light') {
      const dome = new THREE.Mesh(this._sphereGeo, mat);
      dome.scale.set(0.75, 0.95, 0.75);
      pivot.add(dome);
    } else if (a.type === 'button') {
      const btn = new THREE.Mesh(this._sphereGeo, mat);
      btn.scale.setScalar(0.42);
      pivot.add(btn);
    } else if (a.type === 'smokestack') {
      const stack = new THREE.Mesh(this._cylGeo, mat);
      stack.scale.set(0.65, 1.8, 0.65);
      pivot.add(stack);
    } else if (a.type === 'awning') {
      const roof = new THREE.Mesh(this._boxGeo, mat);
      roof.scale.set(4.6, 0.55, 1.3);
      roof.rotation.x = 0.3;
      pivot.add(roof);
    } else {
      const wire = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.09, 5, 10, Math.PI), mat);
      wire.rotation.z = Math.PI;
      pivot.add(wire);
    }
    group.add(pivot);
  }

  private static addConnectorMesh(
    group: THREE.Group,
    c: QFactoryEditorConnector,
    b: { minX: number; maxX: number; minZ: number; maxZ: number },
    mode: QFactoryVisualMode
  ): void {
    const pos = this.facePosition(c.face, c.offsetAlongFace, c.heightY, b);
    const isBelt = c.kind === 'belt-in' || c.kind === 'belt-out';
    if (isBelt) {
      const collarHex = c.kind === 'belt-in' ? '#10b981' : '#3b82f6';
      const collar = new THREE.Mesh(this._boxGeo, QFactoryStyleMaterialLibrary.getSurface(collarHex, mode));
      const alongX = c.face === '-X' || c.face === '+X';
      collar.scale.set(alongX ? 0.42 : 1.55, 1.55, alongX ? 1.55 : 0.42);
      collar.position.copy(pos);

      const tunnel = new THREE.Mesh(this._boxGeo, this._voidMat);
      tunnel.name = `tunnel_hole_${c.id}`;
      tunnel.scale.set(alongX ? 1.1 : 1.2, 1.2, alongX ? 1.2 : 1.1);
      tunnel.position.copy(pos);
      group.add(collar, tunnel);
      return;
    }

    const lugHex = c.kind === 'wire-in' ? '#facc15' : '#f97316';
    const lug = new THREE.Mesh(this._cylGeo, QFactoryStyleMaterialLibrary.getSurface(lugHex, mode));
    lug.scale.set(0.45, 0.55, 0.45);
    lug.rotation.z = Math.PI / 2;
    lug.position.copy(pos);
    group.add(lug);
  }

  private static addFrontSideMarker(
    group: THREE.Group,
    front: QFactoryFrontSide,
    b: { minX: number; maxX: number; minZ: number; maxZ: number },
    mode: QFactoryVisualMode
  ): void {
    const pos = this.facePosition(front, 0, 0.18, b);
    const badge = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 0.75, 4),
      QFactoryStyleMaterialLibrary.getSurface('#facc15', mode)
    );
    badge.name = 'front_side_marker';
    badge.rotation.x = Math.PI / 2;
    if (front === '-Z') badge.rotation.z = Math.PI;
    if (front === '+X') badge.rotation.z = -Math.PI / 2;
    if (front === '-X') badge.rotation.z = Math.PI / 2;
    badge.position.set(pos.x * 1.16, 0.18, pos.z * 1.16);
    group.add(badge);
  }

  private static measureBounds(cubes: QFactoryEditorCube[]) {
    let minX = -3, maxX = 3, minZ = -3, maxZ = 3;
    for (const c of cubes) {
      minX = Math.min(minX, c.x - c.w / 2);
      maxX = Math.max(maxX, c.x + c.w / 2);
      minZ = Math.min(minZ, c.z - c.d / 2);
      maxZ = Math.max(maxZ, c.z + c.d / 2);
    }
    return { minX, maxX, minZ, maxZ };
  }

  private static facePosition(
    face: QFactoryFrontSide,
    offset: number,
    y: number,
    b: { minX: number; maxX: number; minZ: number; maxZ: number }
  ): THREE.Vector3 {
    if (face === '-X') return new THREE.Vector3(b.minX, y, offset);
    if (face === '+X') return new THREE.Vector3(b.maxX, y, offset);
    if (face === '-Z') return new THREE.Vector3(offset, y, b.minZ);
    return new THREE.Vector3(offset, y, b.maxZ);
  }
}
