import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import Conditions from '../../../Molecules/Conditions/Conditions';

const DEFAULT_CONDITION_OPTIONS = {
  field: [
    { value: 'rating', label: 'Rating' },
    { value: 'sentiment', label: 'Sentiment' },
    { value: 'source', label: 'Source' },
    { value: 'location', label: 'Location' },
    { value: 'keyword', label: 'Keyword' },
  ],
  operator: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
  ],
  value: [
    { value: '1', label: '1 star' },
    { value: '2', label: '2 stars' },
    { value: '3', label: '3 stars' },
    { value: '4', label: '4 stars' },
    { value: '5', label: '5 stars' },
  ],
};

const makeCondition = (id) => ({ id, fieldValue: '', operatorValue: '', valueValue: '' });

export default function BranchBody({ initialValues = {}, onFieldChange }) {
  const [branchName, setBranchName] = useState(initialValues.branchName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [conditions, setConditions] = useState(
    initialValues.conditions?.length ? initialValues.conditions : [makeCondition(1)]
  );
  const [logic, setLogic] = useState(initialValues.logic ?? 'OR');
  const [conditionOptions, setConditionOptions] = useState(
    initialValues.conditionOptions ?? DEFAULT_CONDITION_OPTIONS
  );

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
      const next = [...prev, makeCondition(prev.length + 1)];
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
        name="branchName"
        type="text"
        label="Branch name"
        placeholder="Enter name"
        value={branchName}
        onChange={(e) => { setBranchName(e.target.value); onFieldChange?.('branchName', e.target.value); }}
        required
      />
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={description}
        onChange={(e) => { setDescription(e.target.value); onFieldChange?.('description', e.target.value); }}
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
