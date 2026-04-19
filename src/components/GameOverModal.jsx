import { useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { saveScore, getRankPosition } from '../storage/rankingStore.js';

const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.8)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 100,
};

const box = {
  background: '#111128',
  border: '2px solid #00ffff',
  borderRadius: 12,
  padding: 32,
  textAlign: 'center',
  minWidth: 260,
  boxShadow: '0 0 40px rgba(0,255,255,0.2)',
};

const btnStyle = {
  background: '#00ffff',
  color: '#0a0a1a',
  border: 'none',
  borderRadius: 8,
  padding: '12px 32px',
  fontSize: 16,
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'Courier New',
  marginTop: 16,
  width: '100%',
};

const btn2Style = {
  ...btnStyle,
  background: 'transparent',
  color: '#6060aa',
  border: '1px solid #2a2a4a',
  marginTop: 8,
};

export default function GameOverModal({ onShowRanking }) {
  const status = useGameStore(s => s.status);
  const score = useGameStore(s => s.score);
  const level = useGameStore(s => s.level);
  const lines = useGameStore(s => s.lines);
  const dispatch = useGameStore(s => s.dispatch);
  const savedRef = useRef(false);

  useEffect(() => {
    if (status === 'gameover' && !savedRef.current) {
      savedRef.current = true;
      saveScore(score, level, lines);
    }
    if (status !== 'gameover') {
      savedRef.current = false;
    }
  }, [status, score, level, lines]);

  const rankPos = useMemo(() => {
    if (status !== 'gameover') return null;
    return getRankPosition(score);
  }, [status, score]);

  if (status !== 'gameover') return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <div style={{ fontSize: 28, color: '#ff1744', fontWeight: 'bold', letterSpacing: 3, marginBottom: 16 }}>
          GAME OVER
        </div>

        {rankPos && rankPos <= 10 && (
          <div style={{ color: '#ffd600', fontSize: 13, marginBottom: 12, letterSpacing: 1 }}>
            🏆 TOP {rankPos} NEW RECORD!
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: '#6060aa', letterSpacing: 2 }}>SCORE</div>
            <div style={{ fontSize: 24, color: '#00ffff' }}>{score.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#6060aa', letterSpacing: 2 }}>LEVEL</div>
            <div style={{ fontSize: 24, color: '#00ffff' }}>{level}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#6060aa', letterSpacing: 2 }}>LINES</div>
            <div style={{ fontSize: 24, color: '#00ffff' }}>{lines}</div>
          </div>
        </div>

        <button style={btnStyle} onClick={() => dispatch({ type: 'RESTART' })}>
          PLAY AGAIN
        </button>
        <button style={btn2Style} onClick={onShowRanking}>
          RANKINGS
        </button>
      </div>
    </div>
  );
}
