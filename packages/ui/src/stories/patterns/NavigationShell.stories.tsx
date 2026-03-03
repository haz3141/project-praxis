import type { Meta, StoryObj } from '@storybook/react';
import { AtomicAppShell } from '../../components/organisms/AppShell';

const meta: Meta<typeof AtomicAppShell> = {
  title: 'Patterns/Navigation & Shell',
  component: AtomicAppShell,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AtomicAppShell>;

export const Default: Story = {
  args: {
    sidebar: <div>Sidebar (collapsible)</div>,
    topbar: <div>Top nav + Command (Cmd/Ctrl+K)</div>,
    main: <div>Main planner workspace</div>,
    utility: <div>Utility panel</div>,
  },
};
