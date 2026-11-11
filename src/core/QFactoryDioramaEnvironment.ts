import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFACTORY_RESOURCE_NODES } from './QFactoryResourceNodes';
import { QFactoryStyleMaterialLibrary } from './QFactoryStyleMaterialLibrary';
import { QFactoryFoundationFloor, QFactoryVisualMode } from './QFactoryTypes';

export class QFactoryDioramaEnvironment {
  public static buildStudioEnvironment(scene: THREE.Scene): THREE.Mesh {
    scene.background = new THREE.Color(0xd28a2e);
    scene.fog = new THREE.FogExp2(0xd28a2e, 0.0036);

    const hemi = new THREE.HemisphereLight(0xfff7ed, 0xb47b44, 0.95);
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.35);
    keyLight.position.set(42, 78, 48);
    const rimLight = new THREE.DirectionalLight(0xfde68a, 0.45);
    rimLight.position.set(-45, 35, -35);
    scene.add(hemi, keyLight, rimLight);

    const groundGeo = new THREE.PlaneGeometry(260, 260);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMesh = new THREE.Mesh(groundGeo, QFactoryClayMaterialLibrary.getClay('#cfa97e'));
    scene.add(groundMesh);

    const grid = new THREE.GridHelper(240, 120, 0xb08962, 0xbe9870);
    grid.position.y = 0.02;
    scene.add(grid);

    this.buildRainbowColorRiver(scene);
    this.buildResourcePatches(scene);
    return groundMesh;
  }

  public static applyEnvironmentStyle(scene: THREE.Scene, groundMesh: THREE.Mesh, mode: QFactoryVisualMode): void {
    if (mode === 'anime') {
      scene.background = new THREE.Color(0x7dd3fc);
      scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0032);
      groundMesh.material = QFactoryStyleMaterialLibrary.getSurface('#fef3c7', 'anime');
    } else if (mode === 'vinyl') {
      scene.background = new THREE.Color(0xf5d0fe);
      scene.fog = new THREE.FogExp2(0xf5d0fe, 0.0034);
      groundMesh.material = QFactoryStyleMaterialLibrary.getSurface('#ecfdf5', 'vinyl');
    } else if (mode === 'blockout') {
      scene.background = new THREE.Color(0x1e293b);
      scene.fog = new THREE.FogExp2(0x1e293b, 0.0036);
      groundMesh.material = QFactoryStyleMaterialLibrary.getSurface('#334155', 'blockout');
    } else {
      scene.background = new THREE.Color(0xd28a2e);
      scene.fog = new THREE.FogExp2(0xd28a2e, 0.0036);
      groundMesh.material = QFactoryClayMaterialLibrary.getClay('#cfa97e');
    }
  }

  private static buildRainbowColorRiver(scene: THREE.Scene): void {
    const bands = ['#38bdf8', '#c084fc', '#fb7185', '#facc15', '#4ade80'];
    for (let i = 0; i < bands.length; i++) {
      const offsetX = -42.5 + i * 0.95;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(offsetX - 2, 0.14, -55),
        new THREE.Vector3(offsetX + 1.5, 0.14, -12),
        new THREE.Vector3(offsetX - 1.2, 0.14, 18),
        new THREE.Vector3(offsetX + 1.8, 0.14, 55),
      ]);
      const ribbon = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 36, 0.58, 6, false),
        QFactoryClayMaterialLibrary.getCandyGloss(bands[i], 0.28)
      );
      ribbon.scale.set(1, 0.28, 1);
      scene.add(ribbon);
    }
  }

  private static buildResourcePatches(scene: THREE.Scene): void {
    for (const node of QFACTORY_RESOURCE_NODES) {
      let colorHex = '#92400e';
      let topperHex = '#d97706';
      if (node.oreType === 'sugar-cube') { colorHex = '#fce7f3'; topperHex = '#ec4899'; }
      else if (node.oreType === 'rainbow-dye') { colorHex = '#bae6fd'; topperHex = '#a855f7'; }
      else if (node.oreType === 'red-goo') { colorHex = '#fda4af'; topperHex = '#e11d48'; }
      else if (node.oreType === 'gold-goo') { colorHex = '#fde68a'; topperHex = '#d97706'; }
      else if (node.oreType === 'blue-goo') { colorHex = '#7dd3fc'; topperHex = '#0284c7'; }
      else if (node.oreType === 'wood-block') { colorHex = '#d97706'; topperHex = '#22c55e'; }
      else if (node.oreType === 'tin-ingot') { colorHex = '#eab308'; topperHex = '#fef08a'; }
      else if (node.oreType === 'copper-ore') { colorHex = '#b45309'; topperHex = '#0d9488'; }

      const isGoo = node.oreType.endsWith('-goo') || node.oreType === 'rainbow-dye';
      const patch = new THREE.Mesh(
        new THREE.CylinderGeometry(node.radius * 0.85, node.radius * 1.0, 0.42, 12),
        isGoo ? QFactoryClayMaterialLibrary.getCandyGloss(colorHex, 0.3) : QFactoryClayMaterialLibrary.getClay(colorHex)
      );
      patch.position.set(node.x, 0.21, node.z);
      scene.add(patch);

      for (let k = 0; k < 4; k++) {
        const angle = (k / 4) * Math.PI * 2 + 0.4;
        const dist = node.radius * 0.42;
        const nugget = new THREE.Mesh(
          isGoo ? new THREE.SphereGeometry(0.85, 8, 7) : new THREE.OctahedronGeometry(0.95, 0),
          QFactoryClayMaterialLibrary.getCandyGloss(topperHex, 0.28)
        );
        nugget.position.set(node.x + Math.cos(angle) * dist, 0.72, node.z + Math.sin(angle) * dist);
        scene.add(nugget);
      }
    }
  }

  public static createCardboardFoundationMesh(
    width: number,
    thickness: number,
    depth: number,
    mode: QFactoryVisualMode = 'detailed'
  ): THREE.Mesh {
    const deckHex = mode === 'anime' ? '#fde68a' : mode === 'vinyl' ? '#fbcfe8' : mode === 'blockout' ? '#64748b' : '#c89f72';
    const fluteHex = mode === 'anime' ? '#f59e0b' : mode === 'vinyl' ? '#ec4899' : '#6b4f35';
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(width, thickness, depth),
      QFactoryStyleMaterialLibrary.getSurface(deckHex, mode)
    );
    deck.name = 'deck_surface';

    const fluteMat = QFactoryStyleMaterialLibrary.getSurface(fluteHex, mode);
    const trimFront = new THREE.Mesh(new THREE.BoxGeometry(width + 0.06, thickness * 0.38, 0.16), fluteMat);
    trimFront.position.set(0, 0, depth / 2);
    const trimBack = trimFront.clone();
    trimBack.position.set(0, 0, -depth / 2);
    deck.add(trimFront, trimBack);
    return deck;
  }

  public static createFoundationWithPoles(
    floor: QFactoryFoundationFloor,
    mode: QFactoryVisualMode = 'detailed'
  ): THREE.Group {
    const group = new THREE.Group();
    group.userData = { floorId: floor.id, levelIndex: floor.levelIndex };

    const deck = this.createCardboardFoundationMesh(floor.width, floor.thickness, floor.depth, mode);
    deck.position.set((floor.minX + floor.maxX) / 2, floor.y + floor.thickness / 2, (floor.minZ + floor.maxZ) / 2);
    group.add(deck);

    const poleMat = QFactoryStyleMaterialLibrary.getSurface(mode === 'anime' ? '#f97316' : '#a67c52', mode);
    const collarMat = QFactoryStyleMaterialLibrary.getSurface('#fde047', mode);
    for (let i = 0; i < floor.poles.length; i++) {
      const p = floor.poles[i];
      const h = Math.max(0.5, p.topY - p.bottomY);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.52, h, 8), poleMat);
      col.name = `support_pole_${i}`;
      col.position.set(p.x, p.bottomY + h / 2, p.z);
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.4, 8), collarMat);
      foot.position.set(p.x, p.bottomY + 0.2, p.z);
      group.add(col, foot);
    }

    if (mode === 'anime') {
      QFactoryStyleMaterialLibrary.applyArtStylePostPass(group, 'anime');
    }
    return group;
  }
}
