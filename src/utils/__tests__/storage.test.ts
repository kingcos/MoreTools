import { describe, it, expect, beforeEach } from 'vitest'
import { safeGetJSON, safeSetJSON, safeGetString } from '../storage'

// happy-dom provides a real localStorage — reset it before every test
beforeEach(() => {
  localStorage.clear()
})

// ---------------------------------------------------------------------------
// safeGetJSON
// ---------------------------------------------------------------------------
describe('safeGetJSON', () => {
  it('returns defaultValue when key does not exist', () => {
    expect(safeGetJSON('missing', [])).toEqual([])
    expect(safeGetJSON('missing', { a: 1 })).toEqual({ a: 1 })
    expect(safeGetJSON('missing', 42)).toBe(42)
  })

  it('returns the parsed value when data is valid JSON', () => {
    localStorage.setItem('arr', JSON.stringify([1, 2, 3]))
    expect(safeGetJSON('arr', [])).toEqual([1, 2, 3])
  })

  it('returns a parsed object', () => {
    localStorage.setItem('obj', JSON.stringify({ x: true }))
    expect(safeGetJSON('obj', {})).toEqual({ x: true })
  })

  it('returns defaultValue when stored data is malformed JSON', () => {
    localStorage.setItem('bad', '{ not valid json }}}')
    expect(safeGetJSON('bad', 'fallback')).toBe('fallback')
  })

  it('returns defaultValue when stored data is an empty string', () => {
    localStorage.setItem('empty', '')
    // empty string is not valid JSON → parse throws → return default
    expect(safeGetJSON('empty', 'default')).toBe('default')
  })

  it('handles null stored value gracefully', () => {
    // localStorage.getItem returns null for missing keys
    expect(safeGetJSON('nope', null)).toBeNull()
  })

  it('returns a nested object correctly', () => {
    const nested = { a: { b: [1, 2] } }
    localStorage.setItem('nested', JSON.stringify(nested))
    expect(safeGetJSON('nested', {})).toEqual(nested)
  })
})

// ---------------------------------------------------------------------------
// safeSetJSON
// ---------------------------------------------------------------------------
describe('safeSetJSON', () => {
  it('stores a serialised value', () => {
    safeSetJSON('items', [1, 2, 3])
    expect(localStorage.getItem('items')).toBe('[1,2,3]')
  })

  it('overwrites an existing entry', () => {
    safeSetJSON('k', 'old')
    safeSetJSON('k', 'new')
    expect(localStorage.getItem('k')).toBe('"new"')
  })

  it('stores an object', () => {
    safeSetJSON('config', { dark: true })
    expect(JSON.parse(localStorage.getItem('config')!)).toEqual({ dark: true })
  })

  it('stores null', () => {
    safeSetJSON('n', null)
    expect(localStorage.getItem('n')).toBe('null')
  })

  it('does not throw for circular references', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circular: any = {}
    circular.self = circular
    expect(() => safeSetJSON('circ', circular)).not.toThrow()
  })
})

// ---------------------------------------------------------------------------
// safeGetString
// ---------------------------------------------------------------------------
describe('safeGetString', () => {
  it('returns the raw string when the key exists', () => {
    localStorage.setItem('lang', 'zh-CN')
    expect(safeGetString('lang')).toBe('zh-CN')
  })

  it('returns the provided default when the key is absent', () => {
    expect(safeGetString('missing', 'en')).toBe('en')
  })

  it('returns empty string by default when not given a default', () => {
    expect(safeGetString('missing')).toBe('')
  })
})
