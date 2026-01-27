/**
 * Platform Web App - API Type Definitions
 *
 * TypeScript types matching platform-api-core API responses.
 *
 * Cross-Repo Contract:
 * These types MUST match the Pydantic schemas in platform-api-core.
 * See: platform-api-core/app/schemas/
 *
 * IMPORTANT: Run `npm run generate-api` to regenerate from OpenAPI spec.
 *
 * Breaking Change Impact:
 * - Changing User type breaks: Header, Profile, Settings pages
 * - Changing Project type breaks: Project list, Project detail pages
 * - Changing Token type breaks: Login, token refresh flow
 */

// =============================================================================
// Authentication Types
// Matches: platform-api-core/app/schemas/auth.py
// =============================================================================

export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Token response from login/refresh endpoints.
 *
 * CRITICAL: This is consumed by AuthContext for token storage.
 * Changing field names breaks authentication flow.
 */
export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: 'bearer';
    expires_in: number;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

// =============================================================================
// User Types
// Matches: platform-api-core/app/schemas/user.py
// =============================================================================

/**
 * User response from /auth/me and /users endpoints.
 *
 * Breaking Changes:
 * - Removing `full_name` breaks Header component
 * - Removing `avatar_url` breaks user avatars
 * - Removing `role` breaks permission checks
 */
export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    role: 'super_admin' | 'admin' | 'member' | 'viewer';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserUpdate {
    full_name?: string;
    avatar_url?: string;
}

// =============================================================================
// Workspace Types
// Matches: platform-api-core/app/schemas/workspace.py
// =============================================================================

/**
 * Workspace from /workspaces endpoints.
 *
 * Breaking Changes:
 * - Removing `slug` breaks workspace URL routing
 * - Removing `name` breaks workspace switcher
 */
export interface Workspace {
    id: string;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface WorkspaceListResponse {
    workspaces: Workspace[];
    total: number;
    page: number;
    page_size: number;
}

// =============================================================================
// Project Types
// Matches: platform-api-core/app/schemas/project.py
// =============================================================================

/**
 * Project from /workspaces/{id}/projects endpoints.
 *
 * Breaking Changes:
 * - Removing `name` breaks project cards
 * - Removing `status` breaks status badges
 * - Changing `owner` structure breaks owner display
 */
export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'archived' | 'draft';
    workspace_id: string;
    owner_id: string;
    owner?: User;
    created_at: string;
    updated_at: string;
}

export interface ProjectCreate {
    name: string;
    description?: string;
    status?: 'active' | 'archived' | 'draft';
}

export interface ProjectUpdate {
    name?: string;
    description?: string;
    status?: 'active' | 'archived' | 'draft';
}

export interface ProjectListResponse {
    projects: Project[];
    total: number;
    page: number;
    page_size: number;
}

// =============================================================================
// API Error Types
// =============================================================================

export interface ApiError {
    detail: string;
    status_code: number;
}

// =============================================================================
// Pagination Types
// =============================================================================

export interface PaginationParams {
    page?: number;
    page_size?: number;
}
