import { useEffect, useState } from 'react'
import { apiUrl, readCollection } from '../api.js'
import CollectionView from './CollectionView.jsx'

const columns = [
  { key: 'rank', label: 'Rank' },
  { key: 'user', label: 'User' },
  { key: 'team', label: 'Team' },
  { key: 'points', label: 'Points' },
]

function Leaderboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadLeaderboard() {
      try {
        const response = await fetch(apiUrl('/api/leaderboard/'), { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Leaderboard request failed (${response.status}).`)
        }
        setItems(readCollection(await response.json()))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load the leaderboard.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()
    return () => controller.abort()
  }, [])

  return (
    <CollectionView
      columns={columns}
      description="See how your team is progressing this season."
      error={error}
      items={items}
      loading={loading}
      title="Leaderboard"
    />
  )
}

export default Leaderboard
