import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../prompt-chip.css';
import { serializeFrom, deserializeInto, insertChipAt } from '../promptChipHelpers.js';
import { VariableIcon, ExpandIcon } from '../PromptToolbarIcons.jsx';
import { CHIP_TYPES, DataTypeIcon } from '../VariableChip/VariableChip.jsx';
import styles from './SystemPromptInput.module.css';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function SystemPromptInput({ value, onChange, required }) {
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const lastEmittedRef = useRef(null);
  const savedRangeRef = useRef(null);
  const pickerContainerRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);

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

  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e) => {
      if (pickerContainerRef.current && !pickerContainerRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  const handleOpenPicker = useCallback(() => {
    const el = editorRef.current;
    if (el) {
      const sel = window.getSelection();
      if (sel?.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
    }
    setPickerOpen((p) => !p);
  }, []);

  const handleTypeSelect = useCallback((type) => {
    setPickerOpen(false);
    insertChipAt(editorRef.current, savedRangeRef.current, emitChange, type);
    savedRangeRef.current = null;
  }, [emitChange]);

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>System prompt</span>
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
        <div className={styles.toolbar} ref={pickerContainerRef}>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${pickerOpen ? styles.toolbarBtnActive : ''}`}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenPicker}
            title="Insert variable"
          >
            <VariableIcon />
          </button>
          <button
            type="button"
            className={styles.toolbarBtn}
            onMouseDown={(e) => e.preventDefault()}
            title="Expand"
          >
            <ExpandIcon />
          </button>
          {pickerOpen && (
            <div className={styles.typePicker}>
              {CHIP_TYPES.map((ct) => (
                <button
                  key={ct.type}
                  className={styles.typePickerItem}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleTypeSelect(ct.type)}
                >
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
