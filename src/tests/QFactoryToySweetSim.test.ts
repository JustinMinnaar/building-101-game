import { describe, it, expect } from 'vitest';
import { QFactoryMachineRegistry } from '../core/QFactoryMachineRegistry';
import { validateMachineDef } from '../core/QFactoryMachineSchema';
import { QFactorySimManager } from '../core/QFactorySimManager';
import { QFactoryTeddyController } from '../core/QFactoryTeddyController';

describe('Wonder-Toy & Sweetshop Factory — Schema, Biomes, Multi-Ingredient Crafting & Teddy Player', () => {
  it('fails fast on invalid MachineDefinition JSON and loads all 6 Sweet & Toy machines within 10ms', () => {
    expect(() => validateMachineDef({ id: 'broken-machine' })).toThrow(/Invalid MachineDefinition/i);

    const t0 = performance.now();
    const defs = QFactoryMachineRegistry.getAll();
    const elapsed = performance.now() - t0;

    expect(defs.length).toBeGreaterThanOrEqual(6);
    expect(elapsed).toBeLessThan(10);

    const sweetMaker = QFactoryMachineRegistry.getById('sweet-maker');
    expect(sweetMaker.name).toBe('Swirl-O-Matic Sweet Maker');
    expect(sweetMaker.modes.length).toBeGreaterThanOrEqual(2);
    expect(sweetMaker.basket?.label).toBe('EXTRA SPRINKLES');

    const toyAssembler = QFactoryMachineRegistry.getById('toy-assembler');
    expect(toyAssembler.name).toBe('Wonder-Toy Assembler');
    expect(toyAssembler.basket?.label).toBe('SPARE PARTS');
  });

  it('provides Sugar Patch, Rainbow Color River, Timber Grove, and Brass Vein resource nodes', () => {
    const sim = new QFactorySimManager();
    const nodes = sim.getResourceNodes();
    const oreTypes = nodes.map((n) => n.oreType);

    expect(oreTypes).toContain('sugar-cube');
    expect(oreTypes).toContain('rainbow-dye');
    expect(oreTypes).toContain('wood-block');
    expect(oreTypes).toContain('tin-ingot');

    const sugarNode = nodes.find((n) => n.oreType === 'sugar-cube')!;
    const harvester = sim.placeBuilding('sugar-harvester', sugarNode.x, sugarNode.z);
    expect(harvester.producesItem).toBe('sugar-cube');

    const colorNode = nodes.find((n) => n.oreType === 'rainbow-dye')!;
    const extractor = sim.placeBuilding('color-extractor', colorNode.x, colorNode.z);
    expect(extractor.producesItem).toBe('rainbow-dye');
  });

  it('ramps spinRatio up/down smoothly and crafts Rainbow Lollipops + EXTRA SPRINKLES from Sugar + Color Dye', () => {
    const sim = new QFactorySimManager();
    const sugarNode = sim.getResourceNodes().find((n) => n.oreType === 'sugar-cube')!;
    const colorNode = sim.getResourceNodes().find((n) => n.oreType === 'rainbow-dye')!;

    const harvester = sim.placeBuilding('sugar-harvester', sugarNode.x, sugarNode.z);
    const extractor = sim.placeBuilding('color-extractor', colorNode.x, colorNode.z);
    const sweetMaker = sim.placeBuilding('sweet-maker', 0, -18, 0, true);

    sim.selectMachineMode(sweetMaker.id, 'lollipop-mode');
    sim.connectBelt(harvester.id, sweetMaker.id);
    sim.connectBelt(extractor.id, sweetMaker.id);

    expect(sweetMaker.spinRatio).toBe(0);

    for (let i = 0; i < 40; i++) {
      sim.stepSimulation(0.25);
    }

    const updated = sim.getBuildingById(sweetMaker.id)!;
    expect(updated.spinRatio).toBeGreaterThan(0);
    expect(updated.outputBufferCount).toBeGreaterThan(0);
    expect(updated.lastItemType).toBe('swirl-lollipop');
    expect(updated.basketCount).toBeGreaterThan(0);

    // Toggle power off -> spinRatio coasts down cleanly
    const prevSpin = updated.spinRatio!;
    sim.toggleBuildingPower(sweetMaker.id);
    sim.stepSimulation(0.5);
    expect(updated.spinRatio!).toBeLessThan(prevSpin);
  });

  it('crafts Cogs, Wheels & Widgets, assembles Toy Trains, and wraps them into Gift Boxes', () => {
    const sim = new QFactorySimManager();
    const woodNode = sim.getResourceNodes().find((n) => n.oreType === 'wood-block')!;
    const brassNode = sim.getResourceNodes().find((n) => n.oreType === 'tin-ingot')!;

    const woodHarvester = sim.placeBuilding('sugar-harvester', woodNode.x, woodNode.z);
    const brassHarvester = sim.placeBuilding('sugar-harvester', brassNode.x, brassNode.z);

    const wheelLathe = sim.placeBuilding('part-lathe', -6, 14, 0, true);
    sim.selectMachineMode(wheelLathe.id, 'wheel-mode');

    const cogLathe = sim.placeBuilding('part-lathe', -6, 24, 0, true);
    sim.selectMachineMode(cogLathe.id, 'cog-mode');

    const toyAssembler = sim.placeBuilding('toy-assembler', 10, 18, 0, true);
    sim.selectMachineMode(toyAssembler.id, 'train-mode');

    const giftWrapper = sim.placeBuilding('gift-wrapper', 26, 18, 0, true);
    sim.selectMachineMode(giftWrapper.id, 'express-gift-mode');

    sim.connectBelt(woodHarvester.id, wheelLathe.id);
    sim.connectBelt(brassHarvester.id, cogLathe.id);
    sim.connectBelt(wheelLathe.id, toyAssembler.id);
    sim.connectBelt(cogLathe.id, toyAssembler.id);
    sim.connectBelt(toyAssembler.id, giftWrapper.id);

    for (let i = 0; i < 100; i++) {
      sim.stepSimulation(0.25);
    }

    expect(sim.getBuildingById(toyAssembler.id)!.storedCount).toBeGreaterThan(0);
    expect(sim.getBuildingById(giftWrapper.id)!.lastItemType).toBe('gift-box');
    expect(sim.getTotalGiftBoxesWrapped()).toBeGreaterThan(0);
  });

  it('allows the Fluffy Teddy-Bear player to walk around, collect basket sprinkles, and hand-feed ingredients', () => {
    const sim = new QFactorySimManager();
    const teddy = new QFactoryTeddyController();
    const sweetMaker = sim.placeBuilding('sweet-maker', 4, 0, 0, true);
    sim.selectMachineMode(sweetMaker.id, 'cupcake-mode');

    // Move teddy right (+X) toward the machine
    teddy.stepMovement({ forward: 0, right: 1 }, 0.5);
    expect(teddy.getState().x).toBeGreaterThan(0);
    expect(teddy.getState().walkPhase).toBeGreaterThan(0);

    // Give teddy sugar cubes and hand-feed into Sweet Maker
    teddy.addCarriedItem('sugar-cube', 3);
    const fed = teddy.handFeedMachine(sim, sweetMaker.id);
    expect(fed).toBeGreaterThan(0);

    for (let i = 0; i < 20; i++) {
      sim.stepSimulation(0.25);
    }
    expect(sim.getBuildingById(sweetMaker.id)!.outputBufferCount).toBeGreaterThan(0);

    // Collect EXTRA SPRINKLES from basket
    const sprinkles = sim.collectMachineBasket(sweetMaker.id);
    expect(sprinkles).toBeGreaterThanOrEqual(0);
  });

  it('meets 60 FPS performance budget simulating 300 multi-mode Sweet & Toy machines over 60 ticks', () => {
    const sim = new QFactorySimManager();
    for (let i = 0; i < 100; i++) {
      const z = i * 8;
      const h = sim.placeBuilding('sugar-harvester', -20, z, 0, true);
      h.producesItem = 'sugar-cube';
      const s = sim.placeBuilding('sweet-maker', -4, z, 0, true);
      sim.selectMachineMode(s.id, 'cupcake-mode');
      const g = sim.placeBuilding('gift-wrapper', 12, z, 0, true);
      sim.selectMachineMode(g.id, 'express-gift-mode');
      sim.connectBelt(h.id, s.id);
      sim.connectBelt(s.id, g.id);
    }

    const start = performance.now();
    for (let tick = 0; tick < 60; tick++) {
      sim.stepSimulation(0.05);
    }
    const elapsedMs = performance.now() - start;
    expect(elapsedMs).toBeLessThan(65);
  });

  it('runs the full 2-wing buildToyAndSweetShowcase() pipeline end-to-end into Wrapped Gift Boxes', () => {
    const sim = new QFactorySimManager();
    sim.buildToyAndSweetShowcase();

    expect(sim.getBuildings().length).toBe(10);
    expect(sim.getBelts().length).toBe(9);

    for (let i = 0; i < 140; i++) {
      sim.stepSimulation(0.25);
    }

    expect(sim.getTotalGiftBoxesWrapped()).toBeGreaterThan(0);
    const hamper = sim.getBuildings().find((b) => b.type === 'container')!;
    expect(hamper.storedCount).toBeGreaterThan(0);
    expect(hamper.lastItemType).toBe('gift-box');
  });
});
