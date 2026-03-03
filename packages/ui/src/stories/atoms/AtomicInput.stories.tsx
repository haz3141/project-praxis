import type { Meta, StoryObj } from '@storybook/react';
import { AtomicInput } from '../../components/atoms/Input';

const meta: Meta<typeof AtomicInput> = {
  title: 'Atoms/AtomicInput',
  component: AtomicInput,
  tags: ['autodocs'],
  args: {
    label: 'Task title',
    placeholder: 'Write next action',
    hint: 'Keep it specific and executable.',
  },
};

export default meta;
type Story = StoryObj<typeof AtomicInput>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    error: 'Task title is required.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Compact: Story = {
  args: {
    density: 'compact',
  },
};
