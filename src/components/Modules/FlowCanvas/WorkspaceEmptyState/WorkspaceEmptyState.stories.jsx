import React from 'react';
import WorkspaceEmptyState from './WorkspaceEmptyState';

export default {
  title: 'Agent Builder/Modules/FlowCanvas/WorkspaceEmptyState',
  component: WorkspaceEmptyState,
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

export const LibraryOpen = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ height: '100vh', display: 'flex', background: '#f4f6f7' }}>
        <WorkspaceEmptyState
          onCreateFromScratch={() => {}}
          onUseTemplate={() => {}}
          _defaultLibraryOpen={open}
        />
      </div>
    );
  },
};
