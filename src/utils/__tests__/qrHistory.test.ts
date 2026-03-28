import { describe, it, expect } from 'vitest'
import { addToHistory, removeFromHistory, type QrHistoryItem } from '../qrHistory'

// Helper: create a history item
const item = (text: string, timestamp = 0): QrHistoryItem => ({ text, timestamp })

// ---------------------------------------------------------------------------
// addToHistory
// ---------------------------------------------------------------------------
describe('addToHistory', () => {
  it('adds a new entry to an empty history', () => {
    const result = addToHistory([], 'hello', 100)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ text: 'hello', timestamp: 100 })
  })

  it('prepends new entries to the front of the list', () => {
    const existing = [item('first', 1)]
    const result = addToHistory(existing, 'second', 2)
    expect(result[0].text).toBe('second')
    expect(result[1].text).toBe('first')
  })

  it('does not mutate the original array', () => {
    const original = [item('a', 1)]
    addToHistory(original, 'b', 2)
    expect(original).toHaveLength(1)
  })

  it('deduplicates: moves existing text to the front with a new timestamp', () => {
    const history = [item('a', 1), item('b', 2), item('c', 3)]
    const result = addToHistory(history, 'b', 99)
    expect(result[0]).toEqual({ text: 'b', timestamp: 99 })
    expect(result.filter(i => i.text === 'b')).toHaveLength(1)
    expect(result).toHaveLength(3)
  })

  it('keeps order of non-duplicated items after dedup', () => {
    const history = [item('a', 1), item('b', 2), item('c', 3)]
    const result = addToHistory(history, 'b', 99)
    expect(result.map(i => i.text)).toEqual(['b', 'a', 'c'])
  })

  it('enforces the default max size of 20', () => {
    let history: QrHistoryItem[] = []
    for (let i = 0; i < 25; i++) {
      history = addToHistory(history, `item-${i}`, i)
    }
    expect(history).toHaveLength(20)
    // Most recent items should be at the front
    expect(history[0].text).toBe('item-24')
    expect(history[19].text).toBe('item-5')
  })

  it('enforces a custom max size', () => {
    let history: QrHistoryItem[] = []
    for (let i = 0; i < 10; i++) {
      history = addToHistory(history, `item-${i}`, i, 5)
    }
    expect(history).toHaveLength(5)
  })

  it('returns the same array (not adding) when text is empty', () => {
    const history = [item('a', 1)]
    const result = addToHistory(history, '', 99)
    expect(result).toEqual(history)
  })

  it('uses Date.now() when no timestamp is provided', () => {
    const before = Date.now()
    const result = addToHistory([], 'test')
    const after = Date.now()
    expect(result[0].timestamp).toBeGreaterThanOrEqual(before)
    expect(result[0].timestamp).toBeLessThanOrEqual(after)
  })

  it('adding a duplicate updates the timestamp', () => {
    const history = [item('dup', 1)]
    const result = addToHistory(history, 'dup', 999)
    expect(result[0].timestamp).toBe(999)
  })
})

// ---------------------------------------------------------------------------
// removeFromHistory
// ---------------------------------------------------------------------------
describe('removeFromHistory', () => {
  it('removes the item at the specified index', () => {
    const history = [item('a'), item('b'), item('c')]
    const result = removeFromHistory(history, 1)
    expect(result.map(i => i.text)).toEqual(['a', 'c'])
  })

  it('removes the first item', () => {
    const history = [item('a'), item('b'), item('c')]
    const result = removeFromHistory(history, 0)
    expect(result.map(i => i.text)).toEqual(['b', 'c'])
  })

  it('removes the last item', () => {
    const history = [item('a'), item('b'), item('c')]
    const result = removeFromHistory(history, 2)
    expect(result.map(i => i.text)).toEqual(['a', 'b'])
  })

  it('does not mutate the original array', () => {
    const history = [item('a'), item('b')]
    removeFromHistory(history, 0)
    expect(history).toHaveLength(2)
  })

  it('returns the same array for an out-of-bounds negative index', () => {
    const history = [item('a')]
    expect(removeFromHistory(history, -1)).toEqual(history)
  })

  it('returns the same array for an out-of-bounds large index', () => {
    const history = [item('a')]
    expect(removeFromHistory(history, 99)).toEqual(history)
  })

  it('returns an empty array when the only item is removed', () => {
    const result = removeFromHistory([item('only')], 0)
    expect(result).toHaveLength(0)
  })
})
