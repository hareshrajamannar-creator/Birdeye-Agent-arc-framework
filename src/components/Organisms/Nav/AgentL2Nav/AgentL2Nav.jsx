import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { saveAgent } from '../../../../services/agentService';
import styles from './AgentL2Nav.module.css';

const toSlug = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export default function AgentL2Nav({
  title = 'ReviewsAI',
  menuItems = [],
  activeItemId,
  ctaLabel = 'Send a review request',
  onCtaClick,
  onItemClick,
  currentModule = 'reviews',
}) {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(menuItems.filter((i) => i.defaultExpanded).map((i) => i.id))
  );
  const [creatingIn, setCreatingIn] = useState(null); // { parentId, sectionId }
  const [newAgentName, setNewAgentName] = useState('');
  const inputRef = useRef(null);

  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openCreate(parentId, sectionId, e) {
    e.stopPropagation();
    // Ensure the parent section is expanded
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(parentId);
      return next;
    });
    setCreatingIn({ parentId, sectionId });
    setNewAgentName('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function cancelCreate() {
    setCreatingIn(null);
    setNewAgentName('');
  }

  async function commitCreate() {
    const name = newAgentName.trim();
    const sectionId = creatingIn?.sectionId;
    setCreatingIn(null);
    setNewAgentName('');
    if (!name || !sectionId) return;

    const agentId = 'agent-' + Date.now().toString(36);
    const agentSlug = toSlug(name) + '-' + Date.now().toString(36);

    await saveAgent(agentId, {
      id: agentId,
      name,
      moduleSlug: currentModule,
      moduleContext: currentModule,
      sectionContext: sectionId,
      agentSlug,
      nodes: null,
      nodeDetails: {},
      status: 'Draft',
    });

    navigate(`/${currentModule}/agents/${agentSlug}`);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commitCreate();
    else if (e.key === 'Escape') cancelCreate();
  }

  function handleBlur() {
    if (!newAgentName.trim()) cancelCreate();
    else commitCreate();
  }

  const isAgentsSection = (item) => item.id === 'agents';

  return (
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
            const isAgents = isAgentsSection(item);

            if (item.children) {
              return (
                <div key={item.id} className={styles.sectionWrap}>
                  {/* Section header row */}
                  <button
                    className={styles.sectionRow}
                    onClick={() => toggleExpand(item.id)}
                  >
                    <span className={styles.sectionLabel}>{item.label}</span>
                    <span className={`material-symbols-outlined ${styles.chevron}`}>
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                    {isAgents && (
                      <button
                        className={styles.addBtn}
                        title="New agent"
                        onClick={(e) => openCreate(item.id, item.children[0]?.id || item.id, e)}
                      >
                        <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add</span>
                      </button>
                    )}
                  </button>

                  {/* Expanded children */}
                  {isExpanded && (
                    <>
                      {/* Inline create input — shown at top of Agents section */}
                      {isAgents && creatingIn?.parentId === item.id && (
                        <div className={styles.createRow}>
                          <input
                            ref={inputRef}
                            className={styles.createInput}
                            value={newAgentName}
                            placeholder="Agent name"
                            onChange={(e) => setNewAgentName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                          />
                        </div>
                      )}

                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          className={`${styles.childRow} ${activeItemId === child.id ? styles['childRow--active'] : ''}`}
                          onClick={() => onItemClick?.(child.id)}
                        >
                          <span className={styles.childLabel}>{child.label}</span>
                          {isAgents && (
                            <button
                              className={styles.addBtn}
                              title="New agent"
                              onClick={(e) => openCreate(item.id, child.id, e)}
                            >
                              <span className={`material-symbols-outlined ${styles.addBtnIcon}`}>add</span>
                            </button>
                          )}
                        </button>
                      ))}
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
  currentModule: PropTypes.string,
};
