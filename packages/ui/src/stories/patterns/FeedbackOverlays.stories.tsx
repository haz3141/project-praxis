import type { Meta, StoryObj } from '@storybook/react';
import { AtomicButton } from '../../components/atoms/Button';
import { Modal } from '../../components/organisms/Modal';
import { Toast } from '../../components/Toast';
import { ToastRegion } from '../../components/organisms/ToastRegion';

const meta: Meta = {
  title: 'Patterns/Feedback & Overlays',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const OverlayPreview: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <AtomicButton>Trigger toast</AtomicButton>
      <ToastRegion>
        <Toast open title="Saved" description="Task updates synced." tone="success" />
      </ToastRegion>
      <Modal
        open
        title="Review in 60 seconds"
        description="Overlays stay secondary and should return focus to planner context."
        onClose={() => {}}
        actions={<AtomicButton>Close</AtomicButton>}
      >
        Planner review prompt content.
      </Modal>
    </div>
  ),
};
