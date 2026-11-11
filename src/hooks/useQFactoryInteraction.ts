import React, { useCallback, useRef, useState } from 'react';
import { QFactory3DScene } from '../core/QFactory3DScene';
import { QFactoryMatrixCell } from '../core/QFactoryMatrixData';
import { QFactoryPlacementHelper } from '../core/QFactoryPlacementHelper';
import { QFactorySimManager } from '../core/QFactorySimManager';
import { QFactoryBeltShape, QFactoryToolId } from '../core/QFactoryTypes';
import { useQFactoryControls } from './useQFactoryControls';
import { useQFactoryKeyboard } from './useQFactoryKeyboard';

export interface UseQFactoryInteractionParams {
  simRef: React.MutableRefObject<QFactorySimManager>;
  sceneRef: React.RefObject<QFactory3DScene | null>;
  refreshStats: () => void;
  setStatusMessage: (msg: string) => void;
}

export function useQFactoryInteraction({
  simRef,
  sceneRef,
  refreshStats,
  setStatusMessage,
}: UseQFactoryInteractionParams) {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [activeTool, setActiveTool] = useState<QFactoryToolId>('select');
  const [isSelectMode, setIsSelectMode] = useState<boolean>(true);
  const [beltShapeMode, setBeltShapeMode] = useState<QFactoryBeltShape>('default');
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [pendingBeltSourceId, setPendingBeltSourceId] = useState<string | null>(null);

  const [matrixCategoryKey, setMatrixCategoryKey] = useState<string | null>(null);
  const [matrixSelectedRow, setMatrixSelectedRow] = useState<number | null>(null);
  const [matrixHoveredCol, setMatrixHoveredCol] = useState<number | null>(null);

  const [floorThickness, setFloorThickness] = useState<number>(1);
  const [floorDragStart, setFloorDragStart] = useState<{ x: number; z: number } | null>(null);

  const [marqueeStart, setMarqueeStart] = useState<{ x: number; y: number } | null>(null);
  const [marqueeEnd, setMarqueeEnd] = useState<{ x: number; y: number } | null>(null);
  const pointerDownPosRef = useRef<{ clientX: number; clientY: number; worldX: number; worldZ: number } | null>(null);

  const { getNdc, onPointerDown: handleControlsPointerDown, handleDrag, isClick } = useQFactoryControls(sceneRef);

  const handleSelectMode = useCallback(() => {
    simRef.current.setSelectTool();
    setIsSelectMode(true);
    setActiveTool('select');
    setPendingBeltSourceId(null);
    setMatrixCategoryKey(null);
    setStatusMessage('Select Mode Active. Click machine/belt or drag rectangle. Press [Del] to delete.');
  }, [simRef, setStatusMessage]);

  const handleArmTool = useCallback((toolId: QFactoryToolId, name: string) => {
    setIsSelectMode(false);
    setActiveTool(toolId);
    simRef.current.setActiveTool(toolId);
    setPendingBeltSourceId(null);
    setMatrixCategoryKey(null);
    setMatrixSelectedRow(null);
    setStatusMessage(`Armed: ${name}. Click ground to place.`);
  }, [simRef, setStatusMessage]);

  const handleMatrixCellSelect = useCallback((cell: QFactoryMatrixCell) => {
    if (!cell.toolId) return;
    if (cell.floorThickness) setFloorThickness(cell.floorThickness);
    handleArmTool(cell.toolId, cell.name);
  }, [handleArmTool]);

  const cycleBeltShape = useCallback(() => {
    const next: QFactoryBeltShape =
      beltShapeMode === 'default' ? 'straight' : beltShapeMode === 'straight' ? 'curved' : 'default';
    setBeltShapeMode(next);
    simRef.current.setBeltShapeMode(next);
    setStatusMessage(`Belt shape set to: ${next.toUpperCase()}`);
  }, [beltShapeMode, simRef, setStatusMessage]);

  useQFactoryKeyboard({
    simRef,
    sceneRef,
    activeTool,
    matrixCategoryKey,
    matrixSelectedRow,
    setMatrixCategoryKey,
    setMatrixSelectedRow,
    setFloorThickness,
    setRotationDeg,
    setPendingBeltSourceId,
    handleSelectMode,
    handleMatrixCellSelect,
    cycleBeltShape,
    setStatusMessage,
    refreshStats,
  });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handleControlsPointerDown(e);
    if (e.button !== 0 || e.altKey || e.shiftKey) return;

    const scene = sceneRef.current;
    if (!scene) return;
    const ndc = getNdc(e);
    const floorLvl = activeTool.startsWith('foundation-') ? simRef.current.getActiveFloorLevel() : 0;
    const ground = scene.raycastGround(ndc.x, ndc.y, floorLvl);
    if (!ground) return;

    pointerDownPosRef.current = { clientX: e.clientX, clientY: e.clientY, worldX: ground.x, worldZ: ground.z };
    if (activeTool.startsWith('foundation-')) {
      const snapped = simRef.current.snapToGrid(ground.x, ground.z);
      setFloorDragStart(snapped);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (handleDrag(e)) return;
    const scene = sceneRef.current;
    const sim = simRef.current;
    if (!scene) return;

    const ndc = getNdc(e);
    const floorLvl = activeTool.startsWith('foundation-') ? sim.getActiveFloorLevel() : 0;
    const groundPt = scene.raycastGround(ndc.x, ndc.y, floorLvl);
    const snapped = groundPt ? sim.snapToGrid(groundPt.x, groundPt.z) : null;

    if (isSelectMode && pointerDownPosRef.current) {
      const dx = Math.abs(e.clientX - pointerDownPosRef.current.clientX);
      const dy = Math.abs(e.clientY - pointerDownPosRef.current.clientY);
      if (dx > 4 || dy > 4) {
        setMarqueeStart({ x: pointerDownPosRef.current.clientX, y: pointerDownPosRef.current.clientY });
        setMarqueeEnd({ x: e.clientX, y: e.clientY });
      }
      return;
    }

    if (activeTool.startsWith('foundation-') && floorDragStart && snapped) {
      scene.updateFloorRectPreview(
        floorDragStart.x,
        floorDragStart.z,
        snapped.x,
        snapped.z,
        floorThickness,
        sim.getActiveFloorLevel()
      );
      return;
    }

    if (activeTool === 'belt' && pendingBeltSourceId) {
      scene.updateGhostPreview('select', null, 0);
      const srcBld = sim.getBuildingById(pendingBeltSourceId);
      const srcPortPos = srcBld?.outputPorts.find((p) => !p.connectedBeltId)?.worldPosition || srcBld?.outputPort;
      const hit = scene.raycastBuildingOrBeltId(ndc.x, ndc.y);
      let tgtPos = null;
      let isValid = true;
      if (hit.buildingId && hit.buildingId !== pendingBeltSourceId) {
        const tgtBld = sim.getBuildingById(hit.buildingId);
        tgtPos = tgtBld?.inputPorts.find((p) => !p.connectedBeltId)?.worldPosition || tgtBld?.inputPort || null;
      } else if (snapped) {
        const deck = sim.findFoundationAt(snapped.x, snapped.z);
        tgtPos = { x: snapped.x, y: (deck ? deck.topY : 0) + 1.0, z: snapped.z };
      }
      if (srcPortPos && tgtPos) {
        if (Math.hypot(srcPortPos.x - tgtPos.x, srcPortPos.z - tgtPos.z) > 100) isValid = false;
        scene.updateBeltHologram(srcPortPos, tgtPos, beltShapeMode, isValid);
      } else {
        scene.clearBeltHologram();
      }
    } else {
      scene.clearBeltHologram();
      let isValid = true;
      let ghostY = 0;
      if (snapped && activeTool !== 'select' && activeTool !== 'belt' && activeTool !== 'dismantle' && activeTool !== 'starter-chain') {
        isValid = sim.validatePlacement(activeTool, snapped.x, snapped.z, true).valid;
        const deck = sim.findFoundationAt(snapped.x, snapped.z);
        ghostY = deck ? deck.topY : 0;
      }
      scene.updateGhostPreview(activeTool, snapped, rotationDeg, isValid, ghostY);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const scene = sceneRef.current;
    const sim = simRef.current;
    const startPos = pointerDownPosRef.current;
    pointerDownPosRef.current = null;

    if (isSelectMode && marqueeStart && marqueeEnd && scene && startPos) {
      const ndc = getNdc(e);
      const endGround = scene.raycastGround(ndc.x, ndc.y);
      if (endGround) {
        sim.selectInRect(startPos.worldX, startPos.worldZ, endGround.x, endGround.z, e.ctrlKey || e.metaKey);
        const bCount = sim.getSelectedBuildingIds().length;
        const beltCount = sim.getSelectedBeltIds().length;
        setStatusMessage(`Selected ${bCount} machine(s) and ${beltCount} belt(s). Press [Del] to delete.`);
        refreshStats();
      }
      setMarqueeStart(null);
      setMarqueeEnd(null);
      return;
    }

    setMarqueeStart(null);
    setMarqueeEnd(null);

    if (floorDragStart && scene && sim) {
      const ndc = getNdc(e);
      const lvl = sim.getActiveFloorLevel();
      const ground = scene.raycastGround(ndc.x, ndc.y, lvl);
      if (ground) {
        const snapped = sim.snapToGrid(ground.x, ground.z);
        const area = Math.max(4, Math.abs(snapped.x - floorDragStart.x) * Math.abs(snapped.z - floorDragStart.z));
        const cbCost = Math.max(4, Math.round(area / 16)) + lvl * 8;
        if (sim.getEconomy().trySpendSandbox({ cardboard: cbCost })) {
          const floor = sim.placeFoundationRect(floorDragStart.x, floorDragStart.z, snapped.x, snapped.z, floorThickness, lvl);
          const poleMsg = floor.poles.length > 0 ? ` + ${floor.poles.length} Support Poles` : '';
          setStatusMessage(`Built Level ${lvl + 1} Cardboard Deck (${floor.width}x${floor.depth}m${poleMsg}, -${cbCost} Cardboard)!`);
          refreshStats();
        } else {
          setStatusMessage('Not enough Cardboard for deck! Click [+ Restock] in the top bar.');
        }
      }
      scene.clearFloorRectPreview();
      setFloorDragStart(null);
      return;
    }

    if (!isClick(e) || !scene || !sim) return;
    const ndc = getNdc(e);

    if (isSelectMode) {
      const hit = scene.raycastBuildingOrBeltId(ndc.x, ndc.y);
      const id = hit.buildingId ?? hit.beltId;
      if (id) {
        sim.selectItem(id, e.ctrlKey || e.metaKey);
        const b = sim.getBuildingById(id);
        setStatusMessage(b ? `Selected ${b.name} (${b.status}).` : `Selected Belt (${id}).`);
      } else if (!e.ctrlKey && !e.metaKey) {
        sim.deselectBuilding();
        setStatusMessage('Deselected all.');
      }
      refreshStats();
      return;
    }

    if (activeTool === 'belt') {
      QFactoryPlacementHelper.handleBeltClick(
        scene,
        sim,
        ndc,
        pendingBeltSourceId,
        beltShapeMode,
        setPendingBeltSourceId,
        setStatusMessage,
        refreshStats
      );
    } else if (activeTool === 'dismantle') {
      const hit = scene.raycastBuildingOrBeltId(ndc.x, ndc.y);
      const id = hit.buildingId ?? hit.beltId;
      if (id) {
        sim.removeBuildingOrBelt(id);
        setStatusMessage('Dismantled object.');
        refreshStats();
      }
    } else {
      const groundPt = scene.raycastGround(ndc.x, ndc.y);
      if (groundPt) {
        QFactoryPlacementHelper.handleSingleBuildingPlacement(
          sim,
          activeTool,
          groundPt,
          rotationDeg,
          setStatusMessage,
          refreshStats
        );
      }
    }
  };

  return {
    activeKey,
    setActiveKey,
    activeTool,
    setActiveTool,
    isSelectMode,
    beltShapeMode,
    rotationDeg,
    setRotationDeg,
    pendingBeltSourceId,
    setPendingBeltSourceId,
    matrixCategoryKey,
    setMatrixCategoryKey,
    matrixSelectedRow,
    setMatrixSelectedRow,
    matrixHoveredCol,
    setMatrixHoveredCol,
    floorThickness,
    setFloorThickness,
    marqueeStart,
    marqueeEnd,
    handleSelectMode,
    handleArmTool,
    handleMatrixCellSelect,
    cycleBeltShape,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
