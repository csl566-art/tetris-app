import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { calcGhost, getCells, BOARD_W, BOARD_H } from '../engine/gameEngine.js';
import { PIECES } from '../engine/pieces.js';
import { useTouch } from '../hooks/useTouch.js';

const COLOR_MAP = {
  0: null,
  1: '#00e5ff', // I
  2: '#ffd600', // O
  3: '#aa00ff', // T
  4: '#00e676', // S
  5: '#ff1744', // Z
  6: '#2979ff', // J
  7: '#ff6d00', // L
};

const CELL = 28;

function drawBlock(ctx, r, c, color, alpha = 1) {
  if (!color) return;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);

  // Inner highlight
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(c * CELL + 2, r * CELL + 2, CELL - 4, 4);
  ctx.globalAlpha = 1;
}

function drawMiniBlock(ctx, r, c, color, cellSize = 18) {
  if (!color) return;
  ctx.fillStyle = color;
  ctx.fillRect(c * cellSize + 1, r * cellSize + 1, cellSize - 2, cellSize - 2);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, 3);
}

export function MiniPieceCanvas({ pieceKey, size = 18 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !pieceKey) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!pieceKey) return;
    const def = PIECES[pieceKey];
    const shape = def.shapes[0];
    const color = COLOR_MAP[def.color];
    const minR = Math.min(...shape.map(([r]) => r));
    const minC = Math.min(...shape.map(([, c]) => c));
    for (const [r, c] of shape) {
      drawMiniBlock(ctx, r - minR, c - minC, color, size);
    }
  }, [pieceKey, size]);

  return (
    <canvas
      ref={ref}
      width={size * 4}
      height={size * 4}
      style={{ display: 'block' }}
    />
  );
}

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const board = useGameStore(s => s.board);
  const currentPiece = useGameStore(s => s.currentPiece);
  const status = useGameStore(s => s.status);

  useTouch(containerRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = BOARD_W * CELL;
    const H = BOARD_H * CELL;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#0d0d20';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let r = 0; r <= BOARD_H; r++) {
      ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(W, r * CELL); ctx.stroke();
    }
    for (let c = 0; c <= BOARD_W; c++) {
      ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, H); ctx.stroke();
    }

    // Locked blocks
    for (let r = 0; r < BOARD_H; r++) {
      for (let c = 0; c < BOARD_W; c++) {
        drawBlock(ctx, r, c, COLOR_MAP[board[r][c]]);
      }
    }

    if (currentPiece && status === 'playing') {
      // Ghost
      const ghost = calcGhost(board, currentPiece);
      const ghostColor = COLOR_MAP[currentPiece.color];
      for (const [r, c] of getCells(ghost)) {
        if (r >= 0) drawBlock(ctx, r, c, ghostColor, 0.25);
      }

      // Active piece
      const color = COLOR_MAP[currentPiece.color];
      for (const [r, c] of getCells(currentPiece)) {
        if (r >= 0) drawBlock(ctx, r, c, color);
      }
    }

    // Paused overlay
    if (status === 'paused') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 28px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', W / 2, H / 2);
    }
  }, [board, currentPiece, status]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        border: '2px solid #2a2a4a',
        boxShadow: '0 0 20px rgba(0,200,255,0.15)',
        lineHeight: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        width={BOARD_W * CELL}
        height={BOARD_H * CELL}
        style={{ display: 'block' }}
      />
    </div>
  );
}
