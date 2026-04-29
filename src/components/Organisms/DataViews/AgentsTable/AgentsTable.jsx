import React, { useState, useRef } from 'react';
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

export default function AgentsTable({ agents = [], onRowClick, onDeleteAgent, onAgentUpdate }) {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [editingHeader, setEditingHeader] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

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
                <button
                  className={styles.deleteBtn}
                  title="Delete agent"
                  onClick={(e) => { e.stopPropagation(); onDeleteAgent?.(agent.id); }}
                >
                  <span className={`material-symbols-outlined ${styles.deleteBtnIcon}`}>delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
