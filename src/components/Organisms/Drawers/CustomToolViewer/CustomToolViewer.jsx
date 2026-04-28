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

        {/* ─── Free-flowing fields ─── */}
        <div className={styles.body}>
          {tool.fields?.map((f) => (
            <PreviewField key={f.id} field={f} />
          ))}
        </div>
      </div>
    </CommonSideDrawer>
  );
}
