import { QFACTORY_BLUEPRINTS } from './QFactoryBlueprints';
import { QFactoryMachineRegistry } from './QFactoryMachineRegistry';
import { QFACTORY_RESOURCE_NODES } from './QFactoryResourceNodes';
import { QFactoryBuilding, QFactoryBuildingType, QFactoryFoundationFloor } from './QFactoryTypes';

export class QFactoryPlacementValidator {
  public static validate(
    type: QFactoryBuildingType,
    x: number,
    z: number,
    existingBuildings?: Iterable<QFactoryBuilding>,
    requireFoundation = false,
    foundationFloors?: Iterable<QFactoryFoundationFloor>
  ): { valid: boolean; reason?: string } {
    const node = QFACTORY_RESOURCE_NODES.find((n) => Math.hypot(n.x - x, n.z - z) <= n.radius);
    const workshopDef = QFactoryMachineRegistry.has(type) ? QFactoryMachineRegistry.getById(type) : null;
    const isResourceHarvester =
      type === 'miner' || type === 'miner-mk2' || workshopDef?.placementRule === 'resource-node';

    if (isResourceHarvester) {
      if (!node) {
        return {
          valid: false,
          reason: 'Harvesters and Miners cannot be placed on open ground; they must be placed on a resource node.',
        };
      }
      if (workshopDef?.acceptedNodeTypes && !workshopDef.acceptedNodeTypes.includes(node.oreType)) {
        return {
          valid: false,
          reason: `${workshopDef.name} cannot harvest ${node.name}; place it on a matching resource patch.`,
        };
      }
      return { valid: true };
    }

    const floorList = foundationFloors ? Array.from(foundationFloors) : [];
    const isFoundation = type.startsWith('foundation') || type === 'support-pole';
    const hasElevatedDeckHere = floorList.some(
      (f) => f.levelIndex > 0 && x >= f.minX && x <= f.maxX && z >= f.minZ && z <= f.maxZ
    );
    if (!isFoundation && node && !hasElevatedDeckHere) {
      return {
        valid: false,
        reason: `Non-miner machines cannot be placed on a resource mine node (${node.name}); they must be placed in open ground.`,
      };
    }

    // Machines must sit on a floor/foundation polygon
    if (requireFoundation && !isFoundation) {
      let hasFoundation = false;
      const bp = QFACTORY_BLUEPRINTS[type];
      const hx = bp ? bp.depth / 2 : 3;
      const hz = bp ? bp.width / 2 : 3;
      const bMinX = x - hx;
      const bMaxX = x + hx;
      const bMinZ = z - hz;
      const bMaxZ = z + hz;

      for (const f of floorList) {
        if (bMinX >= f.minX && bMaxX <= f.maxX && bMinZ >= f.minZ && bMaxZ <= f.maxZ) {
          hasFoundation = true;
          break;
        }
      }

      if (!hasFoundation && existingBuildings) {
        for (const b of existingBuildings) {
          if (b.type.startsWith('foundation')) {
            const hw = (b.width || 8) / 2;
            const hd = (b.depth || 8) / 2;
            if (bMinX >= b.x - hw && bMaxX <= b.x + hw && bMinZ >= b.z - hd && bMaxZ <= b.z + hd) {
              hasFoundation = true;
              break;
            }
          }
        }
      }

      if (!hasFoundation) {
        return {
          valid: false,
          reason: 'Machines must sit on a foundation floor; you must build a foundation first to place the machine onto.',
        };
      }
    }

    return { valid: true };
  }
}
