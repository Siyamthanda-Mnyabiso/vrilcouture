import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    isAuthenticated: boolean;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: !!user,
                });
            },

            clearUser: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'user-storage',
        }
    )
);