/**
 * Regex validation utilities.
 * Prevents runtime crashes when user-supplied regex patterns are invalid.
 */

/**
 * Returns true when the given string is a valid regular expression pattern.
 */
export function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}

/**
 * Safely constructs a RegExp from a user-supplied pattern.
 * Returns null (and does NOT throw) when the pattern is invalid.
 *
 * @param pattern  The regex source string.
 * @param flags    Optional flags string (e.g. "gi").
 */
export function safeCreateRegex(pattern: string, flags = ''): RegExp | null {
  try {
    return new RegExp(pattern, flags)
  } catch {
    return null
  }
}

/**
 * Escapes all special regex metacharacters in a literal string so it can be
 * safely embedded inside a larger RegExp pattern.
 */
export function escapeRegexChars(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
