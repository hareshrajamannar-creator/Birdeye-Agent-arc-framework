import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';

export default function EntityTriggerBody({ initialValues = {} }) {
  const [triggerName, setTriggerName] = useState(initialValues.triggerName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="triggerName"
        type="text"
        label="Trigger name"
        placeholder="Enter name"
        value={triggerName}
        onChange={(e) => setTriggerName(e.target.value)}
        required
      />
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        noFloatingLabel
      />
    </div>
  );
}
