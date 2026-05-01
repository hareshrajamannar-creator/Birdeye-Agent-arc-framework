import React, { useState, useRef, useEffect } from 'react';
import Chip from '@birdeye/elemental/core/atoms/Chip/index.js';
import styles from './GroupTable.module.css';

const LOCKED_COLS = [
  { id: 'name', label: 'Agent name' },
  { id: 'status', label: 'Status' },
];

const DEFAULT_EDITABLE_COLS = [
  { id: 'col1', label: 'Column 1' },
  { id: 'col2', label: 'Column 2' },
  { id: 'col3', label: 'Column 3' },
  { id: 'col4', label: 'Column 4' },
  { id: 'col5', label: 'Column 5' },
];

const STATUS_CYCLE = ['Running', 'Paused', 'Draft'];
const STATUS_COLOR = { Running: 'green', Paused: 'yellow', Draft: 'grey' };

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

const LOCKED_IDS = new Set(LOCKED_COLS.map((c) => c.id));

export default function GroupTable({ tableData, onTableDataChange, onAgentRowClick, agents = [], viewOnly = false }) {
  const [cols, setCols] = useState(() => tableData?.columns ?? DEFAULT_EDITABLE_COLS);
  const [rows, setRows] = useState(() => tableData?.rows ?? []);
  const [editingHeader, setEditingHeader] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);
  const initialized = useRef(!!(tableData?.columns));
  // Tracks whether orphaned section agents have been merged into rows this mount
  const agentsMergedRef = useRef(false);

  // Sync stored rows from Firestore once (before user edits)
  useEffect(() => {
    if (initialized.current) return;
    if (tableData?.columns) {
      setCols(tableData.columns);
      setRows(tableData.rows ?? []);
      initialized.current = true;
    }
  }, [tableData]); // eslint-disable-line

  // One-time per mount: add any section agents that have no row yet
  useEffect(() => {
    if (agentsMergedRef.current || agents.length === 0) return;
    agentsMergedRef.current = true;
    setRows((prev) => {
      const linkedAgentIds = new Set(prev.filter((r) => r.agentId).map((r) => r.agentId));
      const orphaned = agents
        .filter((a) => !linkedAgentIds.has(a.id))
        .map((a) => ({
          id: a.id,
          agentId: a.id,
          name: a.name || 'Untitled agent',
          status: a.status || 'Draft',
          col1: '', col2: '', col3: '', col4: '', col5: '',
        }));
      return orphaned.length > 0 ? [...prev, ...orphaned] : prev;
    });
  }, [agents]); // eslint-disable-line

  function emit(newCols, newRows) {
    initialized.current = true;
    onTableDataChange?.({ columns: newCols, rows: newRows });
  }

  function focusInput() {
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  /* ─── Header ─── */
  function startHeaderEdit(colId, label) {
    setEditingHeader(colId);
    setEditingCell(null);
    setDraft(label);
    focusInput();
  }

  function commitHeader() {
    const updated = cols.map((c) =>
      c.id === editingHeader ? { ...c, label: draft.trim() || c.label } : c
    );
    setCols(updated);
    setEditingHeader(null);
    emit(updated, rows);
  }

  /* ─── Cell ─── */
  function startCellEdit(rowId, colId, value) {
    setEditingCell({ rowId, colId });
    setEditingHeader(null);
    setDraft(String(value ?? ''));
    focusInput();
  }

  function commitCell(overrideVal) {
    if (!editingCell) return;
    const val = overrideVal !== undefined ? overrideVal : draft;
    const updated = rows.map((r) =>
      r.id === editingCell.rowId ? { ...r, [editingCell.colId]: val } : r
    );
    setRows(updated);
    setEditingCell(null);
    emit(cols, updated);
  }

  function getTabOrder(row) {
    const order = [];
    if (!row.agentId) order.push('name');
    cols.forEach((c) => order.push(c.id));
    return order;
  }

  function handleCellKeyDown(e) {
    if (e.key === 'Escape') { setEditingCell(null); return; }
    if (e.key === 'Enter') { commitCell(); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!editingCell) return;
      const { rowId, colId } = editingCell;
      const val = draft;
      const updatedRows = rows.map((r) =>
        r.id === rowId ? { ...r, [colId]: val } : r
      );
      setRows(updatedRows);
      emit(cols, updatedRows);
      const row = updatedRows.find((r) => r.id === rowId);
      const order = getTabOrder(row);
      const idx = order.indexOf(colId);
      if (idx >= 0 && idx < order.length - 1) {
        const nextCol = order[idx + 1];
        setEditingCell({ rowId, colId: nextCol });
        setDraft(String(row?.[nextCol] ?? ''));
        focusInput();
      } else {
        setEditingCell(null);
      }
    }
  }

  /* ─── Status cycle — only for manual (unlinked) rows ─── */
  function cycleStatus(rowId) {
    const row = rows.find((r) => r.id === rowId);
    // Linked rows get their status from the actual agent doc — don't cycle them
    if (!row || row.agentId) return;
    const idx = STATUS_CYCLE.indexOf(row.status ?? 'Draft');
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    const updated = rows.map((r) => r.id === rowId ? { ...r, status: next } : r);
    setRows(updated);
    emit(cols, updated);
  }

  /* ─── Delete row ─── */
  function deleteRow(rowId) {
    const updated = rows.filter((r) => r.id !== rowId);
    setRows(updated);
    emit(cols, updated);
  }

  /* ─── Add row ─── */
  function addRow() {
    const newRow = {
      id: uid(), name: '', status: 'Draft',
      col1: '', col2: '', col3: '', col4: '', col5: '',
    };
    const updated = [...rows, newRow];
    setRows(updated);
    emit(cols, updated);
    setTimeout(() => startCellEdit(newRow.id, 'col1', ''), 0);
  }

  const allCols = [...LOCKED_COLS, ...cols];

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {allCols.map((col) => {
              const isLocked = LOCKED_IDS.has(col.id);
              return (
                <th key={col.id} className={`${styles.th} ${isLocked ? styles.thLocked : ''}`}>
                  {!isLocked && editingHeader === col.id ? (
                    <input
                      ref={inputRef}
                      className={styles.thInput}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={commitHeader}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitHeader();
                        if (e.key === 'Escape') setEditingHeader(null);
                      }}
                    />
                  ) : (
                    <div className={styles.thInner}>
                      <span>{col.label}</span>
                      {!isLocked && !viewOnly && (
                        <span
                          className={`material-symbols-outlined ${styles.thEditIcon}`}
                          onClick={() => startHeaderEdit(col.id, col.label)}
                        >
                          edit
                        </span>
                      )}
                    </div>
                  )}
                </th>
              );
            })}
            {!viewOnly && <th className={`${styles.th} ${styles.deleteColHeader}`}></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            // For linked rows, status always reflects the live agent doc
            const liveAgent = row.agentId ? agents.find((a) => a.id === row.agentId) : null;
            const displayStatus = liveAgent ? (liveAgent.status || 'Draft') : (row.status || 'Draft');

            return (
              <tr key={row.id} className={styles.tr}>
                {/* Name */}
                <td
                  className={`${styles.td} ${styles.nameCell}`}
                  onClick={() => {
                    if (viewOnly) {
                      if (row.agentId || row.name?.trim()) onAgentRowClick?.(row);
                      return;
                    }
                    if (editingCell?.rowId === row.id && editingCell?.colId === 'name') return;
                    if (row.agentId || row.name?.trim()) {
                      onAgentRowClick?.(row);
                    } else {
                      startCellEdit(row.id, 'name', row.name);
                    }
                  }}
                >
                  {!viewOnly && editingCell?.rowId === row.id && editingCell?.colId === 'name' ? (
                    <input
                      ref={inputRef}
                      className={styles.cellInput}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onBlur={() => commitCell()}
                      onKeyDown={handleCellKeyDown}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className={(row.agentId || row.name?.trim()) ? styles.nameLink : styles.nameValue}>
                      {liveAgent?.name || row.name || <span className={styles.emptyCell}>—</span>}
                    </span>
                  )}
                </td>

                {/* Status — live for linked rows, cycleable for manual rows */}
                <td
                  className={`${styles.td} ${styles.statusCell}`}
                  onClick={!viewOnly ? () => cycleStatus(row.id) : undefined}
                  style={(viewOnly || row.agentId) ? { cursor: 'default' } : undefined}
                >
                  <Chip
                    label={displayStatus}
                    colorType={STATUS_COLOR[displayStatus] || 'grey'}
                    size="small"
                  />
                </td>

                {/* Editable cols */}
                {cols.map((col) => {
                  const isEditing = !viewOnly && editingCell?.rowId === row.id && editingCell?.colId === col.id;
                  return (
                    <td
                      key={col.id}
                      className={styles.td}
                      onClick={!viewOnly ? () => { if (!isEditing) startCellEdit(row.id, col.id, row[col.id]); } : undefined}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          className={styles.cellInput}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={() => commitCell()}
                          onKeyDown={handleCellKeyDown}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className={styles.cellValue}>
                          {row[col.id] || <span className={styles.emptyCell}>—</span>}
                        </span>
                      )}
                    </td>
                  );
                })}

                {/* Delete row */}
                {!viewOnly && (
                  <td className={`${styles.td} ${styles.deleteCell}`} onClick={(e) => e.stopPropagation()}>
                    <button
                      className={styles.deleteRowBtn}
                      title="Remove row"
                      onClick={() => deleteRow(row.id)}
                    >
                      <span className={`material-symbols-outlined ${styles.deleteRowBtnIcon}`}>close</span>
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {!viewOnly && (
        <button className={styles.addRowBtn} onClick={addRow}>
          <span className="material-symbols-outlined">add</span>
          Add row
        </button>
      )}
    </div>
  );
}
