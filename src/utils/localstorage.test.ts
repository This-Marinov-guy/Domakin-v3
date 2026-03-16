import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })

import {
  setLocalStorage,
  getLocalStorage,
  LOCAL_STORAGE_LOCATION,
  LOCAL_STORAGE_PROPERTY_VIEW,
  LOCAL_STORAGE_COOKIE_AGREED,
} from './localstorage'

describe('setLocalStorage', () => {
  beforeEach(() => localStorageMock.clear())

  it('stores array as JSON string', () => {
    setLocalStorage('test_key', [1, 2, 3])
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test_key', JSON.stringify([1, 2, 3]))
  })

  it('stores empty array', () => {
    setLocalStorage('empty', [])
    expect(localStorageMock.setItem).toHaveBeenCalledWith('empty', '[]')
  })

  it('stores objects', () => {
    const data = [{ id: 1, name: 'test' }]
    setLocalStorage('objects', data)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('objects', JSON.stringify(data))
  })
})

describe('getLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('returns parsed data when key exists', () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([{ id: 1 }]))
    const result = getLocalStorage('test_key')
    expect(result).toEqual([{ id: 1 }])
  })

  it('returns empty array and initializes key when key missing', () => {
    localStorageMock.getItem.mockReturnValueOnce(null)
    const result = getLocalStorage('missing_key')
    expect(result).toEqual([])
    expect(localStorageMock.setItem).toHaveBeenCalledWith('missing_key', '[]')
  })
})

describe('localStorage key constants', () => {
  it('keys are non-empty strings', () => {
    expect(typeof LOCAL_STORAGE_LOCATION).toBe('string')
    expect(LOCAL_STORAGE_LOCATION.length).toBeGreaterThan(0)
    expect(typeof LOCAL_STORAGE_PROPERTY_VIEW).toBe('string')
    expect(LOCAL_STORAGE_PROPERTY_VIEW.length).toBeGreaterThan(0)
    expect(typeof LOCAL_STORAGE_COOKIE_AGREED).toBe('string')
    expect(LOCAL_STORAGE_COOKIE_AGREED.length).toBeGreaterThan(0)
  })

  it('all keys are unique', () => {
    const keys = [LOCAL_STORAGE_LOCATION, LOCAL_STORAGE_PROPERTY_VIEW, LOCAL_STORAGE_COOKIE_AGREED]
    expect(new Set(keys).size).toBe(3)
  })
})
