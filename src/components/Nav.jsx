import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useIsMobile } from '../hooks/useMobile'
import { SearchIcon, ClipboardIcon, CarIcon, UserIcon, LogOutIcon, PlusIcon } from './Icons'

const NAV_TABS = [
  { path: '/',        label: '카풀 찾기', Icon: SearchIcon },
  { path: '/my',      label: '내 카풀',   Icon: ClipboardIcon },
  { path: '/rides',   label: '내 운행',   Icon: CarIcon },
  { path: '/profile', label: '프로필',    Icon: UserIcon },
]

export default function Nav({ onOpenPost, onLogout }) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          같이<span style={{ color: 'var(--text)' }}>타</span>
        </div>

        {/* 데스크탑: 탭 + 버튼 */}
        {!isMobile && (
          <div style={styles.navLinks}>
            {NAV_TABS.map(t => (
              <NavLink
                key={t.path}
                to={t.path}
                end={t.path === '/'}
                style={({ isActive }) => ({ ...styles.navTab, ...(isActive ? styles.navTabActive : {}) })}
              >
                {t.label}
              </NavLink>
            ))}
            <button style={styles.btnPrimary} onClick={onOpenPost}>
              <PlusIcon size={15} />
              게시글 등록
            </button>
            <button style={styles.btnLogout} onClick={onLogout} aria-label="로그아웃">
              <LogOutIcon size={15} />
              로그아웃
            </button>
          </div>
        )}

        {/* 모바일: 로그아웃만 */}
        {isMobile && (
          <button style={styles.btnLogout} onClick={onLogout} aria-label="로그아웃">
            <LogOutIcon size={15} />
            로그아웃
          </button>
        )}
      </nav>

      {/* 모바일: 하단 탭 바 */}
      {isMobile && (
        <div style={styles.bottomNav}>
          {NAV_TABS.map(t => {
            const Icon = t.Icon
            return (
              <NavLink
                key={t.path}
                to={t.path}
                end={t.path === '/'}
                style={({ isActive }) => ({
                  ...styles.bottomTab,
                  ...(isActive ? styles.bottomTabActive : {}),
                })}
              >
                <Icon size={20} />
                <span style={styles.bottomLabel}>{t.label}</span>
              </NavLink>
            )
          })}
        </div>
      )}

      {/* 모바일: FAB */}
      {isMobile && (
        <button style={styles.fab} onClick={onOpenPost} aria-label="게시글 등록">
          <PlusIcon size={22} />
        </button>
      )}
    </>
  )
}

const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 500,
    background: 'rgba(246,245,243,0.88)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 500,
    color: 'var(--accent)',
    letterSpacing: '-0.035em',
    cursor: 'pointer',
    userSelect: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '0.15rem',
    alignItems: 'center',
  },
  navTab: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: '0.45rem 0.8rem',
    borderRadius: 8,
    transition: `color 200ms ${EASE}, background 200ms ${EASE}`,
    textDecoration: 'none',
    display: 'inline-block',
  },
  navTabActive: {
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem',
    padding: '0.45rem 0.9rem',
    borderRadius: 8,
    transition: `background 200ms ${EASE}, border-color 200ms ${EASE}`,
    marginLeft: '0.6rem',
  },
  btnLogout: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'transparent',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    padding: '0.42rem 0.75rem',
    borderRadius: 8,
    marginLeft: '0.35rem',
    transition: `border-color 200ms ${EASE}, color 200ms ${EASE}`,
  },
  /* 하단 탭 바 */
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--bottom-nav-h)',
    background: 'rgba(246,245,243,0.94)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    zIndex: 500,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  bottomTab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.28rem',
    textDecoration: 'none',
    color: 'var(--text-dim)',
    transition: `color 200ms ${EASE}`,
    paddingTop: '0.3rem',
  },
  bottomTabActive: {
    color: 'var(--accent)',
  },
  bottomLabel: {
    fontSize: '0.6875rem',
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  /* FAB */
  fab: {
    position: 'fixed',
    bottom: 'calc(var(--bottom-nav-h) + 1rem)',
    right: '1.2rem',
    width: 52,
    height: 52,
    borderRadius: 999,
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    boxShadow: 'var(--card-glow)',
    zIndex: 490,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `background 200ms ${EASE}`,
  },
}
