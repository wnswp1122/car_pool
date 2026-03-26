export const ALL_TAGS = [
  { id: 'no-smoke',  label: '금연',          emoji: '🚭', bg: '#fde8e8', tc: '#b94040' },
  { id: 'smoke-ok',  label: '흡연 가능',     emoji: '🚬', bg: '#f0ece0', tc: '#6b5a2a' },
  { id: 'coffee',    label: '커피 한잔',     emoji: '☕', bg: '#fff4e0', tc: '#8a5c10' },
  { id: 'food-ok',   label: '음식 가능',     emoji: '🍱', bg: '#fff7e0', tc: '#7a6010' },
  { id: 'quiet',     label: '조용한 분위기', emoji: '🤫', bg: '#e8eef8', tc: '#3a5080' },
  { id: 'chatty',    label: '대화 환영',     emoji: '💬', bg: '#e8f4ec', tc: '#2a6040' },
  { id: 'music',     label: '음악 틀어요',   emoji: '🎵', bg: '#f0e8f8', tc: '#6040a0' },
  { id: 'no-music',  label: '무음',          emoji: '🔇', bg: '#f0f0f0', tc: '#606060' },
  { id: 'pet-ok',    label: '반려동물 동승', emoji: '🐾', bg: '#e8f8ec', tc: '#2a7040' },
  { id: 'fast',      label: '급행 출발',     emoji: '⚡', bg: '#fff8dc', tc: '#8a7000' },
  { id: 'ac',        label: '에어컨 빵빵',   emoji: '❄️', bg: '#dff0ff', tc: '#2060a0' },
  { id: 'window',    label: '창문 열어요',   emoji: '🌬️', bg: '#e0f8f0', tc: '#207060' },
  { id: 'ladies',    label: '여성 전용',     emoji: '👩', bg: '#fde8f4', tc: '#904070' },
  { id: 'beginner',  label: '카풀 처음',     emoji: '🌱', bg: '#eaf4e0', tc: '#4a7030' },
  { id: 'pro',       label: '카풀 고수',     emoji: '🏅', bg: '#f8f0dc', tc: '#806020' },
]

export const TAG_MAP = Object.fromEntries(ALL_TAGS.map(t => [t.id, t]))
