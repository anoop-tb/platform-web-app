/**
 * Input Component Stories
 *
 * Documentation for the shared Input component.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'Shared/Form/Input',
    component: Input,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Input Component

Shared form input component.

### Cross-Repo Usage
- **platform-web-app**: Login, forms
- **platform-admin-dashboard**: Settings panels
        `,
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        id: 'default',
        placeholder: 'Enter text...',
    },
};

export const WithLabel: Story = {
    args: {
        id: 'with-label',
        label: 'Email Address',
        type: 'email',
        placeholder: 'you@example.com',
    },
};

export const WithError: Story = {
    args: {
        id: 'with-error',
        label: 'Password',
        type: 'password',
        error: 'Password must be at least 8 characters',
    },
};

export const WithHelper: Story = {
    args: {
        id: 'with-helper',
        label: 'Username',
        helperText: 'Only letters, numbers, and underscores',
    },
};

export const AllStates: Story = {
    name: 'All States',
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '300px' }}>
            <Input id="normal" label="Normal" placeholder="Enter text..." />
            <Input id="helper" label="With Helper" helperText="Some helpful text" />
            <Input id="error" label="With Error" error="This field is required" />
            <Input id="disabled" label="Disabled" disabled placeholder="Disabled input" />
        </div>
    ),
};
