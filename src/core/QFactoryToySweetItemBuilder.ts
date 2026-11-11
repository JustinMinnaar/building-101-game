import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryGooAndBrainItemBuilder } from './QFactoryGooAndBrainItemBuilder';
import { QFactoryItemType } from './QFactoryTypes';

export class QFactoryToySweetItemBuilder {
  private static _smallBox = new THREE.BoxGeometry(0.45, 0.45, 0.45);
  private static _discGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.14, 14);
  private static _stickGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.75, 6);
  private static _cupGeo = new THREE.CylinderGeometry(0.32, 0.22, 0.34, 10);
  private static _coneGeo = new THREE.ConeGeometry(0.36, 0.45, 10);

  public static isToySweetItem(type: QFactoryItemType): boolean {
    return [
      'sugar-cube', 'rainbow-dye', 'wood-block', 'tin-ingot',
      'red-goo', 'gold-goo', 'blue-goo', 'spice-pinch',
      'swirl-lollipop', 'star-cupcake', 'cog', 'wheel', 'widget',
      'toy-train', 'spinning-top', 'toy-rocket', 'gift-box',
      'toy-brain', 'idea-bulb', 'smart-teddy-toy',
      'sprinkles', 'spare-parts',
    ].includes(type);
  }

  public static createMesh(type: QFactoryItemType): THREE.Mesh {
    const special = QFactoryGooAndBrainItemBuilder.createGooOrBrainMesh(type);
    if (special) return special;
    switch (type) {
      case 'sugar-cube':
        return this.makeSugarCluster();
      case 'rainbow-dye':
        return this.makeRainbowBottle();
      case 'wood-block':
        return new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.55, 0.65),
          QFactoryClayMaterialLibrary.getClay('#d97706')
        );
      case 'tin-ingot':
        return new THREE.Mesh(
          new THREE.BoxGeometry(0.75, 0.32, 0.44),
          QFactoryClayMaterialLibrary.getBrass('#eab308')
        );
      case 'swirl-lollipop':
        return this.makeSwirlLollipop();
      case 'star-cupcake':
        return this.makeStarCupcake();
      case 'cog':
        return this.makeToyCog();
      case 'wheel':
        return this.makeToyWheel();
      case 'widget':
        return this.makeStarWidget();
      case 'toy-train':
        return this.makeWoodenTrain();
      case 'spinning-top':
        return this.makeSpinningTop();
      case 'toy-rocket':
        return this.makeToyRocket();
      case 'gift-box':
        return this.makeGiftBox();
      case 'sprinkles':
        return new THREE.Mesh(
          new THREE.OctahedronGeometry(0.26, 0),
          QFactoryClayMaterialLibrary.getCandyGloss('#f472b6', 0.2)
        );
      case 'spare-parts':
      default:
        return this.makeToyCog();
    }
  }

  private static makeSugarCluster(): THREE.Mesh {
    const root = new THREE.Mesh(this._smallBox, QFactoryClayMaterialLibrary.getClay('#ffffff'));
    const berry = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 8, 8),
      QFactoryClayMaterialLibrary.getCandyGloss('#ec4899', 0.15)
    );
    berry.position.set(0.26, 0.05, 0.18);
    root.add(berry);
    return root;
  }

  private static makeRainbowBottle(): THREE.Mesh {
    const root = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.32, 0.55, 10),
      QFactoryClayMaterialLibrary.getCandyGloss('#38bdf8', 0.3)
    );
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 8, 8),
      QFactoryClayMaterialLibrary.getCandyGloss('#facc15', 0.35)
    );
    cap.position.y = 0.32;
    root.add(cap);
    return root;
  }

  private static makeSwirlLollipop(): THREE.Mesh {
    const root = new THREE.Mesh(this._discGeo, QFactoryClayMaterialLibrary.getCandyGloss('#ec4899', 0.22));
    root.rotation.x = Math.PI / 2;
    const innerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.07, 6, 12),
      QFactoryClayMaterialLibrary.getCandyGloss('#facc15', 0.25)
    );
    innerRing.position.y = 0.06;
    const centerDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      QFactoryClayMaterialLibrary.getCandyGloss('#38bdf8', 0.25)
    );
    centerDot.position.y = 0.06;
    const stick = new THREE.Mesh(this._stickGeo, QFactoryClayMaterialLibrary.getClay('#fffbeb'));
    stick.rotation.x = -Math.PI / 2;
    stick.position.set(0, 0, 0.52);
    root.add(innerRing, centerDot, stick);
    return root;
  }

  private static makeStarCupcake(): THREE.Mesh {
    const root = new THREE.Mesh(this._cupGeo, QFactoryClayMaterialLibrary.getClay('#fb7185'));
    const frosting = new THREE.Mesh(this._coneGeo, QFactoryClayMaterialLibrary.getClay('#c084fc'));
    frosting.position.y = 0.34;
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.14, 0),
      QFactoryClayMaterialLibrary.getCandyGloss('#facc15', 0.35)
    );
    star.position.y = 0.62;
    root.add(frosting, star);
    return root;
  }

  private static makeToyCog(): THREE.Mesh {
    const root = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.16, 8),
      QFactoryClayMaterialLibrary.getBrass('#f59e0b')
    );
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.22, 8),
      QFactoryClayMaterialLibrary.getClay('#78350f')
    );
    root.add(hub);
    return root;
  }

  private static makeToyWheel(): THREE.Mesh {
    const root = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.12, 8, 14),
      QFactoryClayMaterialLibrary.getClay('#ef4444')
    );
    root.rotation.x = Math.PI / 2;
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.18, 8),
      QFactoryClayMaterialLibrary.getClay('#facc15')
    );
    hub.rotation.x = Math.PI / 2;
    root.add(hub);
    return root;
  }

  private static makeStarWidget(): THREE.Mesh {
    const root = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.38, 0),
      QFactoryClayMaterialLibrary.getCandyGloss('#a855f7', 0.25)
    );
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.06, 6, 12),
      QFactoryClayMaterialLibrary.getBrass('#fde047')
    );
    root.add(ring);
    return root;
  }

  private static makeWoodenTrain(): THREE.Mesh {
    const boiler = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.42, 0.46),
      QFactoryClayMaterialLibrary.getClay('#22c55e')
    );
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.55, 0.48),
      QFactoryClayMaterialLibrary.getClay('#2563eb')
    );
    cab.position.set(-0.22, 0.25, 0);
    const stack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.09, 0.34, 8),
      QFactoryClayMaterialLibrary.getClay('#ef4444')
    );
    stack.position.set(0.24, 0.34, 0);
    boiler.add(cab, stack);
    return boiler;
  }

  private static makeSpinningTop(): THREE.Mesh {
    const body = new THREE.Mesh(
      new THREE.ConeGeometry(0.42, 0.65, 12),
      QFactoryClayMaterialLibrary.getCandyGloss('#f59e0b', 0.15)
    );
    body.rotation.x = Math.PI;
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.07, 6, 12),
      QFactoryClayMaterialLibrary.getCandyGloss('#ec4899', 0.2)
    );
    band.rotation.x = Math.PI / 2;
    band.position.y = -0.15;
    body.add(band);
    return body;
  }

  private static makeToyRocket(): THREE.Mesh {
    const hull = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.26, 0.65, 10),
      QFactoryClayMaterialLibrary.getClay('#f8fafc')
    );
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.32, 10),
      QFactoryClayMaterialLibrary.getClay('#ef4444')
    );
    nose.position.y = 0.48;
    hull.add(nose);
    return hull;
  }

  private static makeGiftBox(): THREE.Mesh {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.66, 0.76),
      QFactoryClayMaterialLibrary.getClay('#fde68a')
    );
    const ribbonMat = QFactoryClayMaterialLibrary.getCandyGloss('#e11d48', 0.22);
    const r1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.16), ribbonMat);
    const r2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.7, 0.8), ribbonMat);
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.06, 6, 10), ribbonMat);
    bow.position.y = 0.42;
    box.add(r1, r2, bow);
    return box;
  }
}
