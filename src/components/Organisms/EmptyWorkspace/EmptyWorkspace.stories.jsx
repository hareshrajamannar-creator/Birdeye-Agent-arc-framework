import React from 'react';
import EmptyWorkspace from './EmptyWorkspace';

export default {
  title: 'Agent Builder/Modules/EmptyWorkspace',
  component: EmptyWorkspace,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  args: {
    onCreateFromScratch: () => {},
    onUseTemplate: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', background: '#f4f6f7' }}>
        <Story />
      </div>
    ),
  ],
};
