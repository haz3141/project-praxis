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

export const Compact: Story = {
  args: {
    density: 'compact',
  },
};
