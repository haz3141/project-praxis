import type { Meta, StoryObj } from '@storybook/react';
import { AtomicButton } from '../../components/atoms/Button';
import { PriorityCard } from '../../components/organisms/PriorityCard';
import { TaskRow } from '../../components/organisms/TaskRow';
import { TodayTemplate } from '../../components/templates/TodayTemplate';

const meta: Meta<typeof TodayTemplate> = {
  title: 'Patterns/Today (Planner Patterns)',
  component: TodayTemplate,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TodayTemplate>;

export const Default: Story = {
  args: {
    priorities: (
      <PriorityCard
        title="Top 1-3 priorities"
        description="Priorities stay visually dominant for fast re-entry."
        actions={<AtomicButton>Commit now</AtomicButton>}
      />
    ),
    weekStrip: <div className="ds-caption">Mon Tue Wed Thu Fri Sat Sun</div>,
    taskList: (
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <TaskRow title="Capture backlog clean-up" description="15 min" priority="medium" due="Today" />
        <TaskRow title="Review weekly commitments" description="60 sec review" priority="low" due="Fri" />
      </div>
    ),
    overlays: <div className="ds-caption">Insights capsule (tertiary)</div>,
  },
};
