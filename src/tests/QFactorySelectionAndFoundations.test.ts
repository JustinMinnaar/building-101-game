import { describe, it, expect } from 'vitest';
import { QFactorySimManager } from '../core/QFactorySimManager';

describe('QFactory Selection, Foundations & Storage Boxes', () => {
  it('places connectors on the ends of machines, 1 meter off the bottom of the machine', () => {
    const sim = new QFactorySimManager();
    // Place a 30x30 foundation floor of thickness 2m at (0, 0)
    const floor = sim.placeFoundationRect(-15, -15, 15, 15, 2);
    expect(floor.thickness).toBe(2);
    expect(floor.topY).toBe(2);

    // Miner on raw ground (mine node) outside foundation at (-24, 0)
    // Miner has length (along X) = 8, width (along Z) = 6
    const miner = sim.placeBuilding('miner', -24, 0, 0, true);
    expect(miner.outputPort).toBeDefined();
    // Output connector is on the front end (positive X: -24 + 4.0 = -20.0), not on the sides (Z)
    expect(miner.outputPort!.x).toBeCloseTo(-20.0, 1);
    expect(miner.outputPort!.z).toBeCloseTo(0.0, 1);
    // 1m off bottom of machine (miner on ground y=0 -> port y=1.0)
    expect(miner.outputPort!.y).toBe(1.0);

    // Smelter on the foundation floor (y = 2m)
    // Smelter length (along X) = 9, width (along Z) = 6
    const smelter = sim.placeBuilding('smelter', 0, 0, 0, false, true);
    expect(smelter.y).toBe(2.0); // Sits level on top of the 2m foundation
    // Input connector on back end (negative X: -length/2 = -4.5), output on front end (positive X: +length/2 = +4.5)
    expect(smelter.inputPort!.x).toBeCloseTo(-4.5, 1);
    expect(smelter.inputPort!.z).toBeCloseTo(0.0, 1);
    expect(smelter.outputPort!.x).toBeCloseTo(4.5, 1);
    expect(smelter.outputPort!.z).toBeCloseTo(0.0, 1);
    // Connectors are 1 meter off the bottom of the machine (2.0 + 1.0 = 3.0m world height)
    expect(smelter.inputPort!.y).toBe(3.0);
    expect(smelter.outputPort!.y).toBe(3.0);

    // Dual-port Mk.2 machine (Smelter Mk.2) has dual ports side-by-side on the ends
    const smelter2 = sim.placeBuilding('smelter-mk2', 0, 0, 0, true);
    expect(smelter2.inputPorts).toHaveLength(2);
    expect(smelter2.outputPorts).toHaveLength(2);
    // Both input ports are on the back end (negative X: -9.0), offset on Z (-1.5, +1.5)
    for (const inPort of smelter2.inputPorts) {
      expect(inPort.worldPosition.x).toBeCloseTo(-9.0, 1);
      expect(Math.abs(inPort.worldPosition.z)).toBeGreaterThan(0);
    }
    // Both output ports are on the front end (positive X: +9.0), offset on Z (-1.5, +1.5)
    for (const outPort of smelter2.outputPorts) {
      expect(outPort.worldPosition.x).toBeCloseTo(9.0, 1);
      expect(Math.abs(outPort.worldPosition.z)).toBeGreaterThan(0);
    }
  });

  it('supports storage box sizes 1 through 6 with 1m port height off machine bottom and connectors on ends', () => {
    const sim = new QFactorySimManager();
    sim.placeFoundationRect(-10, -50, 60, 50, 1);

    const b1 = sim.placeBuilding('container-1', 0, 0, 0, true);
    expect(b1.width).toBe(6);
    expect(b1.depth).toBe(6);
    expect(b1.height).toBe(6);
    // Input on back end (-3), Output on front end (+3)
    expect(b1.inputPort!.x).toBeCloseTo(-3.0, 1);
    expect(b1.outputPort!.x).toBeCloseTo(3.0, 1);

    const b2 = sim.placeBuilding('container-2', 20, 0, 0, true);
    expect(b2.depth).toBe(12);
    expect(b2.width).toBe(6);
    expect(b2.height).toBe(6);
    // Ends of 12m long container are at -6 and +6
    expect(b2.inputPort!.x).toBeCloseTo(14.0, 1); // 20 - 6
    expect(b2.outputPort!.x).toBeCloseTo(26.0, 1); // 20 + 6

    const b3 = sim.placeBuilding('container-3', 40, 0, 0, true);
    expect(b3.depth).toBe(18);
    expect(b3.width).toBe(6);
    expect(b3.height).toBe(6);

    const b4 = sim.placeBuilding('container-4', 0, 20, 0, true);
    expect(b4.height).toBe(12); // Double height

    const b5 = sim.placeBuilding('container-5', 20, 20, 0, true);
    expect(b5.depth).toBe(12);
    expect(b5.height).toBe(12);

    const b6 = sim.placeBuilding('container-6', 40, 20, 0, true);
    expect(b6.depth).toBe(18);
    expect(b6.height).toBe(12);
  });

  it('tracks solid foundation floor polygons in any 1x1 multiples with 1m, 2m, or 3m thickness', () => {
    const sim = new QFactorySimManager();

    // Draw arbitrary 1x1 multiple area from (12, 15) to (27, 33) with thickness 2m
    const floor = sim.placeFoundationRect(12, 15, 27, 33, 2);
    expect(floor.minX).toBe(12);
    expect(floor.maxX).toBe(27);
    expect(floor.minZ).toBe(15);
    expect(floor.maxZ).toBe(33);
    expect(floor.width).toBe(15); // 27 - 12
    expect(floor.depth).toBe(18); // 33 - 15
    expect(floor.thickness).toBe(2);
    expect(floor.topY).toBe(2);

    // Single solid floor area tracked, zero redundant tiles
    expect(sim.getFoundationFloors()).toHaveLength(1);
    expect(sim.getFoundationFloors()[0].id).toBe(floor.id);
  });

  it('requires machines to sit on a foundation floor polygon unless on a resource mine node', () => {
    const sim = new QFactorySimManager();
    // Non-miner on raw ground without foundation fails validation when floor required
    const checkNoFloor = sim.validatePlacement('smelter', 50, 50, true);
    expect(checkNoFloor.valid).toBe(false);
    expect(checkNoFloor.reason).toMatch(/foundation/i);

    // Place a solid foundation polygon from (40, 40) to (60, 60)
    sim.placeFoundationRect(40, 40, 60, 60, 1);

    // Now placing smelter at (50, 50) succeeds!
    const checkWithFloor = sim.validatePlacement('smelter', 50, 50, true);
    expect(checkWithFloor.valid).toBe(true);
    const smelter = sim.placeBuilding('smelter', 50, 50, 0, false, true);
    expect(smelter).toBeDefined();

    // Machine overlapping the boundary of the foundation fails
    const checkEdge = sim.validatePlacement('smelter', 59, 50, true);
    expect(checkEdge.valid).toBe(false);
  });

  it('supports selecting belts, marquee rect multi-selection, CTRL toggle, and deleting selected items with Delete key', () => {
    const sim = new QFactorySimManager();
    // Lay solid foundation floor polygon and buildings
    sim.placeFoundationRect(-35, -15, 35, 15, 1);
    const m = sim.placeBuilding('miner', -24, 0, 0, true);
    const s = sim.placeBuilding('smelter', -8, 0, 0);
    const belt = sim.connectBelt(m.id, s.id);

    // Select belt directly
    sim.selectItem(belt.id, false);
    expect(sim.getSelectedBeltIds()).toContain(belt.id);
    expect(sim.getSelectedBuildingIds()).toHaveLength(0);

    // Select building with CTRL adds to selection
    sim.selectItem(s.id, true);
    expect(sim.getSelectedBeltIds()).toContain(belt.id);
    expect(sim.getSelectedBuildingIds()).toContain(s.id);

    // CTRL clicking an already-selected item removes it
    sim.selectItem(belt.id, true);
    expect(sim.getSelectedBeltIds()).not.toContain(belt.id);
    expect(sim.getSelectedBuildingIds()).toContain(s.id);

    // Marquee rect selection: select all items in region [-30, -10] to [0, 10]
    sim.selectInRect(-30, -10, 0, 10, false);
    expect(sim.getSelectedBuildingIds()).toContain(m.id);
    expect(sim.getSelectedBuildingIds()).toContain(s.id);
    expect(sim.getSelectedBeltIds()).toContain(belt.id);

    // Delete selected items
    const delStats = sim.deleteSelected();
    expect(delStats.buildingsDeleted).toBeGreaterThanOrEqual(2);
    expect(delStats.beltsDeleted).toBe(1);
    expect(sim.getBuildingById(m.id)).toBeUndefined();
    expect(sim.getBuildingById(s.id)).toBeUndefined();
    expect(sim.getBelts()).toHaveLength(0);
  });
});
