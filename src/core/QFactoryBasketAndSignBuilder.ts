import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryBasketSpec } from './QFactoryMachineSchema';
import { QFactoryBelt } from './QFactoryTypes';

export class QFactoryBasketAndSignBuilder {
  private static _flagMatCache = new Map<string, THREE.MeshStandardMaterial>();
  private static _sprinkleGeo = new THREE.OctahedronGeometry(0.24, 0);
  private static _cogBitGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.14, 7);

  private static getFlagMaterial(label: string): THREE.MeshStandardMaterial {
    let mat = this._flagMatCache.get(label);
    if (!mat) {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#faf7f2';
          ctx.fillRect(0, 0, 256, 128);
          ctx.strokeStyle = '#d6d3d1';
          ctx.lineWidth = 6;
          ctx.strokeRect(3, 3, 250, 122);
          ctx.fillStyle = '#1c1917';
          ctx.font = 'bold 26px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const words = label.split(' ');
          if (words.length >= 2) {
            ctx.fillText(words[0], 128, 46);
            ctx.fillText(words.slice(1).join(' '), 128, 84);
          } else {
            ctx.fillText(label, 128, 64);
          }
          const tex = new THREE.CanvasTexture(canvas);
          tex.needsUpdate = true;
          mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, side: THREE.DoubleSide });
        }
      }
      if (!mat) {
        mat = new THREE.MeshStandardMaterial({ color: 0xfaf7f2, roughness: 0.85, side: THREE.DoubleSide });
      }
      this._flagMatCache.set(label, mat);
    }
    return mat;
  }

  public static buildFrontBasketAndFlag(group: THREE.Group, spec: QFactoryBasketSpec): void {
    const basketGroup = new THREE.Group();
    basketGroup.name = 'basket_container';
    basketGroup.position.set(spec.offset.x, spec.offset.y, spec.offset.z);

    const clayMat = QFactoryClayMaterialLibrary.getClay('#dfd1be');
    const rimMat = QFactoryClayMaterialLibrary.getClay('#cbb89f');

    const floor = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.25, 1.85), clayMat);
    floor.position.y = 0.125;
    const wallF = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.35, 0.24), clayMat);
    wallF.position.set(0, 0.68, 0.82);
    const wallB = wallF.clone();
    wallB.position.set(0, 0.68, -0.82);
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.35, 1.65), clayMat);
    wallL.position.set(-1.23, 0.68, 0);
    const wallR = wallL.clone();
    wallR.position.set(1.23, 0.68, 0);
    const rim = new THREE.Mesh(new THREE.BoxGeometry(2.86, 0.22, 2.0), rimMat);
    rim.position.y = 1.38;
    basketGroup.add(floor, wallF, wallB, wallL, wallR, rim);

    // Pre-allocate 12 colorful items inside the open clay basket
    const stackGroup = new THREE.Group();
    stackGroup.name = 'basket_items_stack';
    const colors = ['#fb7185', '#facc15', '#38bdf8', '#4ade80', '#c084fc', '#fb923c'];
    const isParts = spec.itemType === 'spare-parts';
    for (let i = 0; i < 12; i++) {
      const bit = new THREE.Mesh(
        isParts ? this._cogBitGeo : this._sprinkleGeo,
        QFactoryClayMaterialLibrary.getCandyGloss(colors[i % colors.length], 0.18)
      );
      const col = i % 4;
      const row = Math.floor(i / 4);
      bit.position.set(-0.78 + col * 0.52, 0.48 + row * 0.34, -0.35 + (i % 3) * 0.35);
      bit.rotation.set(i * 0.5, i * 0.8, i * 0.3);
      bit.visible = false;
      stackGroup.add(bit);
    }
    basketGroup.add(stackGroup);

    // Toothpick flag sign
    const stick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 2.35, 6),
      QFactoryClayMaterialLibrary.getClay('#d6b283')
    );
    stick.position.set(-1.05, 1.85, 0.15);
    stick.rotation.z = 0.22;

    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.92), this.getFlagMaterial(spec.label));
    flag.name = 'sign_flag';
    flag.userData = { signText: spec.label };
    flag.position.set(-2.05, 2.55, 0.18);
    flag.rotation.z = 0.22;

    basketGroup.add(stick, flag);
    group.add(basketGroup);
  }

  public static syncBasketFill(group: THREE.Group, count: number, capacity: number): void {
    const stack = group.getObjectByName('basket_items_stack');
    if (!stack) return;
    const totalSlots = stack.children.length;
    const ratio = capacity > 0 ? Math.min(1, count / capacity) : 0;
    const visibleSlots = count > 0 ? Math.max(1, Math.round(ratio * totalSlots)) : 0;
    for (let i = 0; i < totalSlots; i++) {
      stack.children[i].visible = i < visibleSlots;
    }
  }

  public static createClayRollerBeltMesh(belt: QFactoryBelt): THREE.Group {
    const group = new THREE.Group();
    group.name = belt.id;
    group.userData = { beltId: belt.id, beltStyle: 'clay-roller' };

    const pts = belt.pathPoints && belt.pathPoints.length >= 2 ? belt.pathPoints : [belt.startPoint, belt.endPoint];
    const bandMat = QFactoryClayMaterialLibrary.getClay('#57534e');
    const frameMat = QFactoryClayMaterialLibrary.getClay('#a8a29e');
    const rollerMat = QFactoryClayMaterialLibrary.getClay('#e7e5e4');
    const rollerGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.28, 10);
    rollerGeo.rotateX(Math.PI / 2);

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = new THREE.Vector3(pts[i].x, pts[i].y, pts[i].z);
      const p1 = new THREE.Vector3(pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
      const diff = new THREE.Vector3().subVectors(p1, p0);
      const len = Math.max(0.25, diff.length());
      const mid = new THREE.Vector3().addVectors(p0, p1).multiplyScalar(0.5);

      const segGroup = new THREE.Group();
      const topBand = new THREE.Mesh(new THREE.BoxGeometry(len, 0.16, 1.18), bandMat);
      topBand.position.y = 0.22;
      const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(len, 0.34, 1.24), frameMat);
      sideFrame.position.y = 0.0;
      segGroup.add(topBand, sideFrame);

      const rollerCount = Math.max(1, Math.floor(len / 1.35));
      for (let r = 0; r < rollerCount; r++) {
        const rx = -len / 2 + (len / rollerCount) * (r + 0.5);
        const roller = new THREE.Mesh(rollerGeo, rollerMat);
        roller.position.set(rx, 0.0, 0);
        segGroup.add(roller);
      }

      segGroup.position.copy(mid);
      segGroup.rotation.y = -Math.atan2(diff.z, diff.x);
      group.add(segGroup);
    }
    return group;
  }
}
