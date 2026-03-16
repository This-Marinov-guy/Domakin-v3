import { describe, it, expect } from 'vitest'
import {
  SORT_NEWEST,
  SORT_OLDEST,
  SORT_PRICE_LOW,
  SORT_PRICE_HIGH,
  PropertySort,
  PROPERTY_STATUS,
} from './enum'

describe('Sort constants', () => {
  it('has correct string values', () => {
    expect(SORT_NEWEST).toBe('1')
    expect(SORT_OLDEST).toBe('2')
    expect(SORT_PRICE_LOW).toBe('3')
    expect(SORT_PRICE_HIGH).toBe('4')
  })

  it('all sort constants are unique', () => {
    const values = [SORT_NEWEST, SORT_OLDEST, SORT_PRICE_LOW, SORT_PRICE_HIGH]
    expect(new Set(values).size).toBe(4)
  })
})

describe('PropertySort', () => {
  it('is an array with 4 items', () => {
    expect(Array.isArray(PropertySort)).toBe(true)
    expect(PropertySort.length).toBe(4)
  })

  it('each item has value and text fields', () => {
    PropertySort.forEach(item => {
      expect(item).toHaveProperty('value')
      expect(item).toHaveProperty('text')
      expect(typeof item.value).toBe('string')
      expect(typeof item.text).toBe('string')
    })
  })

  it('contains expected sort options', () => {
    const values = PropertySort.map(i => i.value)
    expect(values).toContain('newest')
    expect(values).toContain('price_low')
    expect(values).toContain('price_high')
  })
})

describe('PROPERTY_STATUS', () => {
  it('has all expected status codes', () => {
    expect(PROPERTY_STATUS.PENDING).toBe(1)
    expect(PROPERTY_STATUS.APPROVED).toBe(2)
    expect(PROPERTY_STATUS.REJECTED).toBe(3)
    expect(PROPERTY_STATUS.EXPIRED).toBe(4)
    expect(PROPERTY_STATUS.CANCELLED).toBe(5)
    expect(PROPERTY_STATUS.ON_HOLD).toBe(6)
  })

  it('all status codes are unique', () => {
    const values = Object.values(PROPERTY_STATUS)
    expect(new Set(values).size).toBe(values.length)
  })

  it('all status codes are positive integers', () => {
    Object.values(PROPERTY_STATUS).forEach(val => {
      expect(typeof val).toBe('number')
      expect(val).toBeGreaterThan(0)
      expect(Number.isInteger(val)).toBe(true)
    })
  })
})
