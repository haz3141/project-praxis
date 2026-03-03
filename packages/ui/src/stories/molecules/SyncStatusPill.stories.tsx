import type { Meta, StoryObj } from '@storybook/react';
import { SyncStatusPill } from '../../components/molecules/SyncStatusPill';

const meta: Meta<typeof SyncStatusPill> = {
  title: 'Molecules/SyncStatusPill',
  component: SyncStatusPill,
  tags: ['autodocs'],
  args: {
    state: 'syncing',
    density: 'comfortable',
  },
};

export default meta;
type Story = StoryObj<typeof SyncStatusPill>;

export const Syncing: Story = {};

export const Offline: Story = {
  args: {
    state: 'offline',
  },
};

export const Synced: Story = {
  args: {
    state: 'synced',
  },
};

export const Conflict: Story = {
  args: {
    state: 'conflict',
  },
};

export const Compact: Story = {
  args: {
    density: 'compact',
    state: 'synced',
  },
};
