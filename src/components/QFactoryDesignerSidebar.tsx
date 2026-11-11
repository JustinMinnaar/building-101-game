import React, { useState } from 'react';
import {
  QFactoryConnectorKind,
  QFactoryCustomMachineSpec,
  QFactoryCustomMachineStore,
  QFactoryEditorAddonType,
  QFactoryFrontSide,
} from '../core/QFactoryCustomMachineStore';
import { QFactoryItemType } from '../core/QFactoryTypes';

export interface QFactoryDesignerSidebarProps {
  spec: QFactoryCustomMachineSpec;
  selectedCubeId: string | null;
  onChangeSpec: (next: QFactoryCustomMachineSpec) => void;
}

const ADDON_PALETTE: Array<{ type: QFactoryEditorAddonType; label: string; color: string }> = [
  { type: 'gear', label: '⚙️ Gear', color: '#8c8275' },
  { type: 'cog', label: '🏵️ Brass Cog', color: '#eab308' },
  { type: 'robot-stamper', label: '🦾 Stamper', color: '#64748b' },
  { type: 'wire', label: '〰️ Wire', color: '#ef4444' },
  { type: 'light', label: '🚨 Beacon', color: '#fb7185' },
  { type: 'button', label: '🔘 Button', color: '#38bdf8' },
  { type: 'lever', label: '🕹️ Lever', color: '#d97706' },
  { type: 'smokestack', label: '🏭 Stack', color: '#ca8a04' },
  { type: 'awning', label: '🎪 Awning', color: '#e11d48' },
];

const ITEM_CHOICES: Array<{ id: QFactoryItemType; label: string }> = [
  { id: 'rainbow-dye', label: '🌈 Coloured Goo' },
  { id: 'sugar-cube', label: '🍬 Sparkling Sugar' },
  { id: 'spice-pinch', label: '✨ Cinnamon & Star Spice' },
  { id: 'swirl-lollipop', label: '🍭 Swirl Lollipop' },
  { id: 'cog', label: '⚙️ Clockwork Cog' },
  { id: 'wheel', label: '🛞 Painted Wheel' },
  { id: 'toy-train', label: '🚂 Wooden Toy Train' },
  { id: 'toy-brain', label: '🧠 Toy-Smarts Brain' },
  { id: 'idea-bulb', label: '💡 Bright Idea Bulb' },
  { id: 'smart-teddy-toy', label: '🧸 Smart Talking Toy' },
  { id: 'gift-box', label: '🎁 Wrapped Gift Box' },
];

export const QFactoryDesignerSidebar: React.FC<QFactoryDesignerSidebarProps> = ({
  spec,
  selectedCubeId,
  onChangeSpec,
}) => {
  const [connFace, setConnFace] = useState<QFactoryFrontSide>('-X');
  const activeCube = spec.frameCubes.find((c) => c.id === selectedCubeId) ?? spec.frameCubes[0];
  const mode0 = spec.modes[0];

  const addConn = (kind: QFactoryConnectorKind) => {
    const spread = (spec.connectors.filter((c) => c.face === connFace).length % 3 - 1) * 1.4;
    onChangeSpec(QFactoryCustomMachineStore.addConnector(spec, kind, connFace, spread, kind.startsWith('belt') ? 1.0 : 2.4));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', paddingRight: 4, color: '#fffbeb' }}>
      {/* Machine Name & Front Side */}
      <div style={cardStyle}>
        <div style={secTitle}>🏷️ Machine Identity & Front Side</div>
        <input
          value={spec.name}
          onChange={(e) => onChangeSpec({ ...spec, name: e.target.value })}
          style={inputStyle}
          placeholder="Machine Name"
        />
        <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
          {(['+Z', '-Z', '+X', '-X'] as QFactoryFrontSide[]).map((side) => (
            <button
              key={side}
              onClick={() => onChangeSpec(QFactoryCustomMachineStore.setFrontSide(spec, side))}
              style={{ ...miniBtn, flex: 1, background: spec.frontSide === side ? '#ca8a04' : '#3b2818' }}
            >
              Front {side}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Cube Color & Cutaway */}
      {activeCube && (
        <div style={cardStyle}>
          <div style={secTitle}>🧊 Selected Cube ({activeCube.w}×{activeCube.h}×{activeCube.d}m)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="color"
              value={activeCube.colorHex}
              onChange={(e) => onChangeSpec(QFactoryCustomMachineStore.updateFrameCube(spec, activeCube.id, { colorHex: e.target.value }))}
            />
            <label style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(activeCube.cutawayFront)}
                onChange={(e) => onChangeSpec(QFactoryCustomMachineStore.updateFrameCube(spec, activeCube.id, { cutawayFront: e.target.checked }))}
              />
              Open Cutaway Window
            </label>
          </div>
        </div>
      )}

      {/* Add-ons Shelf */}
      <div style={cardStyle}>
        <div style={secTitle}>🦿 Add Machine Parts (Click to Add, Drag on Grid)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
          {ADDON_PALETTE.map((item) => (
            <button
              key={item.type}
              onClick={() => onChangeSpec(QFactoryCustomMachineStore.addAddon(spec, item.type, { x: 0, y: 3.6, z: 0 }, item.color))}
              style={miniBtn}
            >
              {item.label}
            </button>
          ))}
        </div>
        {spec.addons.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {spec.addons.map((a) => (
              <span key={a.id} style={chipStyle}>
                {a.type}
                <button
                  onClick={() => onChangeSpec(QFactoryCustomMachineStore.removeAddon(spec, a.id))}
                  style={chipClose}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Belt Tunnel Holes & Wire Connectors */}
      <div style={cardStyle}>
        <div style={secTitle}>🕳️ Belt Tunnel Holes & Wire Connectors</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          {(['-X', '+X', '+Z', '-Z'] as QFactoryFrontSide[]).map((f) => (
            <button key={f} onClick={() => setConnFace(f)} style={{ ...miniBtn, flex: 1, background: connFace === f ? '#0369a1' : '#3b2818' }}>
              Side {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          <button onClick={() => addConn('belt-in')} style={{ ...miniBtn, borderColor: '#10b981' }}>🟢 + Belt In Hole</button>
          <button onClick={() => addConn('belt-out')} style={{ ...miniBtn, borderColor: '#3b82f6' }}>🔵 + Belt Out Hole</button>
          <button onClick={() => addConn('wire-in')} style={{ ...miniBtn, borderColor: '#facc15' }}>⚡ + Wire In</button>
          <button onClick={() => addConn('wire-out')} style={{ ...miniBtn, borderColor: '#f97316' }}>🔌 + Wire Out</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {spec.connectors.map((c) => (
            <span key={c.id} style={chipStyle}>
              {c.kind} ({c.face})
              <button onClick={() => onChangeSpec(QFactoryCustomMachineStore.removeConnector(spec, c.id))} style={chipClose}>×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Recipe, Speed & Resource Cost */}
      <div style={cardStyle}>
        <div style={secTitle}>🧪 Recipe, Speed & Build Cost</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
          <label>
            Input Item
            <select
              value={mode0.inputs[0]?.itemType ?? 'rainbow-dye'}
              onChange={(e) => {
                const it = e.target.value as QFactoryItemType;
                const nextMode = { ...mode0, inputs: [{ itemType: it, count: 1 }] };
                onChangeSpec({ ...spec, modes: [nextMode, ...spec.modes.slice(1)] });
              }}
              style={inputStyle}
            >
              {ITEM_CHOICES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label>
            Output Item
            <select
              value={mode0.producesItem}
              onChange={(e) => {
                const it = e.target.value as QFactoryItemType;
                const nextMode = { ...mode0, producesItem: it, label: `Craft ${it}` };
                onChangeSpec({ ...spec, modes: [nextMode, ...spec.modes.slice(1)] });
              }}
              style={inputStyle}
            >
              {ITEM_CHOICES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginTop: 6, fontSize: 10.5 }}>
          <label>Clay: <b>{spec.buildCost.clay}</b></label>
          <label>Metal: <b>{spec.buildCost.metal}</b></label>
          <label>Cycle: <b>{mode0.cycleSec}s</b></label>
        </div>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = { background: 'rgba(46, 31, 19, 0.92)', border: '1px solid #78583a', borderRadius: 10, padding: 9 };
const secTitle: React.CSSProperties = { fontSize: 11.5, fontWeight: 800, color: '#fde68a', marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: '100%', background: '#1f1610', color: '#fffbeb', border: '1px solid #926842', borderRadius: 6, padding: '5px 7px', fontSize: 11.5, marginTop: 2 };
const miniBtn: React.CSSProperties = { background: '#3b2818', color: '#fff7ed', border: '1px solid #926842', borderRadius: 6, padding: '5px 6px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' };
const chipStyle: React.CSSProperties = { background: '#291d12', border: '1px solid #78583a', borderRadius: 12, padding: '2px 7px', fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 };
const chipClose: React.CSSProperties = { background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontWeight: 800, padding: 0 };
