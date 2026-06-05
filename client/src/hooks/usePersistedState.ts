import { useState } from "react";

export default function usePersistedState<T>(stateKey: string, initialState: T): [T, (input: T | ((prev: T) => T)) => void] {
    const [state, setState] = useState<T>(() => {
        const persistedState = localStorage.getItem(stateKey)

        if (!persistedState) {
            return typeof initialState === 'function' ? (initialState as () => T)() : initialState
        }

        try {
            return JSON.parse(persistedState) as T
        } catch {
            return typeof initialState === 'function' ? (initialState as () => T)() : initialState
        }
    })

    const setPersistedState = (input: T | ((prev: T) => T)): void => {
        const data = typeof input === 'function' ? (input as (prev: T) => T)(state) : input

        setState(data)
        try {
            localStorage.setItem(stateKey, JSON.stringify(data))
        } catch {
            // localStorage unavailable or full
        }
    }

    return [state, setPersistedState]
}
