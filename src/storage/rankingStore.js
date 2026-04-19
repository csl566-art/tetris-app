const KEY = 'tetris_rankings';
const SETTINGS_KEY = 'tetris_settings';

export function loadRankings() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveScore(score, level, lines) {
  const rankings = loadRankings();
  const date = new Date().toISOString().slice(0, 10);
  rankings.push({ score, level, lines, date });
  rankings.sort((a, b) => b.score - a.score);
  const top10 = rankings.slice(0, 10).map((r, i) => ({ ...r, rank: i + 1 }));
  localStorage.setItem(KEY, JSON.stringify(top10));
  return top10;
}

export function getRankPosition(score) {
  const rankings = loadRankings();
  if (rankings.length < 10 || score > rankings[rankings.length - 1].score) {
    const temp = [...rankings, { score }].sort((a, b) => b.score - a.score);
    return temp.findIndex(r => r.score === score) + 1;
  }
  return null;
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null') || {
      bgmVolume: 0.5,
      sfxVolume: 0.8,
      ghostPiece: true,
    };
  } catch {
    return { bgmVolume: 0.5, sfxVolume: 0.8, ghostPiece: true };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
