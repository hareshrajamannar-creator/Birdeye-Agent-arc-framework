import React, { useState, useRef, useEffect } from 'react';
import CommonSideDrawer from '@birdeye/elemental/core/atoms/CommonSideDrawer/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import VariableChip from '../../../Molecules/Inputs/VariableChip/VariableChip';
import { saveCustomTool } from '../../../../services/agentService';
import './CustomToolBuilder.css';

// ─── Field type definitions ────────────────────────────────────────────────────

export const FIELD_TYPES = [
  { value: 'text',     label: 'Text',     icon: 'text_fields' },
  { value: 'textarea', label: 'Long text', icon: 'notes' },
  { value: 'number',   label: 'Number',   icon: 'pin' },
  { value: 'dropdown', label: 'Dropdown', icon: 'arrow_drop_down_circle' },
  { value: 'radio',    label: 'Radio',    icon: 'radio_button_checked' },
  { value: 'checkbox', label: 'Checkbox', icon: 'check_box' },
  { value: 'toggle',   label: 'Toggle',   icon: 'toggle_on' },
  { value: 'date',     label: 'Date',     icon: 'calendar_today' },
  { value: 'variable', label: 'Variable', icon: 'data_object' },
  { value: 'tags',     label: 'Tags',     icon: 'local_offer' },
];

export const OPTION_FIELD_TYPES = new Set(['dropdown', 'radio', 'checkbox']);

export function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export function emptyField(type = 'text') {
  return {
    id: makeId(),
    type,
    label: '',
    placeholder: '',
    required: false,
    options: OPTION_FIELD_TYPES.has(type) ? ['Option 1', 'Option 2'] : [],
  };
}

// ─── Field type picker ─────────────────────────────────────────────────────────

export function FieldTypePicker({ value, onChange }) {
  return (
    <div className="ctb__type-grid">
      {FIELD_TYPES.map((ft) => (
        <button
          key={ft.value}
          className={`ctb__type-btn${value === ft.value ? ' ctb__type-btn--active' : ''}`}
          onClick={() => onChange(ft.value)}
          type="button"
          title={ft.label}
        >
          <span className="material-symbols-outlined">{ft.icon}</span>
          <span className="ctb__type-btn__label">{ft.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Options editor (for dropdown / radio / checkbox) ─────────────────────────

export function OptionsEditor({ options, onChange }) {
  const updateOption = (i, val) => {
    const next = [...options];
    next[i] = val;
    onChange(next);
  };

  const addOption = () => onChange([...options, `Option ${options.length + 1}`]);

  const removeOption = (i) => {
    onChange(options.filter((_, idx) => idx !== i));
  };

  return (
    <div className="ctb__options">
      {options.map((opt, i) => (
        <div key={i} className="ctb__option-row">
          <input
            className="ctb__option-input"
            value={opt}
            placeholder={`Option ${i + 1}`}
            onChange={(e) => updateOption(i, e.target.value)}
          />
          <button
            className="ctb__icon-btn ctb__icon-btn--danger"
            type="button"
            onClick={() => removeOption(i)}
            title="Remove option"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      ))}
      <button className="ctb__add-option-btn" type="button" onClick={addOption}>
        <span className="material-symbols-outlined ctb__add-option-icon">add</span>
        Add option
      </button>
    </div>
  );
}

// ─── Single field editor card ─────────────────────────────────────────────────

export function FieldCard({ field, index, total, onChange, onDelete, onMoveUp, onMoveDown }) {
  const typeMeta = FIELD_TYPES.find((t) => t.value === field.type);

  return (
    <div className="ctb__field-card">
      <div className="ctb__field-card__header">
        <div className="ctb__field-card__type-badge">
          <span className="material-symbols-outlined">{typeMeta?.icon}</span>
          {typeMeta?.label}
        </div>
        <div className="ctb__field-card__actions">
          <button
            className="ctb__icon-btn"
            type="button"
            title="Move up"
            disabled={index === 0}
            onClick={onMoveUp}
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </button>
          <button
            className="ctb__icon-btn"
            type="button"
            title="Move down"
            disabled={index === total - 1}
            onClick={onMoveDown}
          >
            <span className="material-symbols-outlined">arrow_downward</span>
          </button>
          <button
            className="ctb__icon-btn ctb__icon-btn--danger"
            type="button"
            title="Delete field"
            onClick={onDelete}
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      <div className="ctb__field-group">
        <FormInput
          name={`fieldLabel_${field.id}`}
          type="text"
          label="Field label"
          placeholder="e.g. Customer name"
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
          required
        />
      </div>

      {!OPTION_FIELD_TYPES.has(field.type) && field.type !== 'toggle' && (
        <div className="ctb__field-group">
          <FormInput
            name={`fieldPlaceholder_${field.id}`}
            type="text"
            label="Placeholder / helper text"
            placeholder="e.g. Enter a value…"
            value={field.placeholder}
            onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
          />
        </div>
      )}

      {OPTION_FIELD_TYPES.has(field.type) && (
        <div className="ctb__field-group">
          <span className="ctb__label">Options</span>
          <OptionsEditor
            options={field.options}
            onChange={(opts) => onChange({ ...field, options: opts })}
          />
        </div>
      )}

      <div className="ctb__required-row">
        <label className="ctb__required-label">
          <input
            type="checkbox"
            className="ctb__checkbox"
            checked={field.required}
            onChange={(e) => onChange({ ...field, required: e.target.checked })}
          />
          Required field
        </label>
      </div>

      {field.type === 'checkbox' && (
        <div className="ctb__required-row">
          <label className="ctb__required-label">
            <input
              type="checkbox"
              className="ctb__checkbox"
              checked={field.hideLabel ?? false}
              onChange={(e) => onChange({ ...field, hideLabel: e.target.checked })}
            />
            Hide label
          </label>
        </div>
      )}
    </div>
  );
}

// ─── Variable field preview (stateful so the chip can be edited) ──────────────

function VariableFieldPreview({ field }) {
  const [varName, setVarName] = useState(field.placeholder || 'variable_name');
  const label = field.label || <em className="ctb__prev-untitled">Untitled field</em>;
  return (
    <div className="ctb__prev-field">
      <span className="ctb__prev-label">
        {label}{field.required && <span className="ctb__prev-required"> *</span>}
      </span>
      <VariableChip
        value={varName || 'variable_name'}
        type="variable"
        onChange={setVarName}
        onDelete={() => setVarName('')}
      />
    </div>
  );
}

// ─── Live preview ──────────────────────────────────────────────────────────────

export function PreviewField({ field }) {
  const label = field.label || <em className="ctb__prev-untitled">Untitled field</em>;

  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span className="ctb__prev-required"> *</span>}</span>
          <div className="ctb__prev-input ctb__prev-input--placeholder">{field.placeholder || 'Enter a value...'}</div>
        </div>
      );
    case 'textarea':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span className="ctb__prev-required"> *</span>}</span>
          <div className="ctb__prev-textarea">{field.placeholder || ''}</div>
        </div>
      );
    case 'dropdown':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span className="ctb__prev-required"> *</span>}</span>
          <div className="ctb__prev-select">
            <span>{field.options[0] || 'Select…'}</span>
            <span className="material-symbols-outlined ctb__prev-chevron">expand_more</span>
          </div>
        </div>
      );
    case 'radio':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span className="ctb__prev-required"> *</span>}</span>
          <div className="ctb__prev-options">
            {(field.options.length ? field.options : ['Option 1', 'Option 2']).map((opt, i) => (
              <div key={i} className="ctb__prev-option">
                <div className="ctb__prev-option-dot" />
                {opt}
              </div>
            ))}
          </div>
        </div>
      );
    case 'checkbox':
      return (
        <div className="ctb__prev-field">
          {!field.hideLabel && (
            <span className="ctb__prev-label">{label}{field.required && <span className="ctb__prev-required"> *</span>}</span>
          )}
          <div className="ctb__prev-options">
            {(field.options.length ? field.options : ['Option 1', 'Option 2']).map((opt, i) => (
              <div key={i} className="ctb__prev-option">
                <div className="ctb__prev-option-square" />
                {opt}
              </div>
            ))}
          </div>
        </div>
      );
    case 'toggle':
      return (
        <div className="ctb__prev-field">
          <div className="ctb__prev-toggle">
            <div className="ctb__prev-toggle-track" />
            <span className="ctb__prev-label">{label}</span>
          </div>
        </div>
      );
    case 'variable':
      return <VariableFieldPreview field={field} />;
    case 'tags':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span className="ctb__prev-required"> *</span>}</span>
          <div className="ctb__prev-tags">
            <span className="ctb__prev-tag">keyword <span className="ctb__prev-tag-x">×</span></span>
            <span className="ctb__prev-tags-placeholder">{field.placeholder || 'Add a tag...'}</span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function LivePreview({ toolName, toolDescription, fields }) {
  return (
    <div className="ctb__preview-card">
      {(toolName || toolDescription) ? (
        <>
          {toolName && <div className="ctb__preview-title">{toolName}</div>}
          {toolDescription && <div className="ctb__preview-desc">{toolDescription}</div>}
          {fields.length > 0 && <div className="ctb__preview-divider" />}
        </>
      ) : null}

      {fields.length === 0 ? (
        <div className="ctb__preview-empty">
          <span className="material-symbols-outlined ctb__preview-empty-icon">widgets</span>
          Add fields on the left to see a preview here
        </div>
      ) : (
        fields.map((f) => <PreviewField key={f.id} field={f} />)
      )}
    </div>
  );
}

// ─── Add field panel ────────────────────────────────────────────────────────────

export function AddFieldPanel({ onAdd, onCancel }) {
  const [selectedType, setSelectedType] = useState('text');

  return (
    <div className="ctb__add-panel">
      <span className="ctb__label ctb__label--medium">Choose field type</span>
      <FieldTypePicker value={selectedType} onChange={setSelectedType} />
      <div className="ctb__add-panel-actions">
        <Button theme="primary" label="Add field" onClick={() => onAdd(selectedType)} />
        <Button theme="secondary" label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function CustomToolBuilder({ isOpen = false, onClose, onSave, initialTool = null }) {
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [iconDataUrl, setIconDataUrl] = useState(null);
  const [fields, setFields] = useState([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const iconInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setToolName(initialTool?.name ?? '');
    setToolDescription(initialTool?.description ?? '');
    setIconDataUrl(initialTool?.iconDataUrl ?? null);
    setFields(initialTool?.fields ?? []);
    setShowAddPanel(false);
  }, [isOpen, initialTool]);

  const handleIconChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => setIconDataUrl(evt.target.result);
    reader.readAsDataURL(file);
  };

  const handleAddField = (type) => {
    setFields((prev) => [...prev, emptyField(type)]);
    setShowAddPanel(false);
  };

  const handleUpdateField = (id, updated) => {
    setFields((prev) => prev.map((f) => (f.id === id ? updated : f)));
  };

  const handleDeleteField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setFields((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const handleMoveDown = (index) => {
    setFields((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSave = () => {
    if (!toolName.trim()) return;
    const tool = {
      id: initialTool?.id ?? makeId(),
      name: toolName.trim(),
      description: toolDescription.trim(),
      fields,
      iconDataUrl,
      createdAt: initialTool?.createdAt ?? new Date().toISOString(),
    };
    saveCustomTool(tool);
    onSave?.(tool);
  };

  const handleClose = () => {
    onClose?.();
  };

  const canSave = toolName.trim().length > 0;

  return (
    <CommonSideDrawer
      isOpen={isOpen}
      title=""
      onClose={handleClose}
      width="960px"
      shouldScroll={false}
      buttonPosition="right"
      headerRightContent={<span className="ctb__drawer-suppress" />}
    >
      <div className="ctb-outer">
        {/* ─── Custom header with back arrow ─── */}
        <div className="ctb__header">
          <div className="ctb__header-left">
            <button className="ctb__back-btn" type="button" onClick={handleClose}>
              <span className="material-symbols-outlined">arrow_left_alt</span>
            </button>
            <span className="ctb__header-title">
              {initialTool ? 'Edit custom tool' : 'Build custom tool'}
            </span>
          </div>
          <div className="ctb__header-actions">
            <Button theme="primary" label="Save tool" disabled={!canSave} onClick={handleSave} />
          </div>
        </div>

        {/* ─── Two-panel body ─── */}
        <div className="ctb">
          {/* Left: builder form */}
          <div className="ctb__left">
            <div className="ctb__left-scroll">

              {/* Tool name */}
              <div className="ctb__field-group">
                <FormInput
                  name="toolName"
                  type="text"
                  label="Tool name"
                  placeholder="e.g. Create support ticket"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  required
                />
              </div>

              {/* Icon upload */}
              <div className="ctb__field-group">
                <span className="ctb__label">Tool icon</span>
                <span className="ctb__sublabel">Upload SVG or PNG (optional)</span>
                <button
                  className="ctb__icon-upload"
                  type="button"
                  onClick={() => iconInputRef.current?.click()}
                >
                  {iconDataUrl ? (
                    <img src={iconDataUrl} alt="Tool icon" className="ctb__icon-preview" />
                  ) : (
                    <span className="material-symbols-outlined ctb__icon-upload-sym">upload</span>
                  )}
                </button>
                <input
                  ref={iconInputRef}
                  type="file"
                  accept=".svg,.png"
                  className="ctb__icon-input"
                  onChange={handleIconChange}
                />
              </div>

              {/* Tool description */}
              <div className="ctb__field-group">
                <TextArea
                  name="toolDescription"
                  label="Description"
                  placeholder="Describe what this tool does and when to use it…"
                  value={toolDescription}
                  onChange={(e) => setToolDescription(e.target.value)}
                  noFloatingLabel
                />
              </div>

              {/* Divider */}
              <div className="ctb__divider" />

              {/* Fields section */}
              <div className="ctb__fields-section">
                <div className="ctb__fields-header">
                  <span className="ctb__fields-title">Form fields</span>
                  <span className="ctb__fields-count">{fields.length} field{fields.length !== 1 ? 's' : ''}</span>
                </div>

                {fields.length > 0 && (
                  <div className="ctb__fields">
                    {fields.map((field, i) => (
                      <FieldCard
                        key={field.id}
                        field={field}
                        index={i}
                        total={fields.length}
                        onChange={(updated) => handleUpdateField(field.id, updated)}
                        onDelete={() => handleDeleteField(field.id)}
                        onMoveUp={() => handleMoveUp(i)}
                        onMoveDown={() => handleMoveDown(i)}
                      />
                    ))}
                  </div>
                )}

                {showAddPanel ? (
                  <AddFieldPanel
                    onAdd={handleAddField}
                    onCancel={() => setShowAddPanel(false)}
                  />
                ) : (
                  <button
                    className="ctb__add-field-btn"
                    type="button"
                    onClick={() => setShowAddPanel(true)}
                  >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add a field
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right: live preview */}
          <div className="ctb__right">
            <div className="ctb__preview-header">Live preview</div>
            <div className="ctb__preview-scroll">
              <LivePreview
                toolName={toolName}
                toolDescription={toolDescription}
                fields={fields}
              />
            </div>
          </div>
        </div>
      </div>
    </CommonSideDrawer>
  );
}
