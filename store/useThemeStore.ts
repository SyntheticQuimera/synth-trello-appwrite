"use client";
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ThemeStoreState {
    theme: "night" | "cupcake";
    setTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                theme: "cupcake",
                setTheme: () => set((state) => ({
                    ...state,
                    theme: get().theme === "night" ? "cupcake" : "night"
                })),

            }), {
            name: 'theme',
        }
        )
    ))

export const useTheme = () => useThemeStore((state) => state.theme);
export const useSetTheme = () => useThemeStore((state) => state.setTheme);
