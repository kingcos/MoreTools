import { describe, it, expect } from 'vitest'
import { isValidRegex, safeCreateRegex, escapeRegexChars } from '../validation'

// ---------------------------------------------------------------------------
// isValidRegex
// ---------------------------------------------------------------------------
describe('isValidRegex', () => {
  it('returns true for simple patterns', () => {
    expect(isValidRegex('hello')).toBe(true)
    expect(isValidRegex('\\d+')).toBe(true)
    expect(isValidRegex('[a-z]+')).toBe(true)
    expect(isValidRegex('(foo|bar)')).toBe(true)
    expect(isValidRegex('^start')).toBe(true)
    expect(isValidRegex('end$')).toBe(true)
  })

  it('returns true for an empty pattern (matches everything)', () => {
    expect(isValidRegex('')).toBe(true)
  })

  it('returns false for an unmatched opening parenthesis', () => {
    expect(isValidRegex('(')).toBe(false)
  })

  it('returns false for an unmatched opening bracket', () => {
    expect(isValidRegex('[')).toBe(false)
  })

  it('returns false for an invalid quantifier', () => {
    // `?` at the start is invalid in most engines
    expect(isValidRegex('?foo')).toBe(false)
  })

  it('returns false for an invalid repeat syntax', () => {
    expect(isValidRegex('*foo')).toBe(false)
  })

  it('handles complex but valid patterns', () => {
    expect(isValidRegex('(\\d{4})-(\\d{2})-(\\d{2})')).toBe(true)
    expect(isValidRegex('(?:https?|ftp)://')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// safeCreateRegex
// ---------------------------------------------------------------------------
describe('safeCreateRegex', () => {
  it('returns a RegExp for a valid pattern', () => {
    const re = safeCreateRegex('\\d+')
    expect(re).toBeInstanceOf(RegExp)
    expect(re!.test('123')).toBe(true)
  })

  it('applies flags correctly', () => {
    const re = safeCreateRegex('hello', 'gi')
    expect(re!.flags).toBe('gi')
  })

  it('returns null for an invalid pattern', () => {
    expect(safeCreateRegex('(')).toBeNull()
    expect(safeCreateRegex('[')).toBeNull()
  })

  it('returns null for an invalid flag', () => {
    // 'z' is not a valid flag
    expect(safeCreateRegex('foo', 'z')).toBeNull()
  })

  it('returns a global regex that matches multiple occurrences', () => {
    const re = safeCreateRegex('a', 'g')!
    expect('banana'.match(re)).toHaveLength(3)
  })
})

// ---------------------------------------------------------------------------
// escapeRegexChars
// ---------------------------------------------------------------------------
describe('escapeRegexChars', () => {
  it('escapes all special metacharacters', () => {
    const special = '.^$*+?{}[]|()\\-'
    const escaped = escapeRegexChars(special)
    // Every character should now match literally inside a RegExp
    const re = new RegExp(escaped)
    expect(re.test(special)).toBe(true)
  })

  it('leaves plain alphanumeric strings unchanged', () => {
    expect(escapeRegexChars('hello123')).toBe('hello123')
  })

  it('escapes a dot so it only matches a literal dot', () => {
    const escaped = escapeRegexChars('file.txt')
    const re = new RegExp(escaped)
    expect(re.test('file.txt')).toBe(true)
    expect(re.test('fileXtxt')).toBe(false)
  })

  it('escapes brackets', () => {
    const escaped = escapeRegexChars('[test]')
    const re = new RegExp(escaped)
    expect(re.test('[test]')).toBe(true)
  })
})
