const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const apiBase = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function apiUrl(path) {
  return `${apiBase}${path.startsWith('/') ? path : `/${path}`}`
}

export function readCollection(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    for (const key of ['results', 'items', 'data']) {
      if (Array.isArray(payload[key])) {
        return payload[key]
      }
    }
  }

  throw new Error('The API returned an unsupported collection response.')
}
