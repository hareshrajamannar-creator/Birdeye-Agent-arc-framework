import React, { useState, useRef, useEffect } from 'react';
import styles from './VariableChip.module.css';

export default function VariableChip({ value, onChange, onDelete, autoFocus = false }) {
  const [editing, setEditing] = useState(autoFocus);
  const [draft, setDraft] = useState(value ?? '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      onChange?.(trimmed);
      setEditing(false);
    } else {
      onDelete?.();
    }
  };

  const cancel = () => {
    if (!value) {
      onDelete?.();
    } else {
      setDraft(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <span className={`${styles.chip} ${styles.chipEditing}`}>
        <span className={styles.chipIcon}>
          <span className="material-symbols-outlined">data_object</span>
        </span>
        <input
          ref={inputRef}
          className={styles.chipInput}
          value={draft}
          placeholder="variable"
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit(); }
            if (e.key === 'Escape') { e.preventDefault(); cancel(); }
          }}
        />
      </span>
    );
  }

  return (
    <span className={styles.chip}>
      <span className={styles.chipIcon}>
        <span className="material-symbols-outlined">data_object</span>
      </span>
      <span className={styles.chipLabel} onClick={() => setEditing(true)}>
        {value}
      </span>
      <button
        className={styles.deleteBtn}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </span>
  );
}
