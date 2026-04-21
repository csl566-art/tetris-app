import { useState, useEffect } from 'react';

const MAX_CELL = 28;
const MIN_CELL = 16;
const MIN_PANEL = 60;
const MAX_PANEL = 80;

export function useCellSize() {
  function calc() {
    const vw = window.innerWidth;
    // Layout: padding(8)*2 + gap(8)*2 + panel*2 + board(10*cell)
    // Maximize cell size while keeping panels >= MIN_PANEL
    const cellSize = Math.min(MAX_CELL, Math.max(MIN_CELL, Math.floor((vw - 32 - MIN_PANEL * 2) / 10)));
    const panelWidth = Math.min(MAX_PANEL, Math.max(MIN_PANEL, Math.floor((vw - 32 - cellSize * 10) / 2)));
    // miniSize: fits 4 blocks inside panel accounting for padding
    const miniSize = Math.max(10, Math.floor((panelWidth - 12) / 4));
    return { cellSize, panelWidth, miniSize };
  }

  const [sizes, setSizes] = useState(calc);

  useEffect(() => {
    function onResize() { setSizes(calc()); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return sizes;
}
