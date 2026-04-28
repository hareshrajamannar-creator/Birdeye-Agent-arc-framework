import React, { useState, useRef, useEffect } from 'react';
import CommonSideDrawer from '@birdeye/elemental/core/atoms/CommonSideDrawer/index.js';
import { PreviewField } from '../CustomToolBuilder/CustomToolBuilder.jsx';
import styles from './CustomToolViewer.module.css';

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
      title={tool.name}
      onClose={onClose}
      width="480px"
      shouldScroll={false}
      buttonPosition="right"
      headerRightContent={
        <div className={styles.headerActions} ref={menuRef}>
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
          <button className={styles.closeBtn} type="button" onClick={onClose} title="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      }
    >
      <div className={styles.viewer}>
        <div className={styles.viewBody}>
          <div className={styles.infoRow}>
            {tool.iconDataUrl ? (
              <img src={tool.iconDataUrl} alt={tool.name} className={styles.toolIcon} />
            ) : (
              <span className={`material-symbols-outlined ${styles.toolIconFallback}`}>build</span>
            )}
            <div className={styles.infoText}>
              <span className={styles.toolName}>{tool.name}</span>
              {tool.description && (
                <span className={styles.toolDesc}>{tool.description}</span>
              )}
            </div>
          </div>

          {tool.fields?.length > 0 && (
            <div className={styles.fieldsSection}>
              <span className={styles.fieldsSectionLabel}>Form fields</span>
              <div className={styles.previewCard}>
                {tool.fields.map((f) => (
                  <PreviewField key={f.id} field={f} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CommonSideDrawer>
  );
}
