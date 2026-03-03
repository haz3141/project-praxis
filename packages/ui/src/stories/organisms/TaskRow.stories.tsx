import type { Meta, StoryObj } from '@storybook/react';
import { AtomicButton } from '../../components/atoms/Button';
import { TaskRow } from '../../components/organisms/TaskRow';

const meta: Meta<typeof TaskRow> = {
  title: 'Organisms/TaskRow',
  component: TaskRow,
  tags: ['autodocs'],
  args: {
    title: 'Ship token audit script',
    description: 'Fail build on hardcoded color literals in component source.',
    priority: 'high',
    due: 'Today',
    trailing: <AtomicButton variant="ghost">Open</AtomicButton>,
  },
};

export default meta;
type Story = StoryObj<typeof TaskRow>;

export const Default: Story = {};

export const Hover: Story = {
  args: {
    className: 'ds-task-row--state-hover',
  },
};

export const FocusVisible: Story = {
  args: {
    className: 'ds-task-row--state-focus-visible',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    trailing: (
      <AtomicButton variant="ghost" disabled>
        Open
      </AtomicButton>
    ),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    trailing: (
      <AtomicButton variant="ghost" loading>
        Open
      </AtomicButton>
    ),
  },
};

export const Compact: Story = {
  args: {
    density: 'compact',
  },
};
