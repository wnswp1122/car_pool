import React from 'react'
import { TAG_MAP } from '../data/tags'
import { fmtPrice } from './CarpoolCard'

export default function DetailModal({ post, onClose, onJoin }) {
  if (!post) return null

  const avail = post.seats - post.filled
  const full = avail <= 0

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.title}>카풀 상세</div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* 경로 정보 */}
        <div style={styles.routeSection}>
          <div style={styles.route}>
            <span>{post.from}</span>
            <span style={{ color: 'var(--accent)' }}>→</span>
            <span>{post.to}</span>
          </div>
          <div style={styles.metaGrid}>
            <MetaItem label="날짜" value={post.date} />
            <MetaItem label="시간" value={post.time} />
            <MetaItem label="모집 인원" value={`${post.seats}명 (${post.filled}명 참여중)`} />
            <MetaItem label="1인 분담금" value={fmtPrice(post.price)} accent />
          </div>
          {post.tags?.length > 0 && (
            <div style={styles.tags}>
              {post.tags.map(tid => {
                const t = TAG_MAP[tid]
                if (!t) return null
                return (
                  <span key={tid} style={{ ...styles.tagPill, background: t.bg, color: t.tc, borderColor: `${t.tc}22` }}>
                    {t.emoji} {t.label}
                  </span>
                )
              })}
            </div>
          )}
          {post.desc && (
            <div style={styles.desc}>{post.desc}</div>
          )}
        </div>

        {/* 드라이버 정보 */}
        <div style={styles.driverSection}>
          <div style={{ ...styles.driverAvatar, background: `${post.color}22`, color: post.color }}>
            {post.nickname[0]}
          </div>
          <div>
            <div style={styles.driverName}>{post.nickname}</div>
            <div style={styles.driverRating}>★★★★★ {post.rating}</div>
            <div style={styles.driverTrips}>총 {post.trips}회 탑승</div>
          </div>
        </div>

        <button
          style={{ ...styles.joinBtn, ...(full ? styles.joinBtnDisabled : {}) }}
          disabled={full}
          onClick={() => onJoin(post.id)}
        >
          {full ? '마감된 카풀입니다' : '참여 신청하기'}
        </button>
      </div>
    </div>
  )
}

function MetaItem({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: accent ? 'var(--accent)' : 'var(--text)' }}>{value}</span>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 600,
    background: 'rgba(42,42,31,0.5)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 540,
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(42,42,31,0.15)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '1.3rem',
    padding: '0.3rem',
    borderRadius: 6,
  },
  routeSection: {
    background: 'var(--surface2)',
    borderRadius: 12,
    padding: '1.2rem',
    marginBottom: '1.2rem',
  },
  route: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '0.8rem',
    color: 'var(--text)',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border)',
  },
  tagPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.72rem',
    fontWeight: 600,
    padding: '0.22rem 0.6rem',
    borderRadius: 100,
    border: '1.5px solid',
  },
  desc: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border)',
    fontSize: '0.87rem',
    color: 'var(--text-muted)',
    lineHeight: 1.7,
  },
  driverSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: 'var(--surface2)',
    borderRadius: 12,
    padding: '1rem 1.2rem',
    marginBottom: '1.2rem',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  driverName: {
    fontWeight: 700,
    marginBottom: '0.2rem',
    color: 'var(--text)',
  },
  driverRating: {
    fontSize: '0.82rem',
    color: '#b8860b',
  },
  driverTrips: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  joinBtn: {
    width: '100%',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '0.85rem',
    borderRadius: 10,
    transition: 'all 0.2s',
  },
  joinBtnDisabled: {
    background: 'var(--border)',
    color: 'var(--text-muted)',
    cursor: 'not-allowed',
  },
}
