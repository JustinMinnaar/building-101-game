import * as THREE from 'three';
import { QFactoryToySweetItemBuilder } from './QFactoryToySweetItemBuilder';
import { QFactoryItemType } from './QFactoryTypes';

export class QFactoryItemMeshBuilder {
  public static createMesh(type: QFactoryItemType): THREE.Mesh {
    if (QFactoryToySweetItemBuilder.isToySweetItem(type)) {
      return QFactoryToySweetItemBuilder.createMesh(type);
    }
    switch (type) {
      case 'iron-ore':
        return new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.42, 0),
          new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 })
        );
      case 'copper-ore':
        return new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.4, 0),
          new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7, metalness: 0.3 })
        );
      case 'limestone':
        return new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.45, 0.55),
          new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.95 })
        );
      case 'coal':
        return new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.44, 0),
          new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.95 })
        );
      case 'iron-ingot':
        return new THREE.Mesh(
          new THREE.BoxGeometry(0.75, 0.3, 0.4),
          new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0x7c2d12, emissiveIntensity: 0.3, metalness: 0.7 })
        );
      case 'copper-ingot':
        return new THREE.Mesh(
          new THREE.BoxGeometry(0.75, 0.3, 0.4),
          new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.8, roughness: 0.25 })
        );
      case 'iron-plate':
        return new THREE.Mesh(
          new THREE.BoxGeometry(0.85, 0.12, 0.85),
          new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.2 })
        );
      case 'iron-rod':
        return new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.9, 8),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 })
        );
      case 'wire':
        return new THREE.Mesh(
          new THREE.TorusGeometry(0.3, 0.1, 8, 16),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
        );
      case 'cable':
        return new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.28, 0.4, 12),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
        );
      case 'concrete':
        return new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.5, 0.7),
          new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 })
        );
      case 'screw':
      default:
        return new THREE.Mesh(
          new THREE.CylinderGeometry(0.14, 0.1, 0.6, 6),
          new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 })
        );
    }
  }
}
