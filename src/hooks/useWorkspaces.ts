/**
 * Platform Web App - useWorkspaces Hook
 *
 * React hook for workspace data fetching.
 */

import { useCallback, useEffect, useState } from 'react';
import { Workspace } from '../types/api';
import { getWorkspaces } from '../services/workspaces';

interface UseWorkspacesResult {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    setCurrentWorkspace: (workspace: Workspace) => void;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

/**
 * Hook for managing workspaces.
 *
 * Used by: Workspace switcher, Dashboard
 */
export function useWorkspaces(): UseWorkspacesResult {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchWorkspaces = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getWorkspaces();
            setWorkspaces(response.workspaces);

            // Set first workspace as current if none selected
            if (!currentWorkspace && response.workspaces.length > 0) {
                setCurrentWorkspace(response.workspaces[0]);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch workspaces'));
        } finally {
            setIsLoading(false);
        }
    }, [currentWorkspace]);

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    return {
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        isLoading,
        error,
        refetch: fetchWorkspaces,
    };
}
