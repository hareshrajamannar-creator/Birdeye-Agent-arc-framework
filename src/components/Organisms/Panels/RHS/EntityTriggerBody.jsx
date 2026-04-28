import React, { useState, useRef, useEffect } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import styles from './EntityTriggerBody.module.css';

const DEFAULT_CONDITIONS = [
  { field: 'Event', operator: 'is', value: 'Review received' },
  { field: 'Message type', operator: 'is', value: 'Google' },
  { field: 'Message age', operator: 'is less than', value: '48 hours' },
];

/* ─── InlineEditable ─── */
function InlineEditable({ value, onChange, className }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    if (draft !== value) onChange(draft);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { setDraft(value); setIsEditing(false); }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        className={`${styles.editingInput} ${className || ''}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <span
      className={`${styles.chipText} ${className || ''}`}
      onDoubleClick={() => { setDraft(value); setIsEditing(true); }}
    >
      {value}
    </span>
  );
}

/* ─── ConditionChip ─── */
function ConditionChip({ value, onChange }) {
  return (
    <div className={styles.chip}>
      <InlineEditable value={value} onChange={onChange} />
      <span className={`material-symbols-outlined ${styles.chipIcon}`}>expand_more</span>
    </div>
  );
}

/* ─── AndBadge ─── */
function AndBadge({ value, onChange }) {
  return (
    <div className={styles.andBadge}>
      <InlineEditable value={value} onChange={onChange} className={styles.andText} />
      <span className={`material-symbols-outlined ${styles.andIcon}`}>expand_more</span>
    </div>
  );
}

/* ─── Main component ─── */
export default function EntityTriggerBody({ initialValues = {}, onFieldChange }) {
  const [triggerName, setTriggerName] = useState(initialValues.triggerName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [conditions, setConditions] = useState(
    initialValues.conditions ?? DEFAULT_CONDITIONS
  );
  const [connectors, setConnectors] = useState(
    () => Array.from({ length: Math.max(0, (initialValues.conditions ?? DEFAULT_CONDITIONS).length - 1) }, () => 'AND')
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

  const updateField = (index, key, value) => {
    setConditions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const updateConnector = (index, value) => {
    setConnectors((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addCondition = () => {
    setConditions((prev) => [...prev, { field: 'Field', operator: 'is', value: 'Value' }]);
    setConnectors((prev) => [...prev, 'AND']);
  };

  const removeCondition = (index) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
    setConnectors((prev) => {
      const next = [...prev];
      const spliceAt = index < next.length ? index : index - 1;
      if (next.length > 0) next.splice(spliceAt, 1);
      return next;
    });
  };

  return (
    <div className={styles.body}>
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

      {/* ─── Trigger conditions ─── */}
      <div className={styles.conditionsSection}>
        <span className={styles.sectionLabel}>Trigger conditions</span>

        {conditions.map((cond, i) => (
          <React.Fragment key={i}>
            <div className={styles.conditionRow}>
              <ConditionChip value={cond.field} onChange={(v) => updateField(i, 'field', v)} />
              <ConditionChip value={cond.operator} onChange={(v) => updateField(i, 'operator', v)} />
              <ConditionChip value={cond.value} onChange={(v) => updateField(i, 'value', v)} />
              <button
                className={styles.removeBtn}
                onClick={() => removeCondition(i)}
                disabled={conditions.length === 1}
                title="Remove condition"
              >
                <span className={`material-symbols-outlined ${styles.removeBtnIcon}`}>close</span>
              </button>
            </div>

            {i < connectors.length && (
              <div className={styles.andRow}>
                <AndBadge value={connectors[i]} onChange={(v) => updateConnector(i, v)} />
              </div>
            )}
          </React.Fragment>
        ))}

        <button className={styles.addBtn} onClick={addCondition}>
          <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add</span>
          Add condition
        </button>
      </div>
    </div>
  );
}
