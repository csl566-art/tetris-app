import { loadRankings } from '../storage/rankingStore.js';

const overlay = {
  position: 'fixed', inset: 0,
  background: 'rgba(0,0,0,0.85)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 200,
};

const box = {
  background: '#111128',
  border: '2px solid #aa00ff',
  borderRadius: 12,
  padding: 24,
  minWidth: 300,
  maxWidth: 360,
  width: '90vw',
  boxShadow: '0 0 40px rgba(170,0,255,0.2)',
};

const btnStyle = {
  background: 'transparent',
  color: '#aa00ff',
  border: '1px solid #aa00ff',
  borderRadius: 8,
  padding: '10px 24px',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'Courier New',
  marginTop: 16,
  width: '100%',
};

export default function RankingBoard({ onClose }) {
  const rankings = loadRankings();

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={box}>
        <div style={{ fontSize: 20, color: '#aa00ff', fontWeight: 'bold', letterSpacing: 3, marginBottom: 16, textAlign: 'center' }}>
          RANKINGS
        </div>

        {rankings.length === 0 ? (
          <div style={{ color: '#6060aa', textAlign: 'center', padding: 20 }}>No records yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: '#6060aa', borderBottom: '1px solid #2a2a4a' }}>
                <th style={{ padding: '4px 8px', textAlign: 'left' }}>#</th>
                <th style={{ padding: '4px 8px', textAlign: 'right' }}>SCORE</th>
                <th style={{ padding: '4px 8px', textAlign: 'right' }}>LVL</th>
                <th style={{ padding: '4px 8px', textAlign: 'right' }}>DATE</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1a1a38', color: i === 0 ? '#ffd600' : '#e0e0ff' }}>
                  <td style={{ padding: '6px 8px' }}>{i + 1}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', color: '#00ffff' }}>{r.score.toLocaleString()}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right' }}>{r.level}</td>
                  <td style={{ padding: '6px 8px', textAlign: 'right', fontSize: 11, color: '#6060aa' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button style={btnStyle} onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
}
