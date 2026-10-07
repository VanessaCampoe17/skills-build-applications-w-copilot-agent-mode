import { useEffect, useState } from 'react'
import { apiUrl, readCollection } from '../api.js'
import CollectionView from './CollectionView.jsx'

const columns = [
  { key: 'type', label: 'Activity' },
  { key: 'user', label: 'User' },
  { key: 'durationMinutes', label: 'Minutes' },
  { key: 'calories', label: 'Calories' },
  { key: 'date', label: 'Date' },
]

function Activities() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadActivities() {
      try {
        const response = await fetch(apiUrl('/api/activities/'), { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Activities request failed (${response.status}).`)
        }
        setItems(readCollection(await response.json()))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load activities.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadActivities()
    return () => controller.abort()
  }, [])

  return (
    <CollectionView
      columns={columns}
      description="Recent training sessions logged by the OctoFit community."
      error={error}
      items={items}
      loading={loading}
      title="Activities"
    />
  )
}

export default Activities
