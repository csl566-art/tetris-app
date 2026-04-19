import { useGameStore } from '../store/gameStore.js';
import { useState } from 'react';
import RankingBoard from './RankingBoard.jsx';

const screen = {
  position: 'fixed', inset: 0,
  background: '#0a0a1a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  zIndex: 50,
};

const title = {
  fontSize: 48,
  fontWeight: 'bold',
  letterSpacing: 6,
  color: '#00ffff',
  textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
  marginBottom: 8,
};

const subtitle = {
  fontSize: 12,
  color: '#6060aa',
  letterSpacing: 4,
  marginBottom: 32,
};

function Btn({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: primary ? '#00ffff' : 'transparent',
        color: primary ? '#0a0a1a' : '#e0e0ff',
        border: primary ? 'none' : '1px solid #2a2a4a',
        borderRadius: 8,
        padding: '14px 48px',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Courier New',
        cursor: 'pointer',
        letterSpacing: 2,
        width: 220,
        boxShadow: primary ? '0 0 20px rgba(0,255,255,0.3)' : 'none',
      }}
    >
      {children}
    </button>
  );
}

export default function MainMenu() {
  const status = useGameStore(s => s.status);
  const dispatch = useGameStore(s => s.dispatch);
  const [showRanking, setShowRanking] = useState(false);

  if (status !== 'idle') return null;

  return (
    <>
      <div style={screen}>
        <div style={title}>TETRIS</div>
        <div style={subtitle}>NEON EDITION</div>

        <div style={{
          fontSize: 11,
          color: '#2a2a4a',
          letterSpacing: 1,
          marginBottom: 16,
          textAlign: 'center',
          lineHeight: 1.8,
        }}>
          ARROW KEYS / SWIPE TO MOVE<br />
          UP / TAP TO ROTATE  ·  SPACE TO DROP<br />
          C / HOLD BTN TO HOLD
        </div>

        <Btn primary onClick={() => dispatch({ type: 'START' })}>START GAME</Btn>
        <Btn onClick={() => setShowRanking(true)}>RANKINGS</Btn>
      </div>

      {showRanking && <RankingBoard onClose={() => setShowRanking(false)} />}
    </>
  );
}
