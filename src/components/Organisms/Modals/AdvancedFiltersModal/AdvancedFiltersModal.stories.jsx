import React, { useState } from 'react';
import AdvancedFiltersModal from './AdvancedFiltersModal';

export default {
  title: 'Agent Builder/Organisms/Modals/AdvancedFiltersModal',
  component: AdvancedFiltersModal,
  parameters: { layout: 'fullscreen' },
};

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

let nextId = 10;
const uid = () => String(++nextId);

const makeCondition = (logic = 'and') => ({
  id: uid(),
  logic,
  fieldOptions,
  operatorOptions,
  valueOptions,
  fieldValue: '',
  operatorValue: '',
  valueValue: '',
});

const makeGroup = (groupLogic = 'or') => ({
  id: uid(),
  groupLogic,
  conditions: [makeCondition()],
});

function ModalDemo({ initialGroups }) {
  const [groups, setGroups] = useState(initialGroups);

  const handleConditionChange = (groupId, condId, field, value) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : {
          ...g,
          conditions: g.conditions.map((c) =>
            c.id !== condId ? c : { ...c, [`${field}Value`]: value }
          ),
        }
      )
    );

  const handleConditionLogicChange = (groupId, condId, value) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : {
          ...g,
          conditions: g.conditions.map((c) =>
            c.id !== condId ? c : { ...c, logic: value }
          ),
        }
      )
    );

  const handleGroupLogicChange = (groupId, value) =>
    setGroups((prev) =>
      prev.map((g) => (g.id !== groupId ? g : { ...g, groupLogic: value }))
    );

  const handleAddCondition = (groupId) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : { ...g, conditions: [...g.conditions, makeCondition()] }
      )
    );

  const handleRemoveCondition = (groupId, condId) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : {
          ...g,
          conditions: g.conditions.filter((c) => c.id !== condId),
        }
      )
    );

  const handleAddGroup = () =>
    setGroups((prev) => [...prev, makeGroup()]);

  const handleRemoveGroup = (groupId) =>
    setGroups((prev) => prev.filter((g) => g.id !== groupId));

  const handleClear = () =>
    setGroups([makeGroup()]);

  return (
    <div style={{ background: '#f0f0f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AdvancedFiltersModal
        isOpen
        onClose={() => {}}
        groups={groups}
        onConditionChange={handleConditionChange}
        onConditionLogicChange={handleConditionLogicChange}
        onGroupLogicChange={handleGroupLogicChange}
        onAddCondition={handleAddCondition}
        onRemoveCondition={handleRemoveCondition}
        onAddGroup={handleAddGroup}
        onRemoveGroup={handleRemoveGroup}
        onClear={handleClear}
        onSave={() => {}}
      />
    </div>
  );
}

export const SingleGroup = {
  render: () => <ModalDemo initialGroups={[makeGroup()]} />,
};

export const MultipleGroups = {
  render: () => <ModalDemo initialGroups={[makeGroup(), makeGroup('or')]} />,
};
