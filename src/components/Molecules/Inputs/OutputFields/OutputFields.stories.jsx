import React, { useState } from 'react';
import OutputFields from './OutputFields';

export default {
  title: 'Agent Builder/Molecules/Inputs/OutputFields',
  component: OutputFields,
};

export const Empty = {
  render: () => <div style={{ width: 360, padding: 16 }}><OutputFields fields={[]} onAddClick={() => {}} showInfo /></div>,
};

export const WithFields = {
  render: () => {
    const fields = [
      { fieldName: 'sentiment_score', fieldType: 'Number' },
      { fieldName: 'key_themes', fieldType: 'Text' },
    ];
    return (
      <div style={{ width: 360, padding: 16 }}>
        <OutputFields fields={fields} onAddClick={() => {}} showInfo />
      </div>
    );
  },
};
