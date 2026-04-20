import { useGameStore } from '../store/gameStore.js';
import { MiniPieceCanvas } from './GameCanvas.jsx';

function makePanelStyle(panelWidth) {
  const pad = Math.min(8, Math.max(4, Math.floor(panelWidth * 0.09)));
  return {
    background: '#111128',
    border: '1px solid #2a2a4a',
    borderRadius: 6,
    padding: pad,
    marginBottom: 8,
  };
}

const labelStyle = {
  fontSize: 10,
  color: '#6060aa',
  letterSpacing: 2,
  marginBottom: 4,
  textTransform: 'uppercase',
};

export function ScoreBoard({ panelWidth = 80 }) {
  const score = useGameStore(s => s.score);
  const level = useGameStore(s => s.level);
  const lines = useGameStore(s => s.lines);
  const panelStyle = makePanelStyle(panelWidth);
  const valSize = Math.max(14, Math.round(22 * panelWidth / 80));
  const subSize = Math.max(12, Math.round(18 * panelWidth / 80));

  return (
    <div>
      <div style={panelStyle}>
        <div style={labelStyle}>SCORE</div>
        <div style={{ fontSize: valSize, color: '#00ffff', fontWeight: 'bold', letterSpacing: 1 }}>
          {score.toLocaleString()}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <div style={{ ...panelStyle, flex: 1, marginBottom: 0 }}>
          <div style={labelStyle}>LEVEL</div>
          <div style={{ fontSize: subSize, color: '#00ffff', fontWeight: 'bold' }}>{level}</div>
        </div>
        <div style={{ ...panelStyle, flex: 1, marginBottom: 0 }}>
          <div style={labelStyle}>LINES</div>
          <div style={{ fontSize: subSize, color: '#00ffff', fontWeight: 'bold' }}>{lines}</div>
        </div>
      </div>
    </div>
  );
}

export function NextPiecePanel({ panelWidth = 80, miniSize = 13 }) {
  const nextKeys = useGameStore(s => s.nextKeys);
  const panelStyle = makePanelStyle(panelWidth);

  return (
    <div style={panelStyle}>
      <div style={labelStyle}>NEXT</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {nextKeys.slice(0, 3).map((key, i) => (
          <div key={i} style={{ opacity: i === 0 ? 1 : 0.5 - i * 0.1 }}>
            <MiniPieceCanvas pieceKey={key} size={i === 0 ? miniSize : Math.max(10, miniSize - 2)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HoldPanel({ panelWidth = 80, miniSize = 13 }) {
  const heldPiece = useGameStore(s => s.heldPiece);
  const canHold = useGameStore(s => s.canHold);
  const panelStyle = makePanelStyle(panelWidth);

  return (
    <div style={{ ...panelStyle, opacity: canHold ? 1 : 0.5 }}>
      <div style={labelStyle}>HOLD</div>
      <div style={{ minHeight: miniSize * 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {heldPiece ? (
          <MiniPieceCanvas pieceKey={heldPiece} size={miniSize} />
        ) : (
          <span style={{ color: '#2a2a4a', fontSize: 12 }}>—</span>
        )}
      </div>
    </div>
  );
}
