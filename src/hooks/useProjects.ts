/**
 * Platform Web App - useProjects Hook
 *
 * React hook for project data fetching.
 *
 * Cross-Repo:
 * - Uses GET /api/v1/workspaces/{id}/projects
 * - Uses Project type from platform-api-core
 */

import { useCallback, useEffect, useState } from 'react';
import { Project, ProjectListResponse } from '../types/api';
import { getProjects, getProject } from '../services/projects';

interface UseProjectsOptions {
    workspaceId: string;
    page?: number;
    pageSize?: number;
    autoFetch?: boolean;
}

interface UseProjectsResult {
    projects: Project[];
    total: number;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching project list.
 *
 * Used by: ProjectsPage
 */
export function useProjects({
    workspaceId,
    page = 1,
    pageSize = 20,
    autoFetch = true,
}: UseProjectsOptions): UseProjectsResult {
    const [projects, setProjects] = useState<Project[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProjects = useCallback(async () => {
        if (!workspaceId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await getProjects(workspaceId, { page, page_size: pageSize });
            setProjects(response.projects);
            setTotal(response.total);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId, page, pageSize]);

    useEffect(() => {
        if (autoFetch) {
            fetchProjects();
        }
    }, [fetchProjects, autoFetch]);

    return {
        projects,
        total,
        isLoading,
        error,
        refetch: fetchProjects,
    };
}

/**
 * Hook for fetching single project.
 *
 * Used by: ProjectDetailPage
 */
export function useProject(workspaceId: string, projectId: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProject = useCallback(async () => {
        if (!workspaceId || !projectId) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await getProject(workspaceId, projectId, true);
            setProject(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch project'));
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId, projectId]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    return {
        project,
        isLoading,
        error,
        refetch: fetchProject,
    };
}
