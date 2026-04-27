import React, { useState } from 'react';
import MetricCustomiserModal from './MetricCustomiserModal';

export default {
  title: 'Agent Builder/Organisms/Modals/MetricCustomiserModal',
  component: MetricCustomiserModal,
  parameters: { layout: 'fullscreen' },
};

export const TimeSaved = {
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
        <MetricCustomiserModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSave={(settings) => { console.log('Saved:', settings); setOpen(false); }}
          defaultMode="time"
          defaultTimeValue={5}
        />
      </div>
    );
  },
};

export const CostSaved = {
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
        <MetricCustomiserModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSave={(settings) => { console.log('Saved:', settings); setOpen(false); }}
          defaultMode="cost"
          defaultTimeValue={5}
          defaultWage={36}
          defaultCurrency="USD"
        />
      </div>
    );
  },
};
