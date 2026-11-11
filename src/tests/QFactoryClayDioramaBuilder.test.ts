import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { QFactoryBasketAndSignBuilder } from '../core/QFactoryBasketAndSignBuilder';
import { QFactoryDualModeBuilder } from '../core/QFactoryDualModeBuilder';
import { QFactoryItemMeshBuilder } from '../core/QFactoryItemMeshBuilder';
import { QFactorySimManager } from '../core/QFactorySimManager';
import { QFactoryTeddyBuilder } from '../core/QFactoryTeddyBuilder';
import { QFactoryItemType } from '../core/QFactoryTypes';

function countTriangles(root: THREE.Object3D): number {
  let tris = 0;
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.geometry) {
      const geo = obj.geometry;
      if (geo.index) {
        tris += geo.index.count / 3;
      } else if (geo.attributes.position) {
        tris += geo.attributes.position.count / 3;
      }
    }
  });
  return Math.round(tris);
}

describe('QFactoryDualModeBuilder, QFactoryTeddyBuilder & Toy/Sweet 3D Diorama Models', () => {
  it('builds both Blockout and Detailed Claymation Cutaway models with gears, robot arms, awnings, and flags', () => {
    const sim = new QFactorySimManager();
    const sweetMaker = sim.placeBuilding('sweet-maker', 0, 0, 0, true);
    const toyAssembler = sim.placeBuilding('toy-assembler', 16, 0, 0, true);

    const blockoutGroup = QFactoryDualModeBuilder.buildWorkshopMachine(sweetMaker, 'blockout');
    expect(blockoutGroup.userData.visualMode).toBe('blockout');
    expect(countTriangles(blockoutGroup)).toBeLessThan(400);

    const detailedSweet = QFactoryDualModeBuilder.buildWorkshopMachine(sweetMaker, 'detailed');
    expect(detailedSweet.userData.visualMode).toBe('detailed');
    expect(detailedSweet.getObjectByName('anim_gear_1')).toBeDefined();
    expect(detailedSweet.getObjectByName('anim_gear_2')).toBeDefined();
    expect(detailedSweet.getObjectByName('anim_arm_base')).toBeDefined();
    expect(detailedSweet.getObjectByName('anim_lever')).toBeDefined();
    const flag = detailedSweet.getObjectByName('sign_flag');
    expect(flag?.userData.signText).toBe('EXTRA SPRINKLES');
    expect(countTriangles(detailedSweet)).toBeLessThan(3500);

    const detailedToy = QFactoryDualModeBuilder.buildWorkshopMachine(toyAssembler, 'detailed');
    expect(detailedToy.getObjectByName('helper_teddy')).toBeDefined();
    expect(detailedToy.getObjectByName('sign_flag')?.userData.signText).toBe('SPARE PARTS');
    expect(countTriangles(detailedToy)).toBeLessThan(4500);
  });

  it('visibly stacks items inside open clay baskets as basketCount increases', () => {
    const sim = new QFactorySimManager();
    const sweetMaker = sim.placeBuilding('sweet-maker', 0, 0, 0, true);
    const group = QFactoryDualModeBuilder.buildWorkshopMachine(sweetMaker, 'detailed');

    QFactoryBasketAndSignBuilder.syncBasketFill(group, 0, 40);
    const stack0 = group.getObjectByName('basket_items_stack')!;
    expect(stack0.children.filter((c) => c.visible).length).toBe(0);

    QFactoryBasketAndSignBuilder.syncBasketFill(group, 25, 40);
    expect(stack0.children.filter((c) => c.visible).length).toBeGreaterThan(4);
  });

  it('builds fluffy plush Teddy-Bear player and helper rigs with animated limbs', () => {
    const playerTeddy = QFactoryTeddyBuilder.createTeddyBear('player-apron');
    expect(playerTeddy.getObjectByName('anim_leg_l')).toBeDefined();
    expect(playerTeddy.getObjectByName('anim_leg_r')).toBeDefined();
    expect(playerTeddy.getObjectByName('anim_arm_l')).toBeDefined();
    expect(playerTeddy.getObjectByName('anim_arm_r')).toBeDefined();
    expect(playerTeddy.getObjectByName('teddy_snout')).toBeDefined();

    QFactoryTeddyBuilder.animateTeddy(playerTeddy, 1.8, true);
    const legL = playerTeddy.getObjectByName('anim_leg_l')!;
    expect(Math.abs(legL.rotation.x)).toBeGreaterThan(0.01);
  });

  it('builds distinct 3D meshes for all 15 new Sweetshop & Wonder-Toy items', () => {
    const newItems: QFactoryItemType[] = [
      'sugar-cube', 'rainbow-dye', 'wood-block', 'tin-ingot',
      'swirl-lollipop', 'star-cupcake', 'cog', 'wheel', 'widget',
      'toy-train', 'spinning-top', 'toy-rocket', 'gift-box',
      'sprinkles', 'spare-parts',
    ];
    for (const item of newItems) {
      const mesh = QFactoryItemMeshBuilder.createMesh(item);
      expect(mesh).toBeInstanceOf(THREE.Mesh);
    }
  });

  it('meets performance budget building 50 detailed claymation machines + 100 belt items in < 120ms', () => {
    const sim = new QFactorySimManager();
    const sweetMaker = sim.placeBuilding('sweet-maker', 0, 0, 0, true);

    const t0 = performance.now();
    for (let i = 0; i < 50; i++) {
      QFactoryDualModeBuilder.buildWorkshopMachine(sweetMaker, 'detailed');
    }
    for (let j = 0; j < 100; j++) {
      QFactoryItemMeshBuilder.createMesh(j % 2 === 0 ? 'toy-train' : 'swirl-lollipop');
    }
    const elapsed = performance.now() - t0;
    expect(elapsed).toBeLessThan(120);
  });
});
