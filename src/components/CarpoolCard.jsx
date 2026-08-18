import React from 'react'
import { getTagStyle } from '../data/tags'
import { CalendarIcon, ClockIcon, UsersIcon, StarIcon } from './Icons'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']
function fmtDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.getMonth() + 1}/${dt.getDate()}(${DAYS[dt.getDay()]})`
}
function fmtPrice(p) {
  if (!p || p === '') return '무료'
  return Number(p).toLocaleString() + '원'
}

function TagPill({ tag, size = 'normal' }) {
  const t = getTagStyle(tag?.name)
  const fs = size === 'small' ? '0.66rem' : '0.72rem'
  const pad = size === 'small' ? '0.15rem 0.42rem' : '0.22rem 0.6rem'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: fs,
      fontWeight: 500,
      padding: pad,
      borderRadius: 100,
      whiteSpace: 'nowrap',
      background: t.bg,
      color: t.tc,
      border: `1px solid ${t.tc}33`,
    }}>
      {tag?.name}
    </span>
  )
}

export { TagPill, fmtDate, fmtPrice }

export default function CarpoolCard({ post, onOpen, onDelete, onClose, showDelete, showClose }) {
  const avail = post.seats - post.filled
  const full = avail <= 0
  const isClosed = post.status === 'CLOSED'

  return (
    <div
      className="carpool-card"
      style={{
        ...styles.card,
        ...(isClosed ? { opacity: 0.75 } : {}),
      }}
      onClick={() => onOpen(post.id)}
    >
      <div className="carpool-card-topbar" style={styles.topBar} />
      <div style={styles.cardHeader}>
        <div style={styles.routeRow}>
          <span>{post.from}</span>
          <span style={{ color: 'var(--accent)' }}>→</span>
          <span>{post.to}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ ...styles.badge, ...(isClosed ? styles.badgeClosed : full ? styles.badgeFull : styles.badgeSeats) }}>
            {isClosed ? '마감됨' : full ? '마감' : `${avail}석 남음`}
          </div>
          {showClose && !isClosed && (
            <button
              style={styles.closeBtn}
              onClick={e => { e.stopPropagation(); onClose(post.id) }}
            >
              신청 마감
            </button>
          )}
          {showDelete && (
            <button
              style={styles.deleteBtn}
              onClick={e => { e.stopPropagation(); onDelete(post.id) }}
            >
              삭제
            </button>
          )}
        </div>
      </div>
      <div style={styles.meta}>
        <span style={styles.metaItem}><CalendarIcon size={13} style={{ color: 'var(--text-dim)' }} /> {fmtDate(post.date)}</span>
        <span style={styles.metaItem}><ClockIcon size={13} style={{ color: 'var(--text-dim)' }} /> {post.time}</span>
        <span style={styles.metaItem}><UsersIcon size={13} style={{ color: 'var(--text-dim)' }} /> <span className="tabular-nums">{post.filled}/{post.seats}</span>명</span>
      </div>
      {post.tags?.length > 0 && (
        <div style={styles.tags}>
          {post.tags.map(tag => <TagPill key={tag.id} tag={tag} />)}
        </div>
      )}
      {post.desc && <div style={styles.desc}>{post.desc}</div>}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={{ ...styles.avatar, background: `${post.color}1a`, color: post.color }}>
            {(post.nickname || '?')[0]}
          </div>
          <div>
            <div style={styles.userName}>{post.nickname || '익명'}</div>
            <div style={styles.rating}>
              <StarIcon size={11} style={{ color: '#b8860b' }} />
              <span className="tabular-nums">{post.rating}</span> · <span className="tabular-nums">{post.trips}</span>회
            </div>
          </div>
        </div>
        <div style={styles.price}>
          <span className="tabular-nums">{fmtPrice(post.price)}</span>
          {!!post.price && <span style={styles.priceSub}>/인</span>}
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1.3rem',
    cursor: 'pointer',
    boxShadow: 'var(--card-glow)',
    position: 'relative',
    overflow: 'hidden',
    outline: 'none',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: 'var(--accent)',
    transition: 'opacity 0.2s',
    opacity: 0,
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.9rem',
  },
  routeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: '1rem',
    letterSpacing: '-0.01em',
    color: 'var(--text)',
  },
  badge: {
    fontSize: '0.68rem',
    fontWeight: 500,
    padding: '0.22rem 0.55rem',
    borderRadius: 6,
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap',
  },
  badgeSeats: {
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
  },
  badgeFull: {
    background: 'rgba(179,73,47,0.08)',
    color: 'var(--accent3)',
  },
  badgeClosed: {
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
  },
  meta: {
    display: 'flex',
    gap: '0.9rem',
    marginBottom: '0.8rem',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    marginBottom: '0.85rem',
  },
  desc: {
    fontSize: '0.83rem',
    color: 'var(--text-muted)',
    lineHeight: 1.55,
    marginBottom: '0.8rem',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '0.85rem',
    borderTop: '1px solid var(--border)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: 500,
    flexShrink: 0,
  },
  userName: {
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'var(--text)',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  price: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text)',
  },
  priceSub: {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
  },
  deleteBtn: {
    background: 'rgba(179,73,47,0.08)',
    color: 'var(--accent3)',
    border: 'none',
    borderRadius: 6,
    padding: '0.25rem 0.6rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
  closeBtn: {
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
    border: '1px solid var(--accent)',
    borderRadius: 6,
    padding: '0.25rem 0.6rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    fontWeight: 500,
  },
}
