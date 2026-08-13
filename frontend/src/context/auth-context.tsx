import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => typeof window !== 'undefined' ? api.getCurrentUser() : null);
    const loading = false;

    useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('maison_tokens')) {
            api.getMe().then(setUser).catch(() => {
                api.logout();
                setUser(null);
            });
        }

        const interval = setInterval(async () => {
            if (typeof window !== 'undefined' && localStorage.getItem('maison_tokens')) {
                try { await api.refreshToken(); } catch { api.logout(); setUser(null); }
            }
        }, 1000 * 60 * 10);
        return () => clearInterval(interval);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const { user } = await api.login(email, password);
        setUser(user);
    }, []);

    const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
        const { user } = await api.register(email, password, firstName, lastName);
        setUser(user);
    }, []);

    const logout = useCallback(() => {
        api.logout();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
