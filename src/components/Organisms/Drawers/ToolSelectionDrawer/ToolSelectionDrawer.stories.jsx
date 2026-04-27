import React, { useState } from 'react';
import ToolSelectionDrawer from './ToolSelectionDrawer';

export default {
  title: 'Agent Builder/Organisms/Drawer/ToolSelectionDrawer',
  component: ToolSelectionDrawer,
  parameters: { layout: 'fullscreen' },
};

function DrawerWrapper({ defaultTab }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{ height: '100vh', background: 'rgba(33,33,33,0.24)' }}>
      <ToolSelectionDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultTab={defaultTab}
        onToolSelect={(tool) => console.log('Selected tool:', tool)}
        onConnect={(tool) => console.log('Connect:', tool)}
        onAddCustom={() => console.log('Add custom integration')}
      />
    </div>
  );
}

export const InternalTools = {
  render: () => <DrawerWrapper defaultTab="internal" />,
};

export const ExternalTools = {
  render: () => <DrawerWrapper defaultTab="external" />,
};
