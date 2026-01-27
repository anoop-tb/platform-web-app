/**
 * Platform Web App - Workspaces Service
 *
 * Workspace API calls to platform-api-core.
 *
 * Cross-Repo Endpoints:
 * - GET /api/v1/workspaces
 * - GET /api/v1/workspaces/{id}
 *
 * See: platform-api-core/app/api/v1/workspaces.py
 */

import api from './api';
import { PaginationParams, Workspace, WorkspaceListResponse } from '../types/api';

/**
 * Get workspaces for current user.
 *
 * Endpoint: GET /api/v1/workspaces
 *
 * Used by: Workspace switcher, Dashboard
 *
 * Breaking Changes:
 * - If WorkspaceListResponse changes, update workspace switcher
 */
export const getWorkspaces = async (
    params?: PaginationParams
): Promise<WorkspaceListResponse> => {
    const response = await api.get<WorkspaceListResponse>('/workspaces', { params });
    return response.data;
};

/**
 * Get single workspace by ID.
 *
 * Endpoint: GET /api/v1/workspaces/{id}
 *
 * Used by: Workspace context provider
 */
export const getWorkspace = async (workspaceId: string): Promise<Workspace> => {
    const response = await api.get<Workspace>(`/workspaces/${workspaceId}`);
    return response.data;
};

export interface CreateWorkspaceRequest {
    name: string;
    slug: string;
    description?: string;
}

/**
 * Create a new workspace.
 *
 * Endpoint: POST /api/v1/workspaces
 *
 * Used by: Dashboard create workspace modal
 */
export const createWorkspace = async (data: CreateWorkspaceRequest): Promise<Workspace> => {
    const response = await api.post<Workspace>('/workspaces', data);
    return response.data;
};
