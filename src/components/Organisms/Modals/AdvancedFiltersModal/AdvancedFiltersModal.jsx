import React, { useState, useRef, useEffect } from 'react';
import './AdvancedFiltersModal.css';

function FilterDropdown({ selected, options, onChange, placeholder = 'Select', narrow }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const selectedLabel = options.find((o) => o.value === selected)?.label;

  return (
    <div className={`afm-dropdown${narrow ? ' afm-dropdown--narrow' : ''}`} ref={ref}>
      <button
        type="button"
        className={`afm-dropdown__trigger${open ? ' afm-dropdown__trigger--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`afm-dropdown__value${!selectedLabel ? ' afm-dropdown__value--placeholder' : ''}`}>
          {selectedLabel || placeholder}
        </span>
        <span className="material-symbols-outlined afm-dropdown__chevron">expand_more</span>
      </button>
      {open && (
        <ul className="afm-dropdown__menu">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`afm-dropdown__option${opt.value === selected ? ' afm-dropdown__option--selected' : ''}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              <span>{opt.label}</span>
              {opt.value === selected && <span className="material-symbols-outlined">check</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const LOGIC_OPTIONS = [
  { value: 'and', label: 'and' },
  { value: 'or', label: 'or' },
];

export default function AdvancedFiltersModal({
  isOpen,
  onClose,
  groups = [],
  onConditionChange,
  onAddCondition,
  onRemoveCondition,
  onGroupLogicChange,
  onConditionLogicChange,
  onAddGroup,
  onRemoveGroup,
  onClear,
  onSave,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="afm-overlay" onClick={handleOverlayClick}>
      <div className="afm-dialog" role="dialog" aria-modal="true" aria-label="Advanced filters">
        <div className="afm-body">
          <p className="afm-title">Advanced filters</p>

          <div className="afm-groups">
            {groups.map((group, groupIndex) => (
              <React.Fragment key={group.id}>
                {groupIndex > 0 && (
                  <div className="afm-group-connector">
                    <FilterDropdown
                      narrow
                      selected={group.groupLogic}
                      options={LOGIC_OPTIONS}
                      onChange={(opt) => onGroupLogicChange?.(group.id, opt.value)}
                    />
                  </div>
                )}

                <div className="afm-group">
                  <div className="afm-group__conditions">
                    {group.conditions.map((condition, condIndex) => (
                      <div key={condition.id} className="afm-row">
                        {condIndex === 0 ? (
                          <span className="afm-row__when">When</span>
                        ) : (
                          <FilterDropdown
                            narrow
                            selected={condition.logic}
                            options={LOGIC_OPTIONS}
                            onChange={(opt) => onConditionLogicChange?.(group.id, condition.id, opt.value)}
                          />
                        )}
                        <div className="afm-row__dropdowns">
                          <FilterDropdown
                            selected={condition.fieldValue}
                            options={condition.fieldOptions ?? []}
                            onChange={(opt) => onConditionChange?.(group.id, condition.id, 'field', opt.value)}
                          />
                          <FilterDropdown
                            selected={condition.operatorValue}
                            options={condition.operatorOptions ?? []}
                            onChange={(opt) => onConditionChange?.(group.id, condition.id, 'operator', opt.value)}
                          />
                          <FilterDropdown
                            selected={condition.valueValue}
                            options={condition.valueOptions ?? []}
                            onChange={(opt) => onConditionChange?.(group.id, condition.id, 'value', opt.value)}
                          />
                          <button
                            type="button"
                            className="afm-row__delete"
                            onClick={() => onRemoveCondition?.(group.id, condition.id)}
                            aria-label="Remove condition"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="afm-group__footer">
                    <button type="button" className="afm-add-btn" onClick={() => onAddCondition?.(group.id)}>
                      <span className="material-symbols-outlined">add_circle</span>
                      Add condition
                    </button>
                    {groups.length > 1 && (
                      <button
                        type="button"
                        className="afm-remove-group-btn"
                        onClick={() => onRemoveGroup?.(group.id)}
                        aria-label="Remove group"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <button type="button" className="afm-add-btn" onClick={onAddGroup}>
            <span className="material-symbols-outlined">add_circle</span>
            Add group
          </button>
        </div>

        <div className="afm-footer">
          <button type="button" className="afm-btn afm-btn--tertiary" onClick={onClear}>Clear</button>
          <button type="button" className="afm-btn afm-btn--primary" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
