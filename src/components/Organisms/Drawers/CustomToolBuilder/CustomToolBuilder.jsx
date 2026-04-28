import React, { useState } from 'react';
import CommonSideDrawer from '@birdeye/elemental/core/atoms/CommonSideDrawer/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import './CustomToolBuilder.css';

// ─── Field type definitions ────────────────────────────────────────────────────

const FIELD_TYPES = [
  { value: 'text',     label: 'Text',     icon: 'text_fields' },
  { value: 'textarea', label: 'Long text', icon: 'notes' },
  { value: 'number',   label: 'Number',   icon: 'pin' },
  { value: 'dropdown', label: 'Dropdown', icon: 'arrow_drop_down_circle' },
  { value: 'radio',    label: 'Radio',    icon: 'radio_button_checked' },
  { value: 'checkbox', label: 'Checkbox', icon: 'check_box' },
  { value: 'toggle',   label: 'Toggle',   icon: 'toggle_on' },
  { value: 'date',     label: 'Date',     icon: 'calendar_today' },
];

const OPTION_FIELD_TYPES = new Set(['dropdown', 'radio', 'checkbox']);

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyField(type = 'text') {
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

function FieldTypePicker({ value, onChange }) {
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

function OptionsEditor({ options, onChange }) {
  const updateOption = (i, val) => {
    const next = [...options];
    next[i] = val;
    onChange(next);
  };

  const addOption = () => onChange([...options, `Option ${options.length + 1}`]);

  const removeOption = (i) => {
    const next = options.filter((_, idx) => idx !== i);
    onChange(next);
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
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
        Add option
      </button>
    </div>
  );
}

// ─── Single field editor card ─────────────────────────────────────────────────

function FieldCard({ field, index, total, onChange, onDelete, onMoveUp, onMoveDown }) {
  const typeMeta = FIELD_TYPES.find((t) => t.value === field.type);

  return (
    <div className="ctb__field-card">
      {/* Header row */}
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
            style={{ opacity: index === 0 ? 0.3 : 1 }}
            onClick={onMoveUp}
          >
            <span className="material-symbols-outlined">arrow_upward</span>
          </button>
          <button
            className="ctb__icon-btn"
            type="button"
            title="Move down"
            disabled={index === total - 1}
            style={{ opacity: index === total - 1 ? 0.3 : 1 }}
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

      {/* Label input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="ctb__label ctb__label--required">Field label</span>
        <input
          className="ctb__input"
          placeholder="e.g. Customer name"
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
        />
      </div>

      {/* Placeholder (text / textarea / number / date) */}
      {!OPTION_FIELD_TYPES.has(field.type) && field.type !== 'toggle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="ctb__label">Placeholder / helper text</span>
          <input
            className="ctb__input"
            placeholder="e.g. Enter a value…"
            value={field.placeholder}
            onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
          />
        </div>
      )}

      {/* Options (dropdown / radio / checkbox) */}
      {OPTION_FIELD_TYPES.has(field.type) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="ctb__label">Options</span>
          <OptionsEditor
            options={field.options}
            onChange={(opts) => onChange({ ...field, options: opts })}
          />
        </div>
      )}

      {/* Required toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ ...field, required: e.target.checked })}
          style={{ accentColor: '#1976d2', width: 14, height: 14 }}
        />
        <span className="ctb__label">Required field</span>
      </label>
    </div>
  );
}

// ─── Live preview ──────────────────────────────────────────────────────────────

function PreviewField({ field }) {
  const label = field.label || <em style={{ color: '#bbb' }}>Untitled field</em>;

  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span style={{ color: '#de1b0c' }}> *</span>}</span>
          <div className="ctb__prev-input">{field.placeholder || ''}</div>
        </div>
      );
    case 'textarea':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span style={{ color: '#de1b0c' }}> *</span>}</span>
          <div className="ctb__prev-textarea">{field.placeholder || ''}</div>
        </div>
      );
    case 'dropdown':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span style={{ color: '#de1b0c' }}> *</span>}</span>
          <div className="ctb__prev-select">
            <span>{field.options[0] || 'Select…'}</span>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#888' }}>expand_more</span>
          </div>
        </div>
      );
    case 'radio':
      return (
        <div className="ctb__prev-field">
          <span className="ctb__prev-label">{label}{field.required && <span style={{ color: '#de1b0c' }}> *</span>}</span>
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
          <span className="ctb__prev-label">{label}{field.required && <span style={{ color: '#de1b0c' }}> *</span>}</span>
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
    default:
      return null;
  }
}

function LivePreview({ toolName, toolDescription, fields }) {
  return (
    <div className="ctb__preview-card">
      {toolName || toolDescription ? (
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

function AddFieldPanel({ onAdd, onCancel }) {
  const [selectedType, setSelectedType] = useState('text');

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e5e9f0',
        borderRadius: 6,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <span className="ctb__label" style={{ fontWeight: 500 }}>Choose field type</span>
      <FieldTypePicker value={selectedType} onChange={setSelectedType} />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button theme="primary" label="Add field" onClick={() => onAdd(selectedType)} />
        <Button theme="secondary" label="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function CustomToolBuilder({ isOpen = false, onClose, onSave }) {
  const [toolName, setToolName] = useState('');
  const [toolDescription, setToolDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [showAddPanel, setShowAddPanel] = useState(false);

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
    onSave?.({
      id: makeId(),
      name: toolName.trim(),
      description: toolDescription.trim(),
      fields,
      createdAt: new Date().toISOString(),
    });
    // Reset
    setToolName('');
    setToolDescription('');
    setFields([]);
    setShowAddPanel(false);
    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  const canSave = toolName.trim().length > 0;

  return (
    <CommonSideDrawer
      isOpen={isOpen}
      title="Build custom tool"
      onClose={handleClose}
      width="820px"
      shouldScroll={false}
      buttonPosition="left"
    >
      <div className="ctb">
        {/* ─── Left: builder ─── */}
        <div className="ctb__left">
          <div className="ctb__left-scroll">

            {/* Tool name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="ctb__label ctb__label--required">Tool name</span>
              <input
                className="ctb__input"
                placeholder="e.g. Create support ticket"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
              />
            </div>

            {/* Tool description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="ctb__label">Description</span>
              <textarea
                className="ctb__textarea"
                placeholder="Describe what this tool does and when to use it…"
                value={toolDescription}
                onChange={(e) => setToolDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#e5e9f0', margin: '0 -16px' }} />

            {/* Fields section label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#212121' }}>
                Form fields
              </span>
              <span style={{ fontSize: 12, color: '#888' }}>
                {fields.length} field{fields.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Existing fields */}
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

            {/* Add field panel or button */}
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

          {/* Footer */}
          <div className="ctb__footer">
            <Button theme="secondary" label="Cancel" onClick={handleClose} />
            <Button
              theme="primary"
              label="Save tool"
              disabled={!canSave}
              onClick={handleSave}
            />
          </div>
        </div>

        {/* ─── Right: live preview ─── */}
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
    </CommonSideDrawer>
  );
}
