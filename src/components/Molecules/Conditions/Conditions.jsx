import React, { useState, useRef, useEffect } from 'react';
import './Conditions.css';

function Dropdown({ name, selected, options, onChange, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const selectedLabel = options.find((o) => o.value === selected)?.label;

  return (
    <div className="tc-dropdown" ref={ref}>
      <button
        type="button"
        className={`tc-dropdown__trigger${open ? ' tc-dropdown__trigger--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
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
  onAdvancedFilters,
}) {
  return (
    <div className="trigger-conditions">
      <div className="trigger-conditions__section">
        <span className="trigger-conditions__label">Conditions</span>
        <div className="trigger-conditions__card">
          <div className="trigger-conditions__conditions">
            {conditions.map((condition, index) => (
              <React.Fragment key={condition.id}>
                {index > 0 && (
                  <LogicConnector value={logic} onChange={onLogicChange ?? (() => {})} />
                )}
                <div className="trigger-conditions__condition">
                  <Dropdown
                    name={`field-${condition.id}`}
                    selected={condition.fieldValue}
                    options={condition.fieldOptions ?? []}
                    onChange={(opt) => onConditionChange?.(condition.id, 'field', opt.value)}
                  />
                  <Dropdown
                    name={`operator-${condition.id}`}
                    selected={condition.operatorValue}
                    options={condition.operatorOptions ?? []}
                    onChange={(opt) => onConditionChange?.(condition.id, 'operator', opt.value)}
                  />
                  <Dropdown
                    name={`value-${condition.id}`}
                    selected={condition.valueValue}
                    options={condition.valueOptions ?? []}
                    onChange={(opt) => onConditionChange?.(condition.id, 'value', opt.value)}
                  />
                </div>
              </React.Fragment>
            ))}
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
