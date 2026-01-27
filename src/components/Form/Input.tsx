/**
 * Platform Web App - Input Component
 *
 * Shared form input component.
 *
 * Cross-Repo Usage:
 * - SHARED with platform-admin-dashboard
 */

import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Input label */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
}

export function Input({
    id,
    label,
    error,
    helperText,
    className = '',
    ...props
}: InputProps) {
    return (
        <div className={`${styles.container} ${className}`}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
            {helperText && !error && (
                <span className={styles.helper}>{helperText}</span>
            )}
        </div>
    );
}
