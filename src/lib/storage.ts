export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const value: unknown = JSON.parse(raw)
    if (Array.isArray(fallback)) return (Array.isArray(value) ? value : fallback) as T
    if (fallback === null) return (value === null || (typeof value === 'object' && !Array.isArray(value)) ? value : fallback) as T
    if (typeof value !== typeof fallback) return fallback
    return value as T
  } catch {
    return fallback
  }
}
export function saveStored(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
