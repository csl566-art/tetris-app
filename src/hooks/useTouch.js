import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';

const SWIPE_THRESHOLD = 30;
const LONG_PRESS_MS = 400;

export function useTouch(targetRef) {
  const dispatch = useGameStore(s => s.dispatch);
  const startRef = useRef(null);
  const longPressRef = useRef(null);
  const movedRef = useRef(false);

  useEffect(() => {
    const el = targetRef?.current;
    if (!el) return;

    function onTouchStart(e) {
      const t = e.changedTouches[0];
      startRef.current = { x: t.clientX, y: t.clientY, time: Date.now() };
      movedRef.current = false;

      if (e.touches.length === 2) {
        dispatch({ type: 'PAUSE' });
        return;
      }

      longPressRef.current = setTimeout(() => {
        if (!movedRef.current) dispatch({ type: 'HARD_DROP' });
      }, LONG_PRESS_MS);
    }

    function onTouchMove(e) {
      e.preventDefault();
      if (!startRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startRef.current.x;
      const dy = t.clientY - startRef.current.y;
      if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
        movedRef.current = true;
        if (longPressRef.current) clearTimeout(longPressRef.current);
      }
    }

    function onTouchEnd(e) {
      if (longPressRef.current) clearTimeout(longPressRef.current);
      if (!startRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - startRef.current.x;
      const dy = t.clientY - startRef.current.y;
      const dt = Date.now() - startRef.current.time;

      if (!movedRef.current && dt < LONG_PRESS_MS) {
        dispatch({ type: 'ROTATE', dir: 'cw' });
      } else if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < -SWIPE_THRESHOLD) dispatch({ type: 'MOVE_LEFT' });
        else if (dx > SWIPE_THRESHOLD) dispatch({ type: 'MOVE_RIGHT' });
      } else {
        if (dy > SWIPE_THRESHOLD) dispatch({ type: 'SOFT_DROP' });
      }
      startRef.current = null;
    }

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [dispatch, targetRef]);
}
