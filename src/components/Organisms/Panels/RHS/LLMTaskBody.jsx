import React, { useState } from 'react';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import SingleSelect from '@birdeye/elemental/core/atoms/SingleSelect/index.js';
import SystemPromptInput from '../../../Molecules/Inputs/SystemPromptInput/SystemPromptInput';
import UserPromptInput from '../../../Molecules/Inputs/UserPromptInput/UserPromptInput';
import OutputFields from '../../../Molecules/Inputs/OutputFields/OutputFields';
import AddOutputFieldModal from '../../Modals/AddOutputFieldModal/AddOutputFieldModal';
import FieldPickerModal from '../../Modals/FieldPickerModal/FieldPickerModal';
import ContextFieldModal from '../../Modals/ContextFieldModal/ContextFieldModal';
import AddInputFieldModal from '../../Modals/AddInputFieldModal/AddInputFieldModal';

const font = '"Roboto", arial, sans-serif';

function FieldLabel({ label, required, showInfo }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 18 }}>
      <span style={{ fontSize: 12, fontWeight: 400, lineHeight: '18px', letterSpacing: '-0.24px', color: '#212121', fontFamily: font, whiteSpace: 'nowrap' }}>
        {label}
      </span>
      {required && <span style={{ fontSize: 12, lineHeight: '18px', color: '#de1b0c', fontFamily: font }}>*</span>}
      {showInfo && <i className="icon_phoenix-info" style={{ fontSize: 16, color: '#8f8f8f', cursor: 'pointer' }} />}
    </div>
  );
}

function AddBox({ onAdd, children }) {
  return (
    <div style={{ border: '1px solid #e5e9f0', borderRadius: 4, padding: '16px 10px', width: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
        <i className="icon_phoenix-add_circle" style={{ fontSize: 20, color: '#1976d2' }} />
        <span style={{ fontSize: 12, lineHeight: '18px', letterSpacing: '-0.24px', color: '#1976d2', fontFamily: font }}>Add</span>
      </button>
      {children}
    </div>
  );
}

const LLM_MODEL_OPTIONS = [
  { value: 'Fast', label: 'Fast' },
  { value: 'Standard', label: 'Standard' },
  { value: 'Advanced', label: 'Advanced' },
];

export default function LLMTaskBody({ initialValues = {}, onFieldChange }) {
  const [values, setValues] = useState({
    taskName: initialValues.taskName ?? '',
    description: initialValues.description ?? '',
    llmModel: initialValues.llmModel ?? 'Fast',
    systemPrompt: initialValues.systemPrompt ?? '',
    userPrompt: initialValues.userPrompt ?? '',
  });
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [showContextModal, setShowContextModal] = useState(false);
  const [showInputFieldModal, setShowInputFieldModal] = useState(false);
  const [outputFields, setOutputFields] = useState(initialValues.outputFields ?? []);
  const [inputFields, setInputFields] = useState(initialValues.inputFields ?? []);
  const [fieldPickerPrompt, setFieldPickerPrompt] = useState(null); // 'system' | 'user' | null

  const set = (field) => (val) => {
    setValues((v) => ({ ...v, [field]: val }));
    onFieldChange?.(field, val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FormInput
        name="taskName"
        type="text"
        label="Task name"
        placeholder="Enter name"
        value={values.taskName}
        onChange={(e) => set('taskName')(e.target.value)}
        required
      />
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={values.description}
        onChange={(e) => set('description')(e.target.value)}
        required
        noFloatingLabel
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FieldLabel label="LLM Model" showInfo />
        <SingleSelect
          name="llmModel"
          selected={values.llmModel}
          options={LLM_MODEL_OPTIONS}
          onChange={(opt) => set('llmModel')(opt.value)}
          placeholder="Select"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FieldLabel label="Context" showInfo />
        <AddBox onAdd={() => setShowContextModal(true)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <FieldLabel label="Input fields" showInfo />
        <AddBox onAdd={() => setShowInputFieldModal(true)} />
      </div>

      <SystemPromptInput
        value={values.systemPrompt}
        onChange={(e) => set('systemPrompt')(e.target.value)}
        required
        onFieldIconClick={() => setFieldPickerPrompt('system')}
      />

      <UserPromptInput
        value={values.userPrompt}
        onChange={(e) => set('userPrompt')(e.target.value)}
        required
        onFieldIconClick={() => setFieldPickerPrompt('user')}
      />

      <OutputFields
        fields={outputFields}
        onAddClick={() => setShowOutputModal(true)}
        showInfo
      />

      {showOutputModal && (
        <AddOutputFieldModal
          onClose={() => setShowOutputModal(false)}
          onAdd={(field) => setOutputFields((prev) => [...prev, field])}
        />
      )}

      {showContextModal && (
        <ContextFieldModal
          isOpen={showContextModal}
          onClose={() => setShowContextModal(false)}
        />
      )}

      {showInputFieldModal && (
        <AddInputFieldModal
          onClose={() => setShowInputFieldModal(false)}
          onAdd={(field) => setInputFields((prev) => [...prev, field])}
        />
      )}

      {fieldPickerPrompt && (
        <FieldPickerModal
          onClose={() => setFieldPickerPrompt(null)}
          onSelectField={(field) => {
            const key = fieldPickerPrompt === 'system' ? 'systemPrompt' : 'userPrompt';
            set(key)(values[key] + `{{${field}}}`);
            setFieldPickerPrompt(null);
          }}
        />
      )}
    </div>
  );
}
