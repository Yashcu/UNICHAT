import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // Default theme
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.remove(currentTheme);
        document.documentElement.classList.add(newTheme);
        set({ theme: newTheme });
      },
      setTheme: (newTheme) => {
        const currentTheme = get().theme;
        if (currentTheme !== newTheme) {
          document.documentElement.classList.remove(currentTheme);
          document.documentElement.classList.add(newTheme);
          set({ theme: newTheme });
        }
      },
    }),
    {
      name: 'theme-storage', // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      onRehydrateStorage: () => (state) => {
        // This function is called when the state is rehydrated from storage.
        // We need to apply the theme to the documentElement here as well.
        if (state) {
           // Remove potentially conflicting classes if any (e.g. from initial OS detection)
           document.documentElement.classList.remove('light', 'dark');
           document.documentElement.classList.add(state.theme);
        }
      }
    }
  )
);

// Function to initialize theme based on system preference if no theme is stored
export const initializeTheme = () => {
   const storedState = localStorage.getItem('theme-storage');
   if (!storedState) {
       const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
       useThemeStore.getState().setTheme(prefersDark ? 'dark' : 'light');
   } else {
       // Ensure class is set on initial load if theme was already stored
       // The onRehydrateStorage should handle this, but as a fallback:
       const currentTheme = useThemeStore.getState().theme;
       document.documentElement.classList.remove('light', 'dark');
       document.documentElement.classList.add(currentTheme);
   }
};
