import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryStyleMaterialLibrary } from './QFactoryStyleMaterialLibrary';
import { QFactoryTeddyCharacter } from './QFactoryTeddyController';
import { QFactoryToySweetItemBuilder } from './QFactoryToySweetItemBuilder';
import { QFactoryVisualMode } from './QFactoryTypes';

export type QFactoryTeddyVariant = 'player-apron' | 'helper-bowtie';

export class QFactoryTeddyBuilder {
  public static createTeddyBear(variant: QFactoryTeddyVariant): THREE.Group {
    const furHex = variant === 'player-apron' ? '#d98a2b' : '#f0e2ce';
    const accentHex = variant === 'player-apron' ? '#fb7185' : '#38bdf8';
    return this.buildTeddyBody(
      variant === 'player-apron' ? 'player_teddy' : 'helper_teddy',
      furHex,
      accentHex,
      variant === 'player-apron',
      false,
      'detailed'
    );
  }

  public static createSquadTeddy(
    char: QFactoryTeddyCharacter,
    isActivePlayer: boolean,
    visualMode: QFactoryVisualMode = 'detailed'
  ): THREE.Group {
    return this.buildTeddyBody(char.id, char.furHex, char.accentHex, true, isActivePlayer, visualMode);
  }

  private static buildTeddyBody(
    name: string,
    furHex: string,
    accentHex: string,
    wearsApron: boolean,
    showActiveRing: boolean,
    mode: QFactoryVisualMode
  ): THREE.Group {
    const group = new THREE.Group();
    group.name = name;

    const furMat = mode === 'detailed'
      ? QFactoryClayMaterialLibrary.getPlush(furHex)
      : QFactoryStyleMaterialLibrary.getSurface(furHex, mode);
    const snoutHex = '#f8e6ce';
    const padMat = mode === 'detailed'
      ? QFactoryClayMaterialLibrary.getPlush(snoutHex)
      : QFactoryStyleMaterialLibrary.getSurface(snoutHex, mode);
    const eyeMat = QFactoryClayMaterialLibrary.getCandyGloss('#1c1917', 0.04);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.92, 9, 8), furMat);
    belly.scale.set(0.95, 1.15, 0.85);
    belly.position.y = 1.65;
    group.add(belly);

    const head = new THREE.Group();
    head.name = 'teddy_head';
    head.position.set(0, 3.05, 0.05);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.86, 9, 8), furMat);
    skull.scale.set(1.05, 0.96, 0.95);

    const earGeo = new THREE.SphereGeometry(0.32, 7, 6);
    const earL = new THREE.Mesh(earGeo, furMat);
    earL.name = 'teddy_ears';
    earL.position.set(-0.68, 0.68, -0.05);
    const earR = earL.clone();
    earR.position.set(0.68, 0.68, -0.05);

    const snout = new THREE.Mesh(new THREE.SphereGeometry(0.36, 7, 6), padMat);
    snout.name = 'teddy_snout';
    snout.scale.set(1.1, 0.85, 0.9);
    snout.position.set(0, -0.14, 0.72);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 5), eyeMat);
    nose.position.set(0, -0.04, 1.02);

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), eyeMat);
    eyeL.position.set(-0.28, 0.16, 0.78);
    const eyeR = eyeL.clone();
    eyeR.position.set(0.28, 0.16, 0.78);
    head.add(skull, earL, earR, snout, nose, eyeL, eyeR);
    group.add(head);

    const legGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.95, 8);
    const legL = new THREE.Group();
    legL.name = 'anim_leg_l';
    legL.position.set(-0.42, 0.95, 0);
    const legMeshL = new THREE.Mesh(legGeo, furMat);
    legMeshL.position.y = -0.42;
    legL.add(legMeshL);

    const legR = new THREE.Group();
    legR.name = 'anim_leg_r';
    legR.position.set(0.42, 0.95, 0);
    const legMeshR = new THREE.Mesh(legGeo, furMat);
    legMeshR.position.y = -0.42;
    legR.add(legMeshR);
    group.add(legL, legR);

    const armGeo = new THREE.CylinderGeometry(0.24, 0.28, 1.05, 8);
    const armL = new THREE.Group();
    armL.name = 'anim_arm_l';
    armL.position.set(-0.88, 2.25, 0);
    const armMeshL = new THREE.Mesh(armGeo, furMat);
    armMeshL.position.set(-0.18, -0.42, 0.15);
    armMeshL.rotation.z = 0.35;
    armL.add(armMeshL);

    const armR = new THREE.Group();
    armR.name = 'anim_arm_r';
    armR.position.set(0.88, 2.25, 0);
    const armMeshR = new THREE.Mesh(armGeo, furMat);
    armMeshR.position.set(0.18, -0.42, 0.15);
    armMeshR.rotation.z = -0.35;
    armR.add(armMeshR);
    group.add(armL, armR);

    this.addOutfit(group, armR, wearsApron, accentHex, mode);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.08, 6, 18),
      QFactoryClayMaterialLibrary.getCandyGloss('#fde047', 0.85)
    );
    ring.name = 'active_player_ring';
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08;
    ring.visible = showActiveRing;
    group.add(ring);

    if (mode === 'anime') {
      QFactoryStyleMaterialLibrary.applyArtStylePostPass(group, 'anime');
    }
    return group;
  }

  private static addOutfit(
    group: THREE.Group,
    armR: THREE.Group,
    wearsApron: boolean,
    accentHex: string,
    mode: QFactoryVisualMode
  ): void {
    const accentMat = QFactoryStyleMaterialLibrary.getSurface(accentHex, mode);
    if (wearsApron) {
      const apron = new THREE.Mesh(
        new THREE.BoxGeometry(1.06, 1.0, 0.18),
        QFactoryStyleMaterialLibrary.getSurface('#fff7ed', mode)
      );
      apron.position.set(0, 1.55, 0.78);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.02, 0.2), accentMat);
      stripe.position.set(0, 1.55, 0.79);
      group.add(apron, stripe);

      const lollipop = QFactoryToySweetItemBuilder.createMesh('swirl-lollipop');
      lollipop.scale.setScalar(1.1);
      lollipop.position.set(0.28, -0.45, 0.52);
      armR.add(lollipop);
      return;
    }

    const bowL = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.36, 4), accentMat);
    bowL.rotation.z = -Math.PI / 2;
    bowL.position.set(-0.18, 2.38, 0.78);
    const bowR = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.36, 4), accentMat);
    bowR.rotation.z = Math.PI / 2;
    bowR.position.set(0.18, 2.38, 0.78);
    group.add(bowL, bowR);
  }

  public static syncActiveRing(group: THREE.Group, isActive: boolean): void {
    const ring = group.getObjectByName('active_player_ring');
    if (ring) ring.visible = isActive;
  }

  public static animateTeddy(group: THREE.Group, walkPhase: number, isMoving: boolean): void {
    const legL = group.getObjectByName('anim_leg_l');
    const legR = group.getObjectByName('anim_leg_r');
    const armL = group.getObjectByName('anim_arm_l');
    const armR = group.getObjectByName('anim_arm_r');
    const head = group.getObjectByName('teddy_head');

    const swing = isMoving ? Math.sin(walkPhase) * 0.55 : 0;
    if (legL) legL.rotation.x = swing;
    if (legR) legR.rotation.x = -swing;
    if (armL) armL.rotation.x = -swing * 0.65 - 0.2;
    if (armR) armR.rotation.x = swing * 0.65 - 0.3;
    if (head) head.rotation.z = isMoving ? Math.sin(walkPhase * 0.5) * 0.08 : 0;
  }
}
