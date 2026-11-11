import React, { useEffect, useRef, useState, useCallback } from 'react';
import { QFactory3DScene } from '../core/QFactory3DScene';
import { QFactoryCustomMachineSpec, QFactoryCustomMachineStore } from '../core/QFactoryCustomMachineStore';
import { QFACTORY_CATEGORIES } from '../core/QFactoryMatrixData';
import { QFactorySimManager } from '../core/QFactorySimManager';
import { QFactoryTeddyController } from '../core/QFactoryTeddyController';
import { QFactoryThemePack, QFactoryVisualMode } from '../core/QFactoryTypes';
import { useQFactoryInteraction } from '../hooks/useQFactoryInteraction';
import { QFactoryHotbar } from './QFactoryHotbar';
import { QFactoryMachineDesigner } from './QFactoryMachineDesigner';
import { QFactoryMachineInspector } from './QFactoryMachineInspector';
import { QFactoryMatrixInventory } from './QFactoryMatrixInventory';
import { QFactoryTopResourceBar } from './QFactoryTopResourceBar';
import { QFactoryWorkshopPalette } from './QFactoryWorkshopPalette';

export interface QFactory3DViewProps {
  onClose?: () => void;
}

export const QFactory3DView: React.FC<QFactory3DViewProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<QFactorySimManager>(new QFactorySimManager());
  const teddyRef = useRef<QFactoryTeddyController>(new QFactoryTeddyController());
  const sceneRef = useRef<QFactory3DScene | null>(null);
  const keysPressedRef = useRef<Set<string>>(new Set());

  const [selectedBldId, setSelectedBldId] = useState<string | null>(null);
  const [visualMode, setVisualMode] = useState<QFactoryVisualMode>('detailed');
  const [themePack, setThemePack] = useState<QFactoryThemePack>('sweet-toy');
  const [floorLevel, setFloorLevel] = useState<number>(0);
  const [activeTeddyIdx, setActiveTeddyIdx] = useState<number>(0);
  const [isDesignerOpen, setIsDesignerOpen] = useState<boolean>(false);
  const [customMachines, setCustomMachines] = useState<QFactoryCustomMachineSpec[]>(() =>
    QFactoryCustomMachineStore.getAllCustomSpecs()
  );
  const [statusMessage, setStatusMessage] = useState<string>(
    'Walk your coloured Teddy with [WASD], scoop baskets with [E], draw 2nd-floor decks, or open Machine Editor!'
  );
  const [hudStats, setHudStats] = useState({
    giftBoxes: 0,
    sprinkles: 0,
    resources: simRef.current.getEconomy().getResources(),
  });

  const refreshStats = useCallback(() => {
    const sim = simRef.current;
    const hamperItems = sim.getBuildings().filter((b) => b.type === 'container').reduce((a, b) => a + b.storedCount, 0);
    setHudStats({
      giftBoxes: Math.max(sim.getTotalGiftBoxesWrapped(), hamperItems),
      sprinkles: teddyRef.current.getState().sprinklesCollected,
      resources: sim.getEconomy().getResources(),
    });
    setSelectedBldId(sim.getSelectedBuildingId());
  }, []);

  const interaction = useQFactoryInteraction({ simRef, sceneRef, refreshStats, setStatusMessage });
  const {
    activeKey, activeTool, isSelectMode, beltShapeMode, rotationDeg, setRotationDeg,
    pendingBeltSourceId, matrixCategoryKey, setMatrixCategoryKey, matrixSelectedRow, setMatrixSelectedRow,
    matrixHoveredCol, setMatrixHoveredCol, marqueeStart, marqueeEnd,
    handleSelectMode, handleArmTool, handleMatrixCellSelect, cycleBeltShape,
    onPointerDown, onPointerMove, onPointerUp,
  } = interaction;

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (isDesignerOpen || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      const k = e.key.toLowerCase();
      keysPressedRef.current.add(k);
      if (k === 'e') {
        const scooped = teddyRef.current.collectNearbyBaskets(simRef.current);
        if (scooped > 0) {
          setStatusMessage(`🧸 Scooped ${scooped} basket treats & spare parts!`);
          refreshStats();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => keysPressedRef.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [isDesignerOpen, refreshStats]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const sim = simRef.current;
    if (sim.getBuildings().length === 0) {
      sim.buildThemeShowcase();
      refreshStats();
    }
    const scene = new QFactory3DScene(el);
    sceneRef.current = scene;

    let animId = 0;
    let lastTime = performance.now();
    let uiSyncAccum = 0;

    const animate = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const keys = keysPressedRef.current;
      const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0);
      const right = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0);
      teddyRef.current.stepMovement({ forward, right }, dt, scene.getCameraYawRad());
      teddyRef.current.stepCompanionPatrol(dt);

      sim.stepSimulation(dt);
      scene.syncTeddySquad(sim, teddyRef.current);
      scene.syncWithSim(sim, now / 1000, dt);
      scene.render();

      uiSyncAccum += dt;
      if (uiSyncAccum >= 0.25) {
        uiSyncAccum = 0;
        refreshStats();
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    const onResize = () => scene.resize(el.clientWidth, el.clientHeight);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, [refreshStats]);

  const selectedDetails = selectedBldId ? simRef.current.getMachineDetails(selectedBldId) : undefined;
  const pendingBeltName = pendingBeltSourceId ? simRef.current.getBuildingById(pendingBeltSourceId)?.name ?? null : null;
  const activeCategory = matrixCategoryKey ? QFACTORY_CATEGORIES[matrixCategoryKey] : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#d28a2e' }}>
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onWheel={(e) => sceneRef.current?.zoomCamera(e.deltaY)}
        style={{ width: '100%', height: '100%', cursor: isSelectMode ? 'default' : 'crosshair' }}
      />

      {marqueeStart && marqueeEnd && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(marqueeStart.x, marqueeEnd.x),
            top: Math.min(marqueeStart.y, marqueeEnd.y),
            width: Math.abs(marqueeEnd.x - marqueeStart.x),
            height: Math.abs(marqueeEnd.y - marqueeStart.y),
            border: '1.5px dashed #fef08a',
            background: 'rgba(254, 240, 138, 0.22)',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        />
      )}

      <QFactoryTopResourceBar
        resources={hudStats.resources}
        giftBoxes={hudStats.giftBoxes}
        sprinkles={hudStats.sprinkles}
        floorLevel={floorLevel}
        themePack={themePack}
        visualMode={visualMode}
        squad={teddyRef.current.getSquad()}
        activeTeddyIdx={activeTeddyIdx}
        statusMessage={statusMessage}
        rotationDeg={rotationDeg}
        onRestock={() => {
          simRef.current.getEconomy().restock();
          refreshStats();
          setStatusMessage('📦 Restocked Cardboard, Clay, Metal & Coloured Goo!');
        }}
        onSelectFloorLevel={(lvl) => {
          simRef.current.setActiveFloorLevel(lvl);
          setFloorLevel(lvl);
          setStatusMessage(
            lvl === 0
              ? 'Floor Level 1 (Ground Cardboard). Drag Cardboard Floor or place machines!'
              : `Floor Level ${lvl + 1} (+Support Poles). Drag Cardboard Floor to build an elevated mezzanine!`
          );
        }}
        onSelectThemePack={(pack) => {
          simRef.current.setThemePack(pack);
          setThemePack(pack);
          simRef.current.buildThemeShowcase();
          sceneRef.current?.clearCachedMeshes();
          refreshStats();
          setStatusMessage(
            pack === 'smart-brain-toys'
              ? '🧠 Loaded 2-Level Carnival Toy-Smarts Brain & Talking-Toy Factory!'
              : '🍭 Loaded 2-Level Coloured Goo, Sweetshop & Wonder-Toy Factory!'
          );
        }}
        onSelectVisualMode={(mode) => {
          setVisualMode(mode);
          sceneRef.current?.setVisualMode(mode);
          setStatusMessage(`Switched live 3D Art Style to ${mode.toUpperCase()}!`);
        }}
        onSelectTeddy={(idx) => {
          teddyRef.current.selectActiveTeddy(idx);
          const bear = teddyRef.current.getSquad()[idx];
          setActiveTeddyIdx(idx);
          setStatusMessage(`🧸 Now piloting ${bear.name} with [WASD]!`);
        }}
        onOpenDesigner={() => setIsDesignerOpen(true)}
        onRotate={() => setRotationDeg((r) => (r + 90) % 360)}
        onRebuildShowcase={() => {
          simRef.current.buildThemeShowcase();
          sceneRef.current?.clearCachedMeshes();
          refreshStats();
          setStatusMessage('Rebuilt 2-Level Pole-Supported Showcase Factory!');
        }}
        onClear={() => {
          simRef.current.clearAll();
          sceneRef.current?.clearCachedMeshes();
          refreshStats();
          setStatusMessage('Cleared factory tabletop.');
        }}
      />

      <QFactoryWorkshopPalette
        activeTool={activeTool}
        isSelectMode={isSelectMode}
        floorLevel={floorLevel}
        customMachines={customMachines}
        onPickTool={(toolId, label) => handleArmTool(toolId, label)}
        onOpenDesigner={() => setIsDesignerOpen(true)}
      />

      {selectedDetails && (
        <QFactoryMachineInspector
          details={selectedDetails}
          onTogglePower={() => { simRef.current.toggleBuildingPower(selectedDetails.id); refreshStats(); }}
          onSelectMode={(modeId) => {
            simRef.current.selectMachineMode(selectedDetails.id, modeId);
            refreshStats();
            setStatusMessage(`Switched ${selectedDetails.name} recipe!`);
          }}
          onCollectBasket={() => {
            const got = simRef.current.collectMachineBasket(selectedDetails.id);
            teddyRef.current.addCarriedItem('sprinkles', got);
            refreshStats();
            setStatusMessage(`🧺 Scooped ${got} treats from ${selectedDetails.basketLabel}!`);
          }}
          onHandFeed={() => {
            teddyRef.current.addCarriedItem('sugar-cube', 2);
            teddyRef.current.addCarriedItem('rainbow-dye', 2);
            teddyRef.current.addCarriedItem('toy-brain', 2);
            teddyRef.current.addCarriedItem('toy-train', 2);
            const fed = teddyRef.current.handFeedMachine(simRef.current, selectedDetails.id);
            refreshStats();
            setStatusMessage(`🧸 Hand-fed ${fed} ingredient(s) into ${selectedDetails.name}!`);
          }}
          onClose={() => { simRef.current.deselectBuilding(); setSelectedBldId(null); }}
        />
      )}

      {activeCategory && (
        <QFactoryMatrixInventory
          category={activeCategory}
          selectedRow={matrixSelectedRow}
          hoveredCol={matrixHoveredCol}
          onHoverCell={(_r, c) => setMatrixHoveredCol(c)}
          onSelectCell={handleMatrixCellSelect}
          onClose={() => { setMatrixCategoryKey(null); setMatrixSelectedRow(null); }}
        />
      )}

      <QFactoryHotbar
        slots={simRef.current.getHotbarSlots()}
        activeKey={activeKey}
        isSelectMode={isSelectMode}
        beltShapeMode={beltShapeMode}
        pendingBeltSourceName={pendingBeltName}
        activeCategoryKey={matrixCategoryKey}
        onSelectSlot={(key) => {
          if (['1', '2', '3', '4', '5'].includes(key)) { setMatrixCategoryKey(key); setMatrixSelectedRow(null); }
          else simRef.current.selectSlotByKey(key);
        }}
        onSelectMode={handleSelectMode}
        onCycleBeltShape={cycleBeltShape}
        onSelectCategory={(key) => { setMatrixCategoryKey(key); setMatrixSelectedRow(null); }}
      />

      {isDesignerOpen && (
        <QFactoryMachineDesigner
          initialVisualMode={visualMode}
          onSaveAndUse={(saved) => {
            setCustomMachines(QFactoryCustomMachineStore.getAllCustomSpecs());
            sceneRef.current?.clearCachedMeshes();
            setIsDesignerOpen(false);
            handleArmTool(saved.id, saved.name);
            setStatusMessage(`✨ Saved "${saved.name}"! Click any Cardboard Deck to build your custom machine!`);
          }}
          onClose={() => setIsDesignerOpen(false)}
        />
      )}
    </div>
  );
};
