import React, { useState, useRef, useEffect, useCallback } from 'react';
import VariableChip, { CHIP_TYPES, DataTypeIcon } from '../../Inputs/VariableChip/VariableChip';
import styles from './ExpandedRHSTestOutput.module.css';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ExpandedRHSTestOutput({ rows = [], onChange }) {
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
  const fileInputRefs = useRef({});

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
      onChange?.(rows.map((r, i) => i === pickerFor ? { ...r, type } : r));
    }
    setPickerFor(null);
  };

  const commitNew = useCallback(() => {
    if (commitGuardRef.current) return;
    commitGuardRef.current = true;
    const name = newNameDraft.trim();
    if (name) onChange?.([...rows, { name, value: '', type: pendingType, images: [] }]);
    setAddingNew(false);
    setNewNameDraft('');
  }, [newNameDraft, rows, onChange, pendingType]);

  const cancelNew = () => {
    commitGuardRef.current = true;
    setAddingNew(false);
    setNewNameDraft('');
  };

  const startEditValue = useCallback((idx) => {
    setEditingValueIdx(idx);
    setValueDraft(rows[idx]?.value ?? '');
    setOpenMenuIdx(null);
  }, [rows]);

  const commitValue = useCallback((idx) => {
    if (editingValueIdx !== idx) return;
    onChange?.(rows.map((r, i) => i === idx ? { ...r, value: valueDraft } : r));
    setEditingValueIdx(null);
  }, [editingValueIdx, valueDraft, rows, onChange]);

  const handleNameChange = (idx, newName) => onChange?.(rows.map((r, i) => i === idx ? { ...r, name: newName } : r));

  const handleDelete = (idx) => {
    onChange?.(rows.filter((_, i) => i !== idx));
    setOpenMenuIdx(null);
    if (editingValueIdx === idx) setEditingValueIdx(null);
  };

  const handleAddImage = (idx) => {
    setOpenMenuIdx(null);
    fileInputRefs.current[idx]?.click();
  };

  const handleFileChange = (idx, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    Promise.all(
      files.map(
        (f) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(f);
          })
      )
    ).then((dataUrls) => {
      onChange?.(rows.map((r, i) => i === idx ? { ...r, images: [...(r.images || []), ...dataUrls] } : r));
    });
    e.target.value = '';
  };

  const handleRemoveImage = (idx, imgIdx) => {
    onChange?.(rows.map((r, i) => i === idx ? { ...r, images: (r.images || []).filter((_, ii) => ii !== imgIdx) } : r));
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
              type={row.type || 'variable'}
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
            <div className={styles.valueCellContent}>
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
                <span className={row.value ? styles.valueText : styles.valuePlaceholder}>
                  {row.value || (!(row.images?.length) ? 'Click to add value' : '')}
                </span>
              )}

              {row.images?.length > 0 && (
                <div className={styles.imageGrid}>
                  {row.images.map((src, imgIdx) => (
                    <div key={imgIdx} className={styles.imageThumbnailWrap} onClick={(e) => e.stopPropagation()}>
                      <img src={src} alt="" className={styles.imageThumbnail} />
                      <button
                        type="button"
                        className={styles.imageRemoveBtn}
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(idx, imgIdx); }}
                        aria-label="Remove image"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              ref={(el) => { fileInputRefs.current[idx] = el; }}
              type="file"
              accept="image/*"
              multiple
              className={styles.fileInput}
              onChange={(e) => handleFileChange(idx, e)}
            />

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
                    <button type="button" className={styles.menuItem} onClick={(e) => { e.stopPropagation(); handleAddImage(idx); }}>
                      <span className={`material-symbols-outlined ${styles.menuItemIcon}`}>image</span>
                      Add image
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
