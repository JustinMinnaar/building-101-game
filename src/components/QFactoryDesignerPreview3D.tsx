import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { QFactoryCustomMachineMeshBuilder } from '../core/QFactoryCustomMachineMeshBuilder';
import { QFactoryCustomMachineSpec } from '../core/QFactoryCustomMachineStore';
import { QFactoryDioramaEnvironment } from '../core/QFactoryDioramaEnvironment';
import { QFactoryDualModeBuilder } from '../core/QFactoryDualModeBuilder';
import { QFactoryBuilding, QFactoryVisualMode } from '../core/QFactoryTypes';

export interface QFactoryDesignerPreview3DProps {
  spec: QFactoryCustomMachineSpec;
  visualMode: QFactoryVisualMode;
}

export const QFactoryDesignerPreview3D: React.FC<QFactoryDesignerPreview3DProps> = ({
  spec,
  visualMode,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const specRef = useRef(spec);
  const modeRef = useRef(visualMode);
  const rebuildFlagRef = useRef(true);

  specRef.current = spec;
  modeRef.current = visualMode;
  rebuildFlagRef.current = true;

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(visualMode === 'anime' ? 0x7dd3fc : visualMode === 'vinyl' ? 0xf5d0fe : 0xd28a2e);
    const cam = new THREE.PerspectiveCamera(45, Math.max(1, el.clientWidth) / Math.max(1, el.clientHeight), 0.2, 120);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(Math.max(1, el.clientWidth), Math.max(1, el.clientHeight));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xfff7ed, 0x92400e, 1.05));
    const dir = new THREE.DirectionalLight(0xfffbeb, 1.35);
    dir.position.set(16, 24, 18);
    scene.add(dir);

    const cardDeck = QFactoryDioramaEnvironment.createCardboardFoundationMesh(16, 0.7, 16, 'detailed');
    cardDeck.position.y = -0.35;
    scene.add(cardDeck);

    let machineGroup: THREE.Group | null = null;
    let theta = 0.55;
    let phi = 1.08;
    let radius = 19;
    let dragging = false;
    let prevX = 0;
    let prevY = 0;

    const dummyBld: QFactoryBuilding = {
      id: 'preview_machine', type: specRef.current.id, name: specRef.current.name,
      x: 0, y: 0, z: 0, rotationDeg: 0, width: 8, depth: 8, height: 7,
      ports: [], inputPorts: [], outputPorts: [], status: 'powered on', powerUsageMW: 5,
      inputBufferCount: 0, outputBufferCount: 0, inStackCapacity: 100, outStackCapacity: 100,
      storedCount: 0, productionProgress: 0, cycleDurationSec: 1.5, spinRatio: 1, basketCount: 16, basketCapacity: 40,
    };

    let animId = 0;
    const tick = (now: number) => {
      if (rebuildFlagRef.current) {
        rebuildFlagRef.current = false;
        scene.background = new THREE.Color(
          modeRef.current === 'anime' ? 0x7dd3fc : modeRef.current === 'vinyl' ? 0xf5d0fe : modeRef.current === 'blockout' ? 0x1e293b : 0xd28a2e
        );
        if (machineGroup) scene.remove(machineGroup);
        machineGroup = QFactoryCustomMachineMeshBuilder.buildCustomMachine(specRef.current, dummyBld, modeRef.current);
        scene.add(machineGroup);
      }
      if (machineGroup) {
        QFactoryDualModeBuilder.animateWorkshopMachine(machineGroup, dummyBld, now / 1000);
      }
      cam.position.set(
        radius * Math.sin(phi) * Math.sin(theta),
        3.2 + radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );
      cam.lookAt(0, 3.0, 0);
      renderer.render(scene, cam);
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => { dragging = true; prevX = e.clientX; prevY = e.clientY; };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      theta -= (e.clientX - prevX) * 0.01;
      phi = Math.max(0.3, Math.min(1.45, phi - (e.clientY - prevY) * 0.008));
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onUp = () => { dragging = false; };
    const onWheel = (e: WheelEvent) => { radius = Math.max(9, Math.min(34, radius + e.deltaY * 0.015)); };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('wheel', onWheel);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('wheel', onWheel);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', border: '1.5px solid #926842' }}>
      <div ref={hostRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 10, background: 'rgba(28, 19, 12, 0.82)', padding: '4px 10px', borderRadius: 8, fontSize: 11, color: '#fde68a', pointerEvents: 'none' }}>
        🎥 Live 3D Preview ({visualMode.toUpperCase()}) — Drag to Orbit • Scroll to Zoom
      </div>
    </div>
  );
};
