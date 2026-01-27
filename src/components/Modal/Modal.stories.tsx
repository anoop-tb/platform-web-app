/**
 * Modal Component Stories
 *
 * Documentation for the shared Modal component.
 *
 * Cross-Repo Note:
 * This component is SHARED with platform-admin-dashboard.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta: Meta<typeof Modal> = {
    title: 'Shared/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Modal Component

Shared modal dialog component.

### Cross-Repo Usage
- **platform-web-app**: Forms, confirmations
- **platform-admin-dashboard**: Settings, confirmations
        `,
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Example Modal"
                >
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        This is the modal content. It can contain any React components.
                    </p>
                </Modal>
            </>
        );
    },
};

export const WithActions: Story = {
    name: 'With Actions',
    render: () => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <>
                <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Confirm Action"
                >
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>
                        Are you sure you want to proceed with this action?
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => setIsOpen(false)}>
                            Confirm
                        </Button>
                    </div>
                </Modal>
            </>
        );
    },
};

export const Sizes: Story = {
    render: () => {
        const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
        return (
            <>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button onClick={() => setSize('sm')}>Small</Button>
                    <Button onClick={() => setSize('md')}>Medium</Button>
                    <Button onClick={() => setSize('lg')}>Large</Button>
                </div>
                <Modal
                    isOpen={size !== null}
                    onClose={() => setSize(null)}
                    title={`${size?.toUpperCase()} Modal`}
                    size={size || 'md'}
                >
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                        This is a {size} sized modal.
                    </p>
                </Modal>
            </>
        );
    },
};
