import React, { useState } from 'react'
import { login, signup } from '../api/auth'
import { CarIcon, UsersIcon, MapPinIcon, AlertCircleIcon } from './Icons'

const HIGHLIGHTS = [
  { Icon: CarIcon, text: '가까운 방향의 카풀을 실시간으로 찾아보세요' },
  { Icon: MapPinIcon, text: '출발지·목적지 기반으로 딱 맞는 동선을 매칭합니다' },
  { Icon: UsersIcon, text: '연료비를 나누고, 새로운 이동 습관을 만들어요' },
]

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', nickname: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit() {
    setError('')
    if (!form.email || !form.password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    if (tab === 'signup' && !form.nickname) {
      setError('닉네임을 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      if (tab === 'signup') {
        await signup(form.email, form.password, form.nickname)
      }
      const token = await login(form.email, form.password)
      onLogin(token)
    } catch (e) {
      setError(e.message || '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.band} />

      <div className="login-split" style={styles.split}>
        {/* 좌측: 브랜드 소개 */}
        <div style={styles.brandCol}>
          <div style={styles.logo}>
            같이<span style={{ color: 'var(--accent)' }}>타</span>
          </div>
          <h1 style={styles.h1}>목적지가 같은 사람들을<br />연결합니다</h1>
          <div style={styles.highlights}>
            {HIGHLIGHTS.map((h, i) => (
              <div key={i} style={styles.highlightRow}>
                <h.Icon size={17} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <span>{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 폼 */}
        <div style={styles.formCol}>
          <div style={styles.card}>
            <div style={styles.tabs}>
              <button
                style={{ ...styles.tab, ...(tab === 'login' ? styles.tabActive : {}) }}
                onClick={() => { setTab('login'); setError('') }}
              >
                로그인
              </button>
              <button
                style={{ ...styles.tab, ...(tab === 'signup' ? styles.tabActive : {}) }}
                onClick={() => { setTab('signup'); setError('') }}
              >
                회원가입
              </button>
            </div>

            <div style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>이메일</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {tab === 'signup' && (
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>닉네임</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={form.nickname}
                    onChange={e => set('nickname', e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}

              <div style={styles.fieldGroup}>
                <label style={styles.label}>비밀번호</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="비밀번호를 입력하세요 (8자 이상)"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {error && (
                <div style={styles.errorBox}>
                  <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
                  {error}
                </div>
              )}

              <button style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
                {loading ? '처리 중...' : tab === 'login' ? '로그인' : '회원가입'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const styles = {
  wrapper: {
    minHeight: '100vh',
    position: 'relative',
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
  split: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    maxWidth: 1120,
    margin: '0 auto',
    padding: '1.5rem',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 6fr) minmax(0, 6fr)',
    gap: '3rem',
    alignItems: 'center',
  },
  brandCol: {
    padding: '2rem 1rem',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    fontWeight: 500,
    letterSpacing: '-0.03em',
    color: 'var(--text)',
    marginBottom: '1.8rem',
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.9rem, 4vw, 2.6rem)',
    fontWeight: 500,
    letterSpacing: '-0.03em',
    lineHeight: 1.18,
    color: 'var(--text)',
    marginBottom: '2rem',
    wordBreak: 'keep-all',
  },
  highlights: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.95rem',
  },
  highlightRow: {
    display: 'flex',
    gap: '0.65rem',
    alignItems: 'flex-start',
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
  },
  formCol: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '2.2rem 2rem',
    width: '100%',
    maxWidth: 400,
    boxShadow: 'var(--card-glow)',
  },
  tabs: {
    display: 'flex',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: 3,
    marginBottom: '1.6rem',
    gap: 2,
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.55rem',
    borderRadius: 7,
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    transition: `background 200ms ${EASE}, color 200ms ${EASE}`,
  },
  tabActive: {
    background: 'var(--surface)',
    color: 'var(--accent)',
    boxShadow: 'var(--card-glow)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  fieldGroup: {
    marginBottom: '0.9rem',
  },
  label: {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.45rem',
  },
  input: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0.75rem 1rem',
    color: 'var(--text)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: `border-color 200ms ${EASE}`,
    boxSizing: 'border-box',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: 'var(--accent3)',
    fontSize: '0.82rem',
    marginBottom: '0.6rem',
    padding: '0.55rem 0.8rem',
    background: 'rgba(179,73,47,0.07)',
    border: '1px solid rgba(179,73,47,0.2)',
    borderRadius: 8,
  },
  submitBtn: {
    width: '100%',
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '0.9375rem',
    padding: '0.85rem',
    borderRadius: 999,
    marginTop: '0.5rem',
    transition: `background 200ms ${EASE}`,
  },
}
