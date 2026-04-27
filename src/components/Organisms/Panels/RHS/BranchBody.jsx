import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import Conditions from '../../../Molecules/Conditions/Conditions';

const fieldOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'sentiment', label: 'Sentiment' },
  { value: 'source', label: 'Source' },
  { value: 'location', label: 'Location' },
  { value: 'keyword', label: 'Keyword' },
];

const operatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
];

const valueOptions = [
  { value: '1', label: '1 star' },
  { value: '2', label: '2 stars' },
  { value: '3', label: '3 stars' },
  { value: '4', label: '4 stars' },
  { value: '5', label: '5 stars' },
];

const makeCondition = (id) => ({
  id,
  fieldOptions,
  operatorOptions,
  valueOptions,
  fieldValue: '',
  operatorValue: '',
  valueValue: '',
});

const font = '"Roboto", arial, sans-serif';
const helpTextStyle = { fontSize: 11, lineHeight: '16px', color: '#8f8f8f', fontFamily: font };

export default function BranchBody({ initialValues = {} }) {
  const [branchName, setBranchName] = useState(initialValues.branchName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [conditions, setConditions] = useState(initialValues.conditions ?? [makeCondition(1)]);
  const [logic, setLogic] = useState(initialValues.logic ?? 'OR');

  function handleConditionChange(id, field, value) {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [`${field}Value`]: value } : c))
    );
  }

  function handleAddCondition() {
    setConditions((prev) => [...prev, makeCondition(prev.length + 1)]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <FormInput
        name="branchName"
        type="text"
        label="Branch name"
        placeholder="Enter name"
        value={branchName}
        onChange={(e) => setBranchName(e.target.value)}
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
      <Conditions
        conditions={conditions}
        logic={logic}
        onConditionChange={handleConditionChange}
        onLogicChange={setLogic}
        onAddCondition={handleAddCondition}
        onAdvancedFilters={() => {}}
      />
    </div>
  );
}
