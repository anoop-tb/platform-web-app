/**
 * Platform Web App - Button Component
 *
 * Shared button component used across the platform.
 *
 * Cross-Repo Usage:
 * - This component is SHARED with platform-admin-dashboard
 * - Changes here affect both applications
 * - Storybook stories document all variants
 *
 * See: .storybook/ for component documentation
 */

import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual variant */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    /** Scale variant */
    Scale?: 'sm' | 'md' | 'lg';
    /** Full width button */
    fullWidth?: boolean;
    /** Loading state */
    isLoading?: boolean;
    /** Children content */
    children: React.ReactNode;
}

/**
 * Button component with multiple variants.
 *
 * Reused by:
 * - platform-admin-dashboard (copied via npm package or manual copy)
 *
 * @example
 * <Button variant="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 */
export function Button({
    variant = 'primary',
    Scale = 'md',
    fullWidth = false,
    isLoading = false,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[Scale],
        fullWidth ? styles.fullWidth : '',
        isLoading ? styles.loading : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={classNames}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className={styles.spinner} aria-label="Loading" />
            ) : (
                children
            )}
        </button>
    );
}
