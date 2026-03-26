import React from 'react'

export default function Hero({ totalPosts }) {
  return (
    <div style={styles.hero}>
      <div style={styles.badge}>
        <span style={styles.badgeDot}>●</span>
        실시간 카풀 매칭
      </div>
      <h1 style={styles.h1}>
        이동을 <span style={{ color: 'var(--accent)' }}>함께</span>하면
        <br />
        더 저렴하고 빠릅니다
      </h1>
      <p style={styles.p}>
        목적지가 같은 사람들을 연결해 드립니다
        <br />
        연료비를 나누고, 교통체증도 줄이세요
      </p>
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={styles.statNum}>{totalPosts}</div>
          <div style={styles.statLabel}>등록된 카풀</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNum}>2,847</div>
          <div style={styles.statLabel}>누적 매칭</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNum}>4.8★</div>
          <div style={styles.statLabel}>평균 평점</div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    position: 'relative',
    zIndex: 1,
    padding: '4rem 2rem 2.5rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'var(--accent-pale)',
    border: '1px solid rgba(107,124,63,0.3)',
    color: 'var(--accent)',
    fontSize: '0.78rem',
    fontWeight: 500,
    padding: '0.35rem 0.9rem',
    borderRadius: 100,
    marginBottom: '1.2rem',
    letterSpacing: '0.5px',
  },
  badgeDot: {
    fontSize: '0.5rem',
    animation: 'pulse 2s infinite',
  },
  h1: {
    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: '0.8rem',
    letterSpacing: '-2px',
    color: 'var(--text)',
  },
  p: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    marginBottom: '1.8rem',
    lineHeight: 1.7,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    marginTop: '1.5rem',
  },
  stat: {
    textAlign: 'center',
  },
  statNum: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--accent)',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: 2,
  },
}
