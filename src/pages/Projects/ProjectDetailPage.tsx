/**
 * Platform Web App - Project Detail Page
 *
 * Single project view.
 *
 * API Endpoint: GET /api/v1/workspaces/{id}/projects/{id}
 * See: platform-api-core/app/api/v1/projects.py
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import { useProject } from '../../hooks/useProjects';
import { MainLayout } from '../../components/Layout/MainLayout';
import { Card } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const { currentWorkspace } = useWorkspaces();
    const { project, isLoading, error } = useProject(
        currentWorkspace?.id || '',
        projectId || ''
    );

    if (!currentWorkspace) {
        return (
            <MainLayout>
                <div className={styles.container}>
                    <p>Please select a workspace first.</p>
                </div>
            </MainLayout>
        );
    }

    if (isLoading) {
        return (
            <MainLayout>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading project...</div>
                </div>
            </MainLayout>
        );
    }

    if (error || !project) {
        return (
            <MainLayout>
                <div className={styles.container}>
                    <Card className={styles.errorCard}>
                        <p>Project not found or an error occurred.</p>
                        <Button variant="primary" onClick={() => navigate('/projects')}>
                            Back to Projects
                        </Button>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Button variant="ghost" onClick={() => navigate('/projects')}>
                        ← Back to Projects
                    </Button>
                </header>

                <div className={styles.content}>
                    <div className={styles.titleRow}>
                        <h1 className={styles.title}>{project.name}</h1>
                        <span className={`${styles.status} ${styles[project.status]}`}>
                            {project.status}
                        </span>
                    </div>

                    <p className={styles.description}>
                        {project.description || 'No description provided.'}
                    </p>

                    <Card className={styles.detailsCard}>
                        <h2 className={styles.sectionTitle}>Project Details</h2>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detail}>
                                <span className={styles.detailLabel}>Created</span>
                                <span className={styles.detailValue}>
                                    {new Date(project.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.detail}>
                                <span className={styles.detailLabel}>Last Updated</span>
                                <span className={styles.detailValue}>
                                    {new Date(project.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.detail}>
                                <span className={styles.detailLabel}>Status</span>
                                <span className={styles.detailValue}>{project.status}</span>
                            </div>
                            {project.owner && (
                                <div className={styles.detail}>
                                    <span className={styles.detailLabel}>Owner</span>
                                    <span className={styles.detailValue}>{project.owner.full_name}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
