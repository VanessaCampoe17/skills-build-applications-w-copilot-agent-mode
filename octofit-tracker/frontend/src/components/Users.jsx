import { useEffect, useState } from 'react'
import { apiUrl, readCollection } from '../api.js'
import CollectionView from './CollectionView.jsx'

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'team', label: 'Team' },
]

function Users() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const response = await fetch(apiUrl('/api/users/'), { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Users request failed (${response.status}).`)
        }
        setItems(readCollection(await response.json()))
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load users.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadUsers()
    return () => controller.abort()
  }, [])

  return (
    <CollectionView
      columns={columns}
      description="Meet the people building healthier habits together."
      error={error}
      items={items}
      loading={loading}
      title="Users"
    />
  )
}

export default Users
