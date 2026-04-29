import React, { useState, useRef, useEffect, useCallback } from 'react';
import VariableChip, { CHIP_TYPES, DataTypeIcon } from '../../Inputs/VariableChip/VariableChip';
import styles from './ExpandedRHSTestInput.module.css';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ExpandedRHSTestInput({ fields = [], onChange }) {
  const [editingValueIdx, setEditingValueIdx] = useState(null);
  const [valueDraft, setValueDraft] = useState('');
  const [openMenuIdx, setOpenMenuIdx] = useState(null);

  const [addingNew, setAddingNew] = useState(false);
  const [newNameDraft, setNewNameDraft] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFor, setPickerFor] = useState(null);
  const [pendingType, setPendingType] = useState('variable');

  const newNameRef = useRef(null);
  const valueTextareaRef = useRef(null);
  const pickerRef = useRef(null);
  const commitGuardRef = useRef(false);

  useEffect(() => {
    if (addingNew && newNameRef.current) newNameRef.current.focus();
  }, [addingNew]);

  useEffect(() => {
    if (editingValueIdx !== null && valueTextareaRef.current) {
      const el = valueTextareaRef.current;
      el.focus();
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, [editingValueIdx]);

  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const openForAdd = () => { setPickerFor('add'); setPickerOpen(true); };
  const openForChip = (i) => { setPickerFor(i); setPickerOpen(true); };

  const selectType = (type) => {
    setPickerOpen(false);
    if (pickerFor === 'add') {
      setPendingType(type);
      commitGuardRef.current = false;
      setAddingNew(true);
      setNewNameDraft('');
    } else if (typeof pickerFor === 'number') {
      onChange?.(fields.map((f, i) => i === pickerFor ? { ...f, type } : f));
    }
    setPickerFor(null);
  };

  const commitNew = useCallback(() => {
    if (commitGuardRef.current) return;
    commitGuardRef.current = true;
    const name = newNameDraft.trim();
    if (name) onChange?.([...fields, { name, value: '', type: pendingType }]);
    setAddingNew(false);
    setNewNameDraft('');
  }, [newNameDraft, fields, onChange, pendingType]);

  const cancelNew = () => {
    commitGuardRef.current = true;
    setAddingNew(false);
    setNewNameDraft('');
  };

  const startEditValue = useCallback((idx) => {
    setEditingValueIdx(idx);
    setValueDraft(fields[idx]?.value ?? '');
    setOpenMenuIdx(null);
  }, [fields]);

  const commitValue = useCallback((idx) => {
    if (editingValueIdx !== idx) return;
    onChange?.(fields.map((f, i) => i === idx ? { ...f, value: valueDraft } : f));
    setEditingValueIdx(null);
  }, [editingValueIdx, valueDraft, fields, onChange]);

  const handleNameChange = (idx, newName) => onChange?.(fields.map((f, i) => i === idx ? { ...f, name: newName } : f));

  const handleDelete = (idx) => {
    onChange?.(fields.filter((_, i) => i !== idx));
    setOpenMenuIdx(null);
    if (editingValueIdx === idx) setEditingValueIdx(null);
  };

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <div className={styles.headerFieldCell}>
          <span className={styles.headerLabel}>Input fields</span>
          <span className={`material-symbols-outlined ${styles.chevron}`}>expand_more</span>
        </div>
        <div className={styles.headerValueCell}>
          <span className={styles.headerLabel}>Values</span>
        </div>
      </div>

      {fields.map((field, idx) => (
        <div key={idx} className={styles.dataRow}>
          <div className={styles.fieldCell}>
            <VariableChip
              value={field.name}
              type={field.type || 'variable'}
              onChange={(name) => handleNameChange(idx, name)}
              onDelete={() => handleDelete(idx)}
              onSwatchClick={() => openForChip(idx)}
              fullWidth
            />
          </div>
          <div
            className={styles.valueCell}
            onClick={() => editingValueIdx !== idx && startEditValue(idx)}
          >
            {editingValueIdx === idx ? (
              <textarea
                ref={valueTextareaRef}
                className={styles.valueTextarea}
                value={valueDraft}
                placeholder="Enter a value…"
                onChange={(e) => {
                  setValueDraft(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onBlur={() => commitValue(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitValue(idx); }
                  if (e.key === 'Escape') { e.preventDefault(); setEditingValueIdx(null); }
                }}
                rows={1}
              />
            ) : (
              <span className={field.value ? styles.valueText : styles.valuePlaceholder}>
                {field.value || 'Click to add value'}
              </span>
            )}
            {editingValueIdx !== idx && (
              <div className={styles.moreWrap}>
                <button
                  type="button"
                  className={`${styles.moreBtn} ${openMenuIdx === idx ? styles.moreBtnOpen : ''}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => { e.stopPropagation(); setOpenMenuIdx(openMenuIdx === idx ? null : idx); }}
                >
                  <span className={`material-symbols-outlined ${styles.moreBtnIcon}`}>more_vert</span>
                </button>
                {openMenuIdx === idx && (
                  <div className={styles.menuPopup}>
                    <button type="button" className={styles.menuItem} onClick={(e) => { e.stopPropagation(); startEditValue(idx); }}>
                      <span className={`material-symbols-outlined ${styles.menuItemIcon}`}>edit</span>
                      Edit value
                    </button>
                    <button type="button" className={`${styles.menuItem} ${styles.menuItemDelete}`} onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}>
                      <span className={`material-symbols-outlined ${styles.menuItemIcon}`}>delete</span>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {addingNew && (
        <div className={styles.dataRow}>
          <div className={styles.fieldCell}>
            <span className={`${styles.newChip} ${styles[`newChip${cap(pendingType)}`] || ''}`}>
              <span className={`${styles.newChipSwatch} ${styles[`newChipSwatch${cap(pendingType)}`] || ''}`}>
                {pendingType === 'variable' || !CHIP_TYPES.find((ct) => ct.type === pendingType)?.icon
                  ? <DataTypeIcon />
                  : <span className={`material-symbols-outlined ${styles[`newSwatchIcon${cap(pendingType)}`] || ''}`}>{CHIP_TYPES.find((ct) => ct.type === pendingType)?.icon}</span>
                }
              </span>
              <input
                ref={newNameRef}
                className={styles.newChipInput}
                value={newNameDraft}
                placeholder="field name"
                onChange={(e) => setNewNameDraft(e.target.value)}
                onBlur={commitNew}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitNew(); }
                  if (e.key === 'Escape') { e.preventDefault(); cancelNew(); }
                }}
              />
            </span>
          </div>
          <div className={styles.valueCell}>
            <span className={styles.valuePlaceholder}>Set field name first</span>
          </div>
        </div>
      )}

      <div className={styles.addRow}>
        <div className={styles.addBtnWrap} ref={pickerRef}>
          <button
            type="button"
            className={styles.addBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={openForAdd}
          >
            <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add_circle</span>
            Add
          </button>
          {pickerOpen && (
            <div className={styles.typePicker}>
              {CHIP_TYPES.map((ct) => (
                <button key={ct.type} className={styles.typePickerItem} type="button" onClick={() => selectType(ct.type)}>
                  <span className={`${styles.typePickerSwatch} ${styles[`tpSwatch${cap(ct.type)}`] || ''}`}>
                    {ct.icon
                      ? <span className={`material-symbols-outlined ${styles[`tpIcon${cap(ct.type)}`] || ''}`}>{ct.icon}</span>
                      : <DataTypeIcon />
                    }
                  </span>
                  <span className={styles.typePickerLabel}>{ct.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
