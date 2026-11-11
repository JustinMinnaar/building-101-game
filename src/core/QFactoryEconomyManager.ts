export interface QFactoryResourceAmounts {
  cardboard: number;
  clay: number;
  metal: number;
  coloredGoo: number;
}

export interface QFactoryBuildCost {
  cardboard?: number;
  clay?: number;
  metal?: number;
  coloredGoo?: number;
}

export class QFactoryEconomyManager {
  private _cardboard = 320;
  private _clay = 260;
  private _metal = 220;
  private _coloredGoo = 85;
  private _gooCarry = 0;

  public getResources(): QFactoryResourceAmounts {
    return {
      cardboard: Math.floor(this._cardboard),
      clay: Math.floor(this._clay),
      metal: Math.floor(this._metal),
      coloredGoo: Math.floor(this._coloredGoo),
    };
  }

  public canAfford(cost: QFactoryBuildCost): boolean {
    if (cost.cardboard && this._cardboard < cost.cardboard) return false;
    if (cost.clay && this._clay < cost.clay) return false;
    if (cost.metal && this._metal < cost.metal) return false;
    if (cost.coloredGoo && this._coloredGoo < cost.coloredGoo) return false;
    return true;
  }

  public spend(cost: QFactoryBuildCost): void {
    if (!this.canAfford(cost)) {
      throw new Error('Not enough Cardboard, Clay, Metal, or Coloured Goo! Click [+ Restock] or harvest more Goo.');
    }
    if (cost.cardboard) this._cardboard -= cost.cardboard;
    if (cost.clay) this._clay -= cost.clay;
    if (cost.metal) this._metal -= cost.metal;
    if (cost.coloredGoo) this._coloredGoo -= cost.coloredGoo;
  }

  public trySpendSandbox(cost: QFactoryBuildCost): boolean {
    if (!this.canAfford(cost)) return false;
    this.spend(cost);
    return true;
  }

  public addColoredGoo(amount: number): void {
    if (amount <= 0) return;
    this._coloredGoo += amount;
  }

  public tickPassiveHarvest(activeGooHarvesters: number, wrappedGiftsDelta: number, deltaSec: number): void {
    this._gooCarry += activeGooHarvesters * 1.4 * deltaSec;
    if (this._gooCarry >= 1) {
      const whole = Math.floor(this._gooCarry);
      this._gooCarry -= whole;
      this._coloredGoo += whole;
    }
    if (wrappedGiftsDelta > 0) {
      this._cardboard += wrappedGiftsDelta * 3;
      this._clay += wrappedGiftsDelta * 2;
      this._metal += wrappedGiftsDelta * 2;
    }
  }

  public restock(): void {
    this._cardboard += 200;
    this._clay += 160;
    this._metal += 140;
    this._coloredGoo += 80;
  }
}
