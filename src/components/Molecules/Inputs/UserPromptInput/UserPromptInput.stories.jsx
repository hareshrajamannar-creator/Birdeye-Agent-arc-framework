import React, { useState } from 'react';
import UserPromptInput from './UserPromptInput';

export default {
  title: 'Agent Builder/Molecules/Inputs/UserPromptInput',
  component: UserPromptInput,
};

export const Default = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 360, padding: 16 }}>
        <UserPromptInput value={value} onChange={(e) => setValue(e.target.value)} required />
      </div>
    );
  },
};

export const WithValue = {
  render: () => {
    const [value, setValue] = useState('Analyze the following feedback: {{feedback_text}}');
    return (
      <div style={{ width: 360, padding: 16 }}>
        <UserPromptInput value={value} onChange={(e) => setValue(e.target.value)} required />
      </div>
    );
  },
};
