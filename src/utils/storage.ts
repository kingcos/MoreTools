/**
 * Safe localStorage utilities — all reads/writes wrapped in try-catch to
 * prevent the app from crashing when stored data is malformed or when
 * the storage quota is exceeded.
 */

/**
 * Read and JSON-parse a value from localStorage.
 * Returns `defaultValue` if the key is absent or the data cannot be parsed.
 */
export function safeGetJSON<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

/**
 * JSON-stringify a value and write it to localStorage.
 * Silently ignores quota-exceeded or serialisation errors.
 */
export function safeSetJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // QuotaExceededError or circular-reference — nothing we can do
  }
}

/**
 * Read a plain string from localStorage.
 * Returns `defaultValue` if the key is absent.
 */
export function safeGetString(key: string, defaultValue: string = ''): string {
  try {
    return localStorage.getItem(key) ?? defaultValue
  } catch {
    return defaultValue
  }
}
