import { useEffect, useState } from 'react'
import { apiUrl, readCollection } from '../api.js'
import CollectionView from './CollectionView.jsx'

const columns = [
  { key: 'name', label: 'Workout' },
  { key: 'type', label: 'Type' },
  { key: 'durationMinutes', label: 'Minutes' },
  { key: 'difficulty', label: 'Difficulty' },
  { key: 'description', label: 'Details' },
]

function Workouts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadWorkouts() {
      try {
        const response = await fetch(apiUrl('/api/workouts/'), { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Workouts request failed (${response.status}).`)
        }
        setItems(readCollection(await response.json()))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load workouts.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()
    return () => controller.abort()
  }, [])

  return (
    <CollectionView
      columns={columns}
      description="Choose a workout that fits your goals and schedule."
      error={error}
      items={items}
      loading={loading}
      title="Workouts"
    />
  )
}

export default Workouts
