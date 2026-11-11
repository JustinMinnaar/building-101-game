import React from 'react';
import { QFactoryCategoryDef, QFactoryMatrixCell } from '../core/QFactoryMatrixData';
import { QFactorySlotIcon } from './QFactorySlotIcon';

export interface QFactoryMatrixInventoryProps {
  category: QFactoryCategoryDef;
  selectedRow: number | null;
  hoveredCol: number | null;
  onSelectCell: (cell: QFactoryMatrixCell) => void;
  onHoverCell: (row: number, col: number) => void;
  onClose: () => void;
}

export const QFactoryMatrixInventory: React.FC<QFactoryMatrixInventoryProps> = ({
  category,
  selectedRow,
  hoveredCol,
  onSelectCell,
  onHoverCell,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 84,
        right: 18,
        background: 'rgba(15, 23, 42, 0.96)',
        border: '1px solid #38bdf8',
        borderRadius: 12,
        padding: 12,
        boxShadow: '0 12px 36px rgba(0,0,0,0.85)',
        zIndex: 50,
        pointerEvents: 'auto',
        userSelect: 'none',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 440,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>{category.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>
            [{category.key}] {category.name} (64-Cell Matrix)
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      {/* Guide text */}
      <div style={{ fontSize: 10, color: '#38bdf8' }}>
        {selectedRow === null
          ? 'Press [1-8] for Row, or click any cell directly'
          : `Row ${selectedRow} Selected! Press [1-8] for Column`}
      </div>

      {/* 8x8 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 42px)',
          gap: 4,
          background: 'rgba(30, 41, 59, 0.5)',
          padding: 6,
          borderRadius: 8,
        }}
      >
        {category.cells.map((rowCells, rIdx) => {
          const rowNum = rIdx + 1;
          const isRowActive = selectedRow === rowNum;
          return rowCells.map((cell, cIdx) => {
            const colNum = cIdx + 1;
            const isColHover = hoveredCol === colNum;
            const hasItem = Boolean(cell.toolId);

            return (
              <button
                key={`${rowNum}-${colNum}`}
                onClick={() => hasItem && onSelectCell(cell)}
                onMouseEnter={() => onHoverCell(rowNum, colNum)}
                title={cell.toolId ? `${cell.name} — ${cell.subtitle || ''} [${rowNum}, ${colNum}]` : `Empty [${rowNum}, ${colNum}]`}
                style={{
                  width: 42,
                  height: 42,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isRowActive
                    ? 'rgba(14, 165, 233, 0.25)'
                    : isColHover
                    ? 'rgba(56, 189, 248, 0.15)'
                    : hasItem
                    ? 'rgba(30, 41, 59, 0.9)'
                    : 'rgba(15, 23, 42, 0.4)',
                  border: isRowActive && isColHover
                    ? '1.5px solid #38bdf8'
                    : isRowActive
                    ? '1px solid #0284c7'
                    : hasItem
                    ? '1px solid #475569'
                    : '1px dashed #334155',
                  borderRadius: 6,
                  cursor: hasItem ? 'pointer' : 'default',
                  padding: 2,
                  position: 'relative',
                  transform: isRowActive && isColHover ? 'scale(1.08)' : 'none',
                  transition: 'transform 0.1s ease',
                }}
              >
                {/* Coordinates label */}
                <span
                  style={{
                    position: 'absolute',
                    top: 1,
                    left: 2,
                    fontSize: 8,
                    fontWeight: 700,
                    color: isRowActive ? '#38bdf8' : '#64748b',
                    fontFamily: 'monospace',
                  }}
                >
                  {rowNum},{colNum}
                </span>

                {cell.toolId ? (
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QFactorySlotIcon toolId={cell.toolId} size={22} />
                  </div>
                ) : (
                  <span style={{ fontSize: 10, color: '#334155', marginTop: 6 }}>•</span>
                )}
              </button>
            );
          });
        })}
      </div>
    </div>
  );
};
