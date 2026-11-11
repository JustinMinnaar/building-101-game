import * as THREE from 'three';

export class QFactoryClayMaterialLibrary {
  private static _clayBumpTex: THREE.DataTexture | null = null;
  private static _plushBumpTex: THREE.DataTexture | null = null;
  private static _clayCache = new Map<string, THREE.MeshStandardMaterial>();
  private static _plushCache = new Map<string, THREE.MeshStandardMaterial>();
  private static _glossCache = new Map<string, THREE.MeshStandardMaterial>();

  private static getClayBumpTexture(): THREE.DataTexture {
    if (!this._clayBumpTex) {
      const size = 64;
      const data = new Uint8Array(size * size * 4);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const wave = Math.sin(x * 0.35) * Math.cos(y * 0.35) * 18 + Math.sin((x + y) * 0.7) * 9;
          const v = Math.max(90, Math.min(220, Math.round(155 + wave)));
          const idx = (y * size + x) * 4;
          data[idx] = v;
          data[idx + 1] = v;
          data[idx + 2] = v;
          data[idx + 3] = 255;
        }
      }
      const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(3, 3);
      tex.needsUpdate = true;
      this._clayBumpTex = tex;
    }
    return this._clayBumpTex;
  }

  private static getPlushBumpTexture(): THREE.DataTexture {
    if (!this._plushBumpTex) {
      const size = 64;
      const data = new Uint8Array(size * size * 4);
      for (let i = 0; i < size * size; i++) {
        const hash = ((i * 7919 + 104729) % 97) - 48;
        const v = Math.max(60, Math.min(245, 160 + hash));
        const idx = i * 4;
        data[idx] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 8);
      tex.needsUpdate = true;
      this._plushBumpTex = tex;
    }
    return this._plushBumpTex;
  }

  public static getClay(colorHex: string): THREE.MeshStandardMaterial {
    let mat = this._clayCache.get(colorHex);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.88,
        metalness: 0.02,
        bumpMap: this.getClayBumpTexture(),
        bumpScale: 0.045,
      });
      this._clayCache.set(colorHex, mat);
    }
    return mat;
  }

  public static getPlush(colorHex: string): THREE.MeshStandardMaterial {
    let mat = this._plushCache.get(colorHex);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.96,
        metalness: 0.0,
        bumpMap: this.getPlushBumpTexture(),
        bumpScale: 0.09,
      });
      this._plushCache.set(colorHex, mat);
    }
    return mat;
  }

  public static getBrass(colorHex = '#eab308'): THREE.MeshStandardMaterial {
    let mat = this._glossCache.get(`brass_${colorHex}`);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.25,
        metalness: 0.82,
      });
      this._glossCache.set(`brass_${colorHex}`, mat);
    }
    return mat;
  }

  public static getCandyGloss(colorHex: string, emissiveIntensity = 0.08): THREE.MeshStandardMaterial {
    const key = `candy_${colorHex}_${emissiveIntensity}`;
    let mat = this._glossCache.get(key);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        emissive: new THREE.Color(colorHex),
        emissiveIntensity,
        roughness: 0.22,
        metalness: 0.06,
      });
      this._glossCache.set(key, mat);
    }
    return mat;
  }
}
