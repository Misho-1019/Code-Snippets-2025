import { createContext, useContext, type ReactNode } from "react";

interface ThemeContextType {
    isDark: boolean
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => {},
})

export function useThemeContext(): ThemeContextType {
    return useContext(ThemeContext)
}
