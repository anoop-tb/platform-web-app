/**
 * Platform Web App - Card Component
 *
 * Shared card container component.
 */

import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
    /** Children content */
    children: React.ReactNode;
    /** Additional class name */
    className?: string;
    /** Click handler for interactive cards */
    onClick?: () => void;
    /** Enable hover effects */
    hoverable?: boolean;
}

export function Card({
    children,
    className = '',
    onClick,
    hoverable = false,
}: CardProps) {
    const classNames = [
        styles.card,
        hoverable ? styles.hoverable : '',
        onClick ? styles.clickable : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classNames} onClick={onClick}>
            {children}
        </div>
    );
}
