/**
 * Card Component Stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
    title: 'Shared/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: (
            <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Card Title</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>
                    Card content goes here.
                </p>
            </div>
        ),
    },
};

export const Hoverable: Story = {
    args: {
        hoverable: true,
        children: (
            <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Hoverable Card</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>
                    Hover over me!
                </p>
            </div>
        ),
    },
};

export const Clickable: Story = {
    args: {
        hoverable: true,
        onClick: () => alert('Card clicked!'),
        children: (
            <div style={{ padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Clickable Card</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)' }}>
                    Click me!
                </p>
            </div>
        ),
    },
};
