/**
 * Platform Web App - Projects Page
 *
 * Lists projects in the current workspace.
 *
 * API Endpoint: GET /api/v1/workspaces/{id}/projects
 * See: platform-api-core/app/api/v1/projects.py
 *
 * Breaking Changes:
 * - If ProjectListResponse changes, update grid rendering
 * - If Project fields change, update ProjectCard component
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useProjects } from '../../hooks/useProjects';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { Input } from '../../components/Form/Input';
import { createProject } from '../../services/projects';
import styles from './ProjectsPage.module.css';

export function ProjectsPage() {
    const navigate = useNavigate();
    const { currentWorkspace } = useWorkspaces();
    const { projects, isLoading, refetch } = useProjects({
        workspaceId: currentWorkspace?.id || '',
        autoFetch: !!currentWorkspace,
    });

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateProject = async () => {
        if (!currentWorkspace || !newProjectName.trim()) return;

        setIsCreating(true);
        try {
            await createProject(currentWorkspace.id, { name: newProjectName });
            setNewProjectName('');
            setShowCreateModal(false);
            refetch();
        } catch (error) {
            console.error('Failed to create project:', error);
        } finally {
            setIsCreating(false);
        }
    };

    if (!currentWorkspace) {
        return (
            <MainLayout>
                <div className={styles.container}>
                    <p>Please select a workspace first.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Projects</h1>
                        <p className={styles.subtitle}>in {currentWorkspace.name}</p>
                    </div>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        + New Project
                    </Button>
                </header>

                {isLoading ? (
                    <div className={styles.loading}>Loading projects...</div>
                ) : projects.length === 0 ? (
                    <Card className={styles.emptyState}>
                        <p>No projects yet. Create your first project to get started.</p>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            Create Project
                        </Button>
                    </Card>
                ) : (
                    <div className={styles.projectGrid}>
                        {projects.map((project) => (
                            <Card
                                key={project.id}
                                className={styles.projectCard}
                                onClick={() => navigate(`/projects/${project.id}`)}
                                hoverable
                            >
                                <div className={styles.projectHeader}>
                                    <h3 className={styles.projectName}>{project.name}</h3>
                                    <span className={`${styles.status} ${styles[project.status]}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <p className={styles.projectDescription}>
                                    {project.description || 'No description'}
                                </p>
                                <div className={styles.projectMeta}>
                                    <span>Updated {new Date(project.updated_at).toLocaleDateString()}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    title="Create New Project"
                >
                    <div className={styles.modalContent}>
                        <Input
                            id="project-name"
                            label="Project Name"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Enter project name"
                        />
                        <div className={styles.modalActions}>
                            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCreateProject}
                                isLoading={isCreating}
                                disabled={!newProjectName.trim()}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </MainLayout>
    );
}
