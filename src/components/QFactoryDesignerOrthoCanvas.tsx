import React, { useRef, useState } from 'react';
import {
  QFactoryCustomMachineSpec,
  QFactoryCustomMachineStore,
} from '../core/QFactoryCustomMachineStore';

export interface QFactoryDesignerOrthoCanvasProps {
  spec: QFactoryCustomMachineSpec;
  selectedCubeId: string | null;
  selectedAddonId: string | null;
  clickAddCubeMode: boolean;
  onSelectCube: (id: string | null) => void;
  onSelectAddon: (id: string | null) => void;
  onChangeSpec: (next: QFactoryCustomMachineSpec) => void;
}

const SCALE = 20; // 20px per meter
const HALF_W = 160;
const HALF_H = 140;

export const QFactoryDesignerOrthoCanvas: React.FC<QFactoryDesignerOrthoCanvasProps> = ({
  spec,
  selectedCubeId,
  selectedAddonId,
  clickAddCubeMode,
  onSelectCube,
  onSelectAddon,
  onChangeSpec,
}) => {
  const [plane, setPlane] = useState<'top-xz' | 'side-xy'>('top-xz');
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{
    kind: 'move-cube' | 'resize-cube' | 'move-addon';
    id: string;
    startX: number;
    startY: number;
    origA: number;
    origB: number;
    origWA: number;
    origWB: number;
  } | null>(null);

  const toWorld = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { a: 0, b: 0 };
    const px = ((clientX - rect.left) / rect.width) * (HALF_W * 2) - HALF_W;
    const py = ((clientY - rect.top) / rect.height) * (HALF_H * 2) - HALF_H;
    if (plane === 'top-xz') return { a: Math.round((px / SCALE) * 2) / 2, b: Math.round((py / SCALE) * 2) / 2 };
    return { a: Math.round((px / SCALE) * 2) / 2, b: Math.max(0.5, Math.round(((80 - py) / SCALE) * 2) / 2) };
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!clickAddCubeMode || e.target !== svgRef.current) return;
    const { a, b } = toWorld(e.clientX, e.clientY);
    const next = QFactoryCustomMachineStore.addFrameCube(
      spec,
      plane === 'top-xz'
        ? { x: a, y: 2.5, z: b, w: 3.5, h: 4.0, d: 3.5, colorHex: '#fed7aa' }
        : { x: a, y: b, z: 0, w: 3.5, h: 3.0, d: 3.5, colorHex: '#fed7aa' }
    );
    onChangeSpec(next);
    onSelectCube(next.frameCubes[next.frameCubes.length - 1].id);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = (e.clientX - d.startX) / SCALE;
    const dy = (e.clientY - d.startY) / SCALE;

    if (d.kind === 'move-cube') {
      const nextA = Math.round((d.origA + dx) * 2) / 2;
      const nextB = plane === 'top-xz' ? Math.round((d.origB + dy) * 2) / 2 : Math.max(1, Math.round((d.origB - dy) * 2) / 2);
      onChangeSpec(
        QFactoryCustomMachineStore.updateFrameCube(
          spec,
          d.id,
          plane === 'top-xz' ? { x: nextA, z: nextB } : { x: nextA, y: nextB }
        )
      );
    } else if (d.kind === 'resize-cube') {
      const nw = Math.max(1.5, Math.round((d.origWA + dx * 2) * 2) / 2);
      const nb = Math.max(1.5, Math.round((d.origWB + (plane === 'top-xz' ? dy : -dy) * 2) * 2) / 2);
      onChangeSpec(
        QFactoryCustomMachineStore.updateFrameCube(
          spec,
          d.id,
          plane === 'top-xz' ? { w: nw, d: nb } : { w: nw, h: nb }
        )
      );
    } else if (d.kind === 'move-addon') {
      const nextA = Math.round((d.origA + dx) * 4) / 4;
      const nextB = plane === 'top-xz' ? Math.round((d.origB + dy) * 4) / 4 : Math.max(0.4, Math.round((d.origB - dy) * 4) / 4);
      onChangeSpec(
        QFactoryCustomMachineStore.updateAddon(
          spec,
          d.id,
          plane === 'top-xz' ? { x: nextA, z: nextB } : { x: nextA, y: nextB }
        )
      );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setPlane('top-xz')}
            style={{ ...tabBtn, background: plane === 'top-xz' ? '#d97706' : '#3b2818' }}
          >
            📐 Top Footprint (X / Z)
          </button>
          <button
            onClick={() => setPlane('side-xy')}
            style={{ ...tabBtn, background: plane === 'side-xy' ? '#d97706' : '#3b2818' }}
          >
            📏 Side Elevation (X / Height)
          </button>
        </div>
        <span style={{ fontSize: 11, color: '#fde68a' }}>
          {clickAddCubeMode ? '✨ Click empty grid to stamp a new Cube!' : 'Drag Cube to move • Drag corner square to resize'}
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`${-HALF_W} ${-HALF_H} ${HALF_W * 2} ${HALF_H * 2}`}
        onClick={handleCanvasClick}
        onPointerMove={onPointerMove}
        onPointerUp={() => { dragRef.current = null; }}
        style={{
          flex: 1,
          width: '100%',
          background: '#1f1610',
          border: '1.5px solid #926842',
          borderRadius: 12,
          cursor: clickAddCubeMode ? 'copy' : 'default',
          userSelect: 'none',
        }}
      >
        {/* 2m Craft Grid */}
        {[-6, -4, -2, 0, 2, 4, 6].map((m) => (
          <g key={m}>
            <line x1={m * SCALE} y1={-HALF_H} x2={m * SCALE} y2={HALF_H} stroke="#3b2a1e" strokeWidth={m === 0 ? 1.5 : 0.7} />
            <line x1={-HALF_W} y1={m * SCALE} x2={HALF_W} y2={m * SCALE} stroke="#3b2a1e" strokeWidth={m === 0 ? 1.5 : 0.7} />
          </g>
        ))}

        {/* Front-Side Indicator in Top View */}
        {plane === 'top-xz' && (
          <text
            x={spec.frontSide === '+X' ? 118 : spec.frontSide === '-X' ? -146 : -24}
            y={spec.frontSide === '+Z' ? 128 : spec.frontSide === '-Z' ? -118 : 4}
            fill="#facc15"
            fontSize={11}
            fontWeight={800}
          >
            ★ FRONT ({spec.frontSide})
          </text>
        )}

        {/* Frame Cubes */}
        {spec.frameCubes.map((c) => {
          const cx = c.x * SCALE;
          const cy = plane === 'top-xz' ? c.z * SCALE : 80 - c.y * SCALE;
          const cw = c.w * SCALE;
          const ch = (plane === 'top-xz' ? c.d : c.h) * SCALE;
          const sel = c.id === selectedCubeId;
          return (
            <g key={c.id}>
              <rect
                x={cx - cw / 2}
                y={cy - ch / 2}
                width={cw}
                height={ch}
                rx={5}
                fill={c.colorHex}
                fillOpacity={0.78}
                stroke={sel ? '#fef08a' : '#78350f'}
                strokeWidth={sel ? 2.6 : 1.4}
                style={{ cursor: 'grab' }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onSelectCube(c.id);
                  onSelectAddon(null);
                  dragRef.current = {
                    kind: 'move-cube', id: c.id, startX: e.clientX, startY: e.clientY,
                    origA: c.x, origB: plane === 'top-xz' ? c.z : c.y, origWA: c.w, origWB: plane === 'top-xz' ? c.d : c.h,
                  };
                }}
              />
              {/* Bottom-Right Resize Handle */}
              <rect
                x={cx + cw / 2 - 6}
                y={cy + ch / 2 - 6}
                width={11}
                height={11}
                fill="#facc15"
                stroke="#1c1917"
                style={{ cursor: 'nwse-resize' }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onSelectCube(c.id);
                  dragRef.current = {
                    kind: 'resize-cube', id: c.id, startX: e.clientX, startY: e.clientY,
                    origA: c.x, origB: plane === 'top-xz' ? c.z : c.y, origWA: c.w, origWB: plane === 'top-xz' ? c.d : c.h,
                  };
                }}
              />
              {/* 1-Click Remove Badge when >1 cube */}
              {spec.frameCubes.length > 1 && (
                <g
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangeSpec(QFactoryCustomMachineStore.removeFrameCube(spec, c.id));
                  }}
                >
                  <circle cx={cx + cw / 2 - 2} cy={cy - ch / 2 + 2} r={7} fill="#dc2626" />
                  <text x={cx + cw / 2 - 5} y={cy - ch / 2 + 5} fill="#fff" fontSize={9} fontWeight={800}>×</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Draggable Add-on Pins */}
        {spec.addons.map((a) => {
          const ax = a.x * SCALE;
          const ay = plane === 'top-xz' ? a.z * SCALE : 80 - a.y * SCALE;
          const sel = a.id === selectedAddonId;
          return (
            <g
              key={a.id}
              style={{ cursor: 'grab' }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectAddon(a.id);
                onSelectCube(null);
                dragRef.current = {
                  kind: 'move-addon', id: a.id, startX: e.clientX, startY: e.clientY,
                  origA: a.x, origB: plane === 'top-xz' ? a.z : a.y, origWA: 1, origWB: 1,
                };
              }}
            >
              <circle cx={ax} cy={ay} r={sel ? 9 : 7} fill={a.colorHex} stroke={sel ? '#fff' : '#1c1917'} strokeWidth={2} />
              <text x={ax + 10} y={ay + 3} fill="#fef3c7" fontSize={9} fontWeight={700}>{a.type}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const tabBtn: React.CSSProperties = {
  color: '#fffbeb',
  border: '1px solid #926842',
  borderRadius: 7,
  padding: '5px 10px',
  fontSize: 11.5,
  fontWeight: 700,
  cursor: 'pointer',
};
