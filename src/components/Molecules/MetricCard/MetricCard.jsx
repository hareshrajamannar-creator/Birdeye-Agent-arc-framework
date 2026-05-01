import React, { useState, useRef, useEffect } from 'react';
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
  tooltipText = '',
  onTooltipChange,
  onBatchSave,
  autoEdit = false,
}) {
  const [editing, setEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftTooltip, setDraftTooltip] = useState(tooltipText);
  const [showTooltip, setShowTooltip] = useState(false);
  const valueInputRef = useRef(null);
  const committedRef = useRef(false);

  // Whether we're in "group page" mode (shows Save/Cancel buttons, no blur-to-commit)
  const hasActionButtons = onTooltipChange !== undefined;

  useEffect(() => {
    if (autoEdit) startEdit('value');
  }, []); // eslint-disable-line

  function startEdit(field = 'value') {
    committedRef.current = false;
    setDraftValue(value);
    setDraftTitle(title);
    setDraftTooltip(tooltipText ?? '');
    setEditing(true);
    setTimeout(() => valueInputRef.current?.focus(), 0);
  }

  function commitEdit() {
    if (committedRef.current) return;
    committedRef.current = true;
    const v = draftValue.trim() || value;
    const t = draftTitle.trim() || title;
    if (onBatchSave) {
      // Single atomic update — avoids stale-closure bug when both value and title change
      onBatchSave({ value: v, title: t, tooltip: draftTooltip });
    } else {
      if (v !== value) onValueChange?.(v);
      if (t !== title) onTitleChange?.(t);
      if (hasActionButtons && draftTooltip !== (tooltipText ?? '')) onTooltipChange?.(draftTooltip);
    }
    setEditing(false);
  }

  function cancelEdit() {
    committedRef.current = true;
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  }

  // Only used in non-button mode (existing MetricsGroup behaviour)
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
        <div
          className={styles.editingContent}
          {...(!hasActionButtons && { onBlur: handleContainerBlur })}
        >
          <input
            ref={valueInputRef}
            className={`${styles.editInput} ${styles.editInputValue}`}
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Value"
          />
          <input
            className={`${styles.editInput} ${styles.editInputTitle}`}
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Label"
          />
          {hasActionButtons && (
            <input
              className={`${styles.editInput} ${styles.editInputTooltip}`}
              value={draftTooltip}
              onChange={(e) => setDraftTooltip(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tooltip text (shown on hover over ⓘ)"
            />
          )}
          {hasActionButtons && (
            <div className={styles.editActions}>
              <button className={styles.editCancelBtn} type="button" onClick={cancelEdit}>
                Cancel
              </button>
              <button className={styles.editSaveBtn} type="button" onClick={commitEdit}>
                Save
              </button>
            </div>
          )}
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
            <div
              className={styles.infoIconWrap}
              onMouseEnter={() => tooltipText && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className={`material-symbols-outlined ${styles.infoIcon}`}>info</span>
              {showTooltip && tooltipText && (
                <div className={styles.tooltipPopup}>{tooltipText}</div>
              )}
            </div>
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
