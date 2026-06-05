import { useEffect, useCallback } from "react";
import usePersistedState from "./usePersistedState";

export default function useTheme() {
    const [isDark, setIsDark] = usePersistedState<boolean>('theme-dark', false)

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
    }, [isDark])

    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev)
    }, [setIsDark])

    return { isDark, toggleTheme }
}
