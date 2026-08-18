import React, { useEffect, useRef, useState, useCallback } from 'react'
import { getTagStyle } from '../data/tags'
import { fmtPrice } from './CarpoolCard'
import { fetchComments, createComment, removeComment } from '../api/comments'
import { getPostApplications, acceptApplication, rejectApplication, cancelAcceptApplication, cancelRejectApplication } from '../api/applications'
import { useIsMobile } from '../hooks/useMobile'
import { XIcon, StarIcon, CheckIcon } from './Icons'

const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY

let sdkPromise = null
function loadKakaoSDK() {
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    if (window.kakao?.maps?.Map) { resolve(); return }
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`
    script.onload = () => window.kakao.maps.load(resolve)
    script.onerror = () => reject(new Error('카카오맵 SDK 로드 실패'))
    document.head.appendChild(script)
  })
  return sdkPromise
}

async function fetchOsrmRoute(fromLat, fromLng, toLat, toLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&overview=full`
    const res = await fetch(url)
    const data = await res.json()
    // OSRM은 [lng, lat] 순서로 반환 → [lat, lng] 로 swap
    return data.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) ?? null
  } catch {
    return null
  }
}

function RouteMap({ fromLat, fromLng, toLat, toLng }) {
  const containerRef = useRef(null)
  const [sdkReady, setSdkReady] = useState(!!window.kakao?.maps?.Map)

  useEffect(() => {
    if (sdkReady) return
    loadKakaoSDK().then(() => setSdkReady(true)).catch(() => {})
  }, [sdkReady])

  useEffect(() => {
    if (!sdkReady || !containerRef.current) return
    const hasFrom = fromLat != null && fromLng != null
    const hasTo   = toLat != null && toLng != null
    if (!hasFrom && !hasTo) return

    const kakao = window.kakao
    const center = hasFrom
      ? new kakao.maps.LatLng(fromLat, fromLng)
      : new kakao.maps.LatLng(toLat, toLng)
    const map = new kakao.maps.Map(containerRef.current, { center, level: 6 })

    // 출발지 마커
    if (hasFrom) {
      const el = document.createElement('div')
      el.innerHTML = `<div style="width:12px;height:12px;border-radius:50%;background:#4f46e5;border:2px solid white;box-shadow:0 1px 4px rgba(26,34,51,0.3);"></div>`
      new kakao.maps.CustomOverlay({ position: new kakao.maps.LatLng(fromLat, fromLng), content: el, yAnchor: 0.5 }).setMap(map)
    }
    // 도착지 마커
    if (hasTo) {
      const el = document.createElement('div')
      el.innerHTML = `<div style="width:12px;height:12px;border-radius:50%;background:#1a2233;border:2px solid white;box-shadow:0 1px 4px rgba(26,34,51,0.3);"></div>`
      new kakao.maps.CustomOverlay({ position: new kakao.maps.LatLng(toLat, toLng), content: el, yAnchor: 0.5 }).setMap(map)
    }

    if (hasFrom && hasTo) {
      const bounds = new kakao.maps.LatLngBounds()
      bounds.extend(new kakao.maps.LatLng(fromLat, fromLng))
      bounds.extend(new kakao.maps.LatLng(toLat, toLng))
      map.setBounds(bounds, 40)

      // OSRM 실제 도로 경로 그리기 (실패 시 직선 fallback)
      fetchOsrmRoute(fromLat, fromLng, toLat, toLng).then(coords => {
        const path = coords
          ? coords.map(([lat, lng]) => new kakao.maps.LatLng(lat, lng))
          : [new kakao.maps.LatLng(fromLat, fromLng), new kakao.maps.LatLng(toLat, toLng)]

        new kakao.maps.Polyline({
          path,
          strokeWeight: 3,
          strokeColor: '#4f46e5',
          strokeOpacity: 0.8,
          strokeStyle: coords ? 'solid' : 'dashed', // 실제 경로는 실선, fallback은 점선
        }).setMap(map)
      })
    }
  }, [sdkReady, fromLat, fromLng, toLat, toLng])

  if (fromLat == null && toLat == null) return null

  return (
    <div style={mapStyle}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {!sdkReady && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', background: 'var(--surface2)' }}>
          지도 불러오는 중...
        </div>
      )}
    </div>
  )
}

const mapStyle = {
  position: 'relative',
  height: 170,
  borderRadius: 10,
  overflow: 'hidden',
  marginBottom: '1.2rem',
  border: '1px solid var(--border)',
}

function CommentItem({ comment, currentMemberId, onDelete }) {
  const isOwn = comment.memberId === currentMemberId
  return (
    <div style={styles.commentItem}>
      <div style={styles.commentMeta}>
        <span style={styles.commentNickname}>{comment.nickname}</span>
        <span style={styles.commentTime}>
          {new Date(comment.createdAt).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        {isOwn && (
          <button style={styles.commentDeleteBtn} onClick={() => onDelete(comment.id)}>삭제</button>
        )}
      </div>
      <div style={styles.commentContent}>{comment.content}</div>
    </div>
  )
}

export default function DetailModal({ post, onClose, onJoin, currentMemberId }) {
  const isMobile = useIsMobile()
  if (!post) return null

  const avail = post.seats - post.filled
  const full = avail <= 0

  const [comments, setComments] = useState([])
  const [commentInput, setCommentInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentError, setCommentError] = useState('')

  const [applications, setApplications] = useState([])
  const [loadingApps, setLoadingApps] = useState(false)
  const [appError, setAppError] = useState('')

  const loadComments = useCallback(async () => {
    try {
      setLoadingComments(true)
      const data = await fetchComments(post.id)
      setComments(data || [])
    } catch {
      setComments([])
    } finally {
      setLoadingComments(false)
    }
  }, [post.id])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  useEffect(() => {
    if (!post.isMe) return
    setLoadingApps(true)
    getPostApplications(post.id)
      .then(data => setApplications(data || []))
      .catch(() => setAppError('신청 목록을 불러오지 못했습니다.'))
      .finally(() => setLoadingApps(false))
  }, [post.id, post.isMe])

  async function handleAccept(appId) {
    setAppError('')
    try {
      await acceptApplication(appId)
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'ACCEPTED' } : a))
    } catch (e) {
      setAppError(e.message || '수락에 실패했습니다.')
    }
  }

  async function handleReject(appId) {
    setAppError('')
    try {
      await rejectApplication(appId)
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'REJECTED' } : a))
    } catch (e) {
      setAppError(e.message || '거절에 실패했습니다.')
    }
  }

  async function handleCancelAccept(appId) {
    setAppError('')
    try {
      await cancelAcceptApplication(appId)
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'PENDING' } : a))
    } catch (e) {
      setAppError(e.message || '수락 취소에 실패했습니다.')
    }
  }

  async function handleCancelReject(appId) {
    setAppError('')
    try {
      await cancelRejectApplication(appId)
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'PENDING' } : a))
    } catch (e) {
      setAppError(e.message || '거절 취소에 실패했습니다.')
    }
  }

  async function handleSubmitComment() {
    const text = commentInput.trim()
    if (!text) return
    setCommentError('')
    try {
      setSubmitting(true)
      const created = await createComment(post.id, text)
      setComments(prev => [...prev, created])
      setCommentInput('')
    } catch (e) {
      setCommentError(e.message || '댓글 작성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteComment(commentId) {
    setCommentError('')
    try {
      await removeComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (e) {
      setCommentError(e.message || '댓글 삭제에 실패했습니다.')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const overlayStyle = isMobile
    ? { ...styles.overlay, alignItems: 'flex-end', padding: 0 }
    : styles.overlay

  const modalStyle = isMobile
    ? { ...styles.modal, borderRadius: '14px 14px 0 0', maxWidth: '100%' }
    : styles.modal
  const modalClass = isMobile ? 'sheet-enter' : 'modal-enter'

  return (
    <div className="overlay-fade" style={overlayStyle} onClick={handleOverlayClick}>
      <div className={modalClass} style={modalStyle}>
        {isMobile && <div style={styles.dragHandle} />}
        <div style={styles.header}>
          <div style={styles.title}>카풀 상세</div>
          <button style={styles.closeBtn} onClick={onClose}><XIcon size={16} /></button>
        </div>

        <RouteMap
          fromLat={post.departureLat}
          fromLng={post.departureLng}
          toLat={post.destinationLat}
          toLng={post.destinationLng}
        />

        <div style={styles.routeSection}>
          <div style={styles.route}>
            <span>{post.from}</span>
            <span style={{ color: 'var(--accent)' }}>→</span>
            <span>{post.to}</span>
          </div>
          <div style={styles.metaGrid}>
            <MetaItem label="날짜" value={post.date} mono />
            <MetaItem label="시간" value={post.time} mono />
            <MetaItem label="모집 인원" value={`${post.filled}/${post.seats}명`} mono />
            <MetaItem label="1인 분담금" value={fmtPrice(post.price)} accent mono />
          </div>
          {post.tags?.length > 0 && (
            <div style={styles.tags}>
              {post.tags.map(tag => {
                const t = getTagStyle(tag?.name)
                return (
                  <span key={tag.id} style={{ ...styles.tagPill, background: t.bg, color: t.tc, borderColor: `${t.tc}33` }}>
                    {tag.name}
                  </span>
                )
              })}
            </div>
          )}
          {post.desc && (
            <div style={styles.desc}>{post.desc}</div>
          )}
        </div>

        <div style={styles.driverSection}>
          <div style={{ ...styles.driverAvatar, background: `${post.color}22`, color: post.color }}>
            {(post.nickname || '?')[0]}
          </div>
          <div>
            <div style={styles.driverName}>{post.nickname || '익명'}</div>
            <div style={styles.driverRating}>
              <StarIcon size={13} fill="#b8860b" style={{ color: '#b8860b' }} />
              <span className="tabular-nums">{post.rating}</span>
            </div>
            <div style={styles.driverTrips}>총 <span className="tabular-nums">{post.trips}</span>회 탑승</div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div style={styles.commentSection}>
          <div style={styles.commentHeader}>
            <span>댓글</span>
            <span style={styles.commentBadge}>{comments.length}개</span>
          </div>

          <div style={styles.commentList}>
            {loadingComments ? (
              <div style={styles.commentEmpty}>불러오는 중...</div>
            ) : comments.length === 0 ? (
              <div style={styles.commentEmpty}>첫 댓글을 남겨보세요!</div>
            ) : (
              comments.map(c => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  currentMemberId={currentMemberId}
                  onDelete={handleDeleteComment}
                />
              ))
            )}
          </div>

          {commentError && (
            <div style={styles.commentErrorMsg}>{commentError}</div>
          )}
          <div style={styles.commentInputRow}>
            <input
              style={styles.commentInput}
              placeholder="댓글을 입력하세요 (Enter로 전송)"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              disabled={submitting}
            />
            <button
              style={{ ...styles.commentSendBtn, ...(submitting || !commentInput.trim() ? styles.commentSendBtnDisabled : {}) }}
              onClick={handleSubmitComment}
              disabled={submitting || !commentInput.trim()}
            >
              전송
            </button>
          </div>
        </div>

        {post.isMe ? (
          <div style={styles.appSection}>
            <div style={styles.appHeader}>
              <span>신청 관리</span>
              <span style={styles.appBadge}>
                {applications.filter(a => a.status === 'PENDING').length}명 대기중
              </span>
            </div>
            {loadingApps ? (
              <div style={styles.appEmpty}>불러오는 중...</div>
            ) : appError ? (
              <div style={styles.commentErrorMsg}>{appError}</div>
            ) : applications.length === 0 ? (
              <div style={styles.appEmpty}>아직 신청자가 없습니다</div>
            ) : (
              <div style={styles.appList}>
                {applications.map(app => (
                  <div key={app.id} style={styles.appItem}>
                    <div style={styles.appInfo}>
                      <span style={styles.appNickname}>{app.nickname}</span>
                      <span style={{
                        ...styles.appStatus,
                        ...(app.status === 'ACCEPTED' ? styles.appStatusAccepted
                          : app.status === 'REJECTED' ? styles.appStatusRejected
                          : styles.appStatusPending),
                      }}>
                        {app.status === 'ACCEPTED' ? '수락됨'
                          : app.status === 'REJECTED' ? '거절됨'
                          : '대기중'}
                      </span>
                    </div>
                    {app.status === 'PENDING' && (
                      <div style={styles.appBtns}>
                        <button style={styles.acceptBtn} onClick={() => handleAccept(app.id)}>수락</button>
                        <button style={styles.rejectBtn} onClick={() => handleReject(app.id)}>거절</button>
                      </div>
                    )}
                    {app.status === 'ACCEPTED' && (
                      <div style={styles.appBtns}>
                        <button style={styles.cancelBtn} onClick={() => handleCancelAccept(app.id)}>수락 취소</button>
                      </div>
                    )}
                    {app.status === 'REJECTED' && (
                      <div style={styles.appBtns}>
                        <button style={styles.cancelBtn} onClick={() => handleCancelReject(app.id)}>거절 취소</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <JoinButton full={full} onJoin={() => onJoin(post.id)} />
        )}
      </div>
    </div>
  )
}

function JoinButton({ full, onJoin }) {
  const [status, setStatus] = useState('idle') // idle | loading | done
  async function handleClick() {
    if (status !== 'idle') return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 300))
    setStatus('done')
    await new Promise(r => setTimeout(r, 700))
    onJoin()
  }
  const done = status === 'done'
  const loading = status === 'loading'
  return (
    <button
      style={{
        ...styles.joinBtn,
        ...(full || loading ? styles.joinBtnDisabled : {}),
        ...(done ? { background: '#2f7a4f', borderColor: '#2f7a4f' } : {}),
        transition: `background 200ms ${EASE}, transform 200ms ${EASE}`,
        transform: done ? 'scale(1.01)' : 'scale(1)',
      }}
      disabled={full || loading}
      onClick={handleClick}
    >
      {done && <CheckIcon size={15} />}
      {full ? '마감된 카풀입니다' : done ? '신청 완료!' : loading ? '신청 중...' : '참여 신청하기'}
    </button>
  )
}

function MetaItem({ label, value, accent, mono }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{label}</span>
      <span style={{
        fontSize: '0.9rem',
        fontWeight: mono ? 500 : 500,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        color: accent ? 'var(--accent)' : 'var(--text)',
      }} className={mono ? 'tabular-nums' : undefined}>{value}</span>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 600,
    background: 'rgba(26,34,51,0.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    width: '100%',
    maxWidth: 540,
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '1.5rem 1.5rem 2rem',
    boxShadow: 'var(--card-glow)',
  },
  dragHandle: {
    width: 36,
    height: 4,
    background: 'var(--border)',
    borderRadius: 2,
    margin: '0 auto 1.2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.2rem',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
  },
  closeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.4rem',
    borderRadius: 8,
    transition: `border-color 200ms ${EASE}`,
  },
  routeSection: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1.2rem',
    marginBottom: '1.2rem',
  },
  route: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    fontWeight: 500,
    letterSpacing: '-0.015em',
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
    fontWeight: 500,
    padding: '0.22rem 0.6rem',
    borderRadius: 100,
    border: '1px solid',
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
    border: '1px solid var(--border)',
    borderRadius: 10,
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
    fontWeight: 500,
    flexShrink: 0,
  },
  driverName: {
    fontWeight: 500,
    marginBottom: '0.25rem',
    color: 'var(--text)',
  },
  driverRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.82rem',
    color: '#b8860b',
  },
  driverTrips: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.15rem',
  },
  commentSection: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1rem 1.2rem',
    marginBottom: '1.2rem',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    fontSize: '0.9rem',
    marginBottom: '0.8rem',
    color: 'var(--text)',
  },
  commentBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    fontWeight: 500,
    padding: '0.15rem 0.5rem',
    borderRadius: 100,
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    marginBottom: '0.8rem',
    maxHeight: 200,
    overflowY: 'auto',
  },
  commentItem: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.6rem 0.8rem',
  },
  commentMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem',
  },
  commentNickname: {
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--text)',
  },
  commentTime: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    flex: 1,
  },
  commentDeleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    cursor: 'pointer',
    padding: '0.1rem 0.3rem',
    borderRadius: 4,
  },
  commentContent: {
    fontSize: '0.85rem',
    color: 'var(--text)',
    lineHeight: 1.5,
  },
  commentEmpty: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    padding: '0.8rem 0',
    textAlign: 'center',
  },
  commentInputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  commentInput: {
    flex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.55rem 0.9rem',
    fontSize: '0.85rem',
    color: 'var(--text)',
    outline: 'none',
    transition: `border-color 200ms ${EASE}`,
  },
  commentSendBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    borderRadius: 8,
    padding: '0.55rem 1rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: `background 200ms ${EASE}`,
  },
  commentSendBtnDisabled: {
    background: 'var(--surface2)',
    borderColor: 'var(--border)',
    color: 'var(--text-dim)',
    cursor: 'not-allowed',
  },
  commentErrorMsg: {
    fontSize: '0.78rem',
    color: 'var(--accent3)',
    background: 'rgba(179,73,47,0.07)',
    border: '1px solid rgba(179,73,47,0.2)',
    borderRadius: 6,
    padding: '0.4rem 0.7rem',
    marginBottom: '0.5rem',
  },
  joinBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    fontSize: '0.9375rem',
    padding: '0.85rem',
    borderRadius: 999,
  },
  joinBtnDisabled: {
    background: 'var(--surface2)',
    borderColor: 'var(--border)',
    color: 'var(--text-dim)',
    cursor: 'not-allowed',
  },
  appSection: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1rem 1.2rem',
  },
  appHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    fontSize: '0.9rem',
    marginBottom: '0.8rem',
    color: 'var(--text)',
  },
  appBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    fontWeight: 500,
    padding: '0.15rem 0.5rem',
    borderRadius: 100,
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
  },
  appList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  appItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.6rem 0.8rem',
  },
  appInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  appNickname: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text)',
  },
  appStatus: {
    fontSize: '0.7rem',
    fontWeight: 500,
    padding: '0.15rem 0.5rem',
    borderRadius: 100,
  },
  appStatusPending: {
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
  },
  appStatusAccepted: {
    background: 'var(--accent-pale)',
    color: 'var(--accent)',
  },
  appStatusRejected: {
    background: 'rgba(179,73,47,0.08)',
    color: 'var(--accent3)',
  },
  appBtns: {
    display: 'flex',
    gap: '0.4rem',
  },
  acceptBtn: {
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    borderRadius: 6,
    padding: '0.3rem 0.75rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.78rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  rejectBtn: {
    background: 'rgba(179,73,47,0.08)',
    color: 'var(--accent3)',
    border: 'none',
    borderRadius: 6,
    padding: '0.3rem 0.75rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.78rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  cancelBtn: {
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    padding: '0.3rem 0.75rem',
    fontFamily: 'var(--font-body)',
    fontSize: '0.78rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  appEmpty: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    padding: '0.5rem 0',
    textAlign: 'center',
  },
}
