import { describe, it, expect } from 'vitest'
import { urlEncode, urlDecode, base64Encode, base64Decode } from '../codec'

// ---------------------------------------------------------------------------
// urlEncode
// ---------------------------------------------------------------------------
describe('urlEncode', () => {
  it('encodes special URL characters', () => {
    const result = urlEncode('hello world')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('hello%20world')
  })

  it('encodes Chinese characters', () => {
    const result = urlEncode('你好')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('%E4%BD%A0%E5%A5%BD')
  })

  it('encodes a full URL query string', () => {
    const result = urlEncode('key=hello world&type=测试')
    expect(result.ok).toBe(true)
    expect(result.value).toContain('%20')
  })

  it('returns an empty value for empty input', () => {
    const result = urlEncode('')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('')
  })

  it('leaves safe characters unchanged', () => {
    const safe = 'ABCabc0123-_.~'
    const result = urlEncode(safe)
    expect(result.ok).toBe(true)
    expect(result.value).toBe(safe)
  })
})

// ---------------------------------------------------------------------------
// urlDecode
// ---------------------------------------------------------------------------
describe('urlDecode', () => {
  it('decodes a percent-encoded string', () => {
    const result = urlDecode('hello%20world')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('hello world')
  })

  it('decodes Chinese characters', () => {
    const result = urlDecode('%E4%BD%A0%E5%A5%BD')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('你好')
  })

  it('round-trips with urlEncode', () => {
    const original = 'hello world & 你好 / test=1'
    const encoded = urlEncode(original)
    const decoded = urlDecode(encoded.value)
    expect(decoded.ok).toBe(true)
    expect(decoded.value).toBe(original)
  })

  it('returns ok:false for a malformed percent sequence', () => {
    const result = urlDecode('%')
    expect(result.ok).toBe(false)
  })

  it('returns ok:false for an incomplete percent-encoding', () => {
    const result = urlDecode('%GG')
    expect(result.ok).toBe(false)
  })

  it('handles plain text (no encoding) without errors', () => {
    const result = urlDecode('plaintext')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('plaintext')
  })
})

// ---------------------------------------------------------------------------
// base64Encode
// ---------------------------------------------------------------------------
describe('base64Encode', () => {
  it('encodes ASCII text', () => {
    const result = base64Encode('hello')
    expect(result.ok).toBe(true)
    // "hello" in Base64 is "aGVsbG8="
    expect(result.value).toBe('aGVsbG8=')
  })

  it('encodes UTF-8 characters (Chinese)', () => {
    const result = base64Encode('你好')
    expect(result.ok).toBe(true)
    expect(result.value.length).toBeGreaterThan(0)
    // Should be decodable back
    const decoded = base64Decode(result.value)
    expect(decoded.ok).toBe(true)
    expect(decoded.value).toBe('你好')
  })

  it('encodes an empty string', () => {
    const result = base64Encode('')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('')
  })

  it('encodes special characters', () => {
    const result = base64Encode('!@#$%^&*()')
    expect(result.ok).toBe(true)
    expect(result.value.length).toBeGreaterThan(0)
  })

  it('round-trips with base64Decode', () => {
    const original = 'The quick brown fox jumps over the lazy dog'
    const encoded = base64Encode(original)
    const decoded = base64Decode(encoded.value)
    expect(decoded.ok).toBe(true)
    expect(decoded.value).toBe(original)
  })
})

// ---------------------------------------------------------------------------
// base64Decode
// ---------------------------------------------------------------------------
describe('base64Decode', () => {
  it('decodes a known Base64 string', () => {
    const result = base64Decode('aGVsbG8=')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('hello')
  })

  it('decodes a UTF-8 base64 string', () => {
    const encoded = base64Encode('日本語テスト')
    const result = base64Decode(encoded.value)
    expect(result.ok).toBe(true)
    expect(result.value).toBe('日本語テスト')
  })

  it('returns ok:false for invalid Base64', () => {
    const result = base64Decode('this is not base64!!!')
    expect(result.ok).toBe(false)
  })

  it('handles padded Base64 strings', () => {
    const result = base64Decode('dGVzdA==')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('test')
  })

  it('decodes an empty string', () => {
    const result = base64Decode('')
    expect(result.ok).toBe(true)
    expect(result.value).toBe('')
  })
})
