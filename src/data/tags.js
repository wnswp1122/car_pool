// DB 태그 24개에 대한 스타일 매핑 — web-precision-fintech 팔레트에 맞춰 저채도로 정리
export const TAG_STYLE_MAP = {
  // 행동 규칙
  '금연':          { bg: '#f7ecea', tc: '#94493c' },
  '비흡연':        { bg: '#f7ecea', tc: '#94493c' },
  '흡연':          { bg: '#f3efe6', tc: '#7a6a45' },
  // 분위기
  '조용한 분위기': { bg: '#eef0f7', tc: '#4d5a78' },
  '조용히':        { bg: '#eef0f7', tc: '#4d5a78' },
  '대화환영':      { bg: '#eaf3ee', tc: '#3f7a5c' },
  '음악':          { bg: '#f1eef7', tc: '#6a5590' },
  // 동승자 조건
  '여성전용':      { bg: '#f6edf1', tc: '#94486e' },
  '반려동물':      { bg: '#eaf3ee', tc: '#3f7a5c' },
  '짐 있음':       { bg: '#f6f0e6', tc: '#8a6a2e' },
  // 목적/유형
  '출퇴근':        { bg: '#eaeef7', tc: '#3c4f8a' },
  '학교':          { bg: '#f6f2e6', tc: '#8a7228' },
  '장거리':        { bg: '#edf2e8', tc: '#54702e' },
  '여행':          { bg: '#e9f1f6', tc: '#31607e' },
  // 목적지
  '강남':          { bg: '#eeeef7', tc: '#4d4d8a' },
  '판교':          { bg: '#e9f2ee', tc: '#2f7350' },
  '수원':          { bg: '#f5eee6', tc: '#8a5a30' },
  '인천공항':      { bg: '#e9f0f6', tc: '#33628a' },
  '고속터미널':    { bg: '#f6eef2', tc: '#8a4468' },
  '신촌':          { bg: '#f1eef7', tc: '#6a4890' },
  '홍대':          { bg: '#f7eeee', tc: '#933f4a' },
  '잠실':          { bg: '#edf2e9', tc: '#3f7a3f' },
  '공항':          { bg: '#e9f0f6', tc: '#2f5c8a' },
  '쇼핑':          { bg: '#f6eef1', tc: '#8a3f60' },
}

export const DEFAULT_TAG_STYLE = { bg: 'var(--surface2)', tc: 'var(--text-muted)' }

export function getTagStyle(name) {
  return TAG_STYLE_MAP[name] || DEFAULT_TAG_STYLE
}
