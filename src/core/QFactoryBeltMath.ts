import { QFactoryBeltShape, QFactoryPoint3D } from './QFactoryTypes';

export class QFactoryBeltMath {
  public static computeBeltPath(
    start: QFactoryPoint3D,
    end: QFactoryPoint3D,
    shape: QFactoryBeltShape,
    tunnelInset = 0
  ): { pathPoints: QFactoryPoint3D[]; lengthMeters: number } {
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const dy = end.y - start.y;
    const horizLen = Math.hypot(dx, dz);
    const directLen3D = Math.max(1, Math.hypot(horizLen, dy));

    if (shape === 'straight' && tunnelInset <= 0) {
      return { pathPoints: [{ ...start }, { ...end }], lengthMeters: directLen3D };
    }

    let corePts: QFactoryPoint3D[];
    let lengthFactor = 1.08;

    if (shape === 'straight') {
      corePts = [{ ...start }, { ...end }];
      lengthFactor = 1.0;
    } else if (shape === 'curved') {
      const p1: QFactoryPoint3D = { x: start.x + dx * 0.45, y: start.y, z: start.z };
      const p2: QFactoryPoint3D = { x: start.x + dx * 0.78, y: (start.y + end.y) * 0.5, z: start.z + dz * 0.45 };
      const p3: QFactoryPoint3D = { x: end.x, y: end.y, z: start.z + dz * 0.88 };
      corePts = [{ ...start }, p1, p2, p3, { ...end }];
      lengthFactor = 1.22;
    } else {
      const p1: QFactoryPoint3D = { x: start.x + dx * 0.35, y: start.y, z: start.z };
      const p2: QFactoryPoint3D = { x: end.x - dx * 0.35, y: end.y, z: end.z };
      corePts = [];
      const samples = 8;
      for (let i = 0; i <= samples; i++) {
        corePts.push(this.sampleCubicBezier(start, p1, p2, end, i / samples));
      }
    }

    if (tunnelInset > 0) {
      corePts = this.withTunnelEnds(corePts, tunnelInset);
    }

    return { pathPoints: corePts, lengthMeters: Math.max(2, directLen3D * lengthFactor) };
  }

  public static withTunnelEnds(points: QFactoryPoint3D[], inset = 0.85): QFactoryPoint3D[] {
    if (points.length < 2 || inset <= 0) return points;
    const first = points[0];
    const second = points[1];
    const last = points[points.length - 1];
    const prev = points[points.length - 2];

    const sDx = second.x - first.x;
    const sDz = second.z - first.z;
    const sLen = Math.max(0.001, Math.hypot(sDx, sDz));

    const eDx = last.x - prev.x;
    const eDz = last.z - prev.z;
    const eLen = Math.max(0.001, Math.hypot(eDx, eDz));

    const recessedStart: QFactoryPoint3D = {
      x: first.x - (sDx / sLen) * inset,
      y: first.y,
      z: first.z - (sDz / sLen) * inset,
    };
    const recessedEnd: QFactoryPoint3D = {
      x: last.x + (eDx / eLen) * inset,
      y: last.y,
      z: last.z + (eDz / eLen) * inset,
    };
    return [recessedStart, ...points, recessedEnd];
  }

  public static computeTunnelItemScale(progress: number): number {
    const p = Math.max(0, Math.min(1, progress));
    const windowSpan = 0.12;
    if (p < windowSpan) {
      return 0.14 + (p / windowSpan) * 0.86;
    }
    if (p > 1 - windowSpan) {
      return 0.14 + ((1 - p) / windowSpan) * 0.86;
    }
    return 1.0;
  }

  public static interpolatePosition(pathPoints: QFactoryPoint3D[], progress: number): QFactoryPoint3D {
    const p = Math.max(0, Math.min(1, progress));
    if (pathPoints.length <= 1) return pathPoints[0] ?? { x: 0, y: 0, z: 0 };
    const totalSegments = pathPoints.length - 1;
    const scaled = p * totalSegments;
    const segIdx = Math.min(totalSegments - 1, Math.floor(scaled));
    const localT = scaled - segIdx;
    const p0 = pathPoints[segIdx];
    const p1 = pathPoints[segIdx + 1];
    return {
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT,
      z: p0.z + (p1.z - p0.z) * localT,
    };
  }

  private static sampleCubicBezier(
    p0: QFactoryPoint3D,
    p1: QFactoryPoint3D,
    p2: QFactoryPoint3D,
    p3: QFactoryPoint3D,
    t: number
  ): QFactoryPoint3D {
    const omt = 1 - t;
    const c0 = omt * omt * omt;
    const c1 = 3 * omt * omt * t;
    const c2 = 3 * omt * t * t;
    const c3 = t * t * t;
    return {
      x: c0 * p0.x + c1 * p1.x + c2 * p2.x + c3 * p3.x,
      y: c0 * p0.y + c1 * p1.y + c2 * p2.y + c3 * p3.y,
      z: c0 * p0.z + c1 * p1.z + c2 * p2.z + c3 * p3.z,
    };
  }
}
