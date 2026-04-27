import React, { useState } from 'react';
import VariableSelectionModal from './VariableSelectionModal';

export default {
  title: 'Agent Builder/Organisms/Modals/VariableSelectionModal',
  component: VariableSelectionModal,
  parameters: { layout: 'fullscreen' },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ height: '100vh', background: '#f4f6f7' }}>
        <button
          onClick={() => setOpen(true)}
          style={{ margin: 24, padding: '8px 16px', cursor: 'pointer' }}
        >
          Open modal
        </button>
        <VariableSelectionModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onVariableSelect={(v) => console.log('Selected variable:', v)}
        />
      </div>
    );
  },
};
