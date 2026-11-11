import { describe, it, expect } from 'vitest';
import { QFactoryBeltMath } from '../core/QFactoryBeltMath';
import { QFactoryCustomMachineStore } from '../core/QFactoryCustomMachineStore';
import { QFactoryEconomyManager } from '../core/QFactoryEconomyManager';
import { QFactorySimManager } from '../core/QFactorySimManager';
import { QFactoryTeddyController } from '../core/QFactoryTeddyController';

describe('Machine Editor Cubes/Addons, Multi-Level Cardboard Floors & Poles, Economy & Tunnel Belts', () => {
  it('creates, resizes, adds addons/belt-holes/wire-connectors, marks front side, and registers a Custom Machine into the live sim', () => {
    const draft = QFactoryCustomMachineStore.createBlankDraft('custom-goo-baker', 'Custom Goo Spice Baker');
    expect(draft.frameCubes.length).toBeGreaterThanOrEqual(1);
    expect(draft.frontSide).toBe('+Z');

    // Add a second frame cube & resize the base cube
    const withCube = QFactoryCustomMachineStore.addFrameCube(draft, {
      x: 0, y: 5.5, z: 0, w: 5, h: 2, d: 5, colorHex: '#fb7185',
    });
    expect(withCube.frameCubes.length).toBe(draft.frameCubes.length + 1);

    const resized = QFactoryCustomMachineStore.updateFrameCube(withCube, withCube.frameCubes[0].id, {
      w: 9, h: 5, d: 8,
    });
    expect(resized.frameCubes[0].w).toBe(9);

    // Add gears, robot-stamper, wire, light, button, and lever add-ons
    let decorated = QFactoryCustomMachineStore.addAddon(resized, 'gear', { x: 1.5, y: 3.5, z: -2.0 });
    decorated = QFactoryCustomMachineStore.addAddon(decorated, 'robot-stamper', { x: 0, y: 2.2, z: 0 });
    decorated = QFactoryCustomMachineStore.addAddon(decorated, 'lever', { x: 3.8, y: 1.5, z: 3.8 });
    decorated = QFactoryCustomMachineStore.addAddon(decorated, 'light', { x: 0, y: 6.8, z: 0 });
    expect(decorated.addons.length).toBeGreaterThanOrEqual(4);

    // Add belt in/out holes and wire in/out connectors + mark front side '-X'
    decorated = QFactoryCustomMachineStore.addConnector(decorated, 'wire-in', '-Z', -1.5, 2.5);
    decorated = QFactoryCustomMachineStore.addConnector(decorated, 'wire-out', '+Z', 1.5, 2.5);
    decorated = QFactoryCustomMachineStore.setFrontSide(decorated, '-X');
    expect(decorated.frontSide).toBe('-X');
    expect(decorated.connectors.some((c) => c.kind === 'wire-in')).toBe(true);
    expect(decorated.connectors.some((c) => c.kind === 'belt-in')).toBe(true);
    expect(decorated.connectors.some((c) => c.kind === 'belt-out')).toBe(true);

    // Register into live factory registry & place in QFactorySimManager
    QFactoryCustomMachineStore.saveAndRegister(decorated);
    const sim = new QFactorySimManager();
    const placed = sim.placeBuilding(decorated.id, 0, 0, 0, true);
    expect(placed.name).toBe('Custom Goo Spice Baker');
    expect(placed.inputPorts.length).toBeGreaterThanOrEqual(1);
    expect(placed.outputPorts.length).toBeGreaterThanOrEqual(1);
  });

  it('draws ground and pole-supported 2nd-level cardboard floors, places machines on Level 2, and links 3D sloped belts', () => {
    const sim = new QFactorySimManager();
    const groundDeck = sim.placeFoundationRect(-20, -12, 20, 12, 1, 0);
    expect(groundDeck.levelIndex).toBe(0);
    expect(groundDeck.topY).toBe(1);

    const upperDeck = sim.placeFoundationRect(-10, -10, 14, 10, 1, 1);
    expect(upperDeck.levelIndex).toBe(1);
    expect(upperDeck.topY).toBeGreaterThan(7);
    expect(upperDeck.poles.length).toBeGreaterThanOrEqual(4);

    // Place a machine on ground deck (-14, 0) and a machine on 2nd-level deck (4, 0)
    const lowerMachine = sim.placeBuilding('sweet-maker', -14, 0, 0, false, true);
    const upperMachine = sim.placeBuilding('gift-wrapper', 4, 0, 0, false, true);
    expect(lowerMachine.y).toBe(groundDeck.topY);
    expect(upperMachine.y).toBe(upperDeck.topY);

    // Connect conveyor belt climbing from Level 0 up to Level 1
    const rampBelt = sim.connectBelt(lowerMachine.id, upperMachine.id, 'curved');
    expect(rampBelt.endPoint.y).toBeGreaterThan(rampBelt.startPoint.y + 5);
  });

  it('tracks Cardboard, Clay, Metal, and Coloured Goo resources in QFactoryEconomyManager', () => {
    const econ = new QFactoryEconomyManager();
    const initial = econ.getResources();
    expect(initial.cardboard).toBeGreaterThan(0);
    expect(initial.clay).toBeGreaterThan(0);
    expect(initial.metal).toBeGreaterThan(0);
    expect(initial.coloredGoo).toBeGreaterThan(0);

    econ.spend({ cardboard: 20, clay: 15, metal: 10 });
    expect(econ.getResources().cardboard).toBe(initial.cardboard - 20);
    expect(econ.getResources().clay).toBe(initial.clay - 15);
    expect(econ.getResources().metal).toBe(initial.metal - 10);

    econ.addColoredGoo(12);
    expect(econ.getResources().coloredGoo).toBe(initial.coloredGoo + 12);
  });

  it('extends conveyor paths inside machine connector tunnels and scales items to appear out of and vanish into machines', () => {
    const pathInfo = QFactoryBeltMath.computeBeltPath(
      { x: -4, y: 1, z: 0 },
      { x: 6, y: 1, z: 0 },
      'default',
      0.85
    );
    // First point starts recessed inside the source machine (-4 - 0.85 = -4.85)
    expect(pathInfo.pathPoints[0].x).toBeLessThan(-4.5);
    // Final point ends recessed inside the target machine (6 + 0.85 = 6.85)
    expect(pathInfo.pathPoints[pathInfo.pathPoints.length - 1].x).toBeGreaterThan(6.5);

    const emerging = QFactoryBeltMath.computeTunnelItemScale(0.02);
    const midBelt = QFactoryBeltMath.computeTunnelItemScale(0.5);
    const vanishing = QFactoryBeltMath.computeTunnelItemScale(0.98);
    expect(emerging).toBeLessThan(0.5);
    expect(midBelt).toBe(1.0);
    expect(vanishing).toBeLessThan(0.5);
  });

  it('supports switching between multiple coloured Teddy-Bear player characters and Toy-Smarts vs Sweet-Toy theme packs', () => {
    const teddies = new QFactoryTeddyController();
    const squad = teddies.getSquad();
    expect(squad.length).toBeGreaterThanOrEqual(4);

    // Switch active player Teddy from Golden (0) to Berry-Pink (1) and Sky-Blue (2)
    teddies.selectActiveTeddy(2);
    expect(teddies.getActiveTeddyIndex()).toBe(2);
    teddies.stepMovement({ forward: 1, right: 0 }, 0.4);
    expect(teddies.getSquad()[2].walkPhase).toBeGreaterThan(0);

    // Theme pack switch in SimManager ('sweet-toy' <-> 'smart-brain-toys')
    const sim = new QFactorySimManager();
    sim.setThemePack('smart-brain-toys');
    expect(sim.getThemePack()).toBe('smart-brain-toys');
    sim.buildThemeShowcase();
    expect(sim.getBuildings().length).toBeGreaterThanOrEqual(6);
  });

  it('meets performance budget computing 500 tunnel belt paths & stepping multi-teddy patrol in < 25ms', () => {
    const teddies = new QFactoryTeddyController();
    const t0 = performance.now();
    for (let i = 0; i < 500; i++) {
      QFactoryBeltMath.computeBeltPath({ x: 0, y: 1, z: 0 }, { x: 14, y: 9.5, z: 6 }, 'curved', 0.85);
    }
    for (let tick = 0; tick < 60; tick++) {
      teddies.stepMovement({ forward: 1, right: 0.5 }, 0.016);
      teddies.stepCompanionPatrol(0.016);
    }
    expect(performance.now() - t0).toBeLessThan(25);
  });
});
