import { QFactoryCustomMachineStore } from './QFactoryCustomMachineStore';
import { QFactorySimManager } from './QFactorySimManager';

export class QFactoryStarterLineBuilder {
  public static build(sim: QFactorySimManager, centerZ = 0): void {
    sim.placeFoundationRect(-16, centerZ - 6, 32, centerZ + 6, 1, 0);
    const miner = sim.placeBuilding('miner', -24, centerZ, 0, true);
    const smelter = sim.placeBuilding('smelter', -8, centerZ, 0);
    const constructorBld = sim.placeBuilding('constructor', 8, centerZ, 0);
    const container = sim.placeBuilding('container', 24, centerZ, 0);
    sim.connectBelt(miner.id, smelter.id);
    sim.connectBelt(smelter.id, constructorBld.id);
    sim.connectBelt(constructorBld.id, container.id);
  }

  public static buildToyAndSweetShowcase(sim: QFactorySimManager): void {
    sim.placeFoundationRect(-30, -34, 48, -1, 1, 0);
    sim.placeFoundationRect(-30, 1, 48, 36, 1, 0);

    const sugarHarvester = sim.placeBuilding('sugar-harvester', -38, -22, 0);
    const colorExtractor = sim.placeBuilding('color-extractor', -38, -8, 0);
    const sweetMaker = sim.placeBuilding('sweet-maker', -10, -15, 0, true);
    sim.selectMachineMode(sweetMaker.id, 'lollipop-mode');
    sim.connectBelt(sugarHarvester.id, sweetMaker.id, 'curved');
    sim.connectBelt(colorExtractor.id, sweetMaker.id, 'curved');

    const woodHarvester = sim.placeBuilding('sugar-harvester', -38, 10, 0);
    const brassHarvester = sim.placeBuilding('sugar-harvester', -38, 24, 0);
    const wheelLathe = sim.placeBuilding('part-lathe', -18, 10, 0, true);
    sim.selectMachineMode(wheelLathe.id, 'wheel-mode');
    const cogLathe = sim.placeBuilding('part-lathe', -18, 24, 0, true);
    sim.selectMachineMode(cogLathe.id, 'cog-mode');
    const toyAssembler = sim.placeBuilding('toy-assembler', 2, 17, 0, true);
    sim.selectMachineMode(toyAssembler.id, 'train-mode');

    sim.connectBelt(woodHarvester.id, wheelLathe.id);
    sim.connectBelt(brassHarvester.id, cogLathe.id);
    sim.connectBelt(wheelLathe.id, toyAssembler.id, 'curved');
    sim.connectBelt(cogLathe.id, toyAssembler.id, 'curved');

    const giftWrapper = sim.placeBuilding('gift-wrapper', 22, 2, 0, true);
    sim.selectMachineMode(giftWrapper.id, 'deluxe-gift-mode');
    const giftHamper = sim.placeBuilding('container', 38, 2, 0, true);

    sim.connectBelt(toyAssembler.id, giftWrapper.id, 'curved');
    sim.connectBelt(sweetMaker.id, giftWrapper.id, 'curved');
    sim.connectBelt(giftWrapper.id, giftHamper.id);
  }

  public static buildMultiLevelSweetToyShowcase(sim: QFactorySimManager): void {
    QFactoryCustomMachineStore.ensurePresetsRegistered();
    // Ground corrugated-cardboard decks
    sim.placeFoundationRect(-32, -40, 14, -2, 1, 0);
    sim.placeFoundationRect(-32, 2, 14, 34, 1, 0);
    // Pole-supported 2nd-Level Mezzanine Deck for Finale Assembly & Gift Wrapping!
    sim.placeFoundationRect(14, -18, 48, 22, 1, 1);

    // Wing 1: Coloured Goo Spring + Sugar -> Goo Spice Refinery & Swirl Sweet Maker
    const gooPump = sim.placeBuilding('color-extractor', -38, -36, 0);
    const spiceRefinery = sim.placeBuilding('goo-spice-refinery', -18, -30, 0, true);
    sim.selectMachineMode(spiceRefinery.id, 'goo-to-spice');
    const sugarHarvester = sim.placeBuilding('sugar-harvester', -38, -22, 0);
    const sweetMaker = sim.placeBuilding('sweet-maker', -2, -20, 0, true);
    sim.selectMachineMode(sweetMaker.id, 'lollipop-mode');

    sim.connectBelt(gooPump.id, spiceRefinery.id, 'curved');
    sim.connectBelt(sugarHarvester.id, sweetMaker.id, 'curved');
    sim.connectBelt(spiceRefinery.id, sweetMaker.id, 'curved');

    // Wing 2: Timber Wheels + Brass Cogs -> Wonder-Toy Assembler
    const woodHarvester = sim.placeBuilding('sugar-harvester', -38, 10, 0);
    const brassHarvester = sim.placeBuilding('sugar-harvester', -38, 24, 0);
    const wheelLathe = sim.placeBuilding('part-lathe', -18, 10, 0, true);
    sim.selectMachineMode(wheelLathe.id, 'wheel-mode');
    const cogLathe = sim.placeBuilding('part-lathe', -18, 24, 0, true);
    sim.selectMachineMode(cogLathe.id, 'cog-mode');
    const toyAssembler = sim.placeBuilding('toy-assembler', 0, 16, 0, true);
    sim.selectMachineMode(toyAssembler.id, 'train-mode');

    sim.connectBelt(woodHarvester.id, wheelLathe.id);
    sim.connectBelt(brassHarvester.id, cogLathe.id);
    sim.connectBelt(wheelLathe.id, toyAssembler.id, 'curved');
    sim.connectBelt(cogLathe.id, toyAssembler.id, 'curved');

    // Level 2 Mezzanine: Ramped belts climb up to Ribbon Gift Wrapper & Gift Hamper!
    const giftWrapper = sim.placeBuilding('gift-wrapper', 24, 2, 0, true);
    sim.selectMachineMode(giftWrapper.id, 'deluxe-gift-mode');
    const giftHamper = sim.placeBuilding('container', 40, 2, 0, true);

    sim.connectBelt(toyAssembler.id, giftWrapper.id, 'curved');
    sim.connectBelt(sweetMaker.id, giftWrapper.id, 'curved');
    sim.connectBelt(giftWrapper.id, giftHamper.id);
  }

  public static buildSmartBrainToyShowcase(sim: QFactorySimManager): void {
    QFactoryCustomMachineStore.ensurePresetsRegistered();
    sim.placeFoundationRect(-32, -38, 14, 34, 1, 0);
    // Pole-supported 2nd-Level Carnival "Toy-Smarts" Awakening Deck!
    sim.placeFoundationRect(14, -20, 48, 24, 1, 1);

    // Wing 1: Ruby Coloured Goo -> Toy-Smarts Curiosity Brains!
    const rubyGooPump = sim.placeBuilding('color-extractor', -38, -36, 0);
    const brainMoulder = sim.placeBuilding('smart-brain-stamper', -6, -18, 0, true);
    sim.selectMachineMode(brainMoulder.id, 'craft-toy-brain');
    sim.connectBelt(rubyGooPump.id, brainMoulder.id, 'curved');

    // Wing 2: Timber + Brass -> Toy Trains
    const woodHarvester = sim.placeBuilding('sugar-harvester', -38, 10, 0);
    const brassHarvester = sim.placeBuilding('sugar-harvester', -38, 24, 0);
    const wheelLathe = sim.placeBuilding('part-lathe', -18, 10, 0, true);
    sim.selectMachineMode(wheelLathe.id, 'wheel-mode');
    const cogLathe = sim.placeBuilding('part-lathe', -18, 24, 0, true);
    sim.selectMachineMode(cogLathe.id, 'cog-mode');
    const toyAssembler = sim.placeBuilding('toy-assembler', -2, 16, 0, true);
    sim.selectMachineMode(toyAssembler.id, 'train-mode');

    sim.connectBelt(woodHarvester.id, wheelLathe.id);
    sim.connectBelt(brassHarvester.id, cogLathe.id);
    sim.connectBelt(wheelLathe.id, toyAssembler.id, 'curved');
    sim.connectBelt(cogLathe.id, toyAssembler.id, 'curved');

    // Level 2 Mezzanine: Toy-Smarts Brain + Toy Train -> Smart Talking Toy -> Wrapped Gift Box!
    const smartAwakener = sim.placeBuilding('smart-brain-stamper', 22, -2, 0, true);
    sim.selectMachineMode(smartAwakener.id, 'awaken-smart-toy');
    const giftWrapper = sim.placeBuilding('gift-wrapper', 38, -2, 0, true);
    sim.selectMachineMode(giftWrapper.id, 'express-gift-mode');

    sim.connectBelt(brainMoulder.id, smartAwakener.id, 'curved');
    sim.connectBelt(toyAssembler.id, smartAwakener.id, 'curved');
    sim.connectBelt(smartAwakener.id, giftWrapper.id, 'curved');
  }
}
