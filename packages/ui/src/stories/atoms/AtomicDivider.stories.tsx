import type { Meta, StoryObj } from '@storybook/react';
import { AtomicDivider } from '../../components/atoms/Divider';

const meta: Meta<typeof AtomicDivider> = {
  title: 'Atoms/AtomicDivider',
  component: AtomicDivider,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof AtomicDivider>;

export const Horizontal: Story = {};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div style={{ blockSize: 'var(--ds-space-4xl)', inlineSize: 'var(--ds-space-4xl)', display: 'grid', placeItems: 'center' }}>
      <AtomicDivider {...args} />
    </div>
  ),
};
