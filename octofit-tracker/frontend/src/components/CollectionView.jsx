function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }
  if (Array.isArray(value)) {
    return value.length ? `${value.length} members` : 'None'
  }
  if (typeof value === 'object') {
    return value.name || value.email || value._id || JSON.stringify(value)
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleString()
  }
  return String(value)
}

function CollectionView({ title, description, columns, items, loading, error }) {
  return (
    <section className="section-view" aria-labelledby="collection-title">
      <p className="section-kicker">OCTOFIT / TRACKER</p>
      <h1 id="collection-title">{title}</h1>
      <p className="section-message">{description}</p>

      {loading && <p className="collection-status" role="status">Loading {title.toLowerCase()}…</p>}
      {error && <p className="alert alert-danger collection-status" role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="collection-status">No {title.toLowerCase()} have been added yet.</p>
      )}
      {!loading && !error && items.length > 0 && (
        <div className="table-responsive collection-table-wrap">
          <table className="table table-hover align-middle collection-table">
            <thead>
              <tr>
                {columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item._id || item.id || index}>
                  {columns.map((column) => (
                    <td key={column.key}>{displayValue(item[column.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default CollectionView
