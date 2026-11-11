import React from 'react';
import { QFactoryResourceAmounts } from '../core/QFactoryEconomyManager';
import { QFactoryTeddyCharacter } from '../core/QFactoryTeddyController';
import { QFactoryThemePack, QFactoryVisualMode } from '../core/QFactoryTypes';

export interface QFactoryTopResourceBarProps {
  resources: QFactoryResourceAmounts;
  giftBoxes: number;
  sprinkles: number;
  floorLevel: number;
  themePack: QFactoryThemePack;
  visualMode: QFactoryVisualMode;
  squad: QFactoryTeddyCharacter[];
  activeTeddyIdx: number;
  statusMessage: string;
  rotationDeg: number;
  onRestock: () => void;
  onSelectFloorLevel: (level: number) => void;
  onSelectThemePack: (pack: QFactoryThemePack) => void;
  onSelectVisualMode: (mode: QFactoryVisualMode) => void;
  onSelectTeddy: (idx: number) => void;
  onOpenDesigner: () => void;
  onRotate: () => void;
  onRebuildShowcase: () => void;
  onClear: () => void;
}

export const QFactoryTopResourceBar: React.FC<QFactoryTopResourceBarProps> = ({
  resources,
  giftBoxes,
  sprinkles,
  floorLevel,
  themePack,
  visualMode,
  squad,
  activeTeddyIdx,
  statusMessage,
  rotationDeg,
  onRestock,
  onSelectFloorLevel,
  onSelectThemePack,
  onSelectVisualMode,
  onSelectTeddy,
  onOpenDesigner,
  onRotate,
  onRebuildShowcase,
  onClear,
}) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 14, right: 14, display: 'flex', flexDirection: 'column', gap: 6, pointerEvents: 'none', zIndex: 35 }}>
      {/* Row 1: Craft Resource Bar (Cardboard, Clay, Metal, Coloured Goo) + Machine Editor CTA */}
      <div style={barPanelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, fontWeight: 900, color: '#fde047' }}>
            {themePack === 'sweet-toy' ? '🧸 Sweetshop & Wonder-Toy Factory' : '🧠 Carnival Toy-Smarts & Curiosity Factory'}
          </span>
          <span style={resPill}>📦 Cardboard: <b>{resources.cardboard}</b></span>
          <span style={resPill}>🧱 Clay: <b>{resources.clay}</b></span>
          <span style={resPill}>🔩 Metal: <b>{resources.metal}</b></span>
          <span style={resPill}>🌈 Coloured Goo: <b style={{ color: '#38bdf8' }}>{resources.coloredGoo}</b></span>
          <span style={resPill}>🎁 Gifts: <b style={{ color: '#fb7185' }}>{giftBoxes}</b></span>
          <span style={resPill}>✨ Basket Treats: <b style={{ color: '#fde047' }}>{sprinkles}</b></span>
          <button onClick={onRestock} style={{ ...pillBtn, background: '#14532d', borderColor: '#4ade80' }}>+ Restock</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={onOpenDesigner} style={{ ...pillBtn, background: '#7c2d12', borderColor: '#fb923c', fontSize: 12 }}>
            🛠️ Machine Editor
          </button>
          <button onClick={onRotate} style={pillBtn}>Rotate [R]: {rotationDeg}°</button>
          <button onClick={onRebuildShowcase} style={{ ...pillBtn, background: '#1e3a8a', borderColor: '#60a5fa' }}>
            2-Level Showcase
          </button>
          <button onClick={onClear} style={{ ...pillBtn, background: '#7f1d1d', borderColor: '#f87171' }}>Clear</button>
        </div>
      </div>

      {/* Row 2: Floor Level + Theme Pack + Art Style Demo Switch + Coloured Teddy Player Switcher */}
      <div style={{ ...barPanelStyle, padding: '5px 12px', fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Multi-Level Deck Selector */}
          <div style={groupWrap}>
            <span style={lbl}>Deck Level:</span>
            {[0, 1, 2].map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectFloorLevel(lvl)}
                style={{ ...miniSwitch, background: floorLevel === lvl ? '#d97706' : 'transparent' }}
              >
                {lvl === 0 ? '1st Ground' : `${lvl + 1}${lvl === 1 ? 'nd' : 'rd'} + Poles`}
              </button>
            ))}
          </div>

          {/* Theme World Switch */}
          <div style={groupWrap}>
            <span style={lbl}>Concept:</span>
            <button
              onClick={() => onSelectThemePack('sweet-toy')}
              style={{ ...miniSwitch, background: themePack === 'sweet-toy' ? '#db2777' : 'transparent' }}
            >
              🍭 Sweets & Toys
            </button>
            <button
              onClick={() => onSelectThemePack('smart-brain-toys')}
              style={{ ...miniSwitch, background: themePack === 'smart-brain-toys' ? '#7c3aed' : 'transparent' }}
            >
              🧠 Toy-Smarts Brains
            </button>
          </div>

          {/* Art Style Switcher */}
          <div style={groupWrap}>
            <span style={lbl}>Art Style:</span>
            {([
              ['detailed', '🎨 Clay + Cardboard'],
              ['anime', '✨ Anime Toon'],
              ['vinyl', '🍬 Glossy Vinyl'],
              ['blockout', '🧊 Blockout'],
            ] as const).map(([mode, title]) => (
              <button
                key={mode}
                onClick={() => onSelectVisualMode(mode)}
                style={{ ...miniSwitch, background: visualMode === mode ? '#0284c7' : 'transparent' }}
              >
                {title}
              </button>
            ))}
          </div>

          {/* Coloured Teddy Squad Picker */}
          <div style={groupWrap}>
            <span style={lbl}>Teddy [WASD]:</span>
            {squad.map((bear, idx) => (
              <button
                key={bear.id}
                onClick={() => onSelectTeddy(idx)}
                style={{
                  ...miniSwitch,
                  background: activeTeddyIdx === idx ? bear.furHex : 'transparent',
                  color: activeTeddyIdx === idx ? '#1c1917' : '#fffbeb',
                }}
              >
                🧸 {bear.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <span style={{ color: '#fed7aa', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 340 }}>
          {statusMessage}
        </span>
      </div>
    </div>
  );
};

const barPanelStyle: React.CSSProperties = {
  background: 'rgba(36, 24, 15, 0.93)',
  border: '1px solid #926842',
  borderRadius: 11,
  padding: '7px 14px',
  color: '#fffbeb',
  pointerEvents: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
  boxShadow: '0 8px 22px rgba(0,0,0,0.42)',
};

const resPill: React.CSSProperties = { background: 'rgba(69, 46, 28, 0.85)', border: '1px solid #78583a', borderRadius: 8, padding: '3px 8px', fontSize: 11.5 };
const pillBtn: React.CSSProperties = { background: '#452e1c', color: '#fffbeb', border: '1px solid #926842', borderRadius: 7, padding: '5px 9px', fontSize: 11, fontWeight: 800, cursor: 'pointer' };
const groupWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(20, 14, 9, 0.65)', padding: '2px 5px', borderRadius: 7, border: '1px solid #6b4f35' };
const lbl: React.CSSProperties = { color: '#fde68a', fontWeight: 700, marginRight: 3, fontSize: 10.5 };
const miniSwitch: React.CSSProperties = { border: 'none', borderRadius: 5, padding: '3px 7px', color: '#fffbeb', fontSize: 10.5, fontWeight: 800, cursor: 'pointer' };
