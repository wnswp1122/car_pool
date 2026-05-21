// Visual style map keyed by backend tag name
export const TAG_STYLE_MAP = {
  '금연':          { emoji: '🚭', bg: '#fde8e8', tc: '#b94040' },
  '흡연':          { emoji: '🚬', bg: '#f0ece0', tc: '#6b5a2a' },
  '조용한 분위기': { emoji: '🤫', bg: '#e8eef8', tc: '#3a5080' },
  '반려동물':      { emoji: '🐾', bg: '#e8f8ec', tc: '#2a7040' },
  '짐 있음':       { emoji: '🎒', bg: '#fff4e0', tc: '#8a5c10' },
  '여성전용':      { emoji: '👩', bg: '#fde8f4', tc: '#904070' },
}

export const DEFAULT_TAG_STYLE = { emoji: '🏷️', bg: '#f0f0f0', tc: '#606060' }

export function getTagStyle(name) {
  return TAG_STYLE_MAP[name] || DEFAULT_TAG_STYLE
}
