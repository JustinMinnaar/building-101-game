import { useRef } from 'react';
import { QFactory3DScene } from '../core/QFactory3DScene';

export interface DragState {
  button: number;
  startX: number;
  startY: number;
  moved: boolean;
}

export function useQFactoryControls(sceneRef: React.RefObject<QFactory3DScene | null>) {
  const dragStateRef = useRef<DragState | null>(null);

  const getNdc = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = { button: e.button, startX: e.clientX, startY: e.clientY, moved: false };
  };

  const handleDrag = (e: React.PointerEvent<HTMLDivElement>): boolean => {
    const drag = dragStateRef.current;
    const scene = sceneRef.current;
    if (!drag || !scene) return false;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;

    if (drag.moved) {
      if (drag.button === 2 || (drag.button === 0 && e.altKey)) {
        scene.orbitCamera(dx, dy);
      } else if (drag.button === 1 || (drag.button === 0 && e.shiftKey)) {
        scene.panCamera(dx, dy);
      }
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      return true;
    }
    return false;
  };

  const isClick = (e: React.PointerEvent<HTMLDivElement>): boolean => {
    const drag = dragStateRef.current;
    dragStateRef.current = null;
    return !!(drag && !drag.moved && e.button === 0 && !e.altKey && !e.shiftKey);
  };

  return { getNdc, onPointerDown, handleDrag, isClick };
}
