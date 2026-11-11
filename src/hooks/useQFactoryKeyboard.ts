import { useEffect } from 'react';
import { QFactory3DScene } from '../core/QFactory3DScene';
import { QFACTORY_CATEGORIES, QFactoryMatrixCell } from '../core/QFactoryMatrixData';
import { QFactorySimManager } from '../core/QFactorySimManager';
import { QFactoryToolId } from '../core/QFactoryTypes';

export interface UseQFactoryKeyboardParams {
  simRef: React.MutableRefObject<QFactorySimManager>;
  sceneRef: React.RefObject<QFactory3DScene | null>;
  activeTool: QFactoryToolId;
  matrixCategoryKey: string | null;
  matrixSelectedRow: number | null;
  setMatrixCategoryKey: (key: string | null) => void;
  setMatrixSelectedRow: (row: number | null) => void;
  setFloorThickness: (th: number) => void;
  setRotationDeg: React.Dispatch<React.SetStateAction<number>>;
  setPendingBeltSourceId: (id: string | null) => void;
  handleSelectMode: () => void;
  handleMatrixCellSelect: (cell: QFactoryMatrixCell) => void;
  cycleBeltShape: () => void;
  setStatusMessage: (msg: string) => void;
  refreshStats: () => void;
}

export function useQFactoryKeyboard({
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
}: UseQFactoryKeyboardParams): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const sim = simRef.current;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const res = sim.deleteSelected();
        if (res.buildingsDeleted > 0 || res.beltsDeleted > 0) {
          setStatusMessage(`Deleted ${res.buildingsDeleted} building(s) and ${res.beltsDeleted} belt(s).`);
          refreshStats();
        }
        return;
      }

      if (e.key === '`' || e.key === '~') {
        handleSelectMode();
        return;
      }

      if (matrixCategoryKey) {
        if (e.key === 'Escape') {
          setMatrixCategoryKey(null);
          setMatrixSelectedRow(null);
          setStatusMessage('Closed build matrix.');
        } else if (/^[1-8]$/.test(e.key)) {
          const num = Number(e.key);
          if (matrixSelectedRow === null) {
            setMatrixSelectedRow(num);
            setStatusMessage(`Row ${num} selected. Press [1-8] for Column cell.`);
          } else {
            const cat = QFACTORY_CATEGORIES[matrixCategoryKey];
            const cell = cat?.cells[matrixSelectedRow - 1]?.[num - 1];
            if (cell && cell.toolId) handleMatrixCellSelect(cell);
          }
        }
        return;
      }

      if (activeTool.startsWith('foundation-') && ['1', '2', '3'].includes(e.key)) {
        const th = Number(e.key);
        setFloorThickness(th);
        setStatusMessage(`Floor foundation thickness set to ${th}m.`);
        return;
      }

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        setMatrixCategoryKey(e.key);
        setMatrixSelectedRow(null);
        setStatusMessage(`Opened ${QFACTORY_CATEGORIES[e.key]?.name} matrix. Press [1-8] for Row.`);
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        if (activeTool === 'belt') cycleBeltShape();
        else setRotationDeg((prev) => (prev + 90) % 360);
      } else if (e.key === 'Escape') {
        setPendingBeltSourceId(null);
        sceneRef.current?.clearBeltHologram();
        sim.deselectBuilding();
        refreshStats();
        setStatusMessage('Cancelled current action.');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeTool,
    cycleBeltShape,
    handleMatrixCellSelect,
    handleSelectMode,
    matrixCategoryKey,
    matrixSelectedRow,
    refreshStats,
    sceneRef,
    setFloorThickness,
    setMatrixCategoryKey,
    setMatrixSelectedRow,
    setPendingBeltSourceId,
    setRotationDeg,
    simRef,
    setStatusMessage,
  ]);
}
