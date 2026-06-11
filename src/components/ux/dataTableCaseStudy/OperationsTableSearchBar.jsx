export default function OperationsTableSearchBar({
  keyword,
  onKeywordChange,
  site,
  onSiteChange,
  sites,
}) {
  const siteList = Array.isArray(sites) ? sites : []

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="search"
        placeholder="Keyword…"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        className="w-48 rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300"
      />
      <select
        value={site}
        onChange={(event) => onSiteChange(event.target.value)}
        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-300"
      >
        <option value="all">All sites</option>
        {siteList.map((siteName) => (
          <option key={siteName} value={siteName}>
            {siteName}
          </option>
        ))}
      </select>
    </div>
  )
}
