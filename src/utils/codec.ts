/**
 * Encoding / decoding utilities (URL and Base64).
 * All functions return a Result-style object so callers can handle errors
 * without catching exceptions themselves.
 */

export interface CodecResult {
  ok: boolean
  value: string
  error?: string
}

/** URL-encodes a string using encodeURIComponent. */
export function urlEncode(input: string): CodecResult {
  try {
    return { ok: true, value: encodeURIComponent(input) }
  } catch (e) {
    return { ok: false, value: '', error: String(e) }
  }
}

/** URL-decodes a string using decodeURIComponent. */
export function urlDecode(input: string): CodecResult {
  try {
    return { ok: true, value: decodeURIComponent(input) }
  } catch (e) {
    return { ok: false, value: '', error: String(e) }
  }
}

/** Base64-encodes a UTF-8 string. */
export function base64Encode(input: string): CodecResult {
  try {
    // btoa only handles Latin-1; encode as UTF-8 bytes first
    const bytes = new TextEncoder().encode(input)
    let binary = ''
    bytes.forEach((b) => (binary += String.fromCharCode(b)))
    return { ok: true, value: btoa(binary) }
  } catch (e) {
    return { ok: false, value: '', error: String(e) }
  }
}

/** Base64-decodes a string back to UTF-8. */
export function base64Decode(input: string): CodecResult {
  try {
    const binary = atob(input)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return { ok: true, value: new TextDecoder().decode(bytes) }
  } catch (e) {
    return { ok: false, value: '', error: String(e) }
  }
}
