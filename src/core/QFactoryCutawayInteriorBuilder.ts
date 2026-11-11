import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryInteriorTheme } from './QFactoryMachineSchema';
import { QFactoryToySweetItemBuilder } from './QFactoryToySweetItemBuilder';

export class QFactoryCutawayInteriorBuilder {
  private static _gearGeoCache = new Map<string, THREE.ExtrudeGeometry>();

  private static getGearGeometry(radius: number, teeth: number): THREE.ExtrudeGeometry {
    const key = `${radius}_${teeth}`;
    let geo = this._gearGeoCache.get(key);
    if (!geo) {
      const shape = new THREE.Shape();
      const innerR = radius * 0.76;
      const steps = teeth * 2;
      for (let i = 0; i < steps; i++) {
        const a0 = (i / steps) * Math.PI * 2;
        const a1 = ((i + 0.7) / steps) * Math.PI * 2;
        const r = i % 2 === 0 ? radius : innerR;
        if (i === 0) shape.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
        else shape.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
        shape.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
      }
      shape.closePath();
      const hole = new THREE.Path();
      hole.absarc(0, 0, radius * 0.24, 0, Math.PI * 2, false);
      shape.holes.push(hole);

      geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.34,
        curveSegments: 4,
        bevelEnabled: false,
        steps: 1,
      });
      geo.center();
      this._gearGeoCache.set(key, geo);
    }
    return geo;
  }

  public static buildInterior(
    group: THREE.Group,
    lenX: number,
    heightY: number,
    widthZ: number,
    theme: QFactoryInteriorTheme
  ): void {
    const gearMat = QFactoryClayMaterialLibrary.getClay('#8c8275');
    const gearAccentMat = QFactoryClayMaterialLibrary.getClay('#a69b8d');

    // 3 interlocking clay gears on back-right cutaway wall
    const g1 = new THREE.Mesh(this.getGearGeometry(1.15, 10), gearMat);
    g1.name = 'anim_gear_1';
    g1.position.set(lenX * 0.2, heightY * 0.68, -widthZ * 0.22);

    const g2 = new THREE.Mesh(this.getGearGeometry(0.82, 8), gearAccentMat);
    g2.name = 'anim_gear_2';
    g2.position.set(lenX * 0.05, heightY * 0.76, -widthZ * 0.24);

    const g3 = new THREE.Mesh(this.getGearGeometry(0.95, 9), gearMat);
    g3.name = 'anim_gear_3';
    g3.position.set(lenX * 0.22, heightY * 0.46, -widthZ * 0.24);
    group.add(g1, g2, g3);

    // Colorful dangling clay wires inside top-left & right jamb
    const wireColors = ['#ef4444', '#eab308', '#3b82f6', '#10b981'];
    for (let w = 0; w < 3; w++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-lenX * 0.26 + w * 0.25, heightY * 0.82, -widthZ * 0.1),
        new THREE.Vector3(-lenX * 0.14 + w * 0.25, heightY * 0.68 - w * 0.1, -widthZ * 0.15),
        new THREE.Vector3(-lenX * 0.02 + w * 0.22, heightY * 0.82, -widthZ * 0.12),
      ]);
      const wire = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 8, 0.06, 5, false),
        QFactoryClayMaterialLibrary.getClay(wireColors[w])
      );
      group.add(wire);
    }

    // 2-Joint Articulated Clay Robotic Arm
    const armMat = QFactoryClayMaterialLibrary.getClay('#76818e');
    const jointMat = QFactoryClayMaterialLibrary.getClay('#525b66');
    const armBase = new THREE.Group();
    armBase.name = 'anim_arm_base';
    armBase.position.set(lenX * 0.12, heightY * 0.34, 0.1);

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.62, 1.1, 10), armMat);
    pedestal.position.y = 0.55;
    const boomPivot = new THREE.Group();
    boomPivot.name = 'anim_arm_upper';
    boomPivot.position.set(0, 1.0, 0);

    const boom = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.42, 0.42), armMat);
    boom.position.set(-0.85, 0.45, 0);
    boom.rotation.z = -0.45;
    const elbow = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.52, 10), jointMat);
    elbow.rotation.x = Math.PI / 2;
    elbow.position.set(-1.75, 0.85, 0);

    const claw = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.09, 6, 12, Math.PI * 1.4), jointMat);
    claw.position.set(-2.05, 0.55, 0);
    claw.rotation.z = Math.PI * 0.65;

    boomPivot.add(boom, elbow, claw);
    armBase.add(pedestal, boomPivot);
    group.add(armBase);

    this.addInteriorDisplayProps(group, heightY * 0.36, theme);
  }

  private static addInteriorDisplayProps(group: THREE.Group, deckY: number, theme: QFactoryInteriorTheme): void {
    if (theme === 'sweet-swirl') {
      const pop = QFactoryToySweetItemBuilder.createMesh('swirl-lollipop');
      pop.scale.setScalar(1.55);
      pop.position.set(-1.35, deckY + 1.15, 0.25);
      const c1 = QFactoryToySweetItemBuilder.createMesh('star-cupcake');
      c1.scale.setScalar(1.3);
      c1.position.set(-2.1, deckY + 0.45, 0.4);
      const c2 = QFactoryToySweetItemBuilder.createMesh('star-cupcake');
      c2.scale.setScalar(1.3);
      c2.position.set(-0.8, deckY + 0.45, 0.4);
      group.add(pop, c1, c2);
      return;
    }
    if (theme === 'toy-assembly') {
      const train = QFactoryToySweetItemBuilder.createMesh('toy-train');
      train.scale.setScalar(1.45);
      train.position.set(-1.8, deckY + 0.5, 0.35);
      const top = QFactoryToySweetItemBuilder.createMesh('spinning-top');
      top.scale.setScalar(1.4);
      top.position.set(-0.3, deckY + 0.55, 0.35);
      const rocket = QFactoryToySweetItemBuilder.createMesh('toy-rocket');
      rocket.scale.setScalar(1.45);
      rocket.position.set(1.8, deckY + 0.65, 0.35);
      group.add(train, top, rocket);
      return;
    }
    if (theme === 'gizmo-lathe') {
      const wheel = QFactoryToySweetItemBuilder.createMesh('wheel');
      wheel.scale.setScalar(1.5);
      wheel.position.set(-1.4, deckY + 0.55, 0.35);
      const cog = QFactoryToySweetItemBuilder.createMesh('cog');
      cog.scale.setScalar(1.5);
      cog.position.set(-0.1, deckY + 0.55, 0.35);
      group.add(wheel, cog);
      return;
    }
    if (theme === 'gift-wrap') {
      const gift = QFactoryToySweetItemBuilder.createMesh('gift-box');
      gift.scale.setScalar(1.65);
      gift.position.set(-1.0, deckY + 0.6, 0.35);
      group.add(gift);
    }
  }
}
