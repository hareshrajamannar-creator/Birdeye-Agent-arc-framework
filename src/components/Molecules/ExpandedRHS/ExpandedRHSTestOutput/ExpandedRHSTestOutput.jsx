import React, { useState, useRef, useEffect, useCallback } from 'react';
import VariableChip from '../../Inputs/VariableChip/VariableChip';
import styles from './ExpandedRHSTestOutput.module.css';

export default function ExpandedRHSTestOutput({ rows = [], onChange }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [draft, setDraft] = useState('');
  const [openMenuIdx, setOpenMenuIdx] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingIdx !== null && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }, [editingIdx]);

  const startEdit = useCallback((idx) => {
    setEditingIdx(idx);
    setDraft(rows[idx]?.value ?? '');
    setOpenMenuIdx(null);
  }, [rows]);

  const commit = useCallback((idx) => {
    if (editingIdx !== idx) return;
    onChange?.(rows.map((r, i) => i === idx ? { ...r, value: draft } : r));
    setEditingIdx(null);
  }, [editingIdx, draft, rows, onChange]);

  const handleTextareaKey = (e, idx) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(idx); }
    if (e.key === 'Escape') { e.preventDefault(); setEditingIdx(null); }
  };

  const handleNameChange = (idx, newName) => {
    const updated = rows.map((r, i) => {
      if (i !== idx) return r;
      const { _isNew, ...rest } = r;
      return { ...rest, name: newName };
    });
    onChange?.(updated);
  };

  const handleDelete = (idx) => {
    onChange?.(rows.filter((_, i) => i !== idx));
    setOpenMenuIdx(null);
    if (editingIdx === idx) setEditingIdx(null);
  };

  const handleAdd = () => {
    onChange?.([...rows, { name: '', value: '', _isNew: true }]);
  };

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <div className={styles.headerFieldCell}>
          <span className={styles.headerLabel}>Output fields</span>
          <span className={`material-symbols-outlined ${styles.chevron}`}>expand_more</span>
        </div>
        <div className={styles.headerValueCell}>
          <span className={styles.headerLabel}>Values</span>
        </div>
      </div>

      {rows.map((row, idx) => (
        <div key={idx} className={styles.dataRow}>
          <div className={styles.fieldCell}>
            <VariableChip
              value={row.name}
              autoFocus={!!row._isNew}
              onChange={(name) => handleNameChange(idx, name)}
              onDelete={() => handleDelete(idx)}
              fullWidth
            />
          </div>

          <div
            className={styles.valueCell}
            onClick={() => editingIdx !== idx && startEdit(idx)}
          >
            {editingIdx === idx ? (
              <textarea
                ref={textareaRef}
                className={styles.valueTextarea}
                value={draft}
                placeholder="Enter a value…"
                onChange={(e) => {
                  setDraft(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onBlur={() => commit(idx)}
                onKeyDown={(e) => handleTextareaKey(e, idx)}
                rows={1}
              />
            ) : (
              <span className={row.value ? styles.valueText : styles.valuePlaceholder}>
                {row.value || 'Click to add value'}
              </span>
            )}

            {editingIdx !== idx && (
              <div className={styles.moreWrap}>
                <button
                  type="button"
                  className={`${styles.moreBtn} ${openMenuIdx === idx ? styles.moreBtnOpen : ''}`}
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
                      onClick={(e) => { e.stopPropagation(); startEdit(idx); }}
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

      <div className={styles.addRow}>
        <button type="button" className={styles.addBtn} onClick={handleAdd}>
          <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add_circle</span>
          Add
        </button>
      </div>
    </div>
  );
}
