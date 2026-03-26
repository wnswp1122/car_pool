import { useState, useMemo, useCallback } from 'react'
import { generateMockPosts } from '../data/mockData'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
const COLORS = ['#6b7c3f', '#8a9e50', '#4a5a2a', '#a0845c', '#7a9a6b', '#5c7a4a']

export function useCarpool() {
  const [posts, setPosts] = useState(() => generateMockPosts())
  const [currentPage, setCurrentPage] = useState('list')
  const [currentView, setCurrentView] = useState('card')
  const [currentFilter, setCurrentFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState({ from: '', to: '', date: '' })
  const [selectedTagFilters, setSelectedTagFilters] = useState(new Set())
  const [toast, setToast] = useState('')

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }, [])

  const filteredPosts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    let f = [...posts]
    if (searchQuery.from) f = f.filter(p => p.from.includes(searchQuery.from) || p.to.includes(searchQuery.from))
    if (searchQuery.to)   f = f.filter(p => p.to.includes(searchQuery.to) || p.from.includes(searchQuery.to))
    if (searchQuery.date) f = f.filter(p => p.date === searchQuery.date)
    if (currentFilter === 'today') f = f.filter(p => p.date === today)
    if (currentFilter === 'seats') f = f.filter(p => p.filled < p.seats)
    if (currentFilter === 'cheap') f = [...f].sort((a, b) => (Number(a.price) || 99999) - (Number(b.price) || 99999))
    if (selectedTagFilters.size > 0) {
      f = f.filter(p => [...selectedTagFilters].every(tid => (p.tags || []).includes(tid)))
    }
    return f
  }, [posts, searchQuery, currentFilter, selectedTagFilters])

  const myPosts = useMemo(() => posts.filter(p => p.isMe), [posts])

  const toggleTagFilter = useCallback((id) => {
    setSelectedTagFilters(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const clearTagFilters = useCallback(() => {
    setSelectedTagFilters(new Set())
  }, [])

  const addPost = useCallback((data) => {
    const newPost = {
      id: genId(),
      ...data,
      filled: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rating: '5.0',
      trips: 1,
      isMe: true,
    }
    setPosts(prev => [newPost, ...prev])
    showToast('🚗 게시글이 등록되었습니다!')
  }, [showToast])

  const deletePost = useCallback((id) => {
    setPosts(prev => prev.filter(p => p.id !== id))
    showToast('🗑️ 게시글이 삭제되었습니다')
  }, [showToast])

  const joinCarpool = useCallback((id) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, filled: Math.min(p.filled + 1, p.seats) } : p
    ))
    showToast('✅ 참여 신청이 완료되었습니다!')
  }, [showToast])

  return {
    posts,
    filteredPosts,
    myPosts,
    currentPage, setCurrentPage,
    currentView, setCurrentView,
    currentFilter, setCurrentFilter,
    searchQuery, setSearchQuery,
    selectedTagFilters,
    toggleTagFilter,
    clearTagFilters,
    toast,
    addPost,
    deletePost,
    joinCarpool,
  }
}
