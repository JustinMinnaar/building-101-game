import React from 'react';
import { QFactoryToolId } from '../core/QFactoryTypes';

export interface QFactorySlotIconProps {
  toolId: QFactoryToolId;
  accentColor?: string;
  size?: number;
}

export const QFactorySlotIcon: React.FC<QFactorySlotIconProps> = ({ toolId, size = 32 }) => {
  const s = size;
  switch (toolId) {
    case 'miner':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          {/* Base slab */}
          <polygon points="18,28 32,21 18,14 4,21" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* Orange machine body */}
          <polygon points="12,18 24,12 24,20 12,26" fill="#ea580c" />
          <polygon points="24,12 30,15 30,23 24,20" fill="#c2410c" />
          <polygon points="12,18 18,15 30,15 24,12" fill="#f97316" />
          {/* Drill tower & bit */}
          <rect x="7" y="7" width="5" height="15" fill="#475569" rx="1" />
          <polygon points="9,22 10,27 8,27" fill="#94a3b8" />
          {/* Output Port */}
          <rect x="25" y="19" width="3" height="3" fill="#eab308" />
        </svg>
      );
    case 'miner-mk2':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,30 34,22 18,14 2,22" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <polygon points="8,19 28,10 28,21 8,29" fill="#ea580c" />
          <polygon points="28,10 33,13 33,24 28,21" fill="#c2410c" />
          <rect x="6" y="5" width="4" height="17" fill="#475569" rx="1" />
          <rect x="14" y="5" width="4" height="17" fill="#475569" rx="1" />
          <polygon points="8,22 9,28 7,28" fill="#94a3b8" />
          <polygon points="16,22 17,28 15,28" fill="#94a3b8" />
          <rect x="25" y="19" width="3" height="3" fill="#eab308" />
          <rect x="29" y="17" width="3" height="3" fill="#eab308" />
        </svg>
      );
    case 'smelter':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,29 32,22 18,15 4,22" fill="#1e293b" />
          {/* Red Furnace Block */}
          <polygon points="9,20 23,13 23,23 9,28" fill="#dc2626" />
          <polygon points="23,13 29,16 29,25 23,23" fill="#991b1b" />
          <polygon points="9,20 15,17 29,16 23,13" fill="#ef4444" />
          {/* Glowing fire core */}
          <ellipse cx="16" cy="22" rx="4" ry="2.5" fill="#ff6b00" />
          <ellipse cx="16" cy="22" rx="2" ry="1.2" fill="#fef08a" />
          {/* Twin Smokestacks */}
          <rect x="11" y="5" width="3.5" height="11" fill="#334155" rx="1" />
          <rect x="19" y="4" width="3.5" height="10" fill="#475569" rx="1" />
          <path d="M12,4 Q14,2 12,0" stroke="#94a3b8" strokeWidth="1" fill="none" opacity="0.6" />
        </svg>
      );
    case 'smelter-mk2':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,30 34,22 18,14 2,22" fill="#1e293b" />
          <polygon points="7,20 25,11 25,23 7,29" fill="#dc2626" />
          <polygon points="25,11 31,14 31,25 25,23" fill="#991b1b" />
          <ellipse cx="13" cy="22" rx="3" ry="2" fill="#ff6b00" />
          <ellipse cx="20" cy="18" rx="3" ry="2" fill="#ff6b00" />
          <rect x="8" y="4" width="3" height="12" fill="#334155" rx="1" />
          <rect x="13" y="3" width="3" height="12" fill="#475569" rx="1" />
          <rect x="19" y="3" width="3" height="11" fill="#475569" rx="1" />
          <rect x="24" y="4" width="3" height="11" fill="#334155" rx="1" />
        </svg>
      );
    case 'constructor':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,29 32,22 18,15 4,22" fill="#1e293b" />
          {/* Blue Arch Gantry */}
          <polygon points="8,19 22,12 22,23 8,28" fill="#2563eb" />
          <polygon points="22,12 28,15 28,25 22,23" fill="#1d4ed8" />
          <polygon points="8,19 14,16 28,15 22,12" fill="#3b82f6" />
          {/* Silver Stamping Press Head */}
          <rect x="13" y="14" width="6" height="5" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="16" y1="9" x2="16" y2="14" stroke="#64748b" strokeWidth="2" />
        </svg>
      );
    case 'constructor-mk2':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,30 34,22 18,14 2,22" fill="#1e293b" />
          <polygon points="6,19 24,10 24,23 6,29" fill="#1d4ed8" />
          <polygon points="24,10 32,14 32,25 24,23" fill="#1e40af" />
          <rect x="10" y="13" width="5" height="5" fill="#94a3b8" />
          <rect x="18" y="9" width="5" height="5" fill="#cbd5e1" />
        </svg>
      );
    case 'container':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,29 32,22 18,15 4,22" fill="#1e293b" />
          {/* Green Corrugated Crate */}
          <polygon points="8,19 22,12 22,24 8,28" fill="#059669" />
          <polygon points="22,12 28,15 28,26 22,24" fill="#047857" />
          <polygon points="8,19 14,16 28,15 22,12" fill="#10b981" />
          {/* Ribbing lines */}
          <line x1="12" y1="18" x2="12" y2="26" stroke="#047857" strokeWidth="1" />
          <line x1="16" y1="16" x2="16" y2="25" stroke="#047857" strokeWidth="1" />
          <rect x="25" y="20" width="2" height="3" fill="#eab308" />
        </svg>
      );
    case 'container-mk2':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,30 33,22 18,15 3,22" fill="#1e293b" />
          {/* Double-stacked industrial green container */}
          <polygon points="7,17 22,9 22,26 7,30" fill="#047857" />
          <polygon points="22,9 29,13 29,28 22,26" fill="#065f46" />
          <polygon points="7,17 14,13 29,13 22,9" fill="#10b981" />
          <line x1="7" y1="21" x2="29" y2="18" stroke="#0f172a" strokeWidth="1.2" />
        </svg>
      );
    case 'splitter':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          {/* 2x2x2 Compact Cube */}
          <polygon points="18,26 28,21 18,16 8,21" fill="#f59e0b" />
          <polygon points="8,21 18,26 18,32 8,27" fill="#334155" />
          <polygon points="18,26 28,21 28,27 18,32" fill="#1e293b" />
          {/* 1 in, 3 out port indicators */}
          <circle cx="18" cy="18" r="2" fill="#3b82f6" />
          <polygon points="26,22 28,21 28,24" fill="#eab308" />
          <polygon points="10,22 8,21 8,24" fill="#eab308" />
          <polygon points="18,31 16,30 20,30" fill="#eab308" />
        </svg>
      );
    case 'merger':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          {/* 2x2x2 Compact Cube */}
          <polygon points="18,26 28,21 18,16 8,21" fill="#06b6d4" />
          <polygon points="8,21 18,26 18,32 8,27" fill="#1e293b" />
          <polygon points="18,26 28,21 28,27 18,32" fill="#0f172a" />
          {/* 3 in, 1 out port indicators */}
          <circle cx="18" cy="18" r="2" fill="#eab308" />
          <polygon points="26,22 28,23 28,20" fill="#3b82f6" />
          <polygon points="10,22 8,23 8,20" fill="#3b82f6" />
        </svg>
      );
    case 'connector':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          {/* 1x1x2 Slender Metallic Post */}
          <polygon points="18,28 24,25 18,22 12,25" fill="#1e293b" />
          <rect x="16" y="11" width="4" height="14" fill="#475569" stroke="#64748b" strokeWidth="0.8" />
          <rect x="15" y="9" width="6" height="3" fill="#38bdf8" rx="0.5" />
          <circle cx="16" cy="18" r="1.5" fill="#3b82f6" />
          <circle cx="20" cy="18" r="1.5" fill="#eab308" />
        </svg>
      );
    case 'belt':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          {/* Dark track bed */}
          <polygon points="6,24 24,10 30,13 12,27" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
          {/* Glowing yellow side rails */}
          <line x1="6" y1="23" x2="24" y2="9" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="27" x2="30" y2="13" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
          {/* Rollers */}
          <line x1="10" y1="23" x2="14" y2="25" stroke="#64748b" strokeWidth="1" />
          <line x1="15" y1="19" x2="19" y2="21" stroke="#64748b" strokeWidth="1" />
          <line x1="20" y1="15" x2="24" y2="17" stroke="#64748b" strokeWidth="1" />
        </svg>
      );
    case 'foundation':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,28 32,21 18,14 4,21" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
          <polygon points="4,21 18,28 18,31 4,24" fill="#475569" />
          <polygon points="18,28 32,21 32,24 18,31" fill="#334155" />
        </svg>
      );
    case 'sunken-pit':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,28 32,21 18,14 4,21" fill="#475569" stroke="#64748b" strokeWidth="1" />
          <polygon points="18,25 28,20 18,15 8,20" fill="#020205" />
        </svg>
      );
    case 'tower':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <polygon points="18,30 28,25 18,20 8,25" fill="#1e293b" />
          <rect x="14" y="6" width="8" height="20" fill="#0891b2" stroke="#0e7490" strokeWidth="0.8" />
          <circle cx="18" cy="9" r="4.5" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
          <circle cx="18" cy="9" r="1.5" fill="#f8fafc" />
        </svg>
      );
    case 'dismantle':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <path d="M8,28 L24,12 M20,8 L28,16" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="12,24 8,28 12,28" fill="#f43f5e" />
        </svg>
      );
    case 'starter-chain':
      return (
        <svg width={s} height={s} viewBox="0 0 36 36" fill="none">
          <path d="M19,3 L7,19 L16,19 L13,33 L29,15 L20,15 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
        </svg>
      );
    case 'sugar-harvester':
      return <span style={{ fontSize: s * 0.72 }}>🍬</span>;
    case 'color-extractor':
      return <span style={{ fontSize: s * 0.72 }}>🌈</span>;
    case 'sweet-maker':
      return <span style={{ fontSize: s * 0.72 }}>🍭</span>;
    case 'part-lathe':
      return <span style={{ fontSize: s * 0.72 }}>⚙️</span>;
    case 'toy-assembler':
      return <span style={{ fontSize: s * 0.72 }}>🚂</span>;
    case 'gift-wrapper':
      return <span style={{ fontSize: s * 0.72 }}>🎁</span>;
    default:
      return <span style={{ fontSize: s * 0.65 }}>📦</span>;
  }
};
