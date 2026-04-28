import React, { useRef, useEffect, useCallback } from 'react';
import '../prompt-chip.css';
import { serializeFrom, deserializeInto, insertChipAt } from '../promptChipHelpers.js';
import styles from './UserPromptInput.module.css';

export default function UserPromptInput({ value, onChange, required }) {
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const lastEmittedRef = useRef(null);

  const emitChange = useCallback(() => {
    const s = serializeFrom(editorRef.current);
    lastEmittedRef.current = s;
    onChangeRef.current?.(s);
  }, []);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const newVal = value ?? '';
    if (newVal === lastEmittedRef.current) return;
    lastEmittedRef.current = newVal;
    deserializeInto(el, newVal, emitChange);
  }, [value, emitChange]);

  const handleInsertChip = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const sel = window.getSelection();
    let range = null;
    if (sel.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      range = sel.getRangeAt(0).cloneRange();
    }
    insertChipAt(el, range, emitChange);
  }, [emitChange]);

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>User prompt</span>
        {required && <span className={styles.required}>*</span>}
      </div>
      <div className={styles.inputBox}>
        <div
          ref={editorRef}
          className={styles.editor}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          data-placeholder="Enter prompt"
        />
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.toolbarBtn}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleInsertChip}
            title="Insert variable"
          >
            <span className="material-symbols-outlined">data_object</span>
          </button>
        </div>
      </div>
    </div>
  );
}
