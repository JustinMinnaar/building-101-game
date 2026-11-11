import { describe, it, expect } from 'vitest';
import { QFactorySimManager } from '../core/QFactorySimManager';

describe('QFactorySimManager — 10-Slot Hotbar, Building Placement, Belt Chain & Performance', () => {
  it('initializes with 10 inventory slots (keys 1-9 and 0) and selects slots by key', () => {
    const sim = new QFactorySimManager();
    const slots = sim.getHotbarSlots();
    expect(slots).toHaveLength(10);
    expect(slots[0].key).toBe('1');
    expect(slots[0].toolId).toBe('miner');
    expect(slots[1].key).toBe('2');
    expect(slots[1].toolId).toBe('smelter');
    expect(slots[2].key).toBe('3');
    expect(slots[2].toolId).toBe('constructor');
    expect(slots[3].key).toBe('4');
    expect(slots[3].toolId).toBe('container');
    expect(slots[4].key).toBe('5');
    expect(slots[4].toolId).toBe('belt');
    expect(slots[9].key).toBe('0');

    sim.selectSlotByKey('2');
    expect(sim.getActiveSlot().toolId).toBe('smelter');

    sim.selectSlotByKey('5');
    expect(sim.getActiveSlot().toolId).toBe('belt');
  });

  it('snaps coordinates to 2m grid and places Miner, Smelter, Constructor, and Container with valid ports', () => {
    const sim = new QFactorySimManager();
    const snapped = sim.snapToGrid(3.4, -4.6);
    expect(snapped).toEqual({ x: 4, z: -4 });

    const miner = sim.placeBuilding('miner', -18, 0, 0);
    const smelter = sim.placeBuilding('smelter', -6, 0, 0);
    const constructorBld = sim.placeBuilding('constructor', 6, 0, 0);
    const container = sim.placeBuilding('container', 18, 0, 0);

    expect(sim.getBuildings()).toHaveLength(4);
    expect(miner.outputPort).toBeDefined();
    expect(smelter.inputPort).toBeDefined();
    expect(smelter.outputPort).toBeDefined();
    expect(constructorBld.inputPort).toBeDefined();
    expect(constructorBld.outputPort).toBeDefined();
    expect(container.inputPort).toBeDefined();
  });

  it('connects Mk.1 Belts from Miner -> Smelter -> Constructor -> Container and rejects invalid connections', () => {
    const sim = new QFactorySimManager();
    const miner = sim.placeBuilding('miner', -18, 0, 0);
    const smelter = sim.placeBuilding('smelter', -6, 0, 0);
    const constructorBld = sim.placeBuilding('constructor', 6, 0, 0);
    const container = sim.placeBuilding('container', 18, 0, 0);

    // Fail-fast on self connection
    expect(() => sim.connectBelt(miner.id, miner.id)).toThrow();

    const belt1 = sim.connectBelt(miner.id, smelter.id);
    const belt2 = sim.connectBelt(smelter.id, constructorBld.id);
    const belt3 = sim.connectBelt(constructorBld.id, container.id);

    expect(sim.getBelts()).toHaveLength(3);
    expect(belt1.sourceId).toBe(miner.id);
    expect(belt1.targetId).toBe(smelter.id);
    expect(belt2.sourceId).toBe(smelter.id);
    expect(belt3.targetId).toBe(container.id);
  });

  it('rejects connecting a second belt to a port that already has a belt connected', () => {
    const sim = new QFactorySimManager();
    const miner = sim.placeBuilding('miner', -18, 0, 0);
    const smelter1 = sim.placeBuilding('smelter', -6, 0, 0);
    const smelter2 = sim.placeBuilding('smelter', -6, 10, 0);

    // First connection from miner to smelter1 succeeds
    sim.connectBelt(miner.id, smelter1.id);

    // Attempting second connection from miner's output port fails fast
    expect(() => sim.connectBelt(miner.id, smelter2.id)).toThrowError(
      /output port already has a connected belt/i
    );

    // Attempting second connection to smelter1's input port fails fast
    const miner2 = sim.placeBuilding('miner', -18, 10, 0, true);
    expect(() => sim.connectBelt(miner2.id, smelter1.id)).toThrowError(
      /input port already has a connected belt/i
    );
  });

  it('supports belt placement shapes (default, straight, curved) and computes path points', () => {
    const sim = new QFactorySimManager();
    sim.setBeltShapeMode('curved');
    expect(sim.getBeltShapeMode()).toBe('curved');

    const miner = sim.placeBuilding('miner', -18, 0, 0, true);
    const smelter = sim.placeBuilding('smelter', -6, 12, 0);

    const belt = sim.connectBelt(miner.id, smelter.id, 'curved');
    expect(belt.shape).toBe('curved');
    expect(belt.pathPoints).toBeDefined();
    expect(belt.pathPoints.length).toBeGreaterThanOrEqual(4);

    const straightBelt = sim.connectBelt(
      sim.placeBuilding('miner', 0, 0, 0, true).id,
      sim.placeBuilding('container', 12, 0, 0).id,
      'straight'
    );
    expect(straightBelt.shape).toBe('straight');
    expect(straightBelt.pathPoints.length).toBe(2);
  });

  it('handles machine selection, inspector stats, power toggling and operational states', () => {
    const sim = new QFactorySimManager();
    const miner = sim.placeBuilding('miner', 0, 0, 0, true);

    sim.selectBuilding(miner.id);
    expect(sim.getSelectedBuildingId()).toBe(miner.id);

    const details = sim.getMachineDetails(miner.id);
    expect(details).toBeDefined();
    expect(details?.name).toBe('Miner Mk.1');
    expect(details?.status).toBe('powered on');
    expect(details?.productionRatePerMin).toBe(60);
    expect(details?.powerUsageMW).toBe(5);

    // Toggle power off -> status transitions to 'shutting down' or 'off'
    sim.toggleBuildingPower(miner.id);
    const detailsOff = sim.getMachineDetails(miner.id);
    expect(['shutting down', 'off']).toContain(detailsOff?.status);

    sim.deselectBuilding();
    expect(sim.getSelectedBuildingId()).toBeNull();
  });

  it('supports expanded Satisfactory item types and recipes', () => {
    const sim = new QFactorySimManager();
    const miner = sim.placeBuilding('miner', -12, 0, 0, true);
    sim.setBuildingRecipe(miner.id, {
      name: 'Copper Ore Extraction',
      producesItem: 'copper-ore',
      cycleDurationSec: 1.0,
    });

    const smelter = sim.placeBuilding('smelter', -4, 0, 0);
    sim.setBuildingRecipe(smelter.id, {
      name: 'Copper Ingot Smelting',
      consumesItem: 'copper-ore',
      producesItem: 'copper-ingot',
      cycleDurationSec: 1.0,
    });

    sim.connectBelt(miner.id, smelter.id);

    for (let i = 0; i < 80; i++) {
      sim.stepSimulation(0.25);
    }

    const updatedSmelter = sim.getBuildingById(smelter.id)!;
    expect(updatedSmelter.lastItemType).toBe('copper-ingot');
  });

  it('manages in-stack (up to 100) and out-stack (up to 100); halts machine when out-stack full and stops belt when in-stack full', () => {
    const sim = new QFactorySimManager();
    const miner = sim.placeBuilding('miner', -18, 0, 0, true);
    const smelter = sim.placeBuilding('smelter', -6, 0, 0);

    // Miner fills its out-stack if no belt is attached
    // Miner has capacity 100 in out-stack
    expect(miner.outStackCapacity).toBe(100);
    expect(smelter.inStackCapacity).toBe(100);

    // Set miner outStack to 100 (full)
    miner.outputBufferCount = 100;
    const detailsFull = sim.getMachineDetails(miner.id)!;
    expect(detailsFull.isOutStackFull).toBe(true);

    // Stepping simulation while out-stack is full should halt production
    const prevProgress = miner.productionProgress;
    sim.stepSimulation(1.0);
    expect(miner.outputBufferCount).toBe(100);
    expect(miner.productionProgress).toBe(prevProgress);

    // Now connect belt to smelter
    const belt = sim.connectBelt(miner.id, smelter.id);

    // Fill smelter's in-stack to 100 items (full)
    smelter.inputBufferCount = 100;
    const smelterDetails = sim.getMachineDetails(smelter.id)!;
    expect(smelterDetails.isInStackFull).toBe(true);

    // Advance simulation; belt should stop feeding into smelter because in-stack is full
    sim.stepSimulation(1.0);
    expect(smelter.inputBufferCount).toBe(100);
    expect(belt.isStopped).toBe(true);
  });

  it('cycles sub-item tools when clicking an already-selected hotbar slot key multiple times', () => {
    const sim = new QFactorySimManager();
    // Key 1: Miner Mk.1 -> Miner Mk.2 -> Miner Mk.1
    sim.selectSlotByKey('1');
    expect(sim.getActiveTool()).toBe('miner');
    sim.selectSlotByKey('1');
    expect(sim.getActiveTool()).toBe('miner-mk2');
    sim.selectSlotByKey('1');
    expect(sim.getActiveTool()).toBe('miner');

    // Key 5: Mk.1 Belt -> Splitter -> Merger -> Connector -> Mk.1 Belt
    sim.selectSlotByKey('5');
    expect(sim.getActiveTool()).toBe('belt');
    sim.selectSlotByKey('5');
    expect(sim.getActiveTool()).toBe('splitter');
    sim.selectSlotByKey('5');
    expect(sim.getActiveTool()).toBe('merger');
    sim.selectSlotByKey('5');
    expect(sim.getActiveTool()).toBe('connector');
    sim.selectSlotByKey('5');
    expect(sim.getActiveTool()).toBe('belt');
  });

  it('places 2nd generation machines with 2x scale and dual side-by-side ports', () => {
    const sim = new QFactorySimManager();
    const miner1 = sim.placeBuilding('miner', 0, 0, 0, true);
    const miner2 = sim.placeBuilding('miner-mk2', 20, 0, 0, true);

    expect(miner2.width).toBe(miner1.width * 2);
    expect(miner2.depth).toBe(miner1.depth * 2);
    expect(miner2.height).toBe(miner1.height * 2);

    expect(miner2.outputPorts).toBeDefined();
    expect(miner2.outputPorts.length).toBe(2);

    const smelter2 = sim.placeBuilding('smelter-mk2', 50, 0);
    expect(smelter2.inputPorts.length).toBe(2);
    expect(smelter2.outputPorts.length).toBe(2);
  });

  it('simulates a conveyor splitter (1 in, 3 out) distributing items round-robin', () => {
    const sim = new QFactorySimManager();
    const miner = sim.placeBuilding('miner', -20, 0, 0, true);
    const splitter = sim.placeBuilding('splitter', -8, 0, 0);
    const box1 = sim.placeBuilding('container', 6, -8, 0);
    const box2 = sim.placeBuilding('container', 6, 0, 0);
    const box3 = sim.placeBuilding('container', 6, 8, 0);

    expect(splitter.inputPorts.length).toBe(1);
    expect(splitter.outputPorts.length).toBe(3);

    sim.connectBelt(miner.id, splitter.id);
    sim.connectBelt(splitter.id, box1.id);
    sim.connectBelt(splitter.id, box2.id);
    sim.connectBelt(splitter.id, box3.id);

    // Step simulation
    for (let i = 0; i < 80; i++) {
      sim.stepSimulation(0.25);
    }

    const c1 = sim.getBuildingById(box1.id)!;
    const c2 = sim.getBuildingById(box2.id)!;
    const c3 = sim.getBuildingById(box3.id)!;
    expect(c1.storedCount).toBeGreaterThan(0);
    expect(c2.storedCount).toBeGreaterThan(0);
    expect(c3.storedCount).toBeGreaterThan(0);
  });

  it('simulates a conveyor merger (3 in, 1 out) consolidating multiple inputs into 1 belt', () => {
    const sim = new QFactorySimManager();
    const m1 = sim.placeBuilding('miner', -20, -8, 0, true);
    const m2 = sim.placeBuilding('miner', -20, 8, 0, true);
    const merger = sim.placeBuilding('merger', -6, 0, 0);
    const box = sim.placeBuilding('container', 8, 0, 0);

    expect(merger.inputPorts.length).toBe(3);
    expect(merger.outputPorts.length).toBe(1);

    sim.connectBelt(m1.id, merger.id);
    sim.connectBelt(m2.id, merger.id);
    sim.connectBelt(merger.id, box.id);

    for (let i = 0; i < 80; i++) {
      sim.stepSimulation(0.25);
    }

    const c = sim.getBuildingById(box.id)!;
    expect(c.storedCount).toBeGreaterThan(0);
  });

  it('supports additional mine nodes and auto-smelter with 15s warmup, output flush requirement, and ore switching delay', () => {
    const sim = new QFactorySimManager();
    const nodes = sim.getResourceNodes();
    expect(nodes.length).toBeGreaterThanOrEqual(4);
    const copperNode = nodes.find((n) => n.oreType === 'copper-ore')!;
    expect(copperNode).toBeDefined();

    // Place miner on copper node -> produces copper-ore
    const copperMiner = sim.placeBuilding('miner', copperNode.x, copperNode.z);
    expect(copperMiner.producesItem).toBe('copper-ore');

    // Setup smelter with mixed ore queue: 3 iron-ore, 3 copper-ore, 1 iron-ore
    const smelter = sim.placeBuilding('smelter', 0, 0);
    smelter.inputQueue = ['iron-ore', 'iron-ore', 'iron-ore', 'copper-ore', 'copper-ore', 'copper-ore', 'iron-ore'];
    smelter.inputBufferCount = smelter.inputQueue.length;

    // Initially when it sees iron-ore, it requires 15s warmup before producing ingots
    expect(smelter.status).toBe('powering up');
    sim.stepSimulation(5.0);
    // At 5s, still warming up, 0 ingots produced
    expect(smelter.outputBufferCount).toBe(0);

    // Warmup is 15s, cycle is 2s.
    // 5s passed. Advance 12.5s (total 17.5s) -> warmup finishes (at 15s) and first ingot finishes (at 17s)
    sim.stepSimulation(12.5);
    expect(smelter.outputBufferCount).toBeGreaterThan(0);
    expect(smelter.lastItemType).toBe('iron-ingot');

    // Smelt remaining 2 iron ores (2 * 2.0s = 4.0s)
    sim.stepSimulation(4.5);
    // 3 iron ores consumed, next item in queue is copper-ore
    expect(smelter.inputQueue[0]).toBe('copper-ore');
    expect(smelter.outputBufferCount).toBe(3);

    // Because output still has iron ingots, it CANNOT start smelting copper yet
    sim.stepSimulation(1.0);
    expect(smelter.status).toContain('switching to smelting copper-ore');
    // Progress should not advance to produce copper ingot while iron ingots are in output
    expect(smelter.lastItemType).toBe('iron-ingot');

    // Now drain output buffer to 0
    smelter.outputBufferCount = 0;

    // After output is empty, it must wait 15s to switch over
    sim.stepSimulation(7.0);
    expect(smelter.status).toContain('switching to smelting copper-ore');
    expect(smelter.outputBufferCount).toBe(0);

    // Advance remaining 8.0s switchover + 2.0s cycle = 10.5s -> starts smelting copper!
    sim.stepSimulation(10.5);
    expect(smelter.outputBufferCount).toBeGreaterThan(0);
    expect(smelter.lastItemType).toBe('copper-ingot');
  });

  it('simulates full production flow: Miner (iron-ore) -> Smelter (iron-ingot) -> Constructor (iron-plate) -> Container', () => {
    const sim = new QFactorySimManager();
    const miner = sim.placeBuilding('miner', -12, 0, 0, true);
    const smelter = sim.placeBuilding('smelter', -4, 0, 0);
    const constructorBld = sim.placeBuilding('constructor', 4, 0, 0);
    const container = sim.placeBuilding('container', 12, 0, 0);

    sim.connectBelt(miner.id, smelter.id);
    sim.connectBelt(smelter.id, constructorBld.id);
    sim.connectBelt(constructorBld.id, container.id);

    // Step simulation for 25 seconds in 0.25s increments
    for (let i = 0; i < 100; i++) {
      sim.stepSimulation(0.25);
    }

    const updatedContainer = sim.getBuildingById(container.id)!;
    expect(updatedContainer.storedCount).toBeGreaterThan(0);
    expect(updatedContainer.lastItemType).toBe('iron-plate');
  });

  it('meets 60 FPS performance budget when simulating 400 buildings and 300 Mk.1 belts over 60 ticks', () => {
    const sim = new QFactorySimManager();
    for (let chain = 0; chain < 100; chain++) {
      const z = chain * 6;
      const m = sim.placeBuilding('miner', -18, z, 0, true);
      const s = sim.placeBuilding('smelter', -6, z, 0, true);
      const c = sim.placeBuilding('constructor', 6, z, 0, true);
      const st = sim.placeBuilding('container', 18, z, 0, true);
      sim.connectBelt(m.id, s.id);
      sim.connectBelt(s.id, c.id);
      sim.connectBelt(c.id, st.id);
    }

    const start = performance.now();
    for (let tick = 0; tick < 60; tick++) {
      sim.stepSimulation(0.05);
    }
    const elapsedMs = performance.now() - start;
    expect(elapsedMs).toBeLessThan(60);
  });

  it('enforces terrain placement rules: miners only on resource nodes, non-miners only on open ground', () => {
    const sim = new QFactorySimManager();
    const ironNode = sim.getResourceNodes().find((n) => n.oreType === 'iron-ore')!;
    const copperNode = sim.getResourceNodes().find((n) => n.oreType === 'copper-ore')!;

    // 1. Miner on open ground is rejected
    const openGroundCheck = sim.validatePlacement('miner', 0, 0);
    expect(openGroundCheck.valid).toBe(false);
    expect(openGroundCheck.reason).toMatch(/cannot be placed on open ground/i);
    expect(() => sim.placeBuilding('miner', 0, 0)).toThrow(/cannot be placed on open ground/i);

    // 2. Miner on Iron node succeeds and auto-sets producesItem to iron-ore
    const ironMinerCheck = sim.validatePlacement('miner', ironNode.x, ironNode.z);
    expect(ironMinerCheck.valid).toBe(true);
    const ironMiner = sim.placeBuilding('miner', ironNode.x, ironNode.z);
    expect(ironMiner.producesItem).toBe('iron-ore');

    // 3. Miner on Copper node succeeds and auto-sets producesItem to copper-ore
    const copperMiner = sim.placeBuilding('miner', copperNode.x, copperNode.z);
    expect(copperMiner.producesItem).toBe('copper-ore');

    // 4. Non-miner (smelter, constructor, container) on mine node is rejected
    const smelterOnMineCheck = sim.validatePlacement('smelter', ironNode.x, ironNode.z);
    expect(smelterOnMineCheck.valid).toBe(false);
    expect(smelterOnMineCheck.reason).toMatch(/cannot be placed on a resource mine node/i);
    expect(() => sim.placeBuilding('smelter', ironNode.x, ironNode.z)).toThrow(/cannot be placed on a resource mine node/i);

    // 5. Non-miner on open ground succeeds
    const smelterOnOpenCheck = sim.validatePlacement('smelter', 0, 0);
    expect(smelterOnOpenCheck.valid).toBe(true);
    const smelter = sim.placeBuilding('smelter', 0, 0);
    expect(smelter).toBeDefined();
  });

  it('supports 1x1x2 Belt Connector and 2x2x2 Splitters & Mergers with 100m max belt constraint', () => {
    const sim = new QFactorySimManager();
    const ironNode = sim.getResourceNodes().find((n) => n.oreType === 'iron-ore')!;
    const miner = sim.placeBuilding('miner', ironNode.x, ironNode.z);

    // Splitter & Merger are 2x2x2
    const splitter = sim.placeBuilding('splitter', 10, 10);
    expect(splitter.width).toBe(2);
    expect(splitter.depth).toBe(2);
    expect(splitter.height).toBe(2);

    const merger = sim.placeBuilding('merger', 10, 16);
    expect(merger.width).toBe(2);
    expect(merger.depth).toBe(2);
    expect(merger.height).toBe(2);

    // Connector is 1x1x2 block
    const connector = sim.placeBuilding('connector', 0, 0);
    expect(connector.width).toBe(1);
    expect(connector.depth).toBe(1);
    expect(connector.height).toBe(2);
    expect(connector.inputPorts.length).toBe(1);
    expect(connector.outputPorts.length).toBe(1);

    // Connecting belt within 100m succeeds
    const belt1 = sim.connectBelt(miner.id, connector.id);
    expect(belt1.lengthMeters).toBeLessThanOrEqual(100);

    // Connecting belt over 100m fails fast
    const farBox = sim.placeBuilding('container', 120, 120);
    expect(() => sim.connectBelt(connector.id, farBox.id)).toThrow(/exceeds maximum.*100 meters/i);
  });
});
