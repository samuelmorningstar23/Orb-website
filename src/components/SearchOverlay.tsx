import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { runSearch, type SearchEntry } from '../data/search'
import { CONTACT_EMAIL, openDemoModal } from '../data/siteContent'
import './SearchOverlay.css'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
  onOpen: () => void
}

const QUICK_LINKS: { label: string; to: string }[] = [
  { label: 'Plans', to: '/plans' },
  { label: 'All modules', to: '/#modules' },
  { label: 'Sage', to: '/sage' },
  { label: 'Support', to: '/support' },
]

const SAMPLE_QUESTIONS = [
  'Does patient data leave the hospital?',
  'Does Orb work during internet outages?',
  'How much does Orb cost?',
]

// Small monochrome glyph per result kind.
const KindIcon = ({ kind }: { kind: SearchEntry['kind'] }) => {
  switch (kind) {
    case 'module':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    case 'plan':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24H4a1 1 0 0 0-1 1v5.59c0 .53.21 1.04.59 1.41l9.58 9.59a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.83Z" /><circle cx="7.5" cy="7.5" r="0.5" fill="currentColor" />
        </svg>
      )
    case 'action':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
      )
  }
}

export default function SearchOverlay({ open, onClose, onOpen }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // ⌘K / Ctrl+K from anywhere on the site.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) onClose()
        else onOpen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onOpen])

  // Reset, focus, and scroll-lock while open.
  useEffect(() => {
    if (!open) return
    setQuery('')
    setActiveIdx(0)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => inputRef.current?.focus(), 40)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open, onClose])

  const { answer, results } = useMemo(() => runSearch(query), [query])

  // Keyboard selection walks the answer card first, then the result rows.
  const selectable: SearchEntry[] = useMemo(
    () => (answer ? [answer, ...results] : results),
    [answer, results]
  )

  useEffect(() => { setActiveIdx(0) }, [query])

  if (!open) return null

  const activate = (entry: SearchEntry) => {
    onClose()
    if (entry.action === 'demo') { openDemoModal(); return }
    if (entry.action === 'mail') { window.location.href = `mailto:${CONTACT_EMAIL}`; return }
    if (entry.to) navigate(entry.to)
  }

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => (selectable.length ? (i + 1) % selectable.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => (selectable.length ? (i - 1 + selectable.length) % selectable.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const entry = selectable[activeIdx]
      if (entry) activate(entry)
    }
  }

  const hasQuery = query.trim().length > 0

  return (
    <div className="search-overlay" onClick={onClose}>
      <div
        className="search-overlay__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search Orb"
        onClick={e => e.stopPropagation()}
      >
        <div className="search-overlay__input-row">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.4" y2="16.4" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-overlay__input"
            placeholder="Search Orb — or ask a question…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            role="combobox"
            aria-expanded={selectable.length > 0}
            aria-controls="search-overlay-results"
            aria-activedescendant={selectable[activeIdx] ? `search-result-${selectable[activeIdx].id}` : undefined}
            spellCheck={false}
            autoComplete="off"
          />
          <button className="search-overlay__esc" onClick={onClose} aria-label="Close search">esc</button>
        </div>

        <div className="search-overlay__body" id="search-overlay-results" role="listbox">
          {!hasQuery && (
            <>
              <span className="search-overlay__section-label">Quick links</span>
              <div className="search-overlay__quick-links">
                {QUICK_LINKS.map(q => (
                  <button key={q.to} className="search-overlay__quick-link" onClick={() => { onClose(); navigate(q.to) }}>
                    {q.label}
                  </button>
                ))}
                <button className="search-overlay__quick-link search-overlay__quick-link--gold" onClick={() => { onClose(); openDemoModal() }}>
                  Request a demo
                </button>
              </div>
              <span className="search-overlay__section-label">Try asking</span>
              <div className="search-overlay__samples">
                {SAMPLE_QUESTIONS.map(qn => (
                  <button key={qn} className="search-overlay__sample" onClick={() => setQuery(qn)}>
                    “{qn}”
                  </button>
                ))}
              </div>
            </>
          )}

          {hasQuery && answer && (
            <div
              id={`search-result-${answer.id}`}
              role="option"
              aria-selected={activeIdx === 0}
              className={`search-overlay__answer ${activeIdx === 0 ? 'is-active' : ''}`}
              onClick={() => activate(answer)}
              onMouseEnter={() => setActiveIdx(0)}
            >
              <div className="search-overlay__answer-head">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z" />
                </svg>
                <span>{answer.title}</span>
              </div>
              <p className="search-overlay__answer-text">{answer.answer}</p>
              <span className="search-overlay__answer-more">Read more →</span>
            </div>
          )}

          {hasQuery && results.length > 0 && (
            <>
              <span className="search-overlay__section-label">{answer ? 'Related' : 'Results'}</span>
              <ul className="search-overlay__results">
                {results.map((r, i) => {
                  const idx = answer ? i + 1 : i
                  return (
                    <li key={r.id}>
                      <button
                        id={`search-result-${r.id}`}
                        role="option"
                        aria-selected={activeIdx === idx}
                        className={`search-overlay__result ${activeIdx === idx ? 'is-active' : ''}`}
                        onClick={() => activate(r)}
                        onMouseEnter={() => setActiveIdx(idx)}
                      >
                        <span className="search-overlay__result-icon"><KindIcon kind={r.kind} /></span>
                        <span className="search-overlay__result-text">
                          <span className="search-overlay__result-title">{r.title}</span>
                          {r.subtitle && <span className="search-overlay__result-subtitle">{r.subtitle}</span>}
                        </span>
                        <span className="search-overlay__result-kind">{r.kind}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {hasQuery && !answer && results.length === 0 && (
            <p className="search-overlay__empty">
              No matches for “{query.trim()}”. Try a module name like <em>Sage</em>, a page like <em>plans</em> — or ask a question.
            </p>
          )}
        </div>

        <div className="search-overlay__footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
