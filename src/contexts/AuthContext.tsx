/**
 * Platform Web App - Authentication Context
 *
 * React context for authentication state management.
 *
 * Cross-Repo Dependencies:
 * - GET /api/v1/auth/me from platform-api-core
 * - User type from platform-api-core schemas
 *
 * Breaking Changes:
 * - If User type changes, update this context
 * - If /auth/me response changes, update getCurrentUser calls
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/api';
import { getCurrentUser, login as apiLogin, logout as apiLogout } from '../services/auth';
import { getAccessToken } from '../services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    /**
     * Load user on mount if token exists.
     */
    useEffect(() => {
        const loadUser = async () => {
            const token = getAccessToken();
            if (token) {
                try {
                    const userData = await getCurrentUser();
                    setUser(userData);
                } catch {
                    // Token invalid, user will need to login
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    /**
     * Login and fetch user profile.
     */
    const login = async (email: string, password: string) => {
        await apiLogin({ email, password });
        const userData = await getCurrentUser();
        setUser(userData);
    };

    /**
     * Logout and clear user state.
     */
    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    /**
     * Refresh user profile from API.
     */
    const refreshUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth context.
 *
 * Usage:
 * const { user, login, logout } = useAuth();
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
