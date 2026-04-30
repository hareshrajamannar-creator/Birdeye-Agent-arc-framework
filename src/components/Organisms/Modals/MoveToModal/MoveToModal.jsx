import React, { useState } from 'react';
import { MODULE_NAV } from '../../../Modules/moduleNavigation';
import styles from './MoveToModal.module.css';

const MODULE_ICONS = {
  overview: 'home',
  inbox: 'sms',
  listings: 'location_on',
  reviews: 'grade',
  referrals: 'redeem',
  payments: 'payments',
  appointments: 'event',
  social: 'workspaces',
  surveys: 'assignment_turned_in',
  ticketing: 'shapes',
  contacts: 'group',
  campaigns: 'campaign',
  reports: 'bar_chart',
  insights: 'insights',
  competitors: 'compare_arrows',
  settings: 'settings',
};

const MODULES = Object.entries(MODULE_NAV)
  .map(([moduleId, nav]) => ({
    moduleId,
    title: nav.title,
    sections: nav.menuItems.find((item) => item.id === 'agents')?.children || [],
  }))
  .filter((m) => m.sections.length > 0);

export default function MoveToModal({ onMove, onCancel }) {
  const [expandedModule, setExpandedModule] = useState(null);
  const [selected, setSelected] = useState(null);

  function toggleModule(moduleId) {
    setExpandedModule((prev) => (prev === moduleId ? null : moduleId));
  }

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Move to</span>
          <button className={styles.closeBtn} type="button" onClick={onCancel}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className={styles.body}>
          {MODULES.map(({ moduleId, title, sections }) => (
            <div key={moduleId} className={styles.moduleRow}>
              <button
                className={styles.moduleHeader}
                type="button"
                onClick={() => toggleModule(moduleId)}
              >
                <span className={`material-symbols-outlined ${styles.moduleIcon}`}>
                  {MODULE_ICONS[moduleId] || 'folder'}
                </span>
                <span className={styles.moduleTitle}>{title}</span>
                <span className={`material-symbols-outlined ${styles.moduleChevron} ${expandedModule === moduleId ? styles.moduleChevronOpen : ''}`}>
                  expand_more
                </span>
              </button>

              {expandedModule === moduleId && (
                <div className={styles.sections}>
                  {sections.map((section) => {
                    const isSelected = selected?.moduleId === moduleId && selected?.sectionId === section.id;
                    return (
                      <button
                        key={section.id}
                        className={`${styles.sectionItem} ${isSelected ? styles.sectionItemSelected : ''}`}
                        type="button"
                        onClick={() => setSelected({ moduleId, sectionId: section.id })}
                      >
                        <span className={`${styles.sectionDot} ${isSelected ? styles.sectionDotSelected : ''}`} />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>Cancel</button>
          <button
            className={styles.moveBtn}
            type="button"
            disabled={!selected}
            onClick={() => selected && onMove(selected.moduleId, selected.sectionId)}
          >
            Move here
          </button>
        </div>
      </div>
    </div>
  );
}
