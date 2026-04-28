import React, { useState, useRef, useEffect } from 'react';
import './Conditions.css';
import styles from './Conditions.module.css';

function Dropdown({ name, selected, options, onChange, placeholder = 'Select', onOptionsChange }) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draftOptions, setDraftOptions] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setEditMode(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const selectedLabel = options.find((o) => o.value === selected)?.label;

  const handleEditClick = (e) => {
    e.stopPropagation();
    setOpen(false);
    setDraftOptions(options.map((o) => ({ ...o })));
    setEditMode(true);
  };

  const updateDraftLabel = (index, label) => {
    setDraftOptions((prev) => prev.map((o, i) => i === index ? { ...o, label } : o));
  };

  const removeDraftOption = (index) => {
    setDraftOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const addDraftOption = () => {
    setDraftOptions((prev) => [...prev, { value: `opt_${Date.now()}`, label: '' }]);
  };

  const applyOptions = () => {
    const cleaned = draftOptions
      .filter((o) => o.label.trim())
      .map((o) => ({
        value: o.value || o.label.toLowerCase().replace(/\s+/g, '_'),
        label: o.label.trim(),
      }));
    onOptionsChange?.(cleaned);
    setEditMode(false);
  };

  return (
    <div className={styles.dropdownOuter} ref={ref}>
      <div className={styles.dropdownStretch}>
        <div className="tc-dropdown">
          <button
            type="button"
            className={`tc-dropdown__trigger${open ? ' tc-dropdown__trigger--open' : ''}`}
            onClick={() => { if (!editMode) setOpen((v) => !v); }}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            <span className={`tc-dropdown__value${!selectedLabel ? ' tc-dropdown__value--placeholder' : ''}`}>
              {selectedLabel || placeholder}
            </span>
            <span className="material-symbols-outlined tc-dropdown__chevron">expand_more</span>
          </button>

          {open && (
            <ul className="tc-dropdown__menu" role="listbox">
              {options.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === selected}
                  className={`tc-dropdown__option${opt.value === selected ? ' tc-dropdown__option--selected' : ''}`}
                  onClick={() => { onChange(opt); setOpen(false); }}
                >
                  {opt.label}
                  {opt.value === selected && (
                    <span className="material-symbols-outlined tc-dropdown__check">check</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {editMode && (
            <div className={styles.optionsEditor}>
              <div className={styles.optionsEditorList}>
                {draftOptions.map((opt, i) => (
                  <div key={opt.value || i} className={styles.optionRow}>
                    <input
                      className={styles.optionInput}
                      value={opt.label}
                      placeholder="Option label"
                      onChange={(e) => updateDraftLabel(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.optionRemoveBtn}
                      onClick={() => removeDraftOption(i)}
                    >
                      <span className={`material-symbols-outlined ${styles.optionRemoveBtnIcon}`}>close</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.editorFooter}>
                <button type="button" className={styles.addOptionBtn} onClick={addDraftOption}>
                  <span className={`material-symbols-outlined ${styles.addOptionIcon}`}>add</span>
                  Add option
                </button>
                <button type="button" className={styles.applyBtn} onClick={applyOptions}>
                  <span className={`material-symbols-outlined ${styles.applyBtnIcon}`}>check</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {onOptionsChange && (
        <button
          type="button"
          className={styles.editTrigger}
          onClick={handleEditClick}
          title="Edit options"
        >
          <span className={`material-symbols-outlined ${styles.editTriggerIcon}`}>edit</span>
        </button>
      )}
    </div>
  );
}

function LogicConnector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="tc-connector" ref={ref}>
      <button type="button" className="tc-connector__btn" onClick={() => setOpen((v) => !v)}>
        <span>{value}</span>
        <span className="material-symbols-outlined">expand_more</span>
      </button>
      {open && (
        <ul className="tc-connector__menu">
          {['AND', 'OR'].map((opt) => (
            <li
              key={opt}
              className={`tc-connector__option${value === opt ? ' tc-connector__option--selected' : ''}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              <span>{opt}</span>
              {value === opt && <span className="material-symbols-outlined">check</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Conditions({
  conditions = [],
  logic = 'OR',
  onConditionChange,
  onLogicChange,
  onAddCondition,
  onRemoveCondition,
  onAdvancedFilters,
  conditionOptions,
  onOptionsChange,
}) {
  return (
    <div className="trigger-conditions">
      <div className="trigger-conditions__section">
        <span className="trigger-conditions__label">Conditions</span>
        <div className="trigger-conditions__card">
          <div className="trigger-conditions__conditions">
            {conditions.map((condition, index) => {
              const fieldOpts = conditionOptions?.field ?? condition.fieldOptions ?? [];
              const operatorOpts = conditionOptions?.operator ?? condition.operatorOptions ?? [];
              const valueOpts = conditionOptions?.value ?? condition.valueOptions ?? [];

              return (
                <React.Fragment key={condition.id}>
                  {index > 0 && (
                    <div className={styles.connectorRow}>
                      <LogicConnector value={logic} onChange={onLogicChange ?? (() => {})} />
                      {onRemoveCondition && (
                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => onRemoveCondition(condition.id)}
                          title="Remove condition"
                        >
                          <span className={`material-symbols-outlined ${styles.removeBtnIcon}`}>close</span>
                        </button>
                      )}
                    </div>
                  )}
                  <div className="trigger-conditions__condition">
                    <div className={styles.conditionDropdowns}>
                      <Dropdown
                        name={`field-${condition.id}`}
                        selected={condition.fieldValue}
                        options={fieldOpts}
                        onChange={(opt) => onConditionChange?.(condition.id, 'field', opt.value)}
                        onOptionsChange={onOptionsChange ? (opts) => onOptionsChange('field', opts) : undefined}
                      />
                      <Dropdown
                        name={`operator-${condition.id}`}
                        selected={condition.operatorValue}
                        options={operatorOpts}
                        onChange={(opt) => onConditionChange?.(condition.id, 'operator', opt.value)}
                        onOptionsChange={onOptionsChange ? (opts) => onOptionsChange('operator', opts) : undefined}
                      />
                      <Dropdown
                        name={`value-${condition.id}`}
                        selected={condition.valueValue}
                        options={valueOpts}
                        onChange={(opt) => onConditionChange?.(condition.id, 'value', opt.value)}
                        onOptionsChange={onOptionsChange ? (opts) => onOptionsChange('value', opts) : undefined}
                      />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <button type="button" className="trigger-conditions__add-btn" onClick={onAddCondition}>
            <span className="material-symbols-outlined">add_circle</span>
            Add condition
          </button>
        </div>
      </div>
      <button type="button" className="trigger-conditions__advanced-filters" onClick={onAdvancedFilters}>
        Advanced filters
      </button>
    </div>
  );
}
