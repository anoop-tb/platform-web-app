/**
 * Platform Web App - Dashboard Page
 *
 * Main dashboard showing workspaces and recent activity.
 *
 * API Endpoints Used:
 * - GET /api/v1/auth/me (via AuthContext)
 * - GET /api/v1/workspaces
 * - POST /api/v1/workspaces (create workspace)
 *
 * Breaking Changes:
 * - If User.full_name changes, update greeting
 * - If Workspace fields change, update workspace cards
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { Input } from '../../components/Form/Input';
import { createWorkspace } from '../../services/workspaces';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
    const { user } = useAuth();
    const { workspaces, isLoading, setCurrentWorkspace, refetch } = useWorkspaces();
    const navigate = useNavigate();

    // Create workspace modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
    const [createError, setCreateError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const handleWorkspaceClick = (workspace: typeof workspaces[0]) => {
        setCurrentWorkspace(workspace);
        navigate('/projects');
    };

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) {
            setCreateError('Workspace name is required');
            return;
        }

        setCreateError(null);
        setIsCreating(true);

        try {
            // Generate slug from name (lowercase, replace spaces with hyphens)
            const slug = newWorkspaceName.trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-');

            const workspace = await createWorkspace({
                name: newWorkspaceName.trim(),
                slug,
                description: newWorkspaceDescription.trim() || undefined,
            });

            // Close modal and reset form
            setShowCreateModal(false);
            setNewWorkspaceName('');
            setNewWorkspaceDescription('');

            // Refresh workspaces list
            refetch();

            // Navigate to the new workspace
            setCurrentWorkspace(workspace);
            navigate('/projects');
        } catch (err: any) {
            setCreateError(err.response?.data?.detail || 'Failed to create workspace');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setNewWorkspaceName('');
        setNewWorkspaceDescription('');
        setCreateError(null);
    };

    return (
        <MainLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.greeting}>
                        Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
                    </h1>
                    <p className={styles.subtitle}>
                        Select a workspace to get started
                    </p>
                </header>

                <section className={styles.workspaces}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Your Workspaces</h2>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowCreateModal(true)}
                        >
                            + Create Workspace
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className={styles.loading}>Loading workspaces...</div>
                    ) : workspaces.length === 0 ? (
                        <Card className={styles.emptyState}>
                            <p>No workspaces yet.</p>
                            <Button
                                variant="primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                Create Your First Workspace
                            </Button>
                        </Card>
                    ) : (
                        <div className={styles.workspaceGrid}>
                            {workspaces.map((workspace) => (
                                <Card
                                    key={workspace.id}
                                    className={styles.workspaceCard}
                                    onClick={() => handleWorkspaceClick(workspace)}
                                    hoverable
                                >
                                    <div className={styles.workspaceIcon}>
                                        {workspace.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={styles.workspaceInfo}>
                                        <h3 className={styles.workspaceName}>{workspace.name}</h3>
                                        <p className={styles.workspaceSlug}>/{workspace.slug}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Create Workspace Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={handleCloseModal}
                title="Create Workspace"
            >
                <div className={styles.modalForm}>
                    {createError && (
                        <div className={styles.modalError}>{createError}</div>
                    )}

                    <Input
                        id="workspaceName"
                        label="Workspace Name"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        placeholder="My Workspace"
                        required
                    />

                    <Input
                        id="workspaceDescription"
                        label="Description (optional)"
                        value={newWorkspaceDescription}
                        onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                        placeholder="What's this workspace for?"
                    />

                    <div className={styles.modalActions}>
                        <Button variant="ghost" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateWorkspace}
                            isLoading={isCreating}
                        >
                            Create
                        </Button>
                    </div>
                </div>
            </Modal>
        </MainLayout>
    );
}
