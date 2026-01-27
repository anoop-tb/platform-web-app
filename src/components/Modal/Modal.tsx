/**
 * Platform Web App - Modal Component
 *
 * Shared modal dialog component.
 *
 * Cross-Repo Usage:
 * - SHARED with platform-admin-dashboard
 * - Used for confirmations, forms, alerts
 */

import React, { useEffect } from 'react';
import styles from './Modal.module.css';

export interface ModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** Modal title */
    title?: string;
    /** Modal content */
    children: React.ReactNode;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Modal dialog component.
 *
 * Reused by:
 * - platform-admin-dashboard for confirmations and forms
 */
export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}: ModalProps) {
    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={`${styles.modal} ${styles[size]}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {title && (
                    <div className={styles.header}>
                        <h2 id="modal-title" className={styles.title}>
                            {title}
                        </h2>
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>
                )}
                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
}
