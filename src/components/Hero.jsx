import React from 'react'
import { CarIcon, UsersIcon, StarIcon } from './Icons'

const STATS = [
  { num: (n) => n,     suffix: '',   label: '등록된 카풀', Icon: CarIcon },
  { num: () => '2.8k', suffix: '',   label: '누적 매칭',   Icon: UsersIcon },
  { num: () => '4.8',  suffix: '',   label: '평균 평점',   Icon: StarIcon },
]

export default function Hero({ totalPosts }) {
  const values = [totalPosts, null, null]

  return (
    <div style={styles.hero}>
      <div style={styles.band} />

      <div style={styles.inner}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          실시간 카풀 매칭
        </div>
        <h1 style={styles.h1}>
          이동을 <span style={{ color: 'var(--accent)' }}>함께</span>하면
          <br />
          더 저렴하고 빠릅니다
        </h1>
        <p style={styles.p}>
          목적지가 같은 사람들을 연결해 드립니다 · 연료비를 나누고, 교통체증도 줄이세요
        </p>

        <div style={styles.statsRow}>
          {STATS.map((s, i) => (
            <div key={i} style={styles.statCard}>
              <s.Icon size={16} style={{ color: 'var(--accent)', marginBottom: '0.4rem' }} />
              <div style={styles.statNum}>
                {s.num(values[i])}{s.suffix}
              </div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  hero: {
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },
  band: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: '38vh',
    background: 'var(--band-gradient)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    padding: 'clamp(2.5rem, 6vw, 4.5rem) 2rem 2.5rem',
    textAlign: 'left',
    maxWidth: 760,
    margin: '0 auto',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0.32rem 0.85rem',
    borderRadius: 100,
    marginBottom: '1.4rem',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    animation: 'pulse 2s infinite',
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2rem, 5vw, 3.4rem)',
    fontWeight: 500,
    lineHeight: 1.1,
    marginBottom: '1rem',
    letterSpacing: '-0.035em',
    color: 'var(--text)',
    wordBreak: 'keep-all',
  },
  p: {
    color: 'var(--text-muted)',
    fontSize: 'clamp(0.9rem, 2vw, 1.0625rem)',
    marginBottom: '2.2rem',
    lineHeight: 1.65,
    wordBreak: 'keep-all',
    maxWidth: 480,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0.9rem 1.4rem',
    textAlign: 'left',
    boxShadow: 'var(--card-glow)',
    minWidth: 110,
    flex: '1 1 110px',
    maxWidth: 150,
  },
  statNum: {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
    fontWeight: 500,
    color: 'var(--text)',
    lineHeight: 1,
    marginBottom: '0.3rem',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    wordBreak: 'keep-all',
  },
}
