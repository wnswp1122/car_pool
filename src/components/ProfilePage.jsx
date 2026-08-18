import React, { useEffect, useState } from 'react'
import { getMyProfile, updateProfile, withdrawMember } from '../api/members'
import { getMyDriver, registerDriver, updateDriver } from '../api/drivers'
import { getCarColors } from '../api/vehicles'
import { StarIcon } from './Icons'

const SUCCESS_COLOR = '#2f7a4f'

export default function ProfilePage({ onLogout }) {
  const [profile, setProfile] = useState(null)
  const [loadError, setLoadError] = useState(null)

  const [nicknameForm, setNicknameForm] = useState({ nickname: '' })
  const [nicknameMsg, setNicknameMsg] = useState(null)
  const [nicknameLoading, setNicknameLoading] = useState(false)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState(null)
  const [pwLoading, setPwLoading] = useState(false)

  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [withdrawMsg, setWithdrawMsg] = useState(null)

  // 드라이버 등록 상태
  const [driver, setDriver] = useState(null)
  const [driverLoading, setDriverLoading] = useState(true)
  const [driverMsg, setDriverMsg] = useState(null)
  const [driverSubmitting, setDriverSubmitting] = useState(false)

  const [colors, setColors] = useState([])
  const [carModel, setCarModel] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [carNumber, setCarNumber] = useState('')

  // 드라이버 정보 로드
  useEffect(() => {
    getMyDriver()
      .then(d => {
        setDriver(d)
        setCarModel(d.carModel || '')
        setSelectedColor(d.carColor || '')
        setCarNumber(d.carNumber || '')
      })
      .catch(() => setDriver(false))
      .finally(() => setDriverLoading(false))
  }, [])

  // 색상 목록 로드
  useEffect(() => {
    getCarColors().then(setColors).catch(() => {})
  }, [])

  async function handleDriverSubmit(e) {
    e.preventDefault()
    if (!carModel.trim() || !selectedColor || !carNumber.trim()) {
      setDriverMsg({ ok: false, text: '차량 모델, 색상, 차량 번호를 모두 입력해주세요.' })
      return
    }
    setDriverSubmitting(true)
    setDriverMsg(null)
    try {
      const fn = driver ? updateDriver : registerDriver
      const result = await fn(carModel.trim(), selectedColor, carNumber.trim())
      setDriver(result)
      setDriverMsg({ ok: true, text: driver ? '차량 정보가 수정되었습니다.' : '드라이버로 등록되었습니다.' })
    } catch (err) {
      setDriverMsg({ ok: false, text: err.message || '처리에 실패했습니다.' })
    } finally {
      setDriverSubmitting(false)
    }
  }

  useEffect(() => {
    getMyProfile()
      .then(data => {
        setProfile(data)
        setNicknameForm({ nickname: data.nickname })
      })
      .catch(() => setLoadError('프로필을 불러오지 못했습니다.'))
  }, [])

  async function handleNicknameSubmit(e) {
    e.preventDefault()
    const next = nicknameForm.nickname.trim()
    if (!next) return
    setNicknameLoading(true)
    setNicknameMsg(null)
    try {
      const updated = await updateProfile({ nickname: next })
      setProfile(updated)
      setNicknameMsg({ ok: true, text: '닉네임이 변경되었습니다.' })
    } catch (err) {
      setNicknameMsg({ ok: false, text: err.message || '변경에 실패했습니다.' })
    } finally {
      setNicknameLoading(false)
    }
  }

  async function handleWithdraw() {
    if (!window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제되며 되돌릴 수 없습니다.')) return
    setWithdrawLoading(true)
    setWithdrawMsg(null)
    try {
      await withdrawMember()
      if (onLogout) onLogout()
    } catch (e) {
      setWithdrawMsg({ ok: false, text: e.message || '탈퇴에 실패했습니다.' })
    } finally {
      setWithdrawLoading(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    const { currentPassword, newPassword, confirm } = pwForm
    if (!currentPassword || !newPassword) {
      setPwMsg({ ok: false, text: '현재 비밀번호와 새 비밀번호를 입력해주세요.' })
      return
    }
    if (newPassword !== confirm) {
      setPwMsg({ ok: false, text: '새 비밀번호가 일치하지 않습니다.' })
      return
    }
    if (newPassword.length < 8) {
      setPwMsg({ ok: false, text: '비밀번호는 8자 이상이어야 합니다.' })
      return
    }
    setPwLoading(true)
    setPwMsg(null)
    try {
      await updateProfile({ currentPassword, newPassword })
      setPwMsg({ ok: true, text: '비밀번호가 변경되었습니다.' })
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      setPwMsg({ ok: false, text: err.message || '변경에 실패했습니다.' })
    } finally {
      setPwLoading(false)
    }
  }

  if (loadError) {
    return <div style={styles.errorBox}>{loadError}</div>
  }

  if (!profile) {
    return <div style={styles.loading}>프로필 불러오는 중...</div>
  }

  const initial = profile.nickname ? profile.nickname[0].toUpperCase() : '?'

  return (
    <div style={styles.page}>
      {/* 프로필 요약 */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.dot} />
          <h2 style={styles.cardTitle}>내 프로필</h2>
        </div>
        <div style={styles.profileRow}>
          <div style={styles.avatar}>{initial}</div>
          <div>
            <div style={styles.profileName}>{profile.nickname}</div>
            <div style={styles.profileMeta}>{profile.email}</div>
            <div style={styles.profileMeta}>
              가입일: <span className="tabular-nums">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('ko-KR') : '-'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 닉네임 수정 */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.dot} />
          <h2 style={styles.cardTitle}>닉네임 변경</h2>
        </div>
        <form onSubmit={handleNicknameSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="새 닉네임"
            maxLength={50}
            value={nicknameForm.nickname}
            onChange={e => setNicknameForm({ nickname: e.target.value })}
          />
          <button style={styles.submitBtn} disabled={nicknameLoading}>
            {nicknameLoading ? '변경 중...' : '변경하기'}
          </button>
        </form>
        {nicknameMsg && (
          <div style={{ ...styles.msg, color: nicknameMsg.ok ? SUCCESS_COLOR : 'var(--accent3)' }}>
            {nicknameMsg.text}
          </div>
        )}
      </section>

      {/* 비밀번호 변경 */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.dot} />
          <h2 style={styles.cardTitle}>비밀번호 변경</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="password"
            placeholder="현재 비밀번호"
            value={pwForm.currentPassword}
            onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="새 비밀번호 (8자 이상)"
            value={pwForm.newPassword}
            onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="새 비밀번호 확인"
            value={pwForm.confirm}
            onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
          />
          <button style={styles.submitBtn} disabled={pwLoading}>
            {pwLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
        {pwMsg && (
          <div style={{ ...styles.msg, color: pwMsg.ok ? SUCCESS_COLOR : 'var(--accent3)' }}>
            {pwMsg.text}
          </div>
        )}
      </section>

      {/* 드라이버 등록 */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.dot} />
          <h2 style={styles.cardTitle}>드라이버 등록</h2>
          {driver && <span style={{ ...styles.badge, background: 'rgba(47,122,79,0.1)', color: SUCCESS_COLOR }}>등록됨</span>}
        </div>
        {driverLoading ? (
          <div style={styles.infoBox}>불러오는 중...</div>
        ) : (
          <>
            {driver && (
              <div style={{ ...styles.infoBox, marginBottom: '1rem' }}>
                현재 차량: <strong>{driver.carModel}</strong> / {driver.carColorLabel} / <strong className="tabular-nums">{driver.carNumber}</strong>
                {driver.averageRating > 0 && (
                  <> / <StarIcon size={12} fill="#b8860b" style={{ color: '#b8860b', verticalAlign: -2 }} /> <span className="tabular-nums">{driver.averageRating.toFixed(1)}</span></>
                )}
              </div>
            )}
            <form onSubmit={handleDriverSubmit} style={styles.form}>
              <input
                style={styles.input}
                placeholder="차량 모델 (예: 소나타, 아반떼)"
                value={carModel}
                onChange={e => setCarModel(e.target.value)}
              />
              <select
                style={styles.input}
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
              >
                <option value="">색상 선택</option>
                {colors.map(c => (
                  <option key={c.name} value={c.name}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input
                style={styles.input}
                placeholder="차량 번호 (예: 12가3456)"
                value={carNumber}
                onChange={e => setCarNumber(e.target.value)}
              />
              <button style={styles.submitBtn} disabled={driverSubmitting}>
                {driverSubmitting ? '처리 중...' : driver ? '차량 정보 수정' : '드라이버 등록'}
              </button>
            </form>
            {driverMsg && (
              <div style={{ ...styles.msg, color: driverMsg.ok ? SUCCESS_COLOR : 'var(--accent3)' }}>
                {driverMsg.text}
              </div>
            )}
          </>
        )}
      </section>

      {/* 회원 탈퇴 */}
      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.dot} />
          <h2 style={styles.cardTitle}>회원 탈퇴</h2>
          <span style={{ ...styles.badge, background: 'rgba(179,73,47,0.08)', color: 'var(--accent3)' }}>주의</span>
        </div>
        <div style={styles.infoBox}>
          탈퇴 시 모든 게시글, 댓글, 신청 내역이 삭제되며 되돌릴 수 없습니다.
        </div>
        <button
          style={{ ...styles.submitBtn, background: 'var(--surface)', border: '1px solid var(--accent3)', color: 'var(--accent3)', marginTop: '1rem' }}
          onClick={handleWithdraw}
          disabled={withdrawLoading}
        >
          {withdrawLoading ? '처리 중...' : '회원 탈퇴'}
        </button>
        {withdrawMsg && (
          <div style={{ ...styles.msg, color: 'var(--accent3)' }}>{withdrawMsg.text}</div>
        )}
      </section>
    </div>
  )
}

const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: 680,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1.5rem',
    boxShadow: 'var(--card-glow)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.2rem',
  },
  dot: {
    width: 6,
    height: 6,
    background: 'var(--accent)',
    borderRadius: '50%',
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 500,
    letterSpacing: '-0.015em',
    color: 'var(--text)',
    margin: 0,
  },
  badge: {
    fontSize: '0.68rem',
    fontWeight: 500,
    padding: '0.15rem 0.5rem',
    borderRadius: 100,
    marginLeft: 'auto',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    fontWeight: 500,
    flexShrink: 0,
  },
  profileName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: '1.05rem',
    color: 'var(--text)',
    marginBottom: '0.3rem',
  },
  profileMeta: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    marginBottom: '0.15rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
  },
  input: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.65rem 0.9rem',
    color: 'var(--text)',
    fontSize: '0.88rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: `border-color 200ms ${EASE}`,
  },
  submitBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '0.9375rem',
    padding: '0.75rem',
    borderRadius: 8,
    transition: `background 200ms ${EASE}`,
  },
  msg: {
    marginTop: '0.5rem',
    fontSize: '0.83rem',
    fontWeight: 500,
  },
  infoBox: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.65rem 0.9rem',
    lineHeight: 1.6,
  },
  loading: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
  },
  errorBox: {
    padding: '3rem',
    textAlign: 'center',
    color: 'var(--accent3)',
  },
}
