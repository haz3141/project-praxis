import type { Preview } from '@storybook/react';
import '@praxis/design-tokens/dist/tokens.css';
import '../src/styles.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: 'var(--ds-color-bg-canvas)' },
        { name: 'surface', value: 'var(--ds-color-bg-surface)' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const density = context.globals.density || 'comfortable';
      return (
        <div data-theme="light" data-density={density as string} style={{ padding: '1rem' }}>
          <Story />
        </div>
      );
    },
  ],
  globalTypes: {
    density: {
      name: 'Density',
      defaultValue: 'comfortable',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'comfortable', title: 'Comfortable' },
          { value: 'compact', title: 'Compact' },
        ],
      },
    },
  },
};

export default preview;
