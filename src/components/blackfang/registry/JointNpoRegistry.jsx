import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchJointOpPack } from '../../../lib/kt24Teams'
import OperativeDataslate from '../OperativeDataslate'
import RegistrySearch from './RegistrySearch'
import OperativeRegistryCollapsedPreview from './OperativeRegistryCollapsedPreview'
import RegistryLazyCardGrid from './RegistryLazyCardGrid'
import RegistryExpandableCard from './RegistryExpandableCard'

export default function JointNpoRegistry({ npos }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [expandedKey, setExpandedKey] = useState(null)
  const [expandedOp, setExpandedOp] = useState(null)
  const [loadingKey, setLoadingKey] = useState(null)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const packSlug = searchParams.get('pack')
    if (!packSlug) return

    const pack = npos.find((entry) => entry.jointOpSlug === packSlug)
    if (pack) {
      setQuery(pack.jointOpName)
    }
    setSearchParams(
      (params) => {
        params.delete('pack')
        return params
      },
      { replace: true },
    )
  }, [npos, searchParams, setSearchParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return npos
    return npos.filter(
      (entry) =>
        entry.name.toLowerCase().includes(q) ||
        entry.jointOpName.toLowerCase().includes(q) ||
        entry.jointOpSlug.includes(q) ||
        String(entry.role ?? '')
          .toLowerCase()
          .includes(q) ||
        String(entry.keywords ?? '')
          .toLowerCase()
          .includes(q),
    )
  }, [npos, query])

  async function toggleExpand(entry) {
    if (expandedKey === entry.key) {
      setExpandedKey(null)
      setExpandedOp(null)
      setLoadError('')
      setLoadingKey(null)
      return
    }

    setExpandedKey(entry.key)
    setExpandedOp(null)
    setLoadError('')
    setLoadingKey(entry.key)

    try {
      const pack = await fetchJointOpPack(entry.jointOpSlug)
      const operative = pack.operatives.find((op) => op.id === entry.operativeId)
      if (!operative) throw new Error('Operative not found in joint-op pack.')
      setExpandedOp(operative)
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <div>
      <RegistrySearch
        value={query}
        onChange={setQuery}
        placeholder="Search joint-op NPOs or mission packs…"
      />
      <p className="bf-muted mt-3 text-xs">
        {filtered.length} of {npos.length} non-player operatives from published joint-operation
        packs.
      </p>
      <RegistryLazyCardGrid
        items={filtered}
        resetKey={query}
        columns={1}
        emptyMessage="No NPOs match your search."
        renderItem={(entry) => {
          const isExpanded = expandedKey === entry.key
          const isLoading = loadingKey === entry.key

          return (
            <li key={entry.key}>
              <RegistryExpandableCard
                headerInlineContent={
                  <OperativeRegistryCollapsedPreview
                    entry={entry}
                    isExpanded={isExpanded}
                    onToggle={() => toggleExpand(entry)}
                  />
                }
                expandedLayout="replace"
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(entry)}
                loading={isLoading}
                error={isExpanded && loadError && !isLoading ? loadError : ''}
                expandedContent={
                  expandedOp && isExpanded ? (
                    <OperativeDataslate operative={expandedOp} density="compact" />
                  ) : null
                }
              />
            </li>
          )
        }}
      />
    </div>
  )
}
