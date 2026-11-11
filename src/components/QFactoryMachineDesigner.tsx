import React, { useState } from 'react';
import {
  QFactoryCustomMachineSpec,
  QFactoryCustomMachineStore,
} from '../core/QFactoryCustomMachineStore';
import { QFactoryVisualMode } from '../core/QFactoryTypes';
import { QFactoryDesignerOrthoCanvas } from './QFactoryDesignerOrthoCanvas';
import { QFactoryDesignerPreview3D } from './QFactoryDesignerPreview3D';
import { QFactoryDesignerSidebar } from './QFactoryDesignerSidebar';

export interface QFactoryMachineDesignerProps {
  initialVisualMode: QFactoryVisualMode;
  onSaveAndUse: (spec: QFactoryCustomMachineSpec) => void;
  onClose: () => void;
}

export const QFactoryMachineDesigner: React.FC<QFactoryMachineDesignerProps> = ({
  initialVisualMode,
  onSaveAndUse,
  onClose,
}) => {
  const presets = QFactoryCustomMachineStore.getAllCustomSpecs();
  const [spec, setSpec] = useState<QFactoryCustomMachineSpec>(() =>
    QFactoryCustomMachineStore.createBlankDraft(`custom-machine-${Date.now().toString().slice(-4)}`, 'Wonder Spice & Toy Press')
  );
  const [selectedCubeId, setSelectedCubeId] = useState<string | null>(spec.frameCubes[0]?.id ?? null);
  const [selectedAddonId, setSelectedAddonId] = useState<string | null>(null);
  const [clickAddCubeMode, setClickAddCubeMode] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<QFactoryVisualMode>(initialVisualMode);

  const handleLoadPreset = (id: string) => {
    if (id === '__new__') {
      const fresh = QFactoryCustomMachineStore.createBlankDraft(
        `custom-machine-${Date.now().toString().slice(-4)}`,
        'New Clay Wonder Booth'
      );
      setSpec(fresh);
      setSelectedCubeId(fresh.frameCubes[0]?.id ?? null);
      return;
    }
    const found = QFactoryCustomMachineStore.getCustomSpec(id);
    if (found) {
      const copy: QFactoryCustomMachineSpec = JSON.parse(JSON.stringify(found));
      setSpec(copy);
      setSelectedCubeId(copy.frameCubes[0]?.id ?? null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'linear-gradient(145deg, #241810 0%, #3a2617 100%)',
        color: '#fffbeb',
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        gap: 12,
      }}
    >
      {/* Designer Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(28, 19, 12, 0.9)',
          border: '1px solid #926842',
          borderRadius: 12,
          padding: '10px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fde047' }}>
              🛠️ Wonder-Machine Cube & Add-on Studio
            </div>
            <div style={{ fontSize: 11.5, color: '#fed7aa' }}>
              Fit & resize clay cubes, attach gears, stampers, wires & levers, place belt holes & front marker!
            </div>
          </div>

          <select
            onChange={(e) => handleLoadPreset(e.target.value)}
            defaultValue="__new__"
            style={{ background: '#3b2818', color: '#fffbeb', border: '1px solid #926842', borderRadius: 8, padding: '6px 10px', fontSize: 12 }}
          >
            <option value="__new__">✨ New Custom Machine</option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>📦 Edit: {p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setClickAddCubeMode((v) => !v)}
            style={{
              ...hdrBtn,
              background: clickAddCubeMode ? '#059669' : '#7c2d12',
              borderColor: clickAddCubeMode ? '#34d399' : '#fb923c',
            }}
          >
            {clickAddCubeMode ? '✅ Click-to-Add Cube ON' : '➕ Click-to-Add Cube'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(['detailed', 'anime', 'vinyl', 'blockout'] as QFactoryVisualMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setPreviewStyle(m)}
              style={{ ...hdrBtn, background: previewStyle === m ? '#b45309' : '#291d12' }}
            >
              {m === 'detailed' ? '🎨 Clay' : m === 'anime' ? '✨ Anime' : m === 'vinyl' ? '🍬 Vinyl' : '🧊 Blockout'}
            </button>
          ))}

          <button
            onClick={() => {
              QFactoryCustomMachineStore.saveAndRegister(spec);
              onSaveAndUse(spec);
            }}
            style={{ ...hdrBtn, background: '#15803d', borderColor: '#4ade80', fontSize: 13 }}
          >
            ✨ Save & Place in Factory
          </button>
          <button onClick={onClose} style={{ ...hdrBtn, background: '#7f1d1d', borderColor: '#f87171' }}>
            Back to Factory
          </button>
        </div>
      </div>

      {/* 3-Column Studio Body: Ortho Cube/Connector Canvas | Live 3D Turntable | Add-ons & Recipe Sidebar */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1.15fr 350px', gap: 12, minHeight: 0 }}>
        <QFactoryDesignerOrthoCanvas
          spec={spec}
          selectedCubeId={selectedCubeId}
          selectedAddonId={selectedAddonId}
          clickAddCubeMode={clickAddCubeMode}
          onSelectCube={setSelectedCubeId}
          onSelectAddon={setSelectedAddonId}
          onChangeSpec={setSpec}
        />
        <QFactoryDesignerPreview3D spec={spec} visualMode={previewStyle} />
        <QFactoryDesignerSidebar spec={spec} selectedCubeId={selectedCubeId} onChangeSpec={setSpec} />
      </div>
    </div>
  );
};

const hdrBtn: React.CSSProperties = {
  background: '#3b2818',
  color: '#fffbeb',
  border: '1px solid #926842',
  borderRadius: 8,
  padding: '6px 11px',
  fontSize: 11.5,
  fontWeight: 800,
  cursor: 'pointer',
};
