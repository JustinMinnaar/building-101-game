import * as THREE from 'three';
import { QFactoryBasketAndSignBuilder } from './QFactoryBasketAndSignBuilder';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryCustomMachineMeshBuilder } from './QFactoryCustomMachineMeshBuilder';
import { QFactoryCustomMachineStore } from './QFactoryCustomMachineStore';
import { QFactoryCutawayInteriorBuilder } from './QFactoryCutawayInteriorBuilder';
import { QFactoryCutawayShellBuilder } from './QFactoryCutawayShellBuilder';
import { QFactoryMachineDef } from './QFactoryMachineSchema';
import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFactoryStyleMaterialLibrary } from './QFactoryStyleMaterialLibrary';
import { QFactoryTeddyBuilder } from './QFactoryTeddyBuilder';
import { QFactoryBuilding, QFactoryVisualMode } from './QFactoryTypes';

export class QFactoryDualModeBuilder {
  private static _tunnelVoidMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

  public static buildWorkshopMachine(bld: QFactoryBuilding, visualMode: QFactoryVisualMode): THREE.Group {
    const customSpec = QFactoryCustomMachineStore.getCustomSpec(bld.type);
    if (customSpec && visualMode !== 'blockout') {
      return QFactoryCustomMachineMeshBuilder.buildCustomMachine(customSpec, bld, visualMode);
    }

    const def = QFactoryMachineRegistry.getById(bld.type);
    const group = new THREE.Group();
    group.name = bld.id;
    group.userData = { buildingId: bld.id, buildingType: bld.type, visualMode };
    group.position.set(bld.x, bld.y, bld.z);
    group.rotation.y = (-bld.rotationDeg * Math.PI) / 180;

    if (visualMode === 'blockout') {
      this.populateBlockout(group, def);
    } else {
      this.populateDetailedDiorama(group, bld, def);
    }

    this.addPortTunnelPortals(group, def);
    if (visualMode === 'anime' || visualMode === 'vinyl') {
      QFactoryStyleMaterialLibrary.applyArtStylePostPass(group, visualMode);
    }
    return group;
  }

  private static populateBlockout(group: THREE.Group, def: QFactoryMachineDef): void {
    for (const part of def.blockout) {
      const mat = QFactoryStyleMaterialLibrary.getSurface(part.colorHex, 'blockout');
      let geo: THREE.BufferGeometry;
      if (part.shape === 'cylinder') {
        geo = new THREE.CylinderGeometry(part.size[0], part.size[2], part.size[1], 10);
      } else if (part.shape === 'cone') {
        geo = new THREE.ConeGeometry(part.size[0], part.size[1], 8);
      } else {
        geo = new THREE.BoxGeometry(part.size[0], part.size[1], part.size[2]);
      }
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(part.position[0], part.position[1], part.position[2]);
      group.add(mesh);
    }
    for (let i = 0; i < def.detailed.smokeOffsets.length; i++) {
      const pt = def.detailed.smokeOffsets[i];
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 8, 8),
        QFactoryClayMaterialLibrary.getCandyGloss('#f8fafc', 0.4)
      );
      pin.name = `socket_smoke_${i}`;
      pin.position.set(pt.x, pt.y, pt.z);
      group.add(pin);
    }
  }

  private static populateDetailedDiorama(group: THREE.Group, bld: QFactoryBuilding, def: QFactoryMachineDef): void {
    const lenX = def.footprint.depth;
    const heightY = def.footprint.height;
    const widthZ = def.footprint.width;

    QFactoryCutawayShellBuilder.buildCutawayChassis(group, lenX, heightY, widthZ, def.detailed);
    if (def.detailed.hasCutawayWindow) {
      QFactoryCutawayInteriorBuilder.buildInterior(group, lenX, heightY, widthZ, def.detailed.interiorTheme);
    }
    if (def.basket) {
      QFactoryBasketAndSignBuilder.buildFrontBasketAndFlag(group, def.basket);
      QFactoryBasketAndSignBuilder.syncBasketFill(group, bld.basketCount ?? 0, def.basket.capacity);
    }
    if (def.detailed.helperTeddySide === 'right') {
      const helper = QFactoryTeddyBuilder.createTeddyBear('helper-bowtie');
      helper.position.set(lenX * 0.48, 0, widthZ * 0.48);
      helper.rotation.y = -Math.PI * 0.35;
      group.add(helper);
    }
  }

  private static addPortTunnelPortals(group: THREE.Group, def: QFactoryMachineDef): void {
    for (const p of def.ports) {
      const isIn = p.type === 'input';
      const px = p.relDepth * def.footprint.depth;
      const pz = p.relWidth * def.footprint.width;
      const collarMat = QFactoryClayMaterialLibrary.getCandyGloss(isIn ? '#10b981' : '#3b82f6', 0.45);
      const collar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.5, 1.5), collarMat);
      collar.position.set(px, p.height, pz);

      const tunnel = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.18, 1.18), this._tunnelVoidMat);
      tunnel.name = `tunnel_hole_${p.id}`;
      tunnel.position.set(px - Math.sign(px || 1) * 0.35, p.height, pz);
      group.add(collar, tunnel);
    }
  }

  public static animateWorkshopMachine(group: THREE.Group, bld: QFactoryBuilding, elapsedSec: number): void {
    const spin = bld.spinRatio !== undefined ? bld.spinRatio : 1;
    const phase = elapsedSec * (0.4 + spin * 2.8);

    const g1 = group.getObjectByName('anim_gear_1');
    const g2 = group.getObjectByName('anim_gear_2');
    const g3 = group.getObjectByName('anim_gear_3');
    if (g1 && spin > 0.01) g1.rotation.z = phase * 1.4;
    if (g2 && spin > 0.01) g2.rotation.z = -phase * 1.75;
    if (g3 && spin > 0.01) g3.rotation.z = -phase * 1.55;

    const armUpper = group.getObjectByName('anim_arm_upper');
    if (armUpper && spin > 0.01) {
      armUpper.rotation.z = Math.sin(elapsedSec * 3.4) * 0.28 * spin;
    }

    const lever = group.getObjectByName('anim_lever');
    if (lever) {
      const isOff = bld.status === 'off' || bld.status === 'shutting down';
      lever.rotation.x = isOff ? 0.65 : -0.25;
    }

    if (bld.basketCapacity) {
      QFactoryBasketAndSignBuilder.syncBasketFill(group, bld.basketCount ?? 0, bld.basketCapacity);
    }
  }
}
