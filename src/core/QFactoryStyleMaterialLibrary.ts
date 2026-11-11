import * as THREE from 'three';
import { QFactoryClayMaterialLibrary } from './QFactoryClayMaterialLibrary';
import { QFactoryVisualMode } from './QFactoryTypes';

export class QFactoryStyleMaterialLibrary {
  private static _toonCache = new Map<string, THREE.MeshToonMaterial>();
  private static _vinylCache = new Map<string, THREE.MeshStandardMaterial>();
  private static _blockoutCache = new Map<string, THREE.MeshStandardMaterial>();
  private static _inkOutlineMat: THREE.MeshBasicMaterial | null = null;
  private static _toonGradient: THREE.DataTexture | null = null;

  private static getToonGradientMap(): THREE.DataTexture {
    if (!this._toonGradient) {
      const shades = new Uint8Array([82, 82, 82, 255, 155, 155, 155, 255, 218, 218, 218, 255, 255, 255, 255, 255]);
      const tex = new THREE.DataTexture(shades, 4, 1, THREE.RGBAFormat);
      tex.minFilter = THREE.NearestFilter;
      tex.magFilter = THREE.NearestFilter;
      tex.needsUpdate = true;
      this._toonGradient = tex;
    }
    return this._toonGradient;
  }

  public static getInkOutlineMaterial(): THREE.MeshBasicMaterial {
    if (!this._inkOutlineMat) {
      this._inkOutlineMat = new THREE.MeshBasicMaterial({
        color: 0x1e1b2e,
        side: THREE.BackSide,
      });
    }
    return this._inkOutlineMat;
  }

  public static getSurface(colorHex: string, mode: QFactoryVisualMode): THREE.Material {
    if (mode === 'anime') {
      let mat = this._toonCache.get(colorHex);
      if (!mat) {
        mat = new THREE.MeshToonMaterial({
          color: new THREE.Color(colorHex),
          gradientMap: this.getToonGradientMap(),
        });
        this._toonCache.set(colorHex, mat);
      }
      return mat;
    }

    if (mode === 'vinyl') {
      let mat = this._vinylCache.get(colorHex);
      if (!mat) {
        mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(colorHex),
          roughness: 0.14,
          metalness: 0.08,
        });
        this._vinylCache.set(colorHex, mat);
      }
      return mat;
    }

    if (mode === 'blockout') {
      let mat = this._blockoutCache.get(colorHex);
      if (!mat) {
        mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(colorHex),
          roughness: 0.65,
          metalness: 0.05,
        });
        this._blockoutCache.set(colorHex, mat);
      }
      return mat;
    }

    return QFactoryClayMaterialLibrary.getClay(colorHex);
  }

  public static applyArtStylePostPass(root: THREE.Group, mode: QFactoryVisualMode): void {
    if (mode === 'detailed' || mode === 'blockout') return;

    const meshes: THREE.Mesh[] = [];
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name !== 'anime_ink_outline' && !obj.name.startsWith('tunnel_hole_')) {
        meshes.push(obj);
      }
    });

    const outlineMat = this.getInkOutlineMaterial();
    for (const mesh of meshes) {
      const mat = mesh.material;
      if (mat instanceof THREE.MeshStandardMaterial && !mat.map) {
        const hex = `#${mat.color.getHexString()}`;
        mesh.material = this.getSurface(hex, mode);
      }
      if (mode === 'anime' && mesh.geometry) {
        const outline = new THREE.Mesh(mesh.geometry, outlineMat);
        outline.name = 'anime_ink_outline';
        outline.scale.setScalar(1.045);
        mesh.add(outline);
      }
    }
  }
}
