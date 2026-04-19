import { PIECES, getWallKicks } from './pieces.js';
import { RandomBag } from './randomBag.js';

export const BOARD_W = 10;
export const BOARD_H = 20;

function emptyBoard() {
  return Array.from({ length: BOARD_H }, () => new Array(BOARD_W).fill(0));
}

function createPiece(key) {
  const def = PIECES[key];
  const [dr, dc] = def.spawnOffset;
  return { key, color: def.color, rotation: 0, row: dr, col: dc };
}

function getCells(piece) {
  const shape = PIECES[piece.key].shapes[piece.rotation];
  return shape.map(([r, c]) => [r + piece.row, c + piece.col]);
}

function isValid(board, piece) {
  for (const [r, c] of getCells(piece)) {
    if (c < 0 || c >= BOARD_W || r >= BOARD_H) return false;
    if (r >= 0 && board[r][c] !== 0) return false;
  }
  return true;
}

function calcGhost(board, piece) {
  let ghost = { ...piece };
  while (isValid(board, { ...ghost, row: ghost.row + 1 })) {
    ghost = { ...ghost, row: ghost.row + 1 };
  }
  return ghost;
}

function lockPiece(board, piece) {
  const next = board.map(r => [...r]);
  for (const [r, c] of getCells(piece)) {
    if (r >= 0) next[r][c] = piece.color;
  }
  return next;
}

function clearLines(board) {
  const kept = board.filter(row => row.some(c => c === 0));
  const cleared = BOARD_H - kept.length;
  const newRows = Array.from({ length: cleared }, () => new Array(BOARD_W).fill(0));
  return { board: [...newRows, ...kept], cleared };
}

const SCORE_TABLE = [0, 100, 300, 500, 800];
export const fallInterval = (level) => Math.max(20, 800 - (level - 1) * 50);

export function initState() {
  const bag = new RandomBag();
  const firstKey = bag.next();
  const nextKeys = [bag.next(), bag.next(), bag.next()];
  return {
    board: emptyBoard(),
    currentPiece: createPiece(firstKey),
    heldPiece: null,
    canHold: true,
    nextKeys,
    bag,
    score: 0,
    level: 1,
    lines: 0,
    status: 'idle',
    flashRows: [],
  };
}

export function gameReducer(state, action) {
  if (state.status === 'gameover' && action.type !== 'RESTART') return state;

  switch (action.type) {
    case 'START': return { ...state, status: 'playing' };
    case 'PAUSE':
      if (state.status === 'playing') return { ...state, status: 'paused' };
      if (state.status === 'paused') return { ...state, status: 'playing' };
      return state;

    case 'RESTART': {
      const bag = new RandomBag();
      const firstKey = bag.next();
      const nextKeys = [bag.next(), bag.next(), bag.next()];
      return {
        board: emptyBoard(),
        currentPiece: createPiece(firstKey),
        heldPiece: null,
        canHold: true,
        nextKeys,
        bag,
        score: 0,
        level: 1,
        lines: 0,
        status: 'playing',
        flashRows: [],
      };
    }

    case 'MOVE_LEFT':
    case 'MOVE_RIGHT': {
      if (state.status !== 'playing') return state;
      const dc = action.type === 'MOVE_LEFT' ? -1 : 1;
      const moved = { ...state.currentPiece, col: state.currentPiece.col + dc };
      if (!isValid(state.board, moved)) return state;
      return { ...state, currentPiece: moved };
    }

    case 'SOFT_DROP': {
      if (state.status !== 'playing') return state;
      const dropped = { ...state.currentPiece, row: state.currentPiece.row + 1 };
      if (!isValid(state.board, dropped)) return state;
      return { ...state, currentPiece: dropped, score: state.score + 1 };
    }

    case 'HARD_DROP': {
      if (state.status !== 'playing') return state;
      const ghost = calcGhost(state.board, state.currentPiece);
      const dist = ghost.row - state.currentPiece.row;
      return gameReducer({ ...state, currentPiece: ghost, score: state.score + dist * 2 }, { type: 'LOCK' });
    }

    case 'ROTATE': {
      if (state.status !== 'playing') return state;
      const { currentPiece, board } = state;
      const fromRot = currentPiece.rotation;
      const toRot = (fromRot + (action.dir === 'ccw' ? 3 : 1)) % 4;
      const rotated = { ...currentPiece, rotation: toRot };
      const kicks = getWallKicks(currentPiece.key, fromRot, toRot);
      for (const [kr, kc] of kicks) {
        const test = { ...rotated, row: rotated.row + kr, col: rotated.col + kc };
        if (isValid(board, test)) return { ...state, currentPiece: test };
      }
      return state;
    }

    case 'HOLD': {
      if (state.status !== 'playing' || !state.canHold) return state;
      const { heldPiece, currentPiece, nextKeys, bag } = state;
      let newCurrent, newHeld, newNextKeys = nextKeys, newBag = bag;
      if (heldPiece) {
        newCurrent = createPiece(heldPiece);
        newHeld = currentPiece.key;
      } else {
        const [nextKey, ...rest] = nextKeys;
        const spawned = bag.next();
        newCurrent = createPiece(nextKey);
        newHeld = currentPiece.key;
        newNextKeys = [...rest, spawned];
        newBag = bag;
      }
      return { ...state, currentPiece: newCurrent, heldPiece: newHeld, canHold: false, nextKeys: newNextKeys, bag: newBag };
    }

    case 'GRAVITY':
    case 'LOCK': {
      if (state.status !== 'playing') return state;
      const { currentPiece, board } = state;

      if (action.type === 'GRAVITY') {
        const fallen = { ...currentPiece, row: currentPiece.row + 1 };
        if (isValid(board, fallen)) return { ...state, currentPiece: fallen };
      }

      // Lock piece
      const lockedBoard = lockPiece(board, currentPiece);
      const { board: clearedBoard, cleared } = clearLines(lockedBoard);

      const newLines = state.lines + cleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      const newScore = state.score + (cleared > 0 ? SCORE_TABLE[cleared] * state.level : 0);

      const { bag } = state;
      const [nextKey, ...rest] = state.nextKeys;
      const spawned = bag.next();
      const newPiece = createPiece(nextKey);

      if (!isValid(clearedBoard, newPiece)) {
        return { ...state, board: lockedBoard, status: 'gameover' };
      }

      return {
        ...state,
        board: clearedBoard,
        currentPiece: newPiece,
        nextKeys: [...rest, spawned],
        bag,
        canHold: true,
        score: newScore,
        level: newLevel,
        lines: newLines,
        flashRows: [],
      };
    }

    default:
      return state;
  }
}

export { getCells, calcGhost, isValid };
