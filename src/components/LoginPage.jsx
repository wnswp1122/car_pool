import React, { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', nickname: '' })

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.bg} />

      <div style={styles.card}>
        {/* 로고 */}
        <div style={styles.logo}>
          같이<span style={{ color: 'var(--text)' }}>타</span>
        </div>
        <p style={styles.tagline}>목적지가 같은 사람들을 연결합니다</p>

        {/* 탭 */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === 'login' ? styles.tabActive : {}) }}
            onClick={() => setTab('login')}
          >
            로그인
          </button>
          <button
            style={{ ...styles.tab, ...(tab === 'signup' ? styles.tabActive : {}) }}
            onClick={() => setTab('signup')}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <div style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>이메일</label>
            <input
              style={styles.input}
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onLogin()}
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
              />
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>비밀번호</label>
            <input
              style={styles.input}
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && onLogin()}
            />
          </div>

          {tab === 'login' && (
            <div style={styles.forgotRow}>
              <button style={styles.forgotBtn}>비밀번호를 잊으셨나요?</button>
            </div>
          )}

          <button style={styles.submitBtn} onClick={onLogin}>
            {tab === 'login' ? '로그인' : '회원가입'}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>또는</span>
            <span style={styles.dividerLine} />
          </div>

          <button style={styles.kakaoBtn} onClick={onLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5C4.86 1.5 1.5 4.19 1.5 7.5c0 2.09 1.24 3.93 3.12 5.03L3.75 16.5l3.67-2.43A8.4 8.4 0 009 14.25c4.14 0 7.5-2.69 7.5-5.75S13.14 1.5 9 1.5z" fill="#3A1D1D"/>
            </svg>
            카카오로 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative',
  },
  bg: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 20px 60px rgba(42,42,31,0.1)',
  },
  logo: {
    fontFamily: "'Space Mono', monospace",
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--accent)',
    textAlign: 'center',
    marginBottom: '0.4rem',
  },
  tagline: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '2rem',
  },
  tabs: {
    display: 'flex',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: 4,
    marginBottom: '1.5rem',
    gap: 4,
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.55rem',
    borderRadius: 9,
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'var(--surface)',
    color: 'var(--accent)',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  fieldGroup: {
    marginBottom: '0.8rem',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.4rem',
  },
  input: {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0.75rem 1rem',
    color: 'var(--text)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '0.4rem',
    marginTop: '-0.4rem',
  },
  forgotBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    padding: 0,
  },
  submitBtn: {
    width: '100%',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '1rem',
    padding: '0.85rem',
    borderRadius: 10,
    marginTop: '0.5rem',
    transition: 'all 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    margin: '0.5rem 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'var(--border)',
  },
  dividerText: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
  },
  kakaoBtn: {
    width: '100%',
    background: '#FEE500',
    color: '#3A1D1D',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '0.9rem',
    padding: '0.85rem',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
  },
}
