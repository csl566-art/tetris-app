import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';

export function useGameLoop() {
  const dispatch = useGameStore(s => s.dispatch);
  const status = useGameStore(s => s.status);
  const getFallInterval = useGameStore(s => s.getFallInterval);
  const lastTimeRef = useRef(0);
  const accRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (status !== 'playing') {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    function loop(timestamp) {
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      accRef.current += delta;

      const interval = getFallInterval();
      if (accRef.current >= interval) {
        accRef.current = 0;
        dispatch({ type: 'GRAVITY' });
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    lastTimeRef.current = performance.now();
    accRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [status, dispatch, getFallInterval]);
}
