/**
 * QR code history management utilities (pure, side-effect free).
 */

export interface QrHistoryItem {
  text: string
  timestamp: number
}

/**
 * Adds a text entry to a QR history array (immutable — returns a new array).
 *
 * Behaviour:
 * - If the same text already exists, it is moved to the front with an updated
 *   timestamp instead of being duplicated.
 * - The array is capped at `maxSize` items (oldest items are dropped).
 *
 * @param history   Current history array.
 * @param text      Text to add.
 * @param now       Timestamp to use (defaults to Date.now()).
 * @param maxSize   Maximum number of items to keep (default 20).
 */
export function addToHistory(
  history: QrHistoryItem[],
  text: string,
  now: number = Date.now(),
  maxSize = 20,
): QrHistoryItem[] {
  if (!text) return history

  // Remove any existing entry with the same text
  const filtered = history.filter((item) => item.text !== text)

  // Prepend the new / updated entry
  const updated = [{ text, timestamp: now }, ...filtered]

  // Enforce the size cap
  return updated.slice(0, maxSize)
}

/**
 * Removes the item at the given index from the history array (immutable).
 */
export function removeFromHistory(history: QrHistoryItem[], index: number): QrHistoryItem[] {
  if (index < 0 || index >= history.length) return history
  return history.filter((_, i) => i !== index)
}
