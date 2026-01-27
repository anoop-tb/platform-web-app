/**
 * Platform Web App - Auth Service
 *
 * Authentication API calls to platform-api-core.
 *
 * Cross-Repo Endpoints:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/refresh
 * - GET /api/v1/auth/me
 *
 * See: platform-api-core/app/api/v1/auth.py
 */

import api, { setTokens, clearTokens } from './api';
import { LoginRequest, TokenResponse, User } from '../types/api';

/**
 * Login user and store tokens.
 *
 * Endpoint: POST /api/v1/auth/login
 * Consumes: LoginRequest
 * Returns: TokenResponse
 *
 * Breaking Changes:
 * - If LoginRequest fields change, update login form
 * - If TokenResponse fields change, update token storage
 */
export const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    return response.data;
};

/**
 * Get current user profile.
 *
 * Endpoint: GET /api/v1/auth/me
 * Returns: User
 *
 * Used by: AuthContext to populate user state
 *
 * Breaking Changes:
 * - If User fields change, update AuthContext and Header
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
};

/**
 * Logout user and clear tokens.
 *
 * Endpoint: POST /api/v1/auth/logout
 *
 * Note: This is mostly client-side. Server endpoint is a no-op.
 */
export const logout = async (): Promise<void> => {
    try {
        await api.post('/auth/logout');
    } catch {
        // Ignore errors - logout should always succeed client-side
    } finally {
        clearTokens();
    }
};

/**
 * Register new user.
 *
 * Endpoint: POST /api/v1/auth/register
 * Consumes: { email, password, full_name }
 * Returns: User
 */
export const register = async (data: {
    email: string;
    password: string;
    full_name: string;
}): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
};
