import React, { useState, useEffect, useRef, useCallback } from 'react'
import { getTagStyle } from '../data/tags'
import { fetchTags } from '../api/tags'
import { useIsMobile } from '../hooks/useMobile'
import { searchPlace } from '../api/kakao'
import { XIcon, AlertCircleIcon } from './Icons'

export default function PostModal({ onClose, onSubmit }) {
  const isMobile = useIsMobile()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    from: '', to: '', date: today, time: '',
    seats: '2', price: '', desc: '',
    departureLat: null, departureLng: null,
    destinationLat: null, destinationLng: null,
  })
  const [allTags, setAllTags] = useState([])
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTags().then(setAllTags).catch(() => {})
  }, [])

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function toggleTag(id) {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSubmit() {
    if (!form.from || !form.to || !form.date || !form.time) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }
    setError('')
    onSubmit({
      ...form,
      seats: Number(form.seats),
      tags: [...selectedTags],
    })
    onClose()
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
          <div style={styles.title}>카풀 게시글 등록</div>
          <button style={styles.closeBtn} onClick={onClose}><XIcon size={16} /></button>
        </div>

        <div style={styles.formRow}>
          <FormGroup label="출발지 *">
            <LocationInput
              value={form.from}
              placeholder="예: 강남역 3번 출구"
              onSelect={({ name, lat, lng }) => setForm(f => ({ ...f, from: name, departureLat: lat, departureLng: lng }))}
              onChange={val => setForm(f => ({ ...f, from: val, departureLat: null, departureLng: null }))}
            />
          </FormGroup>
          <FormGroup label="목적지 *">
            <LocationInput
              value={form.to}
              placeholder="예: 판교역 2번 출구"
              onSelect={({ name, lat, lng }) => setForm(f => ({ ...f, to: name, destinationLat: lat, destinationLng: lng }))}
              onChange={val => setForm(f => ({ ...f, to: val, destinationLat: null, destinationLng: null }))}
            />
          </FormGroup>
        </div>

        <div style={styles.formRow}>
          <FormGroup label="출발 날짜 *">
            <input style={{ ...styles.input, fontFamily: 'var(--font-mono)' }} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </FormGroup>
          <FormGroup label="출발 시간 *">
            <input style={{ ...styles.input, fontFamily: 'var(--font-mono)' }} type="time" value={form.time} onChange={e => set('time', e.target.value)} />
          </FormGroup>
        </div>

        <div style={styles.formRow}>
          <FormGroup label="모집 인원 *">
            <select style={styles.input} value={form.seats} onChange={e => set('seats', e.target.value)}>
              <option value="1">1명</option>
              <option value="2">2명</option>
              <option value="3">3명</option>
              <option value="4">4명</option>
            </select>
          </FormGroup>
          <FormGroup label="1인 분담금 (원)">
            <input style={{ ...styles.input, fontFamily: 'var(--font-mono)' }} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="예: 5000" />
          </FormGroup>
        </div>

        <FormGroup label="추가 안내">
          <textarea style={{ ...styles.input, resize: 'vertical', minHeight: 76 }} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="경유지, 주의사항 등 자유롭게 적어주세요" />
        </FormGroup>

        {/* 태그 선택 */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={styles.label}>
            분위기 태그{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--text-dim)', fontSize: '0.75rem' }}>
              (여러 개 선택 가능)
            </span>
          </label>
          <div style={styles.tagPicker}>
            {allTags.map(tag => {
              const t = getTagStyle(tag.name)
              const sel = selectedTags.has(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  style={{
                    ...styles.tagPickBtn,
                    ...(sel
                      ? { background: t.bg, color: t.tc, borderColor: t.tc }
                      : { color: t.tc, borderColor: 'var(--border)', background: 'var(--surface)' }),
                  }}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            <AlertCircleIcon size={14} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        <button style={styles.submitBtn} onClick={handleSubmit}>
          게시글 등록하기
        </button>
      </div>
    </div>
  )
}

function LocationInput({ value, placeholder, onSelect, onChange }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const timer = useRef(null)

  const handleChange = useCallback((e) => {
    const val = e.target.value
    onChange(val)
    clearTimeout(timer.current)
    if (!val.trim()) { setSuggestions([]); setOpen(false); return }
    timer.current = setTimeout(async () => {
      const results = await searchPlace(val)
      setSuggestions(results)
      setOpen(results.length > 0)
    }, 300)
  }, [onChange])

  function handleSelect(doc) {
    onSelect({ name: doc.place_name, lat: parseFloat(doc.y), lng: parseFloat(doc.x) })
    setSuggestions([])
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        style={styles.input}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && (
        <ul style={locStyles.dropdown}>
          {suggestions.map((doc, i) => (
            <HoverItem key={i} onMouseDown={() => handleSelect(doc)}>
              <div style={locStyles.placeName}>{doc.place_name}</div>
              <div style={locStyles.address}>{doc.road_address_name || doc.address_name}</div>
            </HoverItem>
          ))}
        </ul>
      )}
    </div>
  )
}

function HoverItem({ children, onMouseDown }) {
  const [hovered, setHovered] = useState(false)
  return (
    <li
      style={{ ...locStyles.item, background: hovered ? 'var(--surface2)' : 'transparent' }}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </li>
  )
}

const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const locStyles = {
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    boxShadow: 'var(--card-glow)',
    zIndex: 700,
    listStyle: 'none',
    margin: 0,
    padding: '0.3rem 0',
    maxHeight: 220,
    overflowY: 'auto',
  },
  item: {
    padding: '0.55rem 0.9rem',
    cursor: 'pointer',
    borderBottom: '1px solid var(--border)',
    transition: `background 150ms ${EASE}`,
  },
  placeName: {
    fontSize: '0.88rem',
    fontWeight: 500,
    color: 'var(--text)',
    marginBottom: '0.15rem',
  },
  address: {
    fontSize: '0.74rem',
    color: 'var(--text-muted)',
  },
}

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '1rem', flex: 1 }}>
      <label style={{
        display: 'block',
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '0.45rem',
      }}>
        {label}
      </label>
      {children}
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
    marginBottom: '1.5rem',
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
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.8rem',
  },
  label: {
    display: 'block',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.45rem',
  },
  input: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0.7rem 1rem',
    color: 'var(--text)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: `border-color 200ms ${EASE}`,
    boxSizing: 'border-box',
  },
  tagPicker: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.45rem',
    padding: '0.8rem',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
  },
  tagPickBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: 500,
    padding: '0.32rem 0.75rem',
    borderRadius: 100,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: `all 180ms ${EASE}`,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: 'var(--accent3)',
    fontSize: '0.82rem',
    marginBottom: '0.8rem',
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
