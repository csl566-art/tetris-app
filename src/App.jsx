import { useState } from 'react';
import './styles/global.css';
import GameCanvas from './components/GameCanvas.jsx';
import { ScoreBoard, NextPiecePanel, HoldPanel } from './components/SidePanel.jsx';
import TouchControls from './components/TouchControls.jsx';
import GameOverModal from './components/GameOverModal.jsx';
import RankingBoard from './components/RankingBoard.jsx';
import MainMenu from './components/MainMenu.jsx';
import { useGameLoop } from './hooks/useGameLoop.js';
import { useKeyboard } from './hooks/useKeyboard.js';

export default function App() {
  useGameLoop();
  useKeyboard();
  const [showRanking, setShowRanking] = useState(false);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: 8,
      gap: 6,
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: 80 }}>
          <HoldPanel />
        </div>

        <GameCanvas />

        <div style={{ display: 'flex', flexDirection: 'column', width: 80 }}>
          <ScoreBoard />
          <NextPiecePanel />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: 400 }}>
        <TouchControls />
      </div>

      <MainMenu />
      <GameOverModal onShowRanking={() => setShowRanking(true)} />
      {showRanking && <RankingBoard onClose={() => setShowRanking(false)} />}
    </div>
  );
}
