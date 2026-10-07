import { useEffect, useState } from 'react'
import { apiUrl, readCollection } from '../api.js'
import CollectionView from './CollectionView.jsx'

const columns = [
  { key: 'name', label: 'Team' },
  { key: 'description', label: 'About' },
  { key: 'members', label: 'Members' },
]

function Teams() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTeams() {
      try {
        const response = await fetch(apiUrl('/api/teams/'), { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Teams request failed (${response.status}).`)
        }
        setItems(readCollection(await response.json()))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load teams.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTeams()
    return () => controller.abort()
  }, [])

  return (
    <CollectionView
      columns={columns}
      description="Find your training crew and the goals you share."
      error={error}
      items={items}
      loading={loading}
      title="Teams"
    />
  )
}

export default Teams
