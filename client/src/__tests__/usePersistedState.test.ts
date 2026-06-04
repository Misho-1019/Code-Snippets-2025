import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value }),
        removeItem: vi.fn((key: string) => { delete store[key] }),
        clear: vi.fn(() => { store = {} }),
    }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

import usePersistedState from '../hooks/usePersistedState'

describe('usePersistedState', () => {
    beforeEach(() => {
        localStorageMock.clear()
        vi.clearAllMocks()
    })

    it('returns initial state when localStorage is empty', () => {
        const { result } = renderHook(() => usePersistedState('test-key', 'default'))
        const [state] = result.current
        expect(state).toBe('default')
    })

    it('persists state to localStorage on update', () => {
        const { result } = renderHook(() => usePersistedState('test-key', 'default'))

        act(() => {
            const [, setState] = result.current
            setState('updated')
        })

        const [state] = result.current
        expect(state).toBe('updated')
        expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"updated"')
    })

    it('reads existing value from localStorage', () => {
        localStorageMock.getItem.mockReturnValueOnce('"stored"')

        const { result } = renderHook(() => usePersistedState('test-key', 'default'))
        const [state] = result.current
        expect(state).toBe('stored')
    })

    it('falls back to initial state on corrupted localStorage data', () => {
        localStorageMock.getItem.mockReturnValueOnce('not-valid-json')

        const { result } = renderHook(() => usePersistedState('test-key', 'default'))
        const [state] = result.current
        expect(state).toBe('default')
    })

    it('supports function updater', () => {
        const { result } = renderHook(() => usePersistedState('test-key', 0))

        act(() => {
            const [, setState] = result.current
            setState((prev: number) => prev + 1)
        })

        const [state] = result.current
        expect(state).toBe(1)
    })
})
