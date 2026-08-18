import React, { useState, useEffect } from 'react'
import { getTagStyle } from '../data/tags'
import { fetchTags } from '../api/tags'
import { useIsMobile } from '../hooks/useMobile'
import { SearchIcon, XIcon } from './Icons'

export default function SearchSection({ onSearch, onClear, selectedTagFilters, onToggleTag, onClearTags }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [allTags, setAllTags] = useState([])
  const isMobile = useIsMobile()

  useEffect(() => {
    fetchTags().then(setAllTags).catch(() => {})
  }, [])

  function handleSearch() {
    onSearch({ from, to, date })
  }

  function handleClear() {
    setFrom('')
    setTo('')
    setDate('')
    onClear()
  }

  return (
    <div style={styles.section}>
      {/* 검색 영역 */}
      <div style={{ ...styles.searchTop, flexDirection: isMobile ? 'column' : 'row' }}>
        {/* 출발지 + 목적지 (모바일: 2열 grid) */}
        <div style={{ ...styles.inputGroup, gridTemplateColumns: isMobile ? '1fr 1fr' : undefined, display: isMobile ? 'grid' : 'contents', gap: '0.6rem' }}>
          <div style={styles.field}>
            <label style={styles.label}>출발지</label>
            <input
              style={styles.input}
              value={from}
              onChange={e => setFrom(e.target.value)}
              placeholder="예: 강남역"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>목적지</label>
            <input
              style={styles.input}
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="예: 판교역"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </div>

        {/* 날짜 + 버튼 (모바일: 한 줄) */}
        <div style={{ ...styles.actionRow, flex: isMobile ? undefined : 'none' }}>
          <div style={{ ...styles.field, minWidth: isMobile ? 0 : 130, flex: isMobile ? 1 : undefined }}>
            <label style={styles.label}>날짜</label>
            <input
              style={{ ...styles.input, ...styles.inputDate }}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <button style={{ ...styles.searchBtn, flex: isMobile ? 1 : undefined }} onClick={handleSearch}>
            <SearchIcon size={15} />
            검색
          </button>
          <button style={styles.resetBtn} onClick={handleClear}>초기화</button>
        </div>
      </div>

      {/* 태그 필터 — 가로 스크롤 */}
      <div style={styles.tagStripWrapper}>
        <span style={styles.tagLabel}>태그</span>
        <div className="tag-scroll" style={styles.tagScroll}>
          {allTags.map(tag => {
            const t = getTagStyle(tag.name)
            const active = selectedTagFilters.has(tag.id)
            return (
              <button
                key={tag.id}
                onClick={() => onToggleTag(tag.id)}
                style={{
                  ...styles.tagBtn,
                  ...(active
                    ? { background: 'var(--accent-pale)', color: 'var(--accent)', borderColor: 'var(--accent)' }
                    : { background: t.bg, color: t.tc, borderColor: 'var(--border)' }),
                }}
              >
                {tag.name}
              </button>
            )
          })}
        </div>
        {selectedTagFilters.size > 0 && (
          <button style={styles.clearBtn} onClick={onClearTags} title="태그 필터 해제">
            <XIcon size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

const styles = {
  section: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '1rem 1.2rem 0.9rem',
    marginBottom: '0.8rem',
    boxShadow: 'var(--card-glow)',
  },
  searchTop: {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'flex-end',
    marginBottom: '0.85rem',
  },
  inputGroup: {
    flex: 1,
    display: 'contents',
  },
  actionRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'flex-end',
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.32rem',
    minWidth: 0,
  },
  label: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '0.62rem 0.8rem',
    color: 'var(--text)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s cubic-bezier(0.22,0.61,0.36,1)',
    width: '100%',
    minHeight: 42,
  },
  inputDate: {
    fontFamily: 'var(--font-mono)',
    fontVariantNumeric: 'tabular-nums',
    fontSize: '0.82rem',
  },
  searchBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    background: 'var(--accent)',
    color: '#fff',
    border: '1px solid var(--accent)',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem',
    padding: '0 1.1rem',
    borderRadius: 8,
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
    height: 42,
    transition: 'background 0.2s cubic-bezier(0.22,0.61,0.36,1)',
  },
  resetBtn: {
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.85rem',
    padding: '0 0.9rem',
    borderRadius: 8,
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
    height: 42,
    transition: 'border-color 0.2s cubic-bezier(0.22,0.61,0.36,1)',
  },
  tagStripWrapper: {
    borderTop: '1px solid var(--border)',
    paddingTop: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  tagLabel: {
    fontSize: '0.72rem',
    fontWeight: 500,
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  tagScroll: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flex: 1,
    paddingBottom: '0.1rem',
  },
  tagBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    border: '1px solid var(--border)',
    fontSize: '0.76rem',
    fontWeight: 500,
    padding: '0.3rem 0.7rem',
    borderRadius: 100,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s cubic-bezier(0.22,0.61,0.36,1), border-color 0.2s cubic-bezier(0.22,0.61,0.36,1), color 0.2s cubic-bezier(0.22,0.61,0.36,1)',
    flexShrink: 0,
  },
  clearBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    color: 'var(--text-dim)',
    padding: '0.28rem',
    borderRadius: 8,
    flexShrink: 0,
  },
}
