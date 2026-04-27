import React, { useState } from 'react';
import Conditions from './Conditions';

export default {
  title: 'Agent Builder/Molecules/Conditions',
  component: Conditions,
  parameters: { layout: 'padded' },
};

const wrap = (Story) => (
  <div style={{ width: 328, padding: 16 }}>
    <Story />
  </div>
);

const fieldOptions = [
  { value: 'review_rating', label: 'Review rating' },
  { value: 'review_source', label: 'Review source' },
  { value: 'contact_tag', label: 'Contact tag' },
];

const operatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater than' },
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

// Default: one empty condition
export const Default = {
  render: () => {
    const [conditions, setConditions] = useState([makeCondition(1)]);
    const handleChange = (id, field, value) =>
      setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, [`${field}Value`]: value } : c)));
    return (
      <Conditions
        conditions={conditions}
        onConditionChange={handleChange}
        onAddCondition={() => setConditions((prev) => [...prev, makeCondition(prev.length + 1)])}
        onAdvancedFilters={() => {}}
      />
    );
  },
  decorators: [wrap],
};

// After clicking Add condition: two conditions with AND/OR connector
export const MultipleConditions = {
  render: () => {
    const [conditions, setConditions] = useState([makeCondition(1), makeCondition(2)]);
    const [logic, setLogic] = useState('OR');
    const handleChange = (id, field, value) =>
      setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, [`${field}Value`]: value } : c)));
    return (
      <Conditions
        conditions={conditions}
        logic={logic}
        onConditionChange={handleChange}
        onLogicChange={setLogic}
        onAddCondition={() => setConditions((prev) => [...prev, makeCondition(prev.length + 1)])}
        onEditLogic={() => {}}
        onAdvancedFilters={() => {}}
      />
    );
  },
  decorators: [wrap],
};

// Logic connector open: click OR/AND button to see the menu
export const AndOrSelector = {
  render: () => {
    const [conditions, setConditions] = useState([makeCondition(1), makeCondition(2)]);
    const [logic, setLogic] = useState('AND');
    const handleChange = (id, field, value) =>
      setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, [`${field}Value`]: value } : c)));
    return (
      <Conditions
        conditions={conditions}
        logic={logic}
        onConditionChange={handleChange}
        onLogicChange={setLogic}
        onAddCondition={() => setConditions((prev) => [...prev, makeCondition(prev.length + 1)])}
        onEditLogic={() => {}}
        onAdvancedFilters={() => {}}
      />
    );
  },
  decorators: [wrap],
};
