import React, { useState, useRef, useEffect } from 'react';
import Chip from '@birdeye/elemental/core/atoms/Chip/index.js';
import styles from './AgentsTable.module.css';

const DEFAULT_COLUMNS = [
  { id: 'name',             label: 'Agent name' },
  { id: 'status',           label: 'Status' },
  { id: 'reviewsResponded', label: 'Reviews responded' },
  { id: 'responseRate',     label: 'Response rate' },
  { id: 'avgResponseTime',  label: 'Average response time' },
  { id: 'timeSaved',        label: 'Time saved' },
  { id: 'locations',        label: 'Locations' },
];

const STATUS_COLOR = { Running: 'green', Paused: 'yellow', Draft: 'grey' };

const NON_EDITABLE_CELLS = new Set(['status', 'locations']);

function CellValue({ colId, value }) {
  if (colId === 'status') {
    return <Chip label={String(value)} colorType={STATUS_COLOR[value] || 'grey'} size="small" />;
  }
  if (colId === 'locations') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span>{value}</span>
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#555', lineHeight: 1 }}>expand_more</span>
      </span>
    );
  }
  return <span>{value}</span>;
}

export default function AgentsTable({ agents = [], onRowClick, onDeleteAgent, onAgentUpdate, onDuplicateAgent, onMoveAgent }) {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [editingHeader, setEditingHeader] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [draft, setDraft] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const inputRef = useRef(null);
  const menuRefs = useRef({});

  useEffect(() => {
    if (!openMenuId) return;
    function handleOutside(e) {
      const ref = menuRefs.current[openMenuId];
      if (ref && !ref.contains(e.target)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [openMenuId]);

  function focusInput() {
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function startHeaderEdit(col) {
    setEditingHeader(col.id);
    setEditingCell(null);
    setDraft(col.label);
    focusInput();
  }

  function commitHeaderEdit(colId) {
    setColumns((prev) => prev.map((c) => c.id === colId ? { ...c, label: draft.trim() || c.label } : c));
    setEditingHeader(null);
  }

  function startCellEdit(agent, colId) {
    if (NON_EDITABLE_CELLS.has(colId)) return;
    setEditingCell({ rowId: agent.id, colId });
    setEditingHeader(null);
    setDraft(String(agent[colId] ?? ''));
    focusInput();
  }

  function commitCellEdit() {
    if (!editingCell) return;
    onAgentUpdate?.(editingCell.rowId, editingCell.colId, draft.trim());
    setEditingCell(null);
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.id} className={styles.th}>
                {editingHeader === col.id ? (
                  <input
                    ref={inputRef}
                    className={styles.thInput}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => commitHeaderEdit(col.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitHeaderEdit(col.id);
                      if (e.key === 'Escape') setEditingHeader(null);
                    }}
                  />
                ) : (
                  <div className={styles.thInner}>
                    {col.label}
                    <span
                      className={`material-symbols-outlined ${styles.thEditIcon}`}
                      onClick={() => startHeaderEdit(col)}
                    >
                      edit
                    </span>
                  </div>
                )}
              </th>
            ))}
            <th className={styles.th} />
          </tr>
        </thead>

        <tbody>
          {agents.map((agent) => (
            <tr
              key={agent.id}
              className={styles.tr}
              onClick={() => !editingCell && onRowClick?.(agent)}
            >
              {columns.map((col) => {
                const isEditing = editingCell?.rowId === agent.id && editingCell?.colId === col.id;
                return (
                  <td
                    key={col.id}
                    className={`${styles.td} ${col.id === 'name' ? styles.nameCell : ''}`}
                    onDoubleClick={(e) => { e.stopPropagation(); startCellEdit(agent, col.id); }}
                  >
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        className={styles.cellInput}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={commitCellEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitCellEdit();
                          if (e.key === 'Escape') setEditingCell(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <CellValue colId={col.id} value={agent[col.id]} />
                    )}
                  </td>
                );
              })}

              <td className={`${styles.td} ${styles.tdActions}`}>
                <div
                  className={styles.menuWrap}
                  ref={(el) => { menuRefs.current[agent.id] = el; }}
                >
                  <button
                    className={styles.menuBtn}
                    title="More options"
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === agent.id ? null : agent.id); }}
                  >
                    <span className={`material-symbols-outlined ${styles.menuBtnIcon}`}>more_vert</span>
                  </button>

                  {openMenuId === agent.id && (
                    <div className={styles.menu}>
                      <button
                        className={styles.menuItem}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDuplicateAgent?.(agent.id); setOpenMenuId(null); }}
                      >
                        <span className="material-symbols-outlined">content_copy</span>
                        Duplicate
                      </button>
                      <button
                        className={styles.menuItem}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onMoveAgent?.(agent.id); setOpenMenuId(null); }}
                      >
                        <span className="material-symbols-outlined">drive_file_move</span>
                        Move to
                      </button>
                      <div className={styles.menuDivider} />
                      <button
                        className={`${styles.menuItem} ${styles.menuItemDanger}`}
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDeleteAgent?.(agent.id); setOpenMenuId(null); }}
                      >
                        <span className="material-symbols-outlined">delete</span>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
