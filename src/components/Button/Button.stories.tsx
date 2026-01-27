/**
 * Button Component Stories
 *
 * Documentation for the shared Button component.
 *
 * Cross-Repo Note:
 * This component is SHARED with platform-admin-dashboard.
 * Both applications should use the same component variants
 * to maintain visual consistency.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Shared/Button',
    component: Button,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Button Component

Shared button component used across the platform.

### Cross-Repo Usage
- **platform-web-app**: Primary user interface
- **platform-admin-dashboard**: Admin interface (copy this component)

### Breaking Changes
Changing this component affects both applications.
        `,
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'danger'],
            description: 'Visual variant of the button',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size variant',
        },
        fullWidth: {
            control: 'boolean',
            description: 'Stretch to full width',
        },
        isLoading: {
            control: 'boolean',
            description: 'Loading state',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Primary Button',
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Secondary Button',
        variant: 'secondary',
    },
};

export const Ghost: Story = {
    args: {
        children: 'Ghost Button',
        variant: 'ghost',
    },
};

export const Danger: Story = {
    args: {
        children: 'Delete',
        variant: 'danger',
    },
};

export const Loading: Story = {
    args: {
        children: 'Loading...',
        variant: 'primary',
        isLoading: true,
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

export const AllVariants: Story = {
    name: 'All Variants',
    render: () => (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
        </div>
    ),
};
