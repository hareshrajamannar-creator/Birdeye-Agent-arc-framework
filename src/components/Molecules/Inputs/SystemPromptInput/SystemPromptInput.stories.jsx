import React, { useState } from 'react';
import SystemPromptInput from './SystemPromptInput';

export default {
  title: 'Agent Builder/Molecules/Inputs/SystemPromptInput',
  component: SystemPromptInput,
};

export const Default = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 360, padding: 16 }}>
        <SystemPromptInput value={value} onChange={(e) => setValue(e.target.value)} required />
      </div>
    );
  },
};

export const WithValue = {
  render: () => {
    const [value, setValue] = useState('You are a helpful assistant that analyzes customer feedback and extracts structured insights.');
    return (
      <div style={{ width: 360, padding: 16 }}>
        <SystemPromptInput value={value} onChange={(e) => setValue(e.target.value)} required />
      </div>
    );
  },
};
