/**
 * Platform Web App - Projects Service
 *
 * Project API calls to platform-api-core.
 *
 * Cross-Repo Endpoints:
 * - GET /api/v1/workspaces/{id}/projects
 * - POST /api/v1/workspaces/{id}/projects
 * - GET /api/v1/workspaces/{id}/projects/{id}
 * - PATCH /api/v1/workspaces/{id}/projects/{id}
 * - DELETE /api/v1/workspaces/{id}/projects/{id}
 *
 * See: platform-api-core/app/api/v1/projects.py
 */

import api from './api';
import {
    PaginationParams,
    Project,
    ProjectCreate,
    ProjectListResponse,
    ProjectUpdate,
} from '../types/api';

/**
 * Get projects in a workspace.
 *
 * Endpoint: GET /api/v1/workspaces/{workspace_id}/projects
 *
 * Used by: ProjectsPage (project grid)
 *
 * Breaking Changes:
 * - If ProjectListResponse changes, update ProjectsPage
 * - If pagination changes, update infinite scroll/pagination
 */
export const getProjects = async (
    workspaceId: string,
    params?: PaginationParams & { include_owner?: boolean }
): Promise<ProjectListResponse> => {
    const response = await api.get<ProjectListResponse>(
        `/workspaces/${workspaceId}/projects`,
        { params }
    );
    return response.data;
};

/**
 * Get single project by ID.
 *
 * Endpoint: GET /api/v1/workspaces/{workspace_id}/projects/{project_id}
 *
 * Used by: ProjectDetailPage
 *
 * Breaking Changes:
 * - If Project fields change, update ProjectDetailPage
 */
export const getProject = async (
    workspaceId: string,
    projectId: string,
    includeOwner = false
): Promise<Project> => {
    const response = await api.get<Project>(
        `/workspaces/${workspaceId}/projects/${projectId}`,
        { params: { include_owner: includeOwner } }
    );
    return response.data;
};

/**
 * Create new project.
 *
 * Endpoint: POST /api/v1/workspaces/{workspace_id}/projects
 *
 * Used by: CreateProjectModal
 *
 * Breaking Changes:
 * - If ProjectCreate fields change, update create form
 */
export const createProject = async (
    workspaceId: string,
    data: ProjectCreate
): Promise<Project> => {
    const response = await api.post<Project>(
        `/workspaces/${workspaceId}/projects`,
        data
    );
    return response.data;
};

/**
 * Update existing project.
 *
 * Endpoint: PATCH /api/v1/workspaces/{workspace_id}/projects/{project_id}
 *
 * Used by: ProjectSettings, inline edit
 */
export const updateProject = async (
    workspaceId: string,
    projectId: string,
    data: ProjectUpdate
): Promise<Project> => {
    const response = await api.patch<Project>(
        `/workspaces/${workspaceId}/projects/${projectId}`,
        data
    );
    return response.data;
};

/**
 * Delete project.
 *
 * Endpoint: DELETE /api/v1/workspaces/{workspace_id}/projects/{project_id}
 *
 * Used by: ProjectSettings delete button
 */
export const deleteProject = async (
    workspaceId: string,
    projectId: string
): Promise<void> => {
    await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
};
