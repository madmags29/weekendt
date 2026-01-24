"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
    theme: "dark",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme: _defaultTheme = "dark",
    storageKey: _storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
    const [_theme, _setTheme] = useState<Theme>("dark");

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add("dark");
    }, []);

    const value = {
        theme: "dark" as Theme,
        setTheme: () => { },
    };

    // Prevent hydration mismatch by not rendering until mounted
    // or render children but with default theme to avoid flicker
    // For next.js strictly, we might simply render. 
    // But to be safe with localStorage, we wait.
    // Actually, for immediate render we can just return children but effect runs after.

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
