import { useState } from "react";

export default function usePersistedState<T>(stateKey: string, initialState: T): [T, (input: T | ((prev: T) => T)) => void] {
    const [state, setState] = useState<T>(() => {
        const persistedState = localStorage.getItem(stateKey)

        if (!persistedState) {
            return typeof initialState === 'function' ? (initialState as () => T)() : initialState
        }

        return JSON.parse(persistedState) as T
    })

    const setPersistedState = (input: T | ((prev: T) => T)): void => {
        const data = typeof input === 'function' ? (input as (prev: T) => T)(state) : input

        localStorage.setItem(stateKey, JSON.stringify(data))
        setState(data)
    }

    return [state, setPersistedState]
}
