import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryItemType } from './QFactoryTypes';

export class QFactoryGooAndBrainItemBuilder {
  private static _blobGeo = new THREE.SphereGeometry(0.38, 8, 7);
  private static _jarGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.48, 8);

  public static createGooOrBrainMesh(type: QFactoryItemType): THREE.Mesh | null {
    switch (type) {
      case 'red-goo':
        return this.makeGooDrop('#f43f5e');
      case 'gold-goo':
        return this.makeGooDrop('#f59e0b');
      case 'blue-goo':
        return this.makeGooDrop('#38bdf8');
      case 'spice-pinch':
        return this.makeSpiceJar();
      case 'toy-brain':
        return this.makeToyBrain();
      case 'idea-bulb':
        return this.makeIdeaBulb();
      case 'smart-teddy-toy':
        return this.makeSmartTeddyToy();
      default:
        return null;
    }
  }

  private static makeGooDrop(hex: string): THREE.Mesh {
    const drop = new THREE.Mesh(this._blobGeo, QFactoryClayMaterialLibrary.getCandyGloss(hex, 0.28));
    drop.scale.set(1.05, 0.78, 1.05);
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.34, 7),
      QFactoryClayMaterialLibrary.getCandyGloss(hex, 0.28)
    );
    tip.position.y = 0.28;
    drop.add(tip);
    return drop;
  }

  private static makeSpiceJar(): THREE.Mesh {
    const jar = new THREE.Mesh(this._jarGeo, QFactoryClayMaterialLibrary.getCandyGloss('#fb923c', 0.22));
    const star = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.16, 0),
      QFactoryClayMaterialLibrary.getCandyGloss('#fef08a', 0.4)
    );
    star.position.y = 0.34;
    jar.add(star);
    return jar;
  }

  private static makeToyBrain(): THREE.Mesh {
    // Cheerful pastel-pink "Toy-Smarts" curiosity brain (friendly play-dough halves + little star badge!)
    const leftLobe = new THREE.Mesh(this._blobGeo, QFactoryClayMaterialLibrary.getClay('#f472b6'));
    leftLobe.scale.set(0.85, 0.75, 1.15);
    leftLobe.position.x = -0.14;
    const rightLobe = new THREE.Mesh(this._blobGeo, QFactoryClayMaterialLibrary.getClay('#fb7185'));
    rightLobe.scale.set(0.85, 0.75, 1.15);
    rightLobe.position.x = 0.28;
    const starTag = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.15, 0),
      QFactoryClayMaterialLibrary.getCandyGloss('#facc15', 0.4)
    );
    starTag.position.set(0.14, 0.38, 0);
    leftLobe.add(rightLobe, starTag);
    return leftLobe;
  }

  private static makeIdeaBulb(): THREE.Mesh {
    const glass = new THREE.Mesh(this._blobGeo, QFactoryClayMaterialLibrary.getCandyGloss('#fde047', 0.65));
    const socket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.24, 8),
      QFactoryClayMaterialLibrary.getBrass('#94a3b8')
    );
    socket.position.y = -0.34;
    glass.add(socket);
    return glass;
  }

  private static makeSmartTeddyToy(): THREE.Mesh {
    const torso = new THREE.Mesh(this._blobGeo, QFactoryClayMaterialLibrary.getPlush('#38bdf8'));
    const head = new THREE.Mesh(this._blobGeo, QFactoryClayMaterialLibrary.getPlush('#38bdf8'));
    head.scale.setScalar(0.75);
    head.position.y = 0.48;
    const bulbHat = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 6, 5),
      QFactoryClayMaterialLibrary.getCandyGloss('#fde047', 0.7)
    );
    bulbHat.position.y = 0.82;
    torso.add(head, bulbHat);
    return torso;
  }
}
