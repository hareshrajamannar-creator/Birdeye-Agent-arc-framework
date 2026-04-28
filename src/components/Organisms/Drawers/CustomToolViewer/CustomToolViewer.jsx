import React, { useState, useRef, useEffect } from 'react';
import CommonSideDrawer from '@birdeye/elemental/core/atoms/CommonSideDrawer/index.js';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
import { Select, SelectItem } from '@birdeye/elemental/core/atoms/Select/index.js';
import Toggle from '@birdeye/elemental/core/atoms/Toggle/index.js';
import { OPTION_FIELD_TYPES } from '../CustomToolBuilder/CustomToolBuilder.jsx';
import styles from './CustomToolViewer.module.css';

// ─── Interactive field ────────────────────────────────────────────────────────

function InteractiveField({ field }) {
  const [textValue, setTextValue] = useState('');
  const [radioValue, setRadioValue] = useState('');
  const [checkValues, setCheckValues] = useState([]);
  const [selectValue, setSelectValue] = useState(undefined);
  const [toggled, setToggled] = useState(false);

  const label = field.label || 'Untitled field';
  const required = field.required;

  switch (field.type) {
    case 'text':
    case 'number':
    case 'date':
      return (
        <div className={styles.fieldWrap}>
          <FormInput
            name={`view_${field.id}`}
            type={field.type}
            label={label}
            placeholder={field.placeholder || ''}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            required={required}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className={styles.fieldWrap}>
          <TextArea
            name={`view_${field.id}`}
            label={label}
            placeholder={field.placeholder || ''}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            noFloatingLabel
            required={required}
          />
        </div>
      );

    case 'dropdown':
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <Select
            value={selectValue}
            onChange={(e, v) => setSelectValue(v)}
            placeHolder="Select..."
          >
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </Select>
        </div>
      );

    case 'radio':
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <div className={styles.optionGroup}>
            {field.options.map((opt) => (
              <FormInput
                key={opt}
                name={`view_radio_${field.id}`}
                type="radio"
                label={opt}
                labelInside
                checked={radioValue === opt}
                onChange={() => setRadioValue(opt)}
              />
            ))}
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className={styles.fieldWrap}>
          <span className={styles.fieldLabel}>
            {label}{required && <span className={styles.required}> *</span>}
          </span>
          <div className={styles.optionGroup}>
            {field.options.map((opt) => (
              <FormInput
                key={opt}
                name={`view_chk_${field.id}_${opt}`}
                type="checkbox"
                label={opt}
                labelInside
                checked={checkValues.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCheckValues((prev) => [...prev, opt]);
                  } else {
                    setCheckValues((prev) => prev.filter((o) => o !== opt));
                  }
                }}
              />
            ))}
          </div>
        </div>
      );

    case 'toggle':
      return (
        <div className={styles.toggleRow}>
          <span className={styles.fieldLabel}>{label}</span>
          <Toggle
            name={`view_toggle_${field.id}`}
            checked={toggled}
            onChange={(instance, e) => setToggled(e.target.checked)}
          />
        </div>
      );

    default:
      return null;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CustomToolViewer({ isOpen, tool, onClose, onEditTool }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  if (!tool) return null;

  const handleEdit = () => {
    setMenuOpen(false);
    onEditTool?.(tool);
  };

  return (
    <CommonSideDrawer
      isOpen={isOpen}
      title=""
      onClose={onClose}
      width="650px"
      shouldScroll={false}
      buttonPosition="right"
      headerRightContent={<span className={styles.drawerSuppress} />}
    >
      <div className={styles.outer}>
        {/* ─── Custom header ─── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} type="button" onClick={onClose}>
              <span className="material-symbols-outlined">arrow_left_alt</span>
            </button>
            <span className={styles.headerTitle}>{tool.name}</span>
          </div>
          <div className={styles.headerRight} ref={menuRef}>
            <button
              className={styles.moreBtn}
              type="button"
              onClick={() => setMenuOpen((m) => !m)}
              title="More options"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
            {menuOpen && (
              <div className={styles.moreMenu}>
                <button className={styles.moreMenuItem} type="button" onClick={handleEdit}>
                  <span className="material-symbols-outlined">edit</span>
                  Edit tool
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Interactive fields ─── */}
        <div className={styles.body}>
          {tool.fields?.map((f) => (
            <InteractiveField key={f.id} field={f} />
          ))}
        </div>
      </div>
    </CommonSideDrawer>
  );
}
