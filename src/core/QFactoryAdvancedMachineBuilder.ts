import * as THREE from 'three';

export class QFactoryAdvancedMachineBuilder {
  public static addPortBox(group: THREE.Group, x: number, y: number, z: number, isIn: boolean): void {
    const mat = new THREE.MeshStandardMaterial({
      color: isIn ? 0x10b981 : 0x3b82f6, // Green connector for in, Blue for out
      emissive: isIn ? 0x047857 : 0x1d4ed8,
      emissiveIntensity: 0.6,
    });
    const port = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 1.0), mat);
    port.position.set(x, y, z);
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x020617 });
    const hole = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.76, 0.76), voidMat);
    hole.position.set(x, y, z);
    group.add(port, hole);
  }

  public static buildMinerMk2(group: THREE.Group): void {
    const accentMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.4 });
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.8 });

    const housing = new THREE.Mesh(new THREE.BoxGeometry(8.8, 7.2, 8.4), accentMat);
    housing.position.set(1.2, 3.6, 0);
    const tower = new THREE.Mesh(new THREE.BoxGeometry(4.4, 14.4, 4.4), towerMat);
    tower.position.set(-2.8, 7.2, 0);

    const drillGroup = new THREE.Group();
    drillGroup.name = 'anim_drill';
    drillGroup.position.set(-2.8, 3.6, 0);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.5, 7.2, 8), darkMat);
    cone.rotation.x = Math.PI;
    drillGroup.add(cone);

    group.add(housing, tower, drillGroup);
    // Dual output ports side-by-side on front end along +X
    this.addPortBox(group, 8.0, 1.0, -1.8, false);
    this.addPortBox(group, 8.0, 1.0, 1.8, false);
  }

  public static buildSmelterMk2(group: THREE.Group): void {
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.45 });
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff2200, emissiveIntensity: 1.4 });

    const furnace = new THREE.Mesh(new THREE.BoxGeometry(11.6, 8.4, 9.2), redMat);
    furnace.position.y = 4.2;
    const core = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.6, 9.6), glowMat);
    core.name = 'anim_glow';
    core.position.y = 3.0;

    const stack1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 9.0, 12), bodyMat);
    stack1.position.set(-2.4, 11.6, 2.2);
    const stack2 = stack1.clone();
    stack2.position.set(2.4, 11.6, -2.2);

    group.add(furnace, core, stack1, stack2);
    // Dual in/out ports side-by-side on ends along X
    this.addPortBox(group, -9.0, 1.0, -1.5, true);
    this.addPortBox(group, -9.0, 1.0, 1.5, true);
    this.addPortBox(group, 9.0, 1.0, -1.5, false);
    this.addPortBox(group, 9.0, 1.0, 1.5, false);
  }

  public static buildConstructorMk2(group: THREE.Group): void {
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.35 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });

    const arch = new THREE.Mesh(new THREE.BoxGeometry(8.4, 9.6, 13.6), blueMat);
    arch.position.y = 4.8;
    const pressHead = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.2, 6.4), steelMat);
    pressHead.name = 'anim_press';
    pressHead.position.set(0, 4.6, 0);

    group.add(arch, pressHead);
    // Dual in/out ports side-by-side on ends along X
    this.addPortBox(group, -8.0, 1.0, -2.4, true);
    this.addPortBox(group, -8.0, 1.0, 2.4, true);
    this.addPortBox(group, 8.0, 1.0, -2.4, false);
    this.addPortBox(group, 8.0, 1.0, 2.4, false);
  }

  public static buildSunkenPit(group: THREE.Group): void {
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const voidMat = new THREE.MeshBasicMaterial({ color: 0x020205 });
    const rim = new THREE.Mesh(new THREE.BoxGeometry(12, 0.8, 12), rimMat);
    rim.position.y = 0.4;
    const hole = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.9, 9.6), voidMat);
    hole.position.y = 0.42;
    group.add(rim, hole);
  }

  public static buildTower(group: THREE.Group): void {
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x0891b2, roughness: 0.5, metalness: 0.4 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const tower = new THREE.Mesh(new THREE.BoxGeometry(8.4, 16, 8.4), darkMat);
    tower.position.y = 8;
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 1.2, 16), steelMat);
    wheel.name = 'anim_wheel';
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(0, 14, 4.6);
    group.add(tower, wheel);
    this.addPortBox(group, -5.0, 1.2, 0, true);
    this.addPortBox(group, 5.0, 1.2, 0, false);
  }
}
