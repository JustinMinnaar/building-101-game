import { QFactorySupportPoleSpan } from './QFactoryTypes';

export class QFactoryFloorPoleMath {
  public static readonly LEVEL_HEIGHT_METERS = 8.5;

  public static computeDeckElevation(levelIndex: number): number {
    return Math.max(0, Math.round(levelIndex)) * this.LEVEL_HEIGHT_METERS;
  }

  public static computeSupportPoles(
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    deckBottomY: number
  ): QFactorySupportPoleSpan[] {
    if (deckBottomY <= 0.01) return [];
    const insetX = Math.min(1.4, (maxX - minX) * 0.25);
    const insetZ = Math.min(1.4, (maxZ - minZ) * 0.25);
    const xCoords = this.sampleSpan(minX + insetX, maxX - insetX, 18);
    const zCoords = this.sampleSpan(minZ + insetZ, maxZ - insetZ, 18);

    const poles: QFactorySupportPoleSpan[] = [];
    for (let xi = 0; xi < xCoords.length; xi++) {
      for (let zi = 0; zi < zCoords.length; zi++) {
        const isEdge = xi === 0 || xi === xCoords.length - 1 || zi === 0 || zi === zCoords.length - 1;
        if (isEdge) {
          poles.push({ x: xCoords[xi], z: zCoords[zi], bottomY: 0, topY: deckBottomY });
        }
      }
    }
    return poles;
  }

  private static sampleSpan(start: number, end: number, maxStep: number): number[] {
    const length = Math.max(0, end - start);
    if (length < 1.5) return [(start + end) * 0.5];
    const segments = Math.max(1, Math.ceil(length / maxStep));
    const coords: number[] = [];
    for (let i = 0; i <= segments; i++) {
      coords.push(Number((start + (length * i) / segments).toFixed(2)));
    }
    return coords;
  }
}
