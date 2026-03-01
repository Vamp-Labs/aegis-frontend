import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    jwtToken: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            jwtToken: null,
            isAuthenticated: false,
            login: (token: string) => set({ jwtToken: token, isAuthenticated: true }),
            logout: () => set({ jwtToken: null, isAuthenticated: false }),
        }),
        {
            name: 'aegis-auth-storage',
        }
    )
);
