import React, { useState } from 'react'
import { submitReview } from '../api/reviews'
import { StarIcon, XIcon, AlertCircleIcon } from './Icons'

const STAR_COLOR = '#b8860b'

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', margin: '1rem 0' }}>
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'transform 150ms cubic-bezier(0.22,0.61,0.36,1)',
              transform: filled ? 'scale(1.1)' : 'scale(1)',
              padding: '0.15rem',
            }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
          >
            <StarIcon size={28} fill={filled ? STAR_COLOR : 'none'} style={{ color: filled ? STAR_COLOR : 'var(--border)' }} />
          </button>
        )
      })}
    </div>
  )
}

const RATING_LABELS = { 1: '별로예요', 2: '아쉬워요', 3: '보통이에요', 4: '좋았어요', 5: '최고예요!' }

export default function ReviewModal({ ride, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!rating) { setErr('별점을 선택해주세요.'); return }
    setLoading(true)
    setErr('')
    try {
      await submitReview(ride.id, rating, comment.trim() || null)
      onSubmitted?.()
      onClose()
    } catch (error) {
      setErr(error.message || '평가 등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay-fade" style={styles.overlay} onClick={onClose}>
      <div className="modal-enter" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>드라이버 평가</h2>
          <button style={styles.closeBtn} onClick={onClose}><XIcon size={15} /></button>
        </div>

        <div style={styles.routeInfo}>
          <span style={styles.routeText}>
            {ride.departureLocation || '출발지'} → {ride.destinationLocation || '목적지'}
          </span>
          <span style={styles.rideId}>운행 #<span className="tabular-nums">{ride.id}</span></span>
        </div>

        <form onSubmit={handleSubmit}>
          <StarRating value={rating} onChange={setRating} />
          {rating > 0 && (
            <div style={styles.ratingLabel}>{RATING_LABELS[rating]}</div>
          )}

          <textarea
            style={styles.textarea}
            placeholder="후기를 남겨주세요 (선택사항)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxLength={500}
            rows={4}
          />
          <div style={styles.charCount} className="tabular-nums">{comment.length}/500</div>

          {err && (
            <div style={styles.errorBox}>
              <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
              {err}
            </div>
          )}

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>취소</button>
            <button type="submit" style={styles.submitBtn} disabled={loading || !rating}>
              {loading ? '등록 중...' : '평가 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(26,34,51,0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000, padding: '1rem',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '1.8rem',
    width: '100%', maxWidth: 400,
    boxShadow: 'var(--card-glow)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.15rem', fontWeight: 500, letterSpacing: '-0.02em',
    color: 'var(--text)', margin: 0,
  },
  closeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    padding: '0.4rem',
    borderRadius: 8,
    transition: `border-color 200ms ${EASE}`,
  },
  routeInfo: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.3rem', marginBottom: '0.5rem',
  },
  routeText: {
    fontSize: '0.92rem', fontWeight: 500, color: 'var(--text)',
  },
  rideId: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem', color: 'var(--text-muted)',
  },
  ratingLabel: {
    textAlign: 'center', fontSize: '0.9rem', fontWeight: 500,
    color: STAR_COLOR, marginBottom: '1rem',
  },
  textarea: {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid var(--border)', borderRadius: 10,
    padding: '0.8rem', fontSize: '0.85rem',
    fontFamily: 'var(--font-body)', color: 'var(--text)',
    background: 'var(--surface)', resize: 'vertical',
    outline: 'none',
    transition: `border-color 200ms ${EASE}`,
  },
  charCount: {
    textAlign: 'right', fontSize: '0.72rem', color: 'var(--text-dim)',
    marginTop: '0.3rem',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    color: 'var(--accent3)', fontSize: '0.83rem',
    background: 'rgba(179,73,47,0.07)',
    border: '1px solid rgba(179,73,47,0.2)',
    borderRadius: 8,
    padding: '0.6rem 0.8rem', marginTop: '0.8rem',
  },
  actions: {
    display: 'flex', gap: '0.6rem', marginTop: '1.2rem',
  },
  cancelBtn: {
    flex: 1, background: 'var(--surface)',
    border: '1px solid var(--border)', borderRadius: 8,
    padding: '0.7rem', fontSize: '0.88rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500, cursor: 'pointer', color: 'var(--text-muted)',
    transition: `border-color 200ms ${EASE}`,
  },
  submitBtn: {
    flex: 2, background: 'var(--accent)', color: '#fff',
    border: '1px solid var(--accent)', borderRadius: 999,
    padding: '0.7rem', fontSize: '0.88rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500, cursor: 'pointer',
    transition: `background 200ms ${EASE}`,
  },
}
