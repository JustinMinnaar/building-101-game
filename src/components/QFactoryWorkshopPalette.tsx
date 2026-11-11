import React from 'react';
import { QFactoryCustomMachineSpec } from '../core/QFactoryCustomMachineStore';
import { QFactoryToolId } from '../core/QFactoryTypes';

export interface QFactoryWorkshopPaletteProps {
  activeTool: QFactoryToolId;
  isSelectMode: boolean;
  floorLevel: number;
  customMachines: QFactoryCustomMachineSpec[];
  onPickTool: (toolId: QFactoryToolId, label: string) => void;
  onOpenDesigner: () => void;
}

const CORE_WORKSHOP_ITEMS: Array<{ toolId: QFactoryToolId; icon: string; label: string; hint: string; accent: string }> = [
  { toolId: 'foundation-1m', icon: '📦', label: 'Draw Cardboard Floor', hint: 'Drag Area (Ground or 2nd Level)', accent: '#d97706' },
  { toolId: 'support-pole', icon: '🪵', label: 'Deck Support Pole', hint: 'Cardboard Column for Upper Floor', accent: '#f59e0b' },
  { toolId: 'belt', icon: '➡️', label: 'Tunnel Roller Belt', hint: 'Enters & Leaves Machine Holes', accent: '#38bdf8' },
  { toolId: 'color-extractor', icon: '🌈', label: 'Coloured Goo Siphon', hint: 'Place on Goo Pool or Color River', accent: '#ec4899' },
  { toolId: 'sugar-harvester', icon: '🍬', label: 'Sugar & Wood Harvester', hint: 'Place on Sugar/Wood/Brass Patch', accent: '#f472b6' },
  { toolId: 'goo-spice-refinery', icon: '✨', label: 'Goo Sugar & Spice Mill', hint: 'Goo → Sugars & Star Spices', accent: '#fb923c' },
  { toolId: 'sweet-maker', icon: '🍭', label: 'Swirl-O-Matic Sweets', hint: 'Lollipops & Star Cupcakes', accent: '#fb7185' },
  { toolId: 'part-lathe', icon: '⚙️', label: 'Cog & Wheel Lathe', hint: 'Wheels, Cogs & Widgets', accent: '#facc15' },
  { toolId: 'toy-assembler', icon: '🚂', label: 'Wonder-Toy Assembler', hint: 'Trains, Tops & Rockets', accent: '#34d399' },
  { toolId: 'smart-brain-stamper', icon: '🧠', label: 'Toy-Smarts Brain Press', hint: 'Curiosity Brains & Talking Toys', accent: '#a855f7' },
  { toolId: 'gift-wrapper', icon: '🎁', label: 'Gift-Box Wrapper', hint: 'Wraps Toys & Sweets in Ribbons', accent: '#e11d48' },
];

export const QFactoryWorkshopPalette: React.FC<QFactoryWorkshopPaletteProps> = ({
  activeTool,
  isSelectMode,
  floorLevel,
  customMachines,
  onPickTool,
  onOpenDesigner,
}) => {
  const userCreated = customMachines.filter(
    (m) => m.id !== 'goo-spice-refinery' && m.id !== 'smart-brain-stamper'
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 102,
        left: 14,
        width: 224,
        maxHeight: 'calc(100vh - 196px)',
        overflowY: 'auto',
        background: 'rgba(36, 24, 15, 0.92)',
        border: '1px solid #926842',
        borderRadius: 12,
        padding: '9px 9px',
        color: '#fffbeb',
        boxShadow: '0 10px 26px rgba(0,0,0,0.45)',
        zIndex: 34,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 4px', borderBottom: '1px solid #6b4f35' }}>
        <span style={{ fontSize: 11.5, fontWeight: 800, color: '#fde68a' }}>
          🧸 Build Palette (Lvl {floorLevel + 1})
        </span>
        <button
          onClick={onOpenDesigner}
          style={{ background: '#7c2d12', color: '#fffbeb', border: '1px solid #fb923c', borderRadius: 5, fontSize: 9.5, padding: '2px 6px', fontWeight: 800, cursor: 'pointer' }}
        >
          + Custom
        </button>
      </div>

      {CORE_WORKSHOP_ITEMS.map((item) => {
        const selected = !isSelectMode && activeTool === item.toolId;
        return (
          <button
            key={item.toolId}
            onClick={() => onPickTool(item.toolId, item.label)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              textAlign: 'left',
              background: selected ? 'rgba(146, 64, 14, 0.95)' : 'rgba(69, 46, 28, 0.65)',
              border: selected ? `2px solid ${item.accent}` : '1px solid #78583a',
              borderRadius: 8,
              padding: '4px 7px',
              color: '#fff7ed',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 10.8, fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {item.label}
              </div>
              <div style={{ fontSize: 9, color: '#fed7aa', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {item.hint}
              </div>
            </div>
          </button>
        );
      })}

      {userCreated.map((m) => {
        const selected = !isSelectMode && activeTool === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onPickTool(m.id, m.name)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              textAlign: 'left',
              background: selected ? 'rgba(21, 128, 61, 0.92)' : 'rgba(30, 58, 138, 0.55)',
              border: selected ? '2px solid #4ade80' : '1px solid #60a5fa',
              borderRadius: 8,
              padding: '4px 7px',
              color: '#fff7ed',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16 }}>🛠️</span>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 10.8, fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 9, color: '#bfdbfe' }}>Custom Clay Booth ({m.buildCost.clay} Clay)</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
