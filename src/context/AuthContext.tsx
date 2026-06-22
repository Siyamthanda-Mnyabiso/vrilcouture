// src/context/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useUserStore } from '../store/user.store';
import type { User } from '../types/user';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo/mock auth — no backend. Credentials are not checked; any input succeeds
// so the storefront's login/register/account flows remain demoable.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, setUser, clearUser } = useUserStore();
    const [loading, setLoading] = useState(false);

    const signIn = async (email: string, _password: string) => {
        setLoading(true);
        try {
            const mockUser: User = {
                id: crypto.randomUUID(),
                email,
                full_name: email.split('@')[0] || 'Demo User',
                role: 'customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setUser(mockUser);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, _password: string, metadata?: Record<string, any>) => {
        setLoading(true);
        try {
            const mockUser: User = {
                id: crypto.randomUUID(),
                email,
                full_name: metadata?.full_name || email.split('@')[0] || 'Demo User',
                role: 'customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setUser(mockUser);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        clearUser();
    };

    const resetPassword = async (_email: string) => {
        return;
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) throw new Error('No user logged in');
        setUser({ ...user, ...data, updated_at: new Date().toISOString() });
    };

    const value: AuthContextType = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};