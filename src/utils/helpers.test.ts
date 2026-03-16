import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('axios')
vi.mock('react-image-file-resizer', () => ({ default: { imageFileResizer: vi.fn() } }))
vi.mock('react-toastify', () => ({ toast: vi.fn() }))
vi.mock('./defines', () => ({ ENV_PROD: false, LANGUAGES: ['en', 'nl'] }))
vi.mock('./localstorage', () => ({ LOCAL_STORAGE_LOCATION: 'user_location' }))
vi.mock('./config', () => ({ SERVER_ENDPOINT: 'http://localhost:3000' }))

import {
  turnDecimalToInteger,
  capitalizeFirstLetter,
  handleShare,
  cleanFileName,
  createFileName,
} from './helpers'

describe('turnDecimalToInteger', () => {
  it('returns null for null input', () => {
    expect(turnDecimalToInteger(null)).toBeNull()
  })

  it('returns empty string for empty string input', () => {
    expect(turnDecimalToInteger('')).toBe('')
  })

  it('rounds decimals to integer', () => {
    expect(turnDecimalToInteger(3.7)).toBe(4)
    expect(turnDecimalToInteger(2.2)).toBe(2)
  })

  it('returns integer values as string', () => {
    expect(turnDecimalToInteger(5)).toBe('5')
  })

  it('strips leading zeros', () => {
    expect(turnDecimalToInteger('007')).toBe('7')
    expect(turnDecimalToInteger('05')).toBe('5')
  })

  it('keeps bare zero', () => {
    expect(turnDecimalToInteger('0')).toBe('0')
  })
})

describe('capitalizeFirstLetter', () => {
  it('capitalizes first letter of first word', () => {
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world')
  })

  it('returns dash for empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('-')
  })

  it('handles single word', () => {
    expect(capitalizeFirstLetter('amsterdam')).toBe('Amsterdam')
  })

  it('lowercases the rest of first word', () => {
    expect(capitalizeFirstLetter('HELLO world')).toBe('Hello world')
  })
})

describe('handleShare', () => {
  it('returns WhatsApp url', () => {
    const url = handleShare('WhatsApp', 'https://domakin.nl', 'Check this')
    expect(url).toContain('wa.me')
    expect(url).toContain(encodeURIComponent('https://domakin.nl'))
  })

  it('returns Facebook url', () => {
    const url = handleShare('Facebook', 'https://domakin.nl')
    expect(url).toContain('facebook.com')
  })

  it('returns LinkedIn url', () => {
    const url = handleShare('LinkedIn', 'https://domakin.nl')
    expect(url).toContain('linkedin.com')
  })

  it('returns undefined for Instagram', () => {
    expect(handleShare('Instagram')).toBeUndefined()
  })

  it('returns undefined for unknown platform', () => {
    expect(handleShare('TikTok')).toBeUndefined()
  })
})

describe('cleanFileName', () => {
  it('returns full name for short files', () => {
    const file = { name: 'photo.jpg', type: 'image/jpeg' } as File
    expect(cleanFileName(file)).toBe('photo.jpg')
  })

  it('truncates long file names', () => {
    const file = { name: 'very-long-file-name-here.png', type: 'image/png' } as File
    const result = cleanFileName(file)
    expect(result).toContain('...')
    expect(result).toContain('png')
  })
})

describe('createFileName', () => {
  it('creates indexed jpg filename', () => {
    expect(createFileName(0)).toBe('0.jpg')
    expect(createFileName(5)).toBe('5.jpg')
  })
})
