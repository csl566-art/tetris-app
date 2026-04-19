import { useGameStore } from '../store/gameStore.js';
import { MiniPieceCanvas } from './GameCanvas.jsx';

const panelStyle = {
  background: '#111128',
  border: '1px solid #2a2a4a',
  borderRadius: 6,
  padding: '8px',
  marginBottom: 8,
};

const labelStyle = {
  fontSize: 10,
  color: '#6060aa',
  letterSpacing: 2,
  marginBottom: 4,
  textTransform: 'uppercase',
};

const valueStyle = {
  fontSize: 22,
  color: '#00ffff',
  fontWeight: 'bold',
  letterSpacing: 1,
};

export function ScoreBoard() {
  const score = useGameStore(s => s.score);
  const level = useGameStore(s => s.level);
  const lines = useGameStore(s => s.lines);

  return (
    <div>
      <div style={panelStyle}>
        <div style={labelStyle}>SCORE</div>
        <div style={valueStyle}>{score.toLocaleString()}</div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <div style={{ ...panelStyle, flex: 1, marginBottom: 0 }}>
          <div style={labelStyle}>LEVEL</div>
          <div style={{ ...valueStyle, fontSize: 18 }}>{level}</div>
        </div>
        <div style={{ ...panelStyle, flex: 1, marginBottom: 0 }}>
          <div style={labelStyle}>LINES</div>
          <div style={{ ...valueStyle, fontSize: 18 }}>{lines}</div>
        </div>
      </div>
    </div>
  );
}

export function NextPiecePanel() {
  const nextKeys = useGameStore(s => s.nextKeys);

  return (
    <div style={panelStyle}>
      <div style={labelStyle}>NEXT</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {nextKeys.slice(0, 3).map((key, i) => (
          <div key={i} style={{ opacity: i === 0 ? 1 : 0.5 - i * 0.1 }}>
            <MiniPieceCanvas pieceKey={key} size={i === 0 ? 16 : 13} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HoldPanel() {
  const heldPiece = useGameStore(s => s.heldPiece);
  const canHold = useGameStore(s => s.canHold);

  return (
    <div style={{ ...panelStyle, opacity: canHold ? 1 : 0.5 }}>
      <div style={labelStyle}>HOLD</div>
      <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {heldPiece ? (
          <MiniPieceCanvas pieceKey={heldPiece} size={14} />
        ) : (
          <span style={{ color: '#2a2a4a', fontSize: 12 }}>—</span>
        )}
      </div>
    </div>
  );
}
