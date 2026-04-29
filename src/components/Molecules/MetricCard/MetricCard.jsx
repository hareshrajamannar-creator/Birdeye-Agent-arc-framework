import React, { useState, useRef } from 'react';
import styles from './MetricCard.module.css';

export default function MetricCard({
  value,
  title,
  showTrend = false,
  trend = '',
  trendPositive = true,
  showConfig = false,
  onConfig,
  dollarValue,
  onValueChange,
  onTitleChange,
}) {
  const [editing, setEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const [draftTitle, setDraftTitle] = useState(title);
  const valueInputRef = useRef(null);
  const titleInputRef = useRef(null);

  function startEdit(field = 'value') {
    setDraftValue(value);
    setDraftTitle(title);
    setEditing(true);
    setTimeout(() => {
      if (field === 'title') titleInputRef.current?.focus();
      else valueInputRef.current?.focus();
    }, 0);
  }

  function commitEdit() {
    const v = draftValue.trim() || value;
    const t = draftTitle.trim() || title;
    if (v !== value) onValueChange?.(v);
    if (t !== title) onTitleChange?.(t);
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setEditing(false);
  }

  // Only commit when focus leaves the entire editing container, not between its own inputs
  function handleContainerBlur(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    commitEdit();
  }

  return (
    <div className={styles.card}>
      {!editing && (onValueChange || onTitleChange) && (
        <div className={styles.editHint} onClick={() => startEdit('value')} title="Click to edit">
          <span className={`material-symbols-outlined ${styles.editHintIcon}`}>edit</span>
        </div>
      )}

      {editing ? (
        <div className={styles.editingContent} onBlur={handleContainerBlur}>
          <input
            ref={valueInputRef}
            className={`${styles.editInput} ${styles.editInputValue}`}
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Value"
          />
          <input
            ref={titleInputRef}
            className={`${styles.editInput} ${styles.editInputTitle}`}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Label"
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', paddingRight: showConfig ? 44 : 0 }}>
          <div className={styles.valueRow}>
            <span
              className={styles.value}
              onClick={onValueChange ? () => startEdit('value') : undefined}
              style={onValueChange ? { cursor: 'text' } : undefined}
            >
              {value}
            </span>
            {showTrend && trend && (
              <span
                className={styles.trend}
                style={{ color: trendPositive ? '#4eac5d' : '#e53935' }}
              >
                {trend}
              </span>
            )}
          </div>

          <div className={styles.titleRow}>
            <span
              className={`${styles.title}${onTitleChange ? ` ${styles.titleEditable}` : ''}`}
              onClick={onTitleChange ? () => startEdit('title') : undefined}
            >
              {title}
            </span>
            <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
            {dollarValue && (
              <span style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                background: '#f1faf0',
                borderRadius: 4,
                fontSize: 12,
                lineHeight: '18px',
                color: '#377e2c',
                whiteSpace: 'nowrap',
                fontFamily: 'Roboto, sans-serif',
              }}>
                {dollarValue}
              </span>
            )}
          </div>
        </div>
      )}

      {showConfig && (
        <button className={styles.configBtn} onClick={onConfig}>
          <span className={`material-symbols-outlined ${styles.configBtnIcon}`}>tune</span>
        </button>
      )}
    </div>
  );
}
