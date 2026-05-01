import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import Conditions from '../../../Molecules/Conditions/Conditions';

const DEFAULT_CONDITION_OPTIONS = {
  field: [
    { value: 'event', label: 'Event' },
    { value: 'message_type', label: 'Message type' },
    { value: 'message_age', label: 'Message age' },
    { value: 'rating', label: 'Rating' },
    { value: 'sentiment', label: 'Sentiment' },
    { value: 'source', label: 'Source' },
    { value: 'location', label: 'Location' },
    { value: 'keyword', label: 'Keyword' },
  ],
  operator: [
    { value: 'is', label: 'is' },
    { value: 'is_not', label: 'is not' },
    { value: 'contains', label: 'contains' },
    { value: 'greater_than', label: 'is greater than' },
    { value: 'less_than', label: 'is less than' },
  ],
  value: [
    { value: 'review_received', label: 'Review received' },
    { value: 'google', label: 'Google' },
    { value: '48_hours', label: '48 hours' },
  ],
};

const DEFAULT_CONDITIONS = [
  { id: 1, fieldValue: '', operatorValue: '', valueValue: '' },
];

const makeCondition = (id) => ({ id, fieldValue: '', operatorValue: '', valueValue: '' });

export default function EntityTriggerBody({ initialValues = {}, onFieldChange }) {
  const [triggerName, setTriggerName] = useState(initialValues.triggerName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [conditions, setConditions] = useState(
    initialValues.conditions?.length ? initialValues.conditions : DEFAULT_CONDITIONS
  );
  const [logic, setLogic] = useState(initialValues.logic ?? 'AND');
  const [conditionOptions, setConditionOptions] = useState(
    initialValues.conditionOptions ?? DEFAULT_CONDITION_OPTIONS
  );

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

  function handleConditionChange(id, field, value) {
    setConditions((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, [`${field}Value`]: value } : c));
      onFieldChange?.('conditions', next);
      return next;
    });
  }

  function handleRemoveCondition(id) {
    setConditions((prev) => {
      const next = prev.filter((c) => c.id !== id);
      onFieldChange?.('conditions', next);
      return next;
    });
  }

  function handleAddCondition() {
    setConditions((prev) => {
      const next = [...prev, makeCondition(Date.now())];
      onFieldChange?.('conditions', next);
      return next;
    });
  }

  function handleOptionsChange(key, opts) {
    setConditionOptions((prev) => {
      const next = { ...prev, [key]: opts };
      onFieldChange?.('conditionOptions', next);
      return next;
    });
  }

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
      <Conditions
        conditions={conditions}
        logic={logic}
        onConditionChange={handleConditionChange}
        onLogicChange={(val) => { setLogic(val); onFieldChange?.('logic', val); }}
        onAddCondition={handleAddCondition}
        onRemoveCondition={handleRemoveCondition}
        onAdvancedFilters={() => {}}
        conditionOptions={conditionOptions}
        onOptionsChange={handleOptionsChange}
      />
    </div>
  );
}
