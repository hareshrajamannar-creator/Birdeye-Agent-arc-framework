import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import SingleSelect from '@birdeye/elemental/core/atoms/SingleSelect/index.js';
import SystemPromptInput from '../../../Molecules/Inputs/SystemPromptInput/SystemPromptInput';
import UserPromptInput from '../../../Molecules/Inputs/UserPromptInput/UserPromptInput';
import OutputFields from '../../../Molecules/Inputs/OutputFields/OutputFields';
import VariableChip from '../../../Molecules/Inputs/VariableChip/VariableChip';
import styles from './LLMTaskBody.module.css';

const LLM_MODEL_OPTIONS = [
  { value: 'Fast', label: 'Fast' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Advanced', label: 'Advanced' },
];

function ChipContainer({ chips, onChipChange, onChipDelete, addingNew, onStartAdd, onCancelAdd, onCommitAdd }) {
  return (
    <div className={styles.chipContainer}>
      {chips.map((chip, i) => (
        <VariableChip
          key={`${chip}-${i}`}
          value={chip}
          onChange={(v) => onChipChange(i, v)}
          onDelete={() => onChipDelete(i)}
        />
      ))}
      {addingNew && (
        <VariableChip
          value=""
          autoFocus
          onChange={(v) => onCommitAdd(v)}
          onDelete={onCancelAdd}
        />
      )}
      {!addingNew && chips.length === 0 && (
        <button className={styles.addBtn} type="button" onClick={onStartAdd}>
          <span className="material-symbols-outlined">add_circle</span>
          <span className={styles.addBtnLabel}>Add</span>
        </button>
      )}
      {!addingNew && chips.length > 0 && (
        <button className={styles.addSmallBtn} type="button" onClick={onStartAdd}>
          <span className="material-symbols-outlined">add</span>
        </button>
      )}
    </div>
  );
}

export default function LLMTaskBody({ initialValues = {}, onFieldChange }) {
  const [taskName, setTaskName] = useState(initialValues.taskName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [llmModel, setLlmModel] = useState(initialValues.llmModel ?? 'Fast');
  const [systemPrompt, setSystemPrompt] = useState(initialValues.systemPrompt ?? '');
  const [userPrompt, setUserPrompt] = useState(initialValues.userPrompt ?? '');

  const [contextFields, setContextFields] = useState(initialValues.contextFields ?? []);
  const [addingContext, setAddingContext] = useState(false);

  const [inputFields, setInputFields] = useState(initialValues.inputFields ?? []);
  const [addingInput, setAddingInput] = useState(false);

  const [outputFields, setOutputFields] = useState(initialValues.outputFields ?? []);

  const emit = (field, val) => onFieldChange?.(field, val);

  const updateContextFields = (next) => { setContextFields(next); emit('contextFields', next); };
  const updateInputFields = (next) => { setInputFields(next); emit('inputFields', next); };
  const updateOutputFields = (next) => { setOutputFields(next); emit('outputFields', next); };

  return (
    <div className={styles.container}>
      <FormInput
        name="taskName"
        type="text"
        label="Task name"
        placeholder="Enter name"
        value={taskName}
        onChange={(e) => { setTaskName(e.target.value); emit('taskName', e.target.value); }}
        required
      />
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={description}
        onChange={(e) => { setDescription(e.target.value); emit('description', e.target.value); }}
        required
        noFloatingLabel
      />

      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <span className={styles.label}>LLM Model</span>
          <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
        </div>
        <SingleSelect
          name="llmModel"
          selected={llmModel}
          options={LLM_MODEL_OPTIONS}
          onChange={(opt) => { setLlmModel(opt.value); emit('llmModel', opt.value); }}
          placeholder="Select"
        />
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Context</span>
          <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
        </div>
        <ChipContainer
          chips={contextFields}
          onChipChange={(i, v) => updateContextFields(contextFields.map((c, idx) => (idx === i ? v : c)))}
          onChipDelete={(i) => updateContextFields(contextFields.filter((_, idx) => idx !== i))}
          addingNew={addingContext}
          onStartAdd={() => setAddingContext(true)}
          onCancelAdd={() => setAddingContext(false)}
          onCommitAdd={(v) => { updateContextFields([...contextFields, v]); setAddingContext(false); }}
        />
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Input fields</span>
          <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
        </div>
        <ChipContainer
          chips={inputFields}
          onChipChange={(i, v) => updateInputFields(inputFields.map((c, idx) => (idx === i ? v : c)))}
          onChipDelete={(i) => updateInputFields(inputFields.filter((_, idx) => idx !== i))}
          addingNew={addingInput}
          onStartAdd={() => setAddingInput(true)}
          onCancelAdd={() => setAddingInput(false)}
          onCommitAdd={(v) => { updateInputFields([...inputFields, v]); setAddingInput(false); }}
        />
      </div>

      <SystemPromptInput
        value={systemPrompt}
        onChange={(val) => { setSystemPrompt(val); emit('systemPrompt', val); }}
        required
      />

      <UserPromptInput
        value={userPrompt}
        onChange={(val) => { setUserPrompt(val); emit('userPrompt', val); }}
        required
      />

      <OutputFields
        fields={outputFields}
        onFieldsChange={updateOutputFields}
        showInfo
      />
    </div>
  );
}
