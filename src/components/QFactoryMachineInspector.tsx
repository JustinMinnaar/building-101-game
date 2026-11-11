import React from 'react';
import { QFactoryMachineDetails, QFactoryMachineStatus } from '../core/QFactoryTypes';

export interface QFactoryMachineInspectorProps {
  details: QFactoryMachineDetails;
  onTogglePower: () => void;
  onSelectMode?: (modeId: string) => void;
  onCollectBasket?: () => void;
  onHandFeed?: () => void;
  onClose: () => void;
}

export const QFactoryMachineInspector: React.FC<QFactoryMachineInspectorProps> = ({
  details,
  onTogglePower,
  onSelectMode,
  onCollectBasket,
  onHandFeed,
  onClose,
}) => {
  const getStatusColor = (status: QFactoryMachineStatus) => {
    switch (status) {
      case 'powered on': return '#4ade80';
      case 'powering up':
      case 'shutting down': return '#fbbf24';
      case 'tripped': return '#f87171';
      default: return '#a8a29e';
    }
  };

  const isRunning = details.status === 'powered on' || details.status === 'powering up';
  const statusColor = getStatusColor(details.status);
  const spinPct = details.spinRatio !== undefined ? Math.round(details.spinRatio * 100) : null;
  const ingredientEntries = details.ingredientCounts
    ? Object.entries(details.ingredientCounts).filter(([, count]) => (count ?? 0) > 0)
    : [];

  return (
    <div
      style={{
        position: 'absolute',
        top: 76,
        right: 16,
        width: 315,
        background: 'rgba(41, 29, 18, 0.94)',
        border: '1px solid #926842',
        borderRadius: 12,
        padding: '14px 16px',
        color: '#fffbeb',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(10px)',
        zIndex: 50,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fef08a' }}>{details.name}</div>
          <div style={{ fontSize: 11, color: '#fed7aa' }}>Booth #{details.id}</div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#fed7aa', fontSize: 16, cursor: 'pointer', padding: 4 }}
          title="Close (Esc)"
        >
          ✕
        </button>
      </div>

      {/* Lever Switch & Spin Speed */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 10px',
          background: 'rgba(69, 46, 28, 0.8)',
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: statusColor,
              boxShadow: `0 0 8px ${statusColor}`,
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: statusColor }}>
            {details.status} {spinPct !== null ? `(${spinPct}%)` : ''}
          </span>
        </div>
        <button
          onClick={onTogglePower}
          style={{
            background: isRunning ? '#7f1d1d' : '#14532d',
            color: isRunning ? '#fecaca' : '#bbf7d0',
            border: `1px solid ${isRunning ? '#ef4444' : '#22c55e'}`,
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {isRunning ? 'Flip Lever Off' : 'Flip Lever On'}
        </button>
      </div>

      {/* Multi-Mode Recipe Selector */}
      {details.availableModes && details.availableModes.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fde68a', marginBottom: 5 }}>
            Craft Recipe:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {details.availableModes.map((mode) => {
              const active = mode.id === details.activeModeId;
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectMode && onSelectMode(mode.id)}
                  style={{
                    textAlign: 'left',
                    padding: '6px 8px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    background: active ? 'rgba(180, 83, 9, 0.85)' : 'rgba(69, 46, 28, 0.65)',
                    border: active ? '1.5px solid #fde047' : '1px solid #78583a',
                    color: '#fff7ed',
                  }}
                >
                  <div style={{ fontSize: 11.5, fontWeight: 700 }}>{mode.label}</div>
                  <div style={{ fontSize: 10, color: '#fed7aa' }}>
                    Needs: {mode.inputsSummary} → {mode.producesItem}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Production Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#fed7aa' }}>Craft Speed:</span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>
            {details.productionRatePerMin > 0 ? `${details.productionRatePerMin} / min` : 'Storage Hamper'}
          </span>
        </div>
        {details.producesItem && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#fed7aa' }}>Making:</span>
            <span style={{ fontWeight: 700, color: '#fde047' }}>{details.producesItem}</span>
          </div>
        )}
      </div>

      {/* Hopper Ingredients & Teddy Hand-Feed */}
      {details.availableModes && details.availableModes[0]?.inputsSummary !== 'Resource Patch' && (
        <div style={{ background: 'rgba(69, 46, 28, 0.7)', padding: '8px 10px', borderRadius: 8, marginBottom: 8, fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: '#fde68a', fontWeight: 700 }}>Hopper Tray ({details.inputBufferCount}/{details.inStackCapacity})</span>
            {onHandFeed && (
              <button
                onClick={onHandFeed}
                style={{
                  background: '#0284c7',
                  color: '#f0f9ff',
                  border: '1px solid #38bdf8',
                  borderRadius: 5,
                  padding: '3px 8px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🧸 Hand-Feed
              </button>
            )}
          </div>
          <div style={{ color: '#ffedd5', fontSize: 10.5 }}>
            {ingredientEntries.length > 0
              ? ingredientEntries.map(([k, v]) => `${k}: ${v}`).join(' • ')
              : 'Waiting for belt or Teddy delivery...'}
          </div>
        </div>
      )}

      {/* Front Clay Basket */}
      {details.basketLabel && (
        <div style={{ background: 'rgba(87, 53, 30, 0.85)', border: '1px solid #b45309', padding: '7px 10px', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#fde047' }}>🏳️ {details.basketLabel}</div>
            <div style={{ fontSize: 11, color: '#ffedd5' }}>
              Basket: <b>{details.basketCount ?? 0}</b> / {details.basketCapacity ?? 40}
            </div>
          </div>
          {onCollectBasket && (
            <button
              onClick={onCollectBasket}
              style={{
                background: '#d97706',
                color: '#fffbeb',
                border: '1px solid #fde047',
                borderRadius: 6,
                padding: '4px 9px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🧺 Scoop
            </button>
          )}
        </div>
      )}

      {/* Output Ready Count */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
        <div style={{ background: 'rgba(69, 46, 28, 0.7)', padding: '6px 8px', borderRadius: 6 }}>
          <div style={{ color: '#fed7aa' }}>Out Tray</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{details.outputBufferCount} / {details.outStackCapacity}</div>
        </div>
        <div style={{ background: 'rgba(69, 46, 28, 0.7)', padding: '6px 8px', borderRadius: 6 }}>
          <div style={{ color: '#fed7aa' }}>Total Crafted</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{details.storedCount}</div>
        </div>
      </div>
    </div>
  );
};
