// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useUserStore } from '../store/user.store';
import { authService } from '../services/supabase/auth.service';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { user, setUser, clearUser } = useUserStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let subscription: { unsubscribe: () => void } | null = null;

        const checkSession = async () => {
            try {
                const session = await authService.getSession();
                if (session?.user && isMounted) {
                    const userData = await authService.getCurrentUser();
                    if (userData && isMounted) {
                        setUser(userData);
                    }
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkSession();

        const authSubscription = authService.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                authService.getCurrentUser().then((userData) => {
                    if (userData && isMounted) {
                        setUser(userData);
                    }
                });
            } else if (event === 'SIGNED_OUT') {
                clearUser();
            }
        });

        subscription = authSubscription;

        return () => {
            isMounted = false;
            if (subscription && typeof subscription.unsubscribe === 'function') {
                subscription.unsubscribe();
            }
        };
    }, [setUser, clearUser]);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const result = await authService.signIn(email, password);
            if (result.user) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
        setLoading(true);
        try {
            const result = await authService.signUp(email, password, metadata);
            if (result.user) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await authService.signOut();
            clearUser();
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await authService.resetPassword(email);
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        if (!user) throw new Error('No user logged in');
        try {
            const updated = await authService.updateUser(data);
            if (updated) {
                setUser(updated);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
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