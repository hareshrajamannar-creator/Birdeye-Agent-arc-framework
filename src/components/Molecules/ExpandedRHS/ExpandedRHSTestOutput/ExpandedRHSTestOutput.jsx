import React, { useState } from 'react';
import VariableChip from '../../Inputs/VariableChip/VariableChip';
import styles from './ExpandedRHSTestOutput.module.css';

export default function ExpandedRHSTestOutput({ rows = [] }) {
  const [openMenuIdx, setOpenMenuIdx] = useState(null);

  const handleCopy = (value) => {
    navigator.clipboard?.writeText(value ?? '').catch(() => {});
    setOpenMenuIdx(null);
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

      {rows.length === 0 ? (
        <div className={styles.emptyRow}>
          <span className={`material-symbols-outlined ${styles.emptyIcon}`}>bolt</span>
          <span className={styles.emptyText}>Run task to generate output</span>
        </div>
      ) : (
        rows.map((row, idx) => (
          <div key={idx} className={styles.dataRow}>
            <div className={styles.fieldCell}>
              <VariableChip value={row.name} />
            </div>

            <div className={styles.valueCell}>
              {row.value ? (
                <span className={styles.valueText}>{row.value}</span>
              ) : (
                <span className={styles.valuePlaceholder}>—</span>
              )}

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
                      onClick={() => handleCopy(row.value)}
                    >
                      <span className={`material-symbols-outlined ${styles.menuItemIcon}`}>content_copy</span>
                      Copy value
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
