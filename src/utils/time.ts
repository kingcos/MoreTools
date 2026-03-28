/**
 * Pure time-conversion utilities (no side effects, no DOM, fully testable).
 */

/**
 * Converts a numeric timestamp to a human-readable date string using the
 * user's local locale.
 *
 * @param timestamp     The numeric timestamp value.
 * @param isMilliseconds  Whether the value is already in milliseconds.
 *                        Pass false for Unix second timestamps.
 * @returns Formatted date string, or empty string when the input is invalid.
 */
export function timestampToDateString(timestamp: number, isMilliseconds: boolean): string {
  if (!Number.isFinite(timestamp)) return ''

  const ms = isMilliseconds ? timestamp : timestamp * 1000
  const date = new Date(ms)

  if (isNaN(date.getTime())) return ''

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

/**
 * Converts individual date components to a Unix timestamp in milliseconds.
 * Month is 1-based (January = 1).
 */
export function datePartsToTimestampMs(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
): number {
  const date = new Date(year, month - 1, day, hour, minute, second, millisecond)
  return date.getTime()
}

/**
 * Converts individual date components to a Unix timestamp in seconds.
 * Month is 1-based (January = 1).
 */
export function datePartsToTimestampSec(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
): number {
  return Math.floor(datePartsToTimestampMs(year, month, day, hour, minute, second, millisecond) / 1000)
}
