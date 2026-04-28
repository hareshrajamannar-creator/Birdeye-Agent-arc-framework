import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';

export default function EntityTriggerBody({ initialValues = {}, onFieldChange }) {
  const [triggerName, setTriggerName] = useState(initialValues.triggerName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');

  const handleTriggerName = (e) => {
    const val = e.target.value;
    setTriggerName(val);
    onFieldChange?.('triggerName', val);
  };

  const handleDescription = (e) => {
    const val = e.target.value;
    setDescription(val);
    onFieldChange?.('description', val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="triggerName"
        type="text"
        label="Trigger name"
        placeholder="Enter name"
        value={triggerName}
        onChange={handleTriggerName}
        required
      />
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={description}
        onChange={handleDescription}
        noFloatingLabel
      />
    </div>
  );
}
