import { useGameStore } from '../store/gameStore.js';

const btnBase = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8,
  color: '#e0e0ff',
  fontSize: 18,
  padding: '10px 14px',
  minWidth: 44,
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'none',
  WebkitUserSelect: 'none',
};

function Btn({ label, action, style }) {
  const dispatch = useGameStore(s => s.dispatch);

  function onPointerDown(e) {
    e.preventDefault();
    dispatch(action);
  }

  return (
    <button
      style={{ ...btnBase, ...style }}
      onPointerDown={onPointerDown}
    >
      {label}
    </button>
  );
}

export default function TouchControls() {
  const dispatch = useGameStore(s => s.dispatch);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: '8px 0',
    }}>
      {/* Top row: Hold + Rotate + Pause */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <Btn label="HOLD" action={{ type: 'HOLD' }} style={{ flex: 1, fontSize: 11 }} />
        <Btn label="↺" action={{ type: 'ROTATE', dir: 'ccw' }} style={{ flex: 1 }} />
        <Btn label="↻" action={{ type: 'ROTATE', dir: 'cw' }} style={{ flex: 1 }} />
        <button
          style={{ ...btnBase, flex: 1, fontSize: 11 }}
          onPointerDown={e => { e.preventDefault(); dispatch({ type: 'PAUSE' }); }}
        >
          ⏸
        </button>
      </div>

      {/* Bottom row: Move + Drop */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <Btn label="◀" action={{ type: 'MOVE_LEFT' }} style={{ flex: 1.5 }} />
        <Btn label="▼" action={{ type: 'SOFT_DROP' }} style={{ flex: 1 }} />
        <Btn label="▶" action={{ type: 'MOVE_RIGHT' }} style={{ flex: 1.5 }} />
        <Btn label="⬇" action={{ type: 'HARD_DROP' }} style={{ flex: 1, background: 'rgba(0,200,255,0.1)', borderColor: 'rgba(0,200,255,0.3)' }} />
      </div>
    </div>
  );
}
