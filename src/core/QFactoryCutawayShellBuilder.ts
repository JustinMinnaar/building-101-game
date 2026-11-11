import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryDetailedStyleSpec, QFactoryRoofStyle } from './QFactoryMachineSchema';

export class QFactoryCutawayShellBuilder {
  private static _shellGeoCache = new Map<string, THREE.ExtrudeGeometry>();

  private static makeRoundedRectShape(w: number, h: number, r: number): THREE.Shape {
    const s = new THREE.Shape();
    const hw = w / 2;
    const hh = h / 2;
    s.moveTo(-hw + r, -hh);
    s.lineTo(hw - r, -hh);
    s.quadraticCurveTo(hw, -hh, hw, -hh + r);
    s.lineTo(hw, hh - r);
    s.quadraticCurveTo(hw, hh, hw - r, hh);
    s.lineTo(-hw + r, hh);
    s.quadraticCurveTo(-hw, hh, -hw, hh - r);
    s.lineTo(-hw, -hh + r);
    s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    return s;
  }

  private static makeWindowHolePath(w: number, h: number, offsetY: number, r: number): THREE.Path {
    const p = new THREE.Path();
    const hw = w / 2;
    const hh = h / 2;
    p.moveTo(-hw + r, offsetY - hh);
    p.lineTo(hw - r, offsetY - hh);
    p.quadraticCurveTo(hw, offsetY - hh, hw, offsetY - hh + r);
    p.lineTo(hw, offsetY + hh - r);
    p.quadraticCurveTo(hw, offsetY + hh, hw - r, offsetY + hh);
    p.lineTo(-hw + r, offsetY + hh);
    p.quadraticCurveTo(-hw, offsetY + hh, -hw, offsetY + hh - r);
    p.lineTo(-hw, offsetY - hh + r);
    p.quadraticCurveTo(-hw, offsetY - hh, -hw + r, offsetY - hh);
    return p;
  }

  private static getCutawayFrontGeo(lenX: number, heightY: number, depthZ: number): THREE.ExtrudeGeometry {
    const key = `${lenX}_${heightY}_${depthZ}`;
    let geo = this._shellGeoCache.get(key);
    if (!geo) {
      const outer = this.makeRoundedRectShape(lenX, heightY, 0.45);
      const winW = lenX * 0.72;
      const winH = heightY * 0.54;
      outer.holes.push(this.makeWindowHolePath(winW, winH, 0.55, 0.32));
      geo = new THREE.ExtrudeGeometry(outer, {
        depth: depthZ,
        curveSegments: 4,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: 0.16,
        bevelThickness: 0.16,
      });
      geo.center();
      this._shellGeoCache.set(key, geo);
    }
    return geo;
  }

  public static buildCutawayChassis(
    group: THREE.Group,
    lenX: number,
    heightY: number,
    widthZ: number,
    style: QFactoryDetailedStyleSpec
  ): void {
    const shellMat = QFactoryClayMaterialLibrary.getClay(style.shellColorHex);
    const darkInteriorMat = QFactoryClayMaterialLibrary.getClay('#3f3a34');
    const basePlinthMat = QFactoryClayMaterialLibrary.getClay('#e4d5c1');

    // Open-front extruded clay shell
    const frontGeo = this.getCutawayFrontGeo(lenX * 0.88, heightY, widthZ * 0.86);
    const shellMesh = new THREE.Mesh(frontGeo, shellMat);
    shellMesh.position.set(0, heightY * 0.5, 0);
    group.add(shellMesh);

    // Solid back wall & interior belt counter so cutaway has cozy depth
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(lenX * 0.82, heightY * 0.9, 0.5), darkInteriorMat);
    backWall.position.set(0, heightY * 0.48, -widthZ * 0.36);
    const lowerFrontApron = new THREE.Mesh(new THREE.BoxGeometry(lenX * 0.86, heightY * 0.27, widthZ * 0.82), basePlinthMat);
    lowerFrontApron.position.set(0, heightY * 0.14, 0);
    group.add(backWall, lowerFrontApron);

    // Left (-X) & Right (+X) conveyor portal frames + 4 pastel button dots
    const portalFrameMat = QFactoryClayMaterialLibrary.getClay(style.shellColorHex);
    const portalL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.2, 2.4), portalFrameMat);
    portalL.position.set(-lenX * 0.45, 2.2, 0);
    const portalR = portalL.clone();
    portalR.position.set(lenX * 0.45, 2.2, 0);
    group.add(portalL, portalR);

    const buttonColors = ['#facc15', '#38bdf8', '#4ade80', '#fb7185'];
    for (let i = 0; i < 4; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        QFactoryClayMaterialLibrary.getCandyGloss(buttonColors[i], 0.25)
      );
      dot.position.set(-lenX * 0.46, heightY * 0.78, -0.75 + i * 0.5);
      group.add(dot);
    }

    this.buildSideToggleLever(group, lenX * 0.31, heightY * 0.18, widthZ * 0.46);
    this.buildRoofTopper(group, lenX * 0.88, heightY, widthZ * 0.88, style.roofStyle, style.trimColorHex);
  }

  private static buildSideToggleLever(group: THREE.Group, x: number, y: number, z: number): void {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.35, 0.28), QFactoryClayMaterialLibrary.getClay('#bfa58a'));
    slot.position.set(x, y, z);
    const leverPivot = new THREE.Group();
    leverPivot.name = 'anim_lever';
    leverPivot.position.set(x, y - 0.15, z + 0.1);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.85, 8), QFactoryClayMaterialLibrary.getClay('#8c735b'));
    stick.position.set(0, 0.35, 0.2);
    stick.rotation.x = Math.PI * 0.25;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), QFactoryClayMaterialLibrary.getClay('#d6bfa6'));
    knob.position.set(0, 0.65, 0.5);
    leverPivot.add(stick, knob);
    group.add(slot, leverPivot);
  }

  private static buildRoofTopper(
    group: THREE.Group,
    lenX: number,
    heightY: number,
    widthZ: number,
    roofStyle: QFactoryRoofStyle,
    trimHex: string
  ): void {
    if (roofStyle === 'striped-awning') {
      const stripes = 9;
      const stripeW = lenX / stripes;
      for (let i = 0; i < stripes; i++) {
        const isTrim = i % 2 === 0;
        const mat = QFactoryClayMaterialLibrary.getClay(isTrim ? trimHex : '#fff7ed');
        const awning = new THREE.Mesh(new THREE.BoxGeometry(stripeW * 0.98, 0.9, 1.35), mat);
        awning.position.set(-lenX / 2 + stripeW * (i + 0.5), heightY - 0.15, widthZ * 0.52);
        awning.rotation.x = 0.35;
        group.add(awning);

        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 6, 5),
          QFactoryClayMaterialLibrary.getCandyGloss('#fef08a', 0.85)
        );
        bulb.position.set(-lenX / 2 + stripeW * (i + 0.5), heightY + 0.55, widthZ * 0.47);
        group.add(bulb);
      }
      return;
    }

    if (roofStyle === 'bunting-and-stacks') {
      const pennantColors = ['#c084fc', '#fde047', '#fb7185', '#4ade80', '#38bdf8', '#fb923c'];
      const count = 6;
      const span = lenX * 0.88;
      for (let i = 0; i < count; i++) {
        const flag = new THREE.Mesh(
          new THREE.ConeGeometry(0.42, 0.85, 3),
          QFactoryClayMaterialLibrary.getClay(pennantColors[i % pennantColors.length])
        );
        flag.rotation.z = Math.PI;
        flag.position.set(-span / 2 + (span / (count - 1)) * i, heightY - 0.25, widthZ * 0.5);
        group.add(flag);
      }
      for (let s = 0; s < 3; s++) {
        const h = 1.3 + s * 0.35;
        const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, h, 10), QFactoryClayMaterialLibrary.getBrass());
        stack.position.set(0.4 + s * 1.05, heightY + h * 0.5, 0);
        group.add(stack);
      }
      return;
    }

    if (roofStyle === 'ribbon-arch') {
      const ribbonMat = QFactoryClayMaterialLibrary.getClay(trimHex);
      const loopL = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.24, 8, 14), ribbonMat);
      loopL.position.set(-0.75, heightY + 0.7, 0);
      loopL.rotation.z = 0.4;
      const loopR = loopL.clone();
      loopR.position.set(0.75, heightY + 0.7, 0);
      loopR.rotation.z = -0.4;
      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.38, 8, 8), QFactoryClayMaterialLibrary.getCandyGloss('#facc15', 0.3));
      knot.position.set(0, heightY + 0.45, 0);
      group.add(loopL, loopR, knot);
      return;
    }

    const dome = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.9, 1.1, 12),
      QFactoryClayMaterialLibrary.getCandyGloss(trimHex, 0.45)
    );
    dome.position.set(0, heightY + 0.55, 0);
    group.add(dome);
  }
}
