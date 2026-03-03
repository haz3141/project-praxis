import type { Meta, StoryObj } from '@storybook/react';
import { AtomicStatusDot } from '../../components/atoms/StatusDot';

const meta: Meta<typeof AtomicStatusDot> = {
  title: 'Atoms/AtomicStatusDot',
  component: AtomicStatusDot,
  tags: ['autodocs'],
  args: {
    tone: 'neutral',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof AtomicStatusDot>;

export const Neutral: Story = {};

export const Success: Story = {
  args: {
    tone: 'success',
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
  },
};

export const Error: Story = {
  args: {
    tone: 'error',
  },
};

export const Sync: Story = {
  args: {
    tone: 'sync',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    tone: 'sync',
  },
};
