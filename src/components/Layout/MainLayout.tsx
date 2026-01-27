/**
 * Platform Web App - Main Layout Component
 *
 * App shell with header and sidebar.
 */

import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../Button/Button';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { user, logout } = useAuth();

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.logo}>Platform</div>
                <nav className={styles.nav}>
                    <a href="/dashboard" className={styles.navLink}>Dashboard</a>
                    <a href="/projects" className={styles.navLink}>Projects</a>
                </nav>
                <div className={styles.userSection}>
                    <span className={styles.userName}>{user?.full_name}</span>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </header>
            <main className={styles.main}>{children}</main>
        </div>
    );
}
