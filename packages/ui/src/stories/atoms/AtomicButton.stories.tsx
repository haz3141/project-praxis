import type { Meta, StoryObj } from '@storybook/react';
import { AtomicButton } from '../../components/atoms/Button';

const meta: Meta<typeof AtomicButton> = {
  title: 'Atoms/AtomicButton',
  component: AtomicButton,
  tags: ['autodocs'],
  args: {
    children: 'Save',
    variant: 'primary',
    density: 'comfortable',
  },
};

export default meta;
type Story = StoryObj<typeof AtomicButton>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'ds-button--state-hover',
  },
};

export const FocusVisible: Story = {
  args: {
    className: 'ds-button--state-focus-visible',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete task',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Compact: Story = {
  args: {
    density: 'compact',
  },
};
