import React from 'react'
import { useIsMobile } from '../hooks/useMobile'

export default function Toast({ message }) {
  const isMobile = useIsMobile()
  if (!message) return null

  const bottom = isMobile ? 'calc(var(--bottom-nav-h) + 0.8rem)' : '2rem'

  return (
    <div style={{ ...styles.toast, bottom }}>
      <span style={styles.dot} />
      {message}
    </div>
  )
}

const styles = {
  toast: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderLeft: '3px solid var(--accent)',
    color: 'var(--text)',
    padding: '0.7rem 1.3rem 0.7rem 1rem',
    borderRadius: 10,
    fontFamily: 'var(--font-body)',
    fontSize: '0.86rem',
    fontWeight: 500,
    zIndex: 700,
    whiteSpace: 'nowrap',
    boxShadow: 'var(--card-glow)',
    animation: 'toastSlide 0.25s ease both',
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--accent)',
    flexShrink: 0,
  },
}
