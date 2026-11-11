import * as THREE from 'three';
import { QFactoryAdvancedMachineBuilder } from './QFactoryAdvancedMachineBuilder';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryDualModeBuilder } from './QFactoryDualModeBuilder';
import { QFactoryItemMeshBuilder } from './QFactoryItemMeshBuilder';
import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFactoryBelt, QFactoryBuilding, QFactoryBuildingType, QFactoryItemType, QFactoryVisualMode } from './QFactoryTypes';

export class QFactoryModelBuilder {
  public static createBuildingMesh(
    bld: QFactoryBuilding,
    isGhost = false,
    visualMode: QFactoryVisualMode = 'detailed'
  ): THREE.Group {
    if (QFactoryMachineRegistry.has(bld.type)) {
      const workshopGroup = QFactoryDualModeBuilder.buildWorkshopMachine(bld, visualMode);
      if (isGhost) this.applyGhostMaterial(workshopGroup, true);
      return workshopGroup;
    }

    const group = new THREE.Group();
    group.name = bld.id;
    group.userData = { buildingId: bld.id, buildingType: bld.type, visualMode };
    group.position.set(bld.x, bld.y, bld.z);
    group.rotation.y = (-bld.rotationDeg * Math.PI) / 180;

    switch (bld.type) {
      case 'miner': this.buildMiner(group); break;
      case 'miner-mk2': QFactoryAdvancedMachineBuilder.buildMinerMk2(group); break;
      case 'smelter': this.buildSmelter(group); break;
      case 'smelter-mk2': QFactoryAdvancedMachineBuilder.buildSmelterMk2(group); break;
      case 'constructor': this.buildConstructor(group); break;
      case 'constructor-mk2': QFactoryAdvancedMachineBuilder.buildConstructorMk2(group); break;
      case 'container': this.buildContainer(group, 6, 6, 6); break;
      case 'container-1': this.buildContainer(group, 6, 6, 6); break;
      case 'container-2': this.buildContainer(group, 12, 6, 6); break;
      case 'container-3': this.buildContainer(group, 18, 6, 6); break;
      case 'container-4': this.buildContainer(group, 6, 6, 12); break;
      case 'container-5': this.buildContainer(group, 12, 6, 12); break;
      case 'container-6': this.buildContainer(group, 18, 6, 12); break;
      case 'container-mk2': this.buildContainer(group, 12, 6, 12); break;
      case 'splitter': this.buildSplitter(group); break;
      case 'merger': this.buildMerger(group); break;
      case 'connector': this.buildConnector(group); break;
      case 'foundation': this.buildFoundation(group, 1); break;
      case 'foundation-1m': this.buildFoundation(group, 1); break;
      case 'foundation-2m': this.buildFoundation(group, 2); break;
      case 'foundation-3m': this.buildFoundation(group, 3); break;
      case 'support-pole': this.buildSupportPole(group); break;
      case 'sunken-pit': QFactoryAdvancedMachineBuilder.buildSunkenPit(group); break;
      case 'tower': QFactoryAdvancedMachineBuilder.buildTower(group); break;
    }

    if (isGhost) this.applyGhostMaterial(group, true);
    return group;
  }

  public static createGhostForType(type: QFactoryBuildingType, rotationDeg: number, isValid = true): THREE.Group {
    const dummy: QFactoryBuilding = {
      id: 'ghost_preview', type, name: type, x: 0, y: 0, z: 0, rotationDeg,
      width: 6, depth: 8, height: 6, inputBufferCount: 0, outputBufferCount: 0,
      inStackCapacity: 100, outStackCapacity: 100, ports: [], inputPorts: [], outputPorts: [],
      storedCount: 0, productionProgress: 0, cycleDurationSec: 1, status: 'powered on', powerUsageMW: 1,
    };
    const group = this.createBuildingMesh(dummy, false);
    this.applyGhostMaterial(group, isValid);
    return group;
  }

  private static buildSplitter(group: THREE.Group): void {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), bodyMat);
    box.position.y = 1.0;
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.3, 2.05), trimMat);
    trim.position.y = 1.8;
    group.add(box, trim);
    this.addPortBox(group, -1.0, 1.0, 0, true);         // 1 in (back end)
    this.addPortBox(group, 1.0, 1.0, 0, false);         // 1 out (front end)
    this.addPortSideBox(group, 0, 1.0, -1.0, false);    // 1 out (left side)
    this.addPortSideBox(group, 0, 1.0, 1.0, false);     // 1 out (right side)
  }

  private static buildMerger(group: THREE.Group): void {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), bodyMat);
    box.position.y = 1.0;
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.3, 2.05), trimMat);
    trim.position.y = 1.8;
    group.add(box, trim);
    this.addPortBox(group, -1.0, 1.0, 0, true);        // in (back end)
    this.addPortSideBox(group, 0, 1.0, -1.0, true);    // in (left side)
    this.addPortSideBox(group, 0, 1.0, 1.0, true);     // in (right side)
    this.addPortBox(group, 1.0, 1.0, 0, false);        // 1 out (front end)
  }

  private static buildConnector(group: THREE.Group): void {
    const postMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.8, 0.8), postMat);
    post.position.y = 0.9;
    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 1.0), capMat);
    cap.position.y = 1.9;
    group.add(post, cap);
    this.addPortBox(group, -0.45, 1.0, 0, true);
    this.addPortBox(group, 0.45, 1.0, 0, false);
  }

  private static addPortBox(group: THREE.Group, x: number, y: number, z: number, isIn: boolean): void {
    const mat = new THREE.MeshStandardMaterial({
      color: isIn ? 0x10b981 : 0x3b82f6, // Green connector for in, Blue for out
      emissive: isIn ? 0x047857 : 0x1d4ed8,
      emissiveIntensity: 0.6,
    });
    // 1m wide (along Z) and 1m high (along Y) on the ends (along X)
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 1.0), mat);
    port.position.set(x, y, z);
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.76, 0.76), voidMat);
    hole.position.set(x, y, z);
    group.add(port, hole);
  }

  private static addPortSideBox(group: THREE.Group, x: number, y: number, z: number, isIn: boolean): void {
    const mat = new THREE.MeshStandardMaterial({
      color: isIn ? 0x10b981 : 0x3b82f6,
      emissive: isIn ? 0x047857 : 0x1d4ed8,
      emissiveIntensity: 0.6,
    });
    // 1m wide (along X) and 1m high (along Y) on the sides (along Z)
    const port = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.3), mat);
    port.position.set(x, y, z);
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.76, 0.32), voidMat);
    hole.position.set(x, y, z);
    group.add(port, hole);
  }

  private static buildMiner(group: THREE.Group): void {
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });

    const housing = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.6, 4.2), accentMat);
    housing.position.set(0.6, 1.8, 0);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.2, 7.2, 2.2), towerMat);
    tower.position.set(-1.4, 3.6, 0);

    const drillGroup = new THREE.Group();
    drillGroup.name = 'anim_drill';
    drillGroup.position.set(-1.4, 1.8, 0);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.25, 3.6, 8), darkMat);
    cone.rotation.x = Math.PI;
    drillGroup.add(cone);

    group.add(housing, tower, drillGroup);
    // Output port 1m off bottom on front end along +X
    this.addPortBox(group, 4.0, 1.0, 0, false);
  }

  private static buildSmelter(group: THREE.Group): void {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.5 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xff6b00, emissive: 0xff4500, emissiveIntensity: 1.2 });

    const furnace = new THREE.Mesh(new THREE.BoxGeometry(5.8, 4.2, 4.6), redMat);
    furnace.position.y = 2.1;
    const core = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 4.8), glowMat);
    core.name = 'anim_glow';
    core.position.y = 1.5;

    const stack1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 4.5, 12), bodyMat);
    stack1.position.set(-1.2, 5.8, 1.1);
    const stack2 = stack1.clone();
    stack2.position.set(1.2, 5.8, -1.1);

    group.add(furnace, core, stack1, stack2);
    // In/Out ports on ends along X, 1m off bottom of machine
    this.addPortBox(group, -4.5, 1.0, 0, true);
    this.addPortBox(group, 4.5, 1.0, 0, false);
  }

  private static buildConstructor(group: THREE.Group): void {
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4, metalness: 0.3 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });

    const arch = new THREE.Mesh(new THREE.BoxGeometry(4.2, 4.8, 6.8), blueMat);
    arch.position.y = 2.4;
    const pressHead = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 3.2), steelMat);
    pressHead.name = 'anim_press';
    pressHead.position.set(0, 2.3, 0);

    group.add(arch, pressHead);
    // In/Out ports on ends along X, 1m off bottom
    this.addPortBox(group, -4.0, 1.0, 0, true);
    this.addPortBox(group, 4.0, 1.0, 0, false);
  }

  private static buildContainer(group: THREE.Group, width = 6, depth = 6, height = 6): void {
    const boxMat = QFactoryClayMaterialLibrary.getClay('#fde68a');
    const ribbonMat = QFactoryClayMaterialLibrary.getCandyGloss('#e11d48', 0.18);
    // Gift Hamper Storage Box
    const crate = new THREE.Mesh(new THREE.BoxGeometry(depth, height, width), boxMat);
    crate.position.y = height / 2;
    const stripeX = new THREE.Mesh(new THREE.BoxGeometry(depth + 0.12, height + 0.08, 0.9), ribbonMat);
    stripeX.position.y = height / 2;
    const stripeZ = new THREE.Mesh(new THREE.BoxGeometry(0.9, height + 0.08, width + 0.12), ribbonMat);
    stripeZ.position.y = height / 2;
    group.add(crate, stripeX, stripeZ);
    this.addPortBox(group, -depth / 2, 1.0, 0, true);
    this.addPortBox(group, depth / 2, 1.0, 0, false);
  }

  private static buildFoundation(group: THREE.Group, height = 1): void {
    const mat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(8, height, 8), mat);
    slab.position.y = height / 2;
    group.add(slab);
  }

  private static buildSupportPole(group: THREE.Group): void {
    const tubeMat = QFactoryClayMaterialLibrary.getClay('#a67c52');
    const ringMat = QFactoryClayMaterialLibrary.getClay('#fde047');
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 8.5, 10), tubeMat);
    pole.position.y = 4.25;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.45, 10), ringMat);
    base.position.y = 0.22;
    const cap = base.clone();
    cap.position.y = 8.28;
    group.add(pole, base, cap);
  }

  public static createBeltMesh(belt: QFactoryBelt, oreType: 'iron' | 'copper' = 'iron'): THREE.Group {
    const group = new THREE.Group();
    group.name = belt.id;
    group.userData = { beltId: belt.id, oreType };

    const pts = belt.pathPoints && belt.pathPoints.length >= 2 ? belt.pathPoints : [belt.startPoint, belt.endPoint];
    const trackMat = new THREE.MeshStandardMaterial({ color: oreType === 'copper' ? 0x27272a : 0x1e293b, roughness: 0.8 });
    const railMat = new THREE.MeshStandardMaterial({
      color: oreType === 'copper' ? 0xd97706 : 0xeab308,
      roughness: 0.4,
      metalness: oreType === 'copper' ? 0.6 : 0.2,
    });

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = new THREE.Vector3(pts[i].x, pts[i].y, pts[i].z);
      const p1 = new THREE.Vector3(pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
      const diff = new THREE.Vector3().subVectors(p1, p0);
      const len = Math.max(0.2, diff.length());
      const mid = new THREE.Vector3().addVectors(p0, p1).multiplyScalar(0.5);

      const segGroup = new THREE.Group();
      const track = new THREE.Mesh(new THREE.BoxGeometry(len, 0.22, 1.15), trackMat);
      const railL = new THREE.Mesh(new THREE.BoxGeometry(len, 0.36, 0.12), railMat);
      railL.position.z = 0.62;
      const railR = railL.clone();
      railR.position.z = -0.62;

      segGroup.add(track, railL, railR);
      segGroup.position.copy(mid);
      segGroup.rotation.y = -Math.atan2(diff.z, diff.x);
      group.add(segGroup);
    }
    return group;
  }

  public static createItemMesh(itemType: QFactoryItemType): THREE.Mesh {
    return QFactoryItemMeshBuilder.createMesh(itemType);
  }

  public static createBeltGhost(pathPoints: { x: number; y: number; z: number }[], isValid = true): THREE.Group {
    const group = new THREE.Group();
    const ghostMat = new THREE.MeshStandardMaterial({
      color: isValid ? 0x38bdf8 : 0xef4444,
      transparent: true,
      opacity: 0.5,
      roughness: 0.3,
    });
    for (let i = 0; i < pathPoints.length - 1; i++) {
      const p0 = new THREE.Vector3(pathPoints[i].x, pathPoints[i].y, pathPoints[i].z);
      const p1 = new THREE.Vector3(pathPoints[i + 1].x, pathPoints[i + 1].y, pathPoints[i + 1].z);
      const diff = new THREE.Vector3().subVectors(p1, p0);
      const len = Math.max(0.2, diff.length());
      const mid = new THREE.Vector3().addVectors(p0, p1).multiplyScalar(0.5);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, 0.24, 1.15), ghostMat);
      mesh.position.copy(mid);
      mesh.rotation.y = -Math.atan2(diff.z, diff.x);
      group.add(mesh);
    }
    return group;
  }

  private static applyGhostMaterial(group: THREE.Group, isValid = true): void {
    const color = isValid ? 0x38bdf8 : 0xef4444;
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: 0.45,
          roughness: 0.3,
        });
      }
    });
  }
}
