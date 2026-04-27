import React, { useState } from 'react';
import ExpandedRHSTestFeedback from './ExpandedRHSTestFeedback';

export default {
  title: 'Agent Builder/Molecules/Expanded RHS/ExpandedRHSTestFeedback',
  component: ExpandedRHSTestFeedback,
};

export const Default = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 482, padding: 16 }}>
        <ExpandedRHSTestFeedback
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={() => alert('Submitted: ' + value)}
        />
      </div>
    );
  },
};

export const WithValue = {
  render: () => {
    const [value, setValue] = useState('The output is incorrectly categorizing neutral reviews as negative.');
    return (
      <div style={{ width: 482, padding: 16 }}>
        <ExpandedRHSTestFeedback
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={() => alert('Submitted: ' + value)}
        />
      </div>
    );
  },
};
