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
  onChildrenReorder,
  viewOnly = false,
}) {
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(menuItems.filter((i) => i.defaultExpanded).map((i) => i.id))
  );
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Drag state — only active while user is dragging an Agents child row
  const [draggingId, setDraggingId] = useState(null);
  const [localOrder, setLocalOrder] = useState(null); // null = use prop order

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

  /* ─── Drag handlers (Agents section children only) ─── */
  function handleDragStart(childId, children, e) {
    setDraggingId(childId);
    setLocalOrder(children.map((c) => c.id));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnter(targetId) {
    if (!draggingId || targetId === draggingId) return;
    setLocalOrder((prev) => {
      if (!prev) return prev;
      const ids = [...prev];
      const from = ids.indexOf(draggingId);
      const to = ids.indexOf(targetId);
      if (from === -1 || to === -1) return prev;
      ids.splice(from, 1);
      ids.splice(to, 0, draggingId);
      return ids;
    });
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDragEnd() {
    if (localOrder) onChildrenReorder?.(localOrder);
    setDraggingId(null);
    setLocalOrder(null);
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
        <div className={styles.titleBar}>
          <span className={styles.titleText}>{title}</span>
        </div>

        <div className={styles.body}>
          {!viewOnly && (
            <button className={styles.ctaBtn} onClick={onCtaClick}>
              <span className={styles.ctaLabel}>{ctaLabel}</span>
              <div className={styles.ctaDot}>
                <span className={`material-symbols-outlined ${styles.ctaDotIcon}`}>add</span>
              </div>
            </button>
          )}

          <div className={styles.menuList}>
            {menuItems.map((item) => {
              const sectionHasActiveChild = item.children?.some((c) => c.id === activeItemId);
              const isExpanded = viewOnly ? sectionHasActiveChild : expandedIds.has(item.id);
              const isAgents = item.id === 'agents';

              if (item.children) {
                // Build the display order: use localOrder during drag, otherwise prop order
                const displayChildren = isAgents && localOrder
                  ? localOrder.map((id) => item.children.find((c) => c.id === id)).filter(Boolean)
                  : item.children;

                return (
                  <div key={item.id} className={styles.sectionWrap}>
                    <button
                      className={styles.sectionRow}
                      onClick={!viewOnly ? () => toggleExpand(item.id) : undefined}
                      style={viewOnly ? { cursor: 'default' } : undefined}
                    >
                      <span className={styles.sectionLabel}>{item.label}</span>
                      {isAgents && !viewOnly && (
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

                    {isExpanded && (
                      <>
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

                        {displayChildren.map((child) => {
                          const isActive = activeItemId === child.id;
                          const isDragging = draggingId === child.id;
                          return (
                            <button
                              key={child.id}
                              draggable={isAgents && !viewOnly}
                              className={[
                                styles.childRow,
                                isActive ? styles['childRow--active'] : '',
                                isAgents && !viewOnly ? styles.childRowDraggable : '',
                                isDragging ? styles.childRowDragging : '',
                              ].join(' ')}
                              onClick={!viewOnly ? () => !isDragging && onItemClick?.(child.id) : undefined}
                              style={viewOnly && !isActive ? { cursor: 'default', opacity: 0.5 } : undefined}
                              onDragStart={isAgents && !viewOnly ? (e) => handleDragStart(child.id, item.children, e) : undefined}
                              onDragEnter={isAgents && !viewOnly ? () => handleDragEnter(child.id) : undefined}
                              onDragOver={isAgents && !viewOnly ? handleDragOver : undefined}
                              onDragEnd={isAgents && !viewOnly ? handleDragEnd : undefined}
                            >
                              <span className={styles.childLabel}>{child.label}</span>
                              {isAgents && !isActive && !viewOnly && (
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

              return (
                <button
                  key={item.id}
                  className={styles.standaloneRow}
                  onClick={!viewOnly ? () => onItemClick?.(item.id) : undefined}
                  style={viewOnly ? { cursor: 'default' } : undefined}
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
  onChildrenReorder: PropTypes.func,
};
