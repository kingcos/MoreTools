import { describe, it, expect } from 'vitest'
import { timestampToDateString, datePartsToTimestampMs, datePartsToTimestampSec } from '../time'

// ---------------------------------------------------------------------------
// timestampToDateString
// ---------------------------------------------------------------------------
describe('timestampToDateString', () => {
  // Use a fixed, known timestamp: 2024-01-15 12:30:45 CST (UTC+8)
  // UTC epoch: 2024-01-15 04:30:45 → ms = 1705290645000
  const TS_MS = 1705290645000
  const TS_SEC = 1705290645

  it('returns a non-empty string for a valid millisecond timestamp', () => {
    const result = timestampToDateString(TS_MS, true)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('returns a non-empty string for a valid second timestamp', () => {
    const result = timestampToDateString(TS_SEC, false)
    expect(result).toBeTruthy()
    expect(typeof result).toBe('string')
  })

  it('produces the same date string whether given ms or converted seconds', () => {
    const fromMs = timestampToDateString(TS_MS, true)
    const fromSec = timestampToDateString(TS_SEC, false)
    // The two should resolve to the same wall-clock time
    expect(fromMs).toBe(fromSec)
  })

  it('returns empty string for NaN input', () => {
    expect(timestampToDateString(NaN, true)).toBe('')
  })

  it('returns empty string for Infinity', () => {
    expect(timestampToDateString(Infinity, true)).toBe('')
  })

  it('handles epoch zero correctly (1970-01-01)', () => {
    const result = timestampToDateString(0, true)
    expect(result).toBeTruthy()
    expect(result).toContain('1970')
  })

  it('handles negative timestamps (dates before epoch)', () => {
    // -86400000 ms = one day before epoch
    const result = timestampToDateString(-86400000, true)
    expect(result).toBeTruthy()
    expect(result).toContain('1969')
  })

  it('handles very large timestamps gracefully', () => {
    // Year 2100 timestamp
    const result = timestampToDateString(4102444800000, true)
    expect(result).toBeTruthy()
    expect(result).toContain('2100')
  })
})

// ---------------------------------------------------------------------------
// datePartsToTimestampMs
// ---------------------------------------------------------------------------
describe('datePartsToTimestampMs', () => {
  it('returns a number', () => {
    const ts = datePartsToTimestampMs(2024, 1, 15, 0, 0, 0, 0)
    expect(typeof ts).toBe('number')
  })

  it('round-trips: converting the ms back to Date gives the same parts', () => {
    const ts = datePartsToTimestampMs(2024, 6, 15, 12, 30, 45, 500)
    const d = new Date(ts)
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth() + 1).toBe(6) // month is 0-based in Date
    expect(d.getDate()).toBe(15)
    expect(d.getHours()).toBe(12)
    expect(d.getMinutes()).toBe(30)
    expect(d.getSeconds()).toBe(45)
    expect(d.getMilliseconds()).toBe(500)
  })

  it('handles month boundary: December 31', () => {
    const ts = datePartsToTimestampMs(2023, 12, 31, 23, 59, 59, 999)
    const d = new Date(ts)
    expect(d.getFullYear()).toBe(2023)
    expect(d.getMonth() + 1).toBe(12)
    expect(d.getDate()).toBe(31)
  })

  it('all zeros gives epoch minus local offset (consistent)', () => {
    const ts1 = datePartsToTimestampMs(1970, 1, 1, 0, 0, 0, 0)
    const ts2 = new Date(1970, 0, 1, 0, 0, 0, 0).getTime()
    expect(ts1).toBe(ts2)
  })
})

// ---------------------------------------------------------------------------
// datePartsToTimestampSec
// ---------------------------------------------------------------------------
describe('datePartsToTimestampSec', () => {
  it('returns floor(ms / 1000)', () => {
    const ms = datePartsToTimestampMs(2024, 3, 10, 8, 0, 0, 500)
    const sec = datePartsToTimestampSec(2024, 3, 10, 8, 0, 0, 500)
    expect(sec).toBe(Math.floor(ms / 1000))
  })

  it('truncates milliseconds (does not round up)', () => {
    const sec = datePartsToTimestampSec(2024, 1, 1, 0, 0, 0, 999)
    const secNoMs = datePartsToTimestampSec(2024, 1, 1, 0, 0, 0, 0)
    expect(sec).toBe(secNoMs)
  })
})
