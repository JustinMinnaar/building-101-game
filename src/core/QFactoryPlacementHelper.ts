import { QFactory3DScene } from './QFactory3DScene';
import { QFactoryCustomMachineStore } from './QFactoryCustomMachineStore';
import { QFactorySimManager } from './QFactorySimManager';
import { QFactoryBeltShape, QFactoryBuildingType } from './QFactoryTypes';

export class QFactoryPlacementHelper {
  public static handleBeltClick(
    scene: QFactory3DScene,
    sim: QFactorySimManager,
    ndc: { x: number; y: number },
    pendingBeltSourceId: string | null,
    beltShapeMode: QFactoryBeltShape,
    setPendingBeltSourceId: (id: string | null) => void,
    setStatusMessage: (msg: string) => void,
    refreshStats: () => void
  ): void {
    const hit = scene.raycastBuildingOrBeltId(ndc.x, ndc.y);
    const groundPt = scene.raycastGround(ndc.x, ndc.y);
    const snapped = groundPt ? sim.snapToGrid(groundPt.x, groundPt.z) : null;

    if (!pendingBeltSourceId) {
      if (hit.buildingId) {
        setPendingBeltSourceId(hit.buildingId);
        const src = sim.getBuildingById(hit.buildingId);
        setStatusMessage(`Belt start: ${src?.name}. Click destination machine or open deck.`);
      } else if (snapped) {
        try {
          const connector = sim.placeBuilding('connector', snapped.x, snapped.z);
          setPendingBeltSourceId(connector.id);
          setStatusMessage(`Placed Belt Post at (${connector.x}m, ${connector.z}m). Click destination.`);
          refreshStats();
        } catch (err) {
          setStatusMessage((err as Error).message);
        }
      }
      return;
    }

    try {
      if (hit.buildingId) {
        if (hit.buildingId === pendingBeltSourceId) {
          setStatusMessage('Cannot connect belt to itself.');
          return;
        }
        if (!sim.getEconomy().trySpendSandbox({ metal: 4 })) {
          setStatusMessage('Out of Metal for wires & rollers! Click [+ Restock] in the top bar.');
          return;
        }
        const belt = sim.connectBelt(pendingBeltSourceId, hit.buildingId, beltShapeMode);
        const src = sim.getBuildingById(belt.sourceId);
        const dst = sim.getBuildingById(belt.targetId);
        setStatusMessage(`Connected Tunnel Belt (${belt.shape}): ${src?.name} → ${dst?.name}! (-4 Metal)`);
        setPendingBeltSourceId(null);
        scene.clearBeltHologram();
        refreshStats();
      } else if (snapped) {
        const connector = sim.placeBuilding('connector', snapped.x, snapped.z);
        const belt = sim.connectBelt(pendingBeltSourceId, connector.id, beltShapeMode);
        const src = sim.getBuildingById(belt.sourceId);
        sim.getEconomy().trySpendSandbox({ metal: 3 });
        setStatusMessage(`Linked Belt from ${src?.name} to Post. Chaining next segment...`);
        setPendingBeltSourceId(connector.id);
        refreshStats();
      }
    } catch (err) {
      setStatusMessage((err as Error).message);
    }
  }

  public static handleSingleBuildingPlacement(
    sim: QFactorySimManager,
    toolId: string,
    groundPt: { x: number; z: number },
    rotationDeg: number,
    setStatusMessage: (msg: string) => void,
    refreshStats: () => void
  ): void {
    try {
      const custom = QFactoryCustomMachineStore.getCustomSpec(toolId);
      const cost = toolId === 'support-pole'
        ? { cardboard: 6, metal: 2 }
        : custom
          ? custom.buildCost
          : { clay: 14, metal: 8 };

      if (!sim.getEconomy().canAfford(cost)) {
        setStatusMessage('Not enough Cardboard / Clay / Metal! Click [+ Restock] in the top bar.');
        return;
      }
      const placed = sim.placeBuilding(toolId as QFactoryBuildingType, groundPt.x, groundPt.z, rotationDeg, false, true);
      sim.getEconomy().trySpendSandbox(cost);
      const lvlTag = placed.y > 4 ? ` on Upper Deck (${Math.round(placed.y)}m)` : '';
      setStatusMessage(`Built ${placed.name}${lvlTag}!`);
      refreshStats();
    } catch (err) {
      setStatusMessage((err as Error).message);
    }
  }
}
