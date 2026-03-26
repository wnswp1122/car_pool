import React from 'react'

export default function Nav({ currentPage, onPageChange, onOpenPost }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        같이<span style={{ color: 'var(--text)' }}>타</span>
      </div>
      <div style={styles.navLinks}>
        <button
          style={{ ...styles.navTab, ...(currentPage === 'list' ? styles.navTabActive : {}) }}
          onClick={() => onPageChange('list')}
        >
          카풀 찾기
        </button>
        <button
          style={{ ...styles.navTab, ...(currentPage === 'my' ? styles.navTabActive : {}) }}
          onClick={() => onPageChange('my')}
        >
          내 카풀
        </button>
        <button style={styles.btnPrimary} onClick={onOpenPost}>
          + 게시글 등록
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 500,
    background: 'rgba(247,246,242,0.95)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--accent)',
    letterSpacing: '-0.5px',
  },
  navLinks: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  navTab: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    padding: '0.5rem 1rem',
    borderRadius: 8,
    transition: 'all 0.2s',
  },
  navTabActive: {
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
  },
  btnPrimary: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    padding: '0.55rem 1.2rem',
    borderRadius: 8,
    transition: 'all 0.2s',
  },
}
