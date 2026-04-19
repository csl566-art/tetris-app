import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';

const DAS_DELAY = 150;
const DAS_REPEAT = 50;

export function useKeyboard() {
  const dispatch = useGameStore(s => s.dispatch);
  const status = useGameStore(s => s.status);
  const dasRef = useRef(null);

  useEffect(() => {
    function clearDAS() {
      if (dasRef.current) {
        clearInterval(dasRef.current);
        dasRef.current = null;
      }
    }

    function startDAS(action) {
      clearDAS();
      dispatch(action);
      const timeout = setTimeout(() => {
        dasRef.current = setInterval(() => dispatch(action), DAS_REPEAT);
      }, DAS_DELAY);
      dasRef.current = timeout;
    }

    function onKeyDown(e) {
      if (e.repeat) return;
      switch (e.code) {
        case 'ArrowLeft':  e.preventDefault(); startDAS({ type: 'MOVE_LEFT' }); break;
        case 'ArrowRight': e.preventDefault(); startDAS({ type: 'MOVE_RIGHT' }); break;
        case 'ArrowDown':  e.preventDefault(); startDAS({ type: 'SOFT_DROP' }); break;
        case 'ArrowUp':
        case 'KeyX':       e.preventDefault(); dispatch({ type: 'ROTATE', dir: 'cw' }); break;
        case 'KeyZ':       e.preventDefault(); dispatch({ type: 'ROTATE', dir: 'ccw' }); break;
        case 'Space':      e.preventDefault(); dispatch({ type: 'HARD_DROP' }); break;
        case 'KeyC':
        case 'ShiftLeft':  e.preventDefault(); dispatch({ type: 'HOLD' }); break;
        case 'Escape':
        case 'KeyP':       e.preventDefault(); dispatch({ type: 'PAUSE' }); break;
        default: break;
      }
    }

    function onKeyUp(e) {
      if (['ArrowLeft','ArrowRight','ArrowDown'].includes(e.code)) clearDAS();
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      clearDAS();
    };
  }, [dispatch, status]);
}
