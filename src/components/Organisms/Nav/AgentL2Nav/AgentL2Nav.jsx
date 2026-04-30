import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from './AgentL2Nav.module.css';

export default function AgentL2Nav({
  title = 'ReviewsAI',
  menuItems = [],
  activeItemId,
  ctaLabel = 'Send a review request',
  onCtaClick,
  onItemClick,
  onGroupCreate,
  onGroupDelete,
}) {
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(menuItems.filter((i) => i.defaultExpanded).map((i) => i.id))
  );
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const inputRef = useRef(null);

  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openCreate(parentId, e) {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(parentId);
      return next;
    });
    setCreating(true);
    setNewGroupName('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function cancelCreate() {
    setCreating(false);
    setNewGroupName('');
  }

  function commitCreate() {
    const name = newGroupName.trim();
    setCreating(false);
    setNewGroupName('');
    if (!name) return;
    onGroupCreate?.(name);
  }

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') commitCreate();
    else if (e.key === 'Escape') cancelCreate();
  }

  function handleInputBlur() {
    if (!newGroupName.trim()) cancelCreate();
    else commitCreate();
  }

  function handleDeleteClick(child, e) {
    e.stopPropagation();
    setDeleteConfirm({ id: child.id, label: child.label });
  }

  function confirmDelete() {
    if (!deleteConfirm) return;
    onGroupDelete?.(deleteConfirm.id);
    setDeleteConfirm(null);
  }

  const confirmModal = deleteConfirm
    ? ReactDOM.createPortal(
        <div className={styles.confirmBackdrop} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmHeader}>
              <span className={styles.confirmTitle}>Remove agent?</span>
            </div>
            <p className={styles.confirmBody}>
              This will permanently remove <strong>{deleteConfirm.label}</strong> and all its
              workflows. This cannot be undone.
            </p>
            <div className={styles.confirmFooter}>
              <button
                className={styles.confirmCancelBtn}
                type="button"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmRemoveBtn}
                type="button"
                onClick={confirmDelete}
              >
                Remove
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <nav className={styles.nav}>
        {/* Title */}
        <div className={styles.titleBar}>
          <span className={styles.titleText}>{title}</span>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* CTA */}
          <button className={styles.ctaBtn} onClick={onCtaClick}>
            <span className={styles.ctaLabel}>{ctaLabel}</span>
            <div className={styles.ctaDot}>
              <span className={`material-symbols-outlined ${styles.ctaDotIcon}`}>add</span>
            </div>
          </button>

          {/* Menu items */}
          <div className={styles.menuList}>
            {menuItems.map((item) => {
              const isExpanded = expandedIds.has(item.id);
              const isAgents = item.id === 'agents';
              const sectionHasActiveChild = isAgents && item.children?.some((c) => c.id === activeItemId);

              if (item.children) {
                return (
                  <div key={item.id} className={styles.sectionWrap}>
                    {/* Section header row */}
                    <button
                      className={styles.sectionRow}
                      onClick={() => toggleExpand(item.id)}
                    >
                      <span className={styles.sectionLabel}>{item.label}</span>

                      {/* Plus icon — Agents section only, LEFT of chevron */}
                      {isAgents && (
                        <button
                          className={`${styles.addBtn} ${sectionHasActiveChild ? styles.addBtnVisible : ''}`}
                          type="button"
                          title="New agent group"
                          onClick={(e) => openCreate(item.id, e)}
                        >
                          <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add</span>
                        </button>
                      )}

                      <span className={`material-symbols-outlined ${styles.chevron}`}>
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {/* Expanded children */}
                    {isExpanded && (
                      <>
                        {/* Inline create input — top of Agents list */}
                        {isAgents && creating && (
                          <div className={styles.createRow}>
                            <input
                              ref={inputRef}
                              className={styles.createInput}
                              value={newGroupName}
                              placeholder="Agent name"
                              onChange={(e) => setNewGroupName(e.target.value)}
                              onKeyDown={handleInputKeyDown}
                              onBlur={handleInputBlur}
                            />
                          </div>
                        )}

                        {item.children.map((child) => {
                          const isActive = activeItemId === child.id;
                          return (
                            <button
                              key={child.id}
                              className={`${styles.childRow} ${isActive ? styles['childRow--active'] : ''}`}
                              onClick={() => onItemClick?.(child.id)}
                            >
                              <span className={styles.childLabel}>{child.label}</span>
                              {/* Close icon — Agents section children, not on active row */}
                              {isAgents && !isActive && (
                                <button
                                  className={styles.deleteBtn}
                                  type="button"
                                  title="Remove agent group"
                                  onClick={(e) => handleDeleteClick(child, e)}
                                >
                                  <span className={`material-symbols-outlined ${styles.deleteBtnIcon}`}>close</span>
                                </button>
                              )}
                            </button>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              }

              /* Standalone row (no children) */
              return (
                <button
                  key={item.id}
                  className={styles.standaloneRow}
                  onClick={() => onItemClick?.(item.id)}
                >
                  <span className={styles.standaloneLabel}>{item.label}</span>
                  <span className={`material-symbols-outlined ${styles.chevron}`}>expand_more</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {confirmModal}
    </>
  );
}

AgentL2Nav.propTypes = {
  title: PropTypes.string,
  menuItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    defaultExpanded: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })),
  })),
  activeItemId: PropTypes.string,
  ctaLabel: PropTypes.string,
  onCtaClick: PropTypes.func,
  onItemClick: PropTypes.func,
  onGroupCreate: PropTypes.func,
  onGroupDelete: PropTypes.func,
};
