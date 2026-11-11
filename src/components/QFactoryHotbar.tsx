import React from 'react';
import { QFactoryBeltShape, QFactoryHotbarSlot } from '../core/QFactoryTypes';
import { QFactorySlotIcon } from './QFactorySlotIcon';

export interface QFactoryHotbarProps {
  slots: QFactoryHotbarSlot[];
  activeKey: string;
  isSelectMode: boolean;
  beltShapeMode: QFactoryBeltShape;
  pendingBeltSourceName: string | null;
  activeCategoryKey?: string | null;
  onSelectSlot: (key: string) => void;
  onSelectMode: () => void;
  onCycleBeltShape: () => void;
  onSelectCategory?: (key: string) => void;
}

export const QFactoryHotbar: React.FC<QFactoryHotbarProps> = ({
  slots,
  activeKey,
  isSelectMode,
  beltShapeMode,
  pendingBeltSourceName,
  activeCategoryKey,
  onSelectSlot,
  onSelectMode,
  onCycleBeltShape,
  onSelectCategory,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 18,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        zIndex: 40,
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      {/* Belt Linking & Shape Notification Pill */}
      {activeKey === '5' && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {pendingBeltSourceName && (
            <div
              style={{
                background: 'rgba(234, 179, 8, 0.95)',
                color: '#0f172a',
                padding: '5px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.45)',
              }}
            >
              Start: {pendingBeltSourceName} → Click Target (Esc to cancel)
            </div>
          )}
          <button
            onClick={onCycleBeltShape}
            style={{
              background: '#0f172a',
              color: '#38bdf8',
              border: '1px solid #38bdf8',
              borderRadius: 6,
              padding: '5px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            Belt Shape [R]: {beltShapeMode.toUpperCase()}
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '8px 10px',
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid #334155',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Select Tool Button (Key `) */}
        <button
          onClick={onSelectMode}
          title="Select Machine & Inspect (Key `)"
          style={{
            position: 'relative',
            width: 76,
            height: 76,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            background: isSelectMode
              ? 'linear-gradient(180deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))'
              : 'rgba(30, 41, 59, 0.65)',
            border: isSelectMode ? '2px solid #38bdf8' : '1px solid #334155',
            borderRadius: 8,
            color: '#f8fafc',
            cursor: 'pointer',
            padding: '4px 6px',
            transform: isSelectMode ? 'translateY(-4px)' : 'none',
            boxShadow: isSelectMode ? '0 0 14px #38bdf855' : 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 4,
              left: 6,
              fontSize: 11,
              fontWeight: 800,
              color: isSelectMode ? '#38bdf8' : '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            `
          </span>
          <span style={{ fontSize: 22, lineHeight: 1.1, marginTop: 4 }}>👆</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: isSelectMode ? '#ffffff' : '#cbd5e1' }}>
            Select
          </span>
          <span style={{ fontSize: 9, color: '#94a3b8' }}>Inspect</span>
        </button>

        <div style={{ width: 1, background: '#334155', margin: '4px 2px' }} />

        {/* 10 Inventory Slots */}
        {slots.map((slot) => {
          const isCategoryActive = activeCategoryKey === slot.key;
          const isActive = (!isSelectMode && slot.key === activeKey) || isCategoryActive;
          return (
            <button
              key={slot.key}
              onClick={() => {
                if (['1', '2', '3', '4', '5'].includes(slot.key) && onSelectCategory) {
                  onSelectCategory(slot.key);
                } else {
                  onSelectSlot(slot.key);
                }
              }}
              title={`${slot.name} — ${slot.subtitle} (Key ${slot.key})`}
              style={{
                position: 'relative',
                width: 82,
                height: 76,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: isActive
                  ? 'linear-gradient(180deg, rgba(30,41,59,0.98), rgba(15,23,42,0.98))'
                  : 'rgba(30, 41, 59, 0.65)',
                border: isActive ? `2px solid ${slot.accentColor}` : '1px solid #334155',
                borderRadius: 8,
                color: '#f8fafc',
                cursor: 'pointer',
                padding: '4px 6px',
                transform: isActive ? 'translateY(-4px)' : 'none',
                boxShadow: isActive ? `0 0 14px ${slot.accentColor}55` : 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  color: isActive ? slot.accentColor : '#94a3b8',
                  fontFamily: 'monospace',
                }}
              >
                {slot.key}
              </span>
              {slot.variants && slot.variants.length > 1 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 6,
                    fontSize: 9,
                    fontWeight: 700,
                    color: isActive ? '#38bdf8' : '#64748b',
                    fontFamily: 'monospace',
                  }}
                  title="Click again or press key to cycle variant"
                >
                  {slot.activeVariantIndex + 1}/{slot.variants.length}
                </span>
              )}
              <div style={{ marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QFactorySlotIcon toolId={slot.toolId} accentColor={slot.accentColor} size={30} />
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.15,
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {slot.name}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: '#94a3b8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {slot.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
