import React from 'react'

export default function Toast({ message }) {
  if (!message) return null
  return (
    <div style={styles.toast}>
      {message}
    </div>
  )
}

const styles = {
  toast: {
    position: 'fixed',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--surface)',
    border: '1px solid var(--accent)',
    color: 'var(--accent)',
    padding: '0.75rem 1.5rem',
    borderRadius: 100,
    fontSize: '0.86rem',
    fontWeight: 600,
    zIndex: 700,
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(107,124,63,0.2)',
    animation: 'fadeIn 0.3s ease',
  },
}
