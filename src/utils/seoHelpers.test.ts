import { describe, it, expect } from 'vitest'
import {
  createPropertySlug,
  getPropertyUrl,
  generateMetaDescription,
  generateKeywords,
  createCanonicalUrl,
  generateImageUrl,
  getBlogUrl,
  createBlogSlug,
} from './seoHelpers'

describe('createPropertySlug', () => {
  it('creates a slug from id, city and title', () => {
    const property = { id: 42, city: 'Amsterdam', title: 'Nice Apartment' }
    expect(createPropertySlug(property)).toBe('42-amsterdam-nice-apartment')
  })

  it('works without city or title', () => {
    expect(createPropertySlug({ id: 1 })).toBe('1')
  })

  it('uses location when city is missing', () => {
    const property = { id: 5, location: 'Rotterdam', title: 'Studio' }
    expect(createPropertySlug(property)).toBe('5-rotterdam-studio')
  })

  it('strips special characters from slug parts', () => {
    const property = { id: 3, city: 'Den Haag', title: 'Flat & Room!' }
    const slug = createPropertySlug(property)
    expect(slug).not.toMatch(/[!&]/)
  })
})

describe('getPropertyUrl', () => {
  it('returns url using existing slug', () => {
    const property = { slug: 'my-slug', id: 1 }
    expect(getPropertyUrl(property)).toBe('/services/renting/property/my-slug')
  })

  it('generates slug when none exists', () => {
    const property = { id: 10, city: 'Utrecht', title: 'Room' }
    const url = getPropertyUrl(property)
    expect(url).toContain('/services/renting/property/10')
  })

  it('includes language prefix for non-english lang', () => {
    const property = { slug: 'test-slug', id: 1 }
    expect(getPropertyUrl(property, true, 'nl')).toBe('/nl/services/renting/property/test-slug')
  })

  it('omits language prefix for english', () => {
    const property = { slug: 'test-slug', id: 1 }
    expect(getPropertyUrl(property, true, 'en')).toBe('/services/renting/property/test-slug')
  })
})

describe('generateMetaDescription', () => {
  it('returns empty string for falsy input', () => {
    expect(generateMetaDescription('')).toBe('')
  })

  it('returns content unchanged if within maxLength', () => {
    expect(generateMetaDescription('Short text', 160)).toBe('Short text')
  })

  it('truncates long content at word boundary', () => {
    const longText = 'word '.repeat(50)
    const result = generateMetaDescription(longText, 50)
    expect(result.length).toBeLessThanOrEqual(53) // 50 + '...'
  })

  it('strips HTML tags', () => {
    const html = '<p>Hello <b>world</b></p>'
    expect(generateMetaDescription(html)).toBe('Hello world')
  })
})

describe('generateKeywords', () => {
  it('combines primary keywords', () => {
    const result = generateKeywords(['apartment', 'studio'])
    expect(result).toContain('apartment')
    expect(result).toContain('studio')
  })

  it('appends location variants', () => {
    const result = generateKeywords(['apartment'], 'Amsterdam')
    expect(result).toContain('Amsterdam apartment')
    expect(result).toContain('apartment Amsterdam')
  })

  it('appends category', () => {
    const result = generateKeywords(['room'], undefined, 'rental')
    expect(result).toContain('rental')
  })

  it('deduplicates keywords', () => {
    const result = generateKeywords(['apartment', 'apartment'])
    expect(result.split(', ').filter(k => k === 'apartment').length).toBe(1)
  })
})

describe('createCanonicalUrl', () => {
  it('builds canonical url with leading slash', () => {
    expect(createCanonicalUrl('/about')).toBe('https://www.domakin.nl/about')
  })

  it('adds leading slash when missing', () => {
    expect(createCanonicalUrl('about')).toBe('https://www.domakin.nl/about')
  })
})

describe('generateImageUrl', () => {
  it('returns fallback when no imagePath', () => {
    expect(generateImageUrl('')).toBe('https://www.domakin.nl/assets/img/logo.png')
  })

  it('returns custom fallback', () => {
    expect(generateImageUrl('', '/custom.png')).toBe('/custom.png')
  })

  it('returns full url as-is', () => {
    const url = 'https://cdn.example.com/img.jpg'
    expect(generateImageUrl(url)).toBe(url)
  })

  it('prepends base url for relative paths', () => {
    expect(generateImageUrl('/img/photo.jpg')).toBe('https://www.domakin.nl/img/photo.jpg')
  })
})

describe('getBlogUrl', () => {
  it('returns /blog/:slug', () => {
    expect(getBlogUrl({ slug: 'my-post' })).toBe('/blog/my-post')
  })
})

describe('createBlogSlug', () => {
  it('returns post slug', () => {
    expect(createBlogSlug({ slug: 'hello-world' })).toBe('hello-world')
  })

  it('returns fallback when no slug', () => {
    expect(createBlogSlug({})).toBe('post')
  })
})
