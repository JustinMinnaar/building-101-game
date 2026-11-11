import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { QFactoryCustomMachineMeshBuilder } from '../core/QFactoryCustomMachineMeshBuilder';
import { QFactoryCustomMachineStore } from '../core/QFactoryCustomMachineStore';
import { QFactoryDioramaEnvironment } from '../core/QFactoryDioramaEnvironment';
import { QFactorySimManager } from '../core/QFactorySimManager';
import { QFactoryStyleMaterialLibrary } from '../core/QFactoryStyleMaterialLibrary';
import { QFactoryTeddyBuilder } from '../core/QFactoryTeddyBuilder';
import { QFactoryTeddyController } from '../core/QFactoryTeddyController';
import { QFactoryToySweetItemBuilder } from '../core/QFactoryToySweetItemBuilder';

describe('Multi-Art-Style Materials, Custom Cube Machine 3D Builder, Poles & Coloured Teddies', () => {
  it('switches 3D materials cleanly across Clay (detailed), Anime cel-shaded + ink outlines, Vinyl, and Blockout', () => {
    const clayMat = QFactoryStyleMaterialLibrary.getSurface('#fb7185', 'detailed');
    const animeMat = QFactoryStyleMaterialLibrary.getSurface('#fb7185', 'anime');
    const vinylMat = QFactoryStyleMaterialLibrary.getSurface('#fb7185', 'vinyl');

    expect(clayMat).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(animeMat).toBeInstanceOf(THREE.MeshToonMaterial);
    expect(vinylMat).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect((vinylMat as THREE.MeshStandardMaterial).roughness).toBeLessThan(0.25);

    const testGroup = new THREE.Group();
    testGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), clayMat));
    QFactoryStyleMaterialLibrary.applyArtStylePostPass(testGroup, 'anime');

    let outlineCount = 0;
    testGroup.traverse((obj) => {
      if (obj.name === 'anime_ink_outline') outlineCount++;
    });
    expect(outlineCount).toBeGreaterThanOrEqual(1);
  });

  it('builds 3D Custom Cube Machines with frame cubes, all add-on types, belt tunnel holes, wire lugs & front marker', () => {
    let spec = QFactoryCustomMachineStore.createBlankDraft('test-wonder-maker', 'Test Wonder Maker');
    spec = QFactoryCustomMachineStore.addFrameCube(spec, { x: 0, y: 6.2, z: 0, w: 4, h: 2, d: 4, colorHex: '#38bdf8' });
    spec = QFactoryCustomMachineStore.addAddon(spec, 'cog', { x: -1.5, y: 4.0, z: -2.0 });
    spec = QFactoryCustomMachineStore.addAddon(spec, 'wire', { x: 0, y: 5.0, z: -2.0 });
    spec = QFactoryCustomMachineStore.addAddon(spec, 'light', { x: 0, y: 7.5, z: 0 });
    spec = QFactoryCustomMachineStore.addAddon(spec, 'button', { x: -4.0, y: 3.5, z: 0 });
    spec = QFactoryCustomMachineStore.addAddon(spec, 'smokestack', { x: 1.5, y: 7.4, z: 0 });
    spec = QFactoryCustomMachineStore.addAddon(spec, 'awning', { x: 0, y: 6.0, z: 3.6 });
    spec = QFactoryCustomMachineStore.addConnector(spec, 'wire-out', '+Z', 1.2, 2.0);
    spec = QFactoryCustomMachineStore.setFrontSide(spec, '+Z');
    QFactoryCustomMachineStore.saveAndRegister(spec);

    const sim = new QFactorySimManager();
    const bld = sim.placeBuilding(spec.id, 0, 0, 0, true);
    const group = QFactoryCustomMachineMeshBuilder.buildCustomMachine(spec, bld, 'anime');

    expect(group.getObjectByName('front_side_marker')).toBeDefined();
    expect(group.getObjectByName('tunnel_hole_conn_in_0')).toBeDefined();
    expect(group.getObjectByName('tunnel_hole_conn_out_0')).toBeDefined();
    expect(group.getObjectByName('anim_gear_1')).toBeDefined();
    expect(group.getObjectByName('anim_arm_upper')).toBeDefined();
  });

  it('creates 3D meshes for Coloured Goo, Spice Pinch, Toy-Smarts Brains, Idea Bulbs & Smart Talking Toys', () => {
    const newItems = [
      'red-goo', 'gold-goo', 'blue-goo', 'spice-pinch',
      'toy-brain', 'idea-bulb', 'smart-teddy-toy',
    ] as const;

    for (const item of newItems) {
      expect(QFactoryToySweetItemBuilder.isToySweetItem(item)).toBe(true);
      const mesh = QFactoryToySweetItemBuilder.createMesh(item);
      expect(mesh).toBeInstanceOf(THREE.Mesh);
    }
  });

  it('builds 4 coloured Teddy-Bear characters and multi-level floor support poles', () => {
    const controller = new QFactoryTeddyController();
    for (const [idx, char] of controller.getSquad().entries()) {
      const teddy = QFactoryTeddyBuilder.createSquadTeddy(char, idx === 0, 'anime');
      expect(teddy.getObjectByName('teddy_ears')).toBeDefined();
      expect(teddy.getObjectByName('teddy_snout')).toBeDefined();
    }

    const sim = new QFactorySimManager();
    const upperFloor = sim.placeFoundationRect(-8, -8, 12, 8, 1, 1);
    const floorGroup = QFactoryDioramaEnvironment.createFoundationWithPoles(upperFloor, 'detailed');
    let poleMeshes = 0;
    floorGroup.traverse((obj) => {
      if (obj.name.startsWith('support_pole_')) poleMeshes++;
    });
    expect(poleMeshes).toBeGreaterThanOrEqual(4);
  });

  it('meets performance budget building 40 custom cube machines across all 4 art styles in < 60ms', () => {
    const spec = QFactoryCustomMachineStore.getCustomSpec('smart-brain-stamper')!;
    const sim = new QFactorySimManager();
    const bld = sim.placeBuilding('smart-brain-stamper', 0, 0, 0, true);
    const styles = ['detailed', 'anime', 'vinyl', 'blockout'] as const;

    const t0 = performance.now();
    for (let i = 0; i < 40; i++) {
      QFactoryCustomMachineMeshBuilder.buildCustomMachine(spec, bld, styles[i % styles.length]);
    }
    expect(performance.now() - t0).toBeLessThan(60);
  });
});
