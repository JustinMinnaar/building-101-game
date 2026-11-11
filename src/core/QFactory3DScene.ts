import * as THREE from 'three';
import { QFactoryBasketAndSignBuilder } from './QFactoryBasketAndSignBuilder';
import { QFactoryBeltMath } from './QFactoryBeltMath';
import { QFACTORY_BLUEPRINTS } from './QFactoryBlueprints';
import { QFactoryDioramaEnvironment } from './QFactoryDioramaEnvironment';
import { QFactoryDualModeBuilder } from './QFactoryDualModeBuilder';
import { QFactoryFloorPoleMath } from './QFactoryFloorPoleMath';
import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFactoryModelBuilder } from './QFactoryModelBuilder';
import { QFactorySimManager } from './QFactorySimManager';
import { QFactorySmokeSystem } from './QFactorySmokeSystem';
import { QFactoryStyleMaterialLibrary } from './QFactoryStyleMaterialLibrary';
import { QFactoryTeddyBuilder } from './QFactoryTeddyBuilder';
import { QFactoryTeddyController, QFactoryTeddyState } from './QFactoryTeddyController';
import {
  QFactoryBelt,
  QFactoryBeltShape,
  QFactoryBuilding,
  QFactoryBuildingType,
  QFactoryPoint3D,
  QFactoryToolId,
  QFactoryVisualMode,
} from './QFactoryTypes';

export class QFactory3DScene {
  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  private _groundMesh: THREE.Mesh;
  private _foundationsGroup = new THREE.Group();
  private _buildingsGroup = new THREE.Group();
  private _beltsGroup = new THREE.Group();
  private _itemsGroup = new THREE.Group();
  private _teddiesGroup = new THREE.Group();
  private _smokeSystem: QFactorySmokeSystem;
  private _visualMode: QFactoryVisualMode = 'detailed';

  private _ghostGroup: THREE.Group | null = null;
  private _beltGhostGroup: THREE.Group | null = null;
  private _floorRectGhost: THREE.Group | null = null;
  private _raycaster = new THREE.Raycaster();
  private _foundationMeshes = new Map<string, THREE.Group>();
  private _buildingMeshes = new Map<string, THREE.Group>();
  private _beltMeshes = new Map<string, THREE.Group>();
  private _itemMeshes = new Map<string, THREE.Mesh>();
  private _teddyMeshes = new Map<string, THREE.Group>();

  private _camRadius = 68;
  private _camTheta = Math.PI * 0.16;
  private _camPhi = Math.PI * 0.34;
  private _camTarget = new THREE.Vector3(2, 4, 2);

  constructor(container: HTMLElement) {
    this._scene = new THREE.Scene();
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    this._camera = new THREE.PerspectiveCamera(48, width / height, 0.5, 480);
    this.updateCameraTransform();

    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(width, height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this._renderer.domElement);

    this._groundMesh = QFactoryDioramaEnvironment.buildStudioEnvironment(this._scene);
    this._smokeSystem = new QFactorySmokeSystem(this._scene);
    this._scene.add(
      this._foundationsGroup,
      this._buildingsGroup,
      this._beltsGroup,
      this._itemsGroup,
      this._teddiesGroup
    );
  }

  public getVisualMode(): QFactoryVisualMode { return this._visualMode; }
  public getCameraYawRad(): number { return this._camTheta; }

  public setVisualMode(mode: QFactoryVisualMode): void {
    if (this._visualMode === mode) return;
    this._visualMode = mode;
    QFactoryDioramaEnvironment.applyEnvironmentStyle(this._scene, this._groundMesh, mode);
    this.clearCachedMeshes();
  }

  public clearCachedMeshes(): void {
    for (const m of this._foundationMeshes.values()) this._foundationsGroup.remove(m);
    this._foundationMeshes.clear();
    for (const m of this._buildingMeshes.values()) this._buildingsGroup.remove(m);
    this._buildingMeshes.clear();
    for (const m of this._beltMeshes.values()) this._beltsGroup.remove(m);
    this._beltMeshes.clear();
    for (const m of this._itemMeshes.values()) this._itemsGroup.remove(m);
    this._itemMeshes.clear();
    for (const m of this._teddyMeshes.values()) this._teddiesGroup.remove(m);
    this._teddyMeshes.clear();
  }

  public updateCameraTransform(): void {
    const sinPhi = Math.sin(this._camPhi);
    this._camera.position.set(
      this._camTarget.x + this._camRadius * sinPhi * Math.sin(this._camTheta),
      this._camTarget.y + this._camRadius * Math.cos(this._camPhi),
      this._camTarget.z + this._camRadius * sinPhi * Math.cos(this._camTheta)
    );
    this._camera.lookAt(this._camTarget);
  }

  public orbitCamera(deltaX: number, deltaY: number): void {
    this._camTheta -= deltaX * 0.007;
    this._camPhi = Math.max(0.2, Math.min(Math.PI * 0.46, this._camPhi - deltaY * 0.006));
    this.updateCameraTransform();
  }

  public panCamera(deltaX: number, deltaY: number): void {
    const forward = new THREE.Vector3();
    this._camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    const scale = this._camRadius * 0.0018;
    this._camTarget.addScaledVector(right, -deltaX * scale);
    this._camTarget.addScaledVector(forward, deltaY * scale);
    this.updateCameraTransform();
  }

  public zoomCamera(deltaWheel: number): void {
    this._camRadius = Math.max(14, Math.min(180, this._camRadius + deltaWheel * 0.04));
    this.updateCameraTransform();
  }

  public raycastGround(ndcX: number, ndcY: number, activeFloorLevel = 0): { x: number; z: number } | null {
    this._raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this._camera);
    if (activeFloorLevel > 0) {
      const planeY = QFactoryFloorPoleMath.computeDeckElevation(activeFloorLevel);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -planeY);
      const pt = new THREE.Vector3();
      if (this._raycaster.ray.intersectPlane(plane, pt)) return { x: pt.x, z: pt.z };
    }
    const deckHits = this._raycaster.intersectObjects(this._foundationsGroup.children, true);
    for (const h of deckHits) {
      if (h.object.name === 'deck_surface') return { x: h.point.x, z: h.point.z };
    }
    const hits = this._raycaster.intersectObject(this._groundMesh, false);
    return hits.length === 0 ? null : { x: hits[0].point.x, z: hits[0].point.z };
  }

  public raycastBuildingOrBeltId(ndcX: number, ndcY: number): { buildingId?: string; beltId?: string } {
    this._raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this._camera);
    for (const hit of this._raycaster.intersectObjects(this._buildingsGroup.children, true)) {
      let curr: THREE.Object3D | null = hit.object;
      while (curr) {
        if (curr.userData?.buildingId) return { buildingId: curr.userData.buildingId };
        curr = curr.parent;
      }
    }
    for (const hit of this._raycaster.intersectObjects(this._beltsGroup.children, true)) {
      let curr: THREE.Object3D | null = hit.object;
      while (curr) {
        if (curr.userData?.beltId) return { beltId: curr.userData.beltId };
        curr = curr.parent;
      }
    }
    return {};
  }

  public updateGhostPreview(
    toolId: QFactoryToolId,
    snappedPos: { x: number; z: number } | null,
    rotationDeg: number,
    isValid = true,
    floorY = 0
  ): void {
    if (this._ghostGroup) {
      this._scene.remove(this._ghostGroup);
      this._ghostGroup = null;
    }
    if (!snappedPos || !(toolId in QFACTORY_BLUEPRINTS)) return;
    this._ghostGroup = QFactoryModelBuilder.createGhostForType(toolId as QFactoryBuildingType, rotationDeg, isValid);
    this._ghostGroup.position.set(snappedPos.x, floorY, snappedPos.z);
    this._scene.add(this._ghostGroup);
  }

  public updateBeltHologram(
    startPos: QFactoryPoint3D | null,
    targetPos: QFactoryPoint3D | null,
    shape: QFactoryBeltShape,
    isValid = true
  ): void {
    this.clearBeltHologram();
    if (!startPos || !targetPos) return;
    const { pathPoints } = QFactoryBeltMath.computeBeltPath(startPos, targetPos, shape, 0.85);
    this._beltGhostGroup = QFactoryModelBuilder.createBeltGhost(pathPoints, isValid);
    this._scene.add(this._beltGhostGroup);
  }

  public clearBeltHologram(): void {
    if (this._beltGhostGroup) {
      this._scene.remove(this._beltGhostGroup);
      this._beltGhostGroup = null;
    }
  }

  public updateFloorRectPreview(x1: number, z1: number, x2: number, z2: number, thickness = 1, levelIndex = 0): void {
    this.clearFloorRectPreview();
    const minX = Math.round(Math.min(x1, x2));
    const maxX = Math.max(minX + 1, Math.round(Math.max(x1, x2)));
    const minZ = Math.round(Math.min(z1, z2));
    const maxZ = Math.max(minZ + 1, Math.round(Math.max(z1, z2)));
    const baseY = QFactoryFloorPoleMath.computeDeckElevation(levelIndex);

    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xfde047, transparent: true, opacity: 0.48, roughness: 0.4 });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(maxX - minX, thickness, maxZ - minZ), mat);
    slab.position.set((minX + maxX) / 2, baseY + thickness / 2, (minZ + maxZ) / 2);
    group.add(slab);

    for (const p of QFactoryFloorPoleMath.computeSupportPoles(minX, maxX, minZ, maxZ, baseY)) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, p.topY, 8), mat);
      col.position.set(p.x, p.topY / 2, p.z);
      group.add(col);
    }
    this._floorRectGhost = group;
    this._scene.add(group);
  }

  public clearFloorRectPreview(): void {
    if (this._floorRectGhost) {
      this._scene.remove(this._floorRectGhost);
      this._floorRectGhost = null;
    }
  }

  public syncTeddySquad(sim: QFactorySimManager, controller: QFactoryTeddyController): void {
    const activeIdx = controller.getActiveTeddyIndex();
    for (const [idx, char] of controller.getSquad().entries()) {
      let mesh = this._teddyMeshes.get(char.id);
      if (!mesh) {
        mesh = QFactoryTeddyBuilder.createSquadTeddy(char, idx === activeIdx, this._visualMode);
        this._teddyMeshes.set(char.id, mesh);
        this._teddiesGroup.add(mesh);
      }
      const floor = sim.findFoundationAt(char.x, char.z);
      mesh.position.set(char.x, floor ? floor.topY : 0, char.z);
      mesh.rotation.y = char.headingRad;
      QFactoryTeddyBuilder.syncActiveRing(mesh, idx === activeIdx);
      QFactoryTeddyBuilder.animateTeddy(mesh, char.walkPhase, char.isMoving);
    }
  }

  public syncTeddyState(_sim: QFactorySimManager, _state: QFactoryTeddyState): void {
    // Retained for legacy call compatibility; syncTeddySquad updates all 4 coloured bears
  }

  public syncWithSim(sim: QFactorySimManager, elapsedSec: number, deltaSec = 0.016): void {
    this.syncFoundations(sim);
    this.syncBuildings(sim, elapsedSec);
    this.syncBeltsAndItems(sim);
    this._smokeSystem.step(sim, deltaSec);
  }

  private syncFoundations(sim: QFactorySimManager): void {
    const activeIds = new Set<string>();
    for (const floor of sim.getFoundationFloors()) {
      activeIds.add(floor.id);
      if (!this._foundationMeshes.has(floor.id)) {
        const group = QFactoryDioramaEnvironment.createFoundationWithPoles(floor, this._visualMode);
        this._foundationMeshes.set(floor.id, group);
        this._foundationsGroup.add(group);
      }
    }
    for (const [id, mesh] of this._foundationMeshes.entries()) {
      if (!activeIds.has(id)) {
        this._foundationsGroup.remove(mesh);
        this._foundationMeshes.delete(id);
      }
    }
  }

  private syncBuildings(sim: QFactorySimManager, elapsedSec: number): void {
    const activeIds = new Set<string>();
    const selectedIds = new Set(sim.getSelectedBuildingIds());
    for (const bld of sim.getBuildings()) {
      activeIds.add(bld.id);
      let mesh = this._buildingMeshes.get(bld.id);
      if (!mesh) {
        mesh = QFactoryModelBuilder.createBuildingMesh(bld, false, this._visualMode);
        this._buildingMeshes.set(bld.id, mesh);
        this._buildingsGroup.add(mesh);
      }
      this.animateBuilding(mesh, bld, elapsedSec);
      this.syncSelectionBox(mesh, selectedIds.has(bld.id));
    }
    for (const [id, mesh] of this._buildingMeshes.entries()) {
      if (!activeIds.has(id)) {
        this._buildingsGroup.remove(mesh);
        this._buildingMeshes.delete(id);
      }
    }
  }

  private syncBeltsAndItems(sim: QFactorySimManager): void {
    const activeBeltIds = new Set<string>();
    const activeItemIds = new Set<string>();
    const selectedBeltIds = new Set(sim.getSelectedBeltIds());

    for (const belt of sim.getBelts()) {
      activeBeltIds.add(belt.id);
      const rawPts = belt.pathPoints.length >= 2 ? belt.pathPoints : [belt.startPoint, belt.endPoint];
      const tunnelPts = QFactoryBeltMath.withTunnelEnds(rawPts, 0.85);

      let beltMesh = this._beltMeshes.get(belt.id);
      if (!beltMesh) {
        const tunneledBelt: QFactoryBelt = { ...belt, pathPoints: tunnelPts };
        beltMesh = this._visualMode === 'blockout'
          ? QFactoryModelBuilder.createBeltMesh(tunneledBelt, 'iron')
          : QFactoryBasketAndSignBuilder.createClayRollerBeltMesh(tunneledBelt);
        if (this._visualMode === 'anime' || this._visualMode === 'vinyl') {
          QFactoryStyleMaterialLibrary.applyArtStylePostPass(beltMesh, this._visualMode);
        }
        this._beltMeshes.set(belt.id, beltMesh);
        this._beltsGroup.add(beltMesh);
      }
      this.syncSelectionBox(beltMesh, selectedBeltIds.has(belt.id));

      for (const item of belt.items) {
        activeItemIds.add(item.id);
        let itemMesh = this._itemMeshes.get(item.id);
        if (!itemMesh) {
          itemMesh = QFactoryModelBuilder.createItemMesh(item.itemType);
          this._itemMeshes.set(item.id, itemMesh);
          this._itemsGroup.add(itemMesh);
        }
        const pos = QFactoryBeltMath.interpolatePosition(tunnelPts, item.progress);
        const visScale = QFactoryBeltMath.computeTunnelItemScale(item.progress);
        itemMesh.position.set(pos.x, pos.y + 0.62, pos.z);
        itemMesh.scale.setScalar(visScale);
      }
    }

    for (const [id, mesh] of this._beltMeshes.entries()) {
      if (!activeBeltIds.has(id)) {
        this._beltsGroup.remove(mesh);
        this._beltMeshes.delete(id);
      }
    }
    for (const [id, mesh] of this._itemMeshes.entries()) {
      if (!activeItemIds.has(id)) {
        this._itemsGroup.remove(mesh);
        this._itemMeshes.delete(id);
      }
    }
  }

  private syncSelectionBox(mesh: THREE.Group, isSelected: boolean): void {
    const existing = mesh.getObjectByName('selection_highlight');
    if (isSelected && !existing) {
      const box = new THREE.BoxHelper(mesh, 0xfef08a);
      box.name = 'selection_highlight';
      mesh.add(box);
    } else if (!isSelected && existing) {
      mesh.remove(existing);
    }
  }

  private animateBuilding(group: THREE.Group, bld: QFactoryBuilding, elapsedSec: number): void {
    if (QFactoryMachineRegistry.has(bld.type)) {
      QFactoryDualModeBuilder.animateWorkshopMachine(group, bld, elapsedSec);
      return;
    }
    const drill = group.getObjectByName('anim_drill');
    if (drill) drill.rotation.y = elapsedSec * 6.0;
    const press = group.getObjectByName('anim_press');
    if (press) press.position.y = 3.1 + Math.sin(elapsedSec * 4.5) * 0.55;
    const wheel = group.getObjectByName('anim_wheel');
    if (wheel) wheel.rotation.y = elapsedSec * 2.5;
  }

  public render(): void { this._renderer.render(this._scene, this._camera); }

  public resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }

  public dispose(): void {
    this._renderer.dispose();
    this._renderer.domElement.remove();
  }
}
