import React, { useState, useRef, useEffect, useCallback } from 'react';
import VariableChip from '../../Inputs/VariableChip/VariableChip';
import styles from './ExpandedRHSTestInput.module.css';

function DataTypeIcon() {
  return (
    <svg width="16" height="15" viewBox="5 5.5 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.24889 13.2505C7.46549 13.4287 7.64002 13.6525 7.76 13.906C8.06667 14.5385 8.06667 15.3116 8.06667 16.0616C8.06667 17.6148 8.13056 18.3616 9.6 18.3616C9.73556 18.3616 9.86556 18.4155 9.96141 18.5113C10.0573 18.6072 10.1111 18.7372 10.1111 18.8727C10.1111 19.0083 10.0573 19.1383 9.96141 19.2342C9.86556 19.33 9.73556 19.3839 9.6 19.3839C8.48322 19.3839 7.72678 18.9916 7.35111 18.2172C7.04444 17.5847 7.04444 16.8117 7.04444 16.0616C7.04444 14.5085 6.98056 13.7616 5.51111 13.7616C5.37556 13.7616 5.24555 13.7078 5.1497 13.6119C5.05385 13.5161 5 13.3861 5 13.2505C5 13.115 5.05385 12.985 5.1497 12.8891C5.24555 12.7933 5.37556 12.7394 5.51111 12.7394C6.98056 12.7394 7.04444 11.9925 7.04444 10.4394C7.04444 9.69063 7.04444 8.9163 7.35111 8.2838C7.72806 7.50947 8.4845 7.11719 9.60128 7.11719C9.73683 7.11719 9.86684 7.17104 9.96269 7.26689C10.0585 7.36274 10.1124 7.49274 10.1124 7.6283C10.1124 7.76385 10.0585 7.89386 9.96269 7.98971C9.86684 8.08556 9.73683 8.13941 9.60128 8.13941C8.13183 8.13941 8.06794 8.88627 8.06794 10.4394C8.06794 11.1882 8.06794 11.9625 7.76128 12.595C7.64093 12.8486 7.46595 13.0725 7.24889 13.2505ZM20.8235 12.7394C19.3541 12.7394 19.2902 11.9925 19.2902 10.4394C19.2902 9.69063 19.2902 8.9163 18.9835 8.2838C18.6078 7.50947 17.8514 7.11719 16.7346 7.11719C16.5991 7.11719 16.4691 7.17104 16.3732 7.26689C16.2773 7.36274 16.2235 7.49274 16.2235 7.6283C16.2235 7.76385 16.2773 7.89386 16.3732 7.98971C16.4691 8.08556 16.5991 8.13941 16.7346 8.13941C18.2041 8.13941 18.2679 8.88627 18.2679 10.4394C18.2679 11.1882 18.2679 11.9625 18.5746 12.595C18.6946 12.8485 18.8691 13.0724 19.0857 13.2505C18.8691 13.4287 18.6946 13.6525 18.5746 13.906C18.2679 14.5385 18.2679 15.3116 18.2679 16.0616C18.2679 17.6148 18.2041 18.3616 16.7346 18.3616C16.5991 18.3616 16.4691 18.4155 16.3732 18.5113C16.2773 18.6072 16.2235 18.7372 16.2235 18.8727C16.2235 19.0083 16.2773 19.1383 16.3732 19.2342C16.4691 19.33 16.5991 19.3839 16.7346 19.3839C17.8514 19.3839 18.6078 18.9916 18.9835 18.2172C19.2902 17.5847 19.2902 16.8117 19.2902 16.0616C19.2902 14.5085 19.3541 13.7616 20.8235 13.7616C20.9591 13.7616 21.0891 13.7078 21.1849 13.6119C21.2808 13.5161 21.3346 13.3861 21.3346 13.2505C21.3346 13.115 21.2808 12.985 21.1849 12.8891C21.0891 12.7933 20.9591 12.7394 20.8235 12.7394Z" fill="#1976D2" />
      <path d="M14.4142 12.0861L13 13.5003L11.5858 14.9145M11.5858 12.0861L14.4142 14.9145" stroke="#1976D2" strokeLinecap="round" />
    </svg>
  );
}

export default function ExpandedRHSTestInput({ fields = [], onChange }) {
  const [editingValueIdx, setEditingValueIdx] = useState(null);
  const [valueDraft, setValueDraft] = useState('');
  const [openMenuIdx, setOpenMenuIdx] = useState(null);

  // New-row state: managed separately so it never auto-deletes
  const [addingNew, setAddingNew] = useState(false);
  const [newNameDraft, setNewNameDraft] = useState('');
  const newNameRef = useRef(null);
  const valueTextareaRef = useRef(null);

  useEffect(() => {
    if (addingNew && newNameRef.current) {
      newNameRef.current.focus();
    }
  }, [addingNew]);

  useEffect(() => {
    if (editingValueIdx !== null && valueTextareaRef.current) {
      const el = valueTextareaRef.current;
      el.focus();
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, [editingValueIdx]);

  const commitNew = useCallback(() => {
    const name = newNameDraft.trim();
    if (name) {
      onChange?.([...fields, { name, value: '' }]);
    }
    setAddingNew(false);
    setNewNameDraft('');
  }, [newNameDraft, fields, onChange]);

  const cancelNew = () => {
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

  const handleNameChange = (idx, newName) => {
    onChange?.(fields.map((f, i) => i === idx ? { ...f, name: newName } : f));
  };

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
              onChange={(name) => handleNameChange(idx, name)}
              onDelete={() => handleDelete(idx)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuIdx(openMenuIdx === idx ? null : idx);
                  }}
                  aria-label="More options"
                >
                  <span className={`material-symbols-outlined ${styles.moreBtnIcon}`}>more_vert</span>
                </button>
                {openMenuIdx === idx && (
                  <div className={styles.menuPopup}>
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={(e) => { e.stopPropagation(); startEditValue(idx); }}
                    >
                      <span className={`material-symbols-outlined ${styles.menuItemIcon}`}>edit</span>
                      Edit value
                    </button>
                    <button
                      type="button"
                      className={`${styles.menuItem} ${styles.menuItemDelete}`}
                      onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}
                    >
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

      {/* New row — appears when Add is clicked, persists until user commits or cancels */}
      {addingNew && (
        <div className={styles.dataRow}>
          <div className={styles.fieldCell}>
            <span className={styles.newChip}>
              <span className={styles.newChipSwatch}>
                <DataTypeIcon />
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
        <button
          type="button"
          className={styles.addBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setAddingNew(true); setNewNameDraft(''); }}
        >
          <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add_circle</span>
          Add
        </button>
      </div>
    </div>
  );
}
