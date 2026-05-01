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

export default function GroupTable({ tableData, onTableDataChange, onAgentRowClick }) {
  const [cols, setCols] = useState(() => tableData?.columns ?? DEFAULT_EDITABLE_COLS);
  const [rows, setRows] = useState(() => tableData?.rows ?? []);
  const [editingHeader, setEditingHeader] = useState(null);
  const [editingCell, setEditingCell] = useState(null); // { rowId, colId }
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);
  const initialized = useRef(!!(tableData?.columns));

  // Sync from Firestore once when real data arrives (before user has made edits)
  useEffect(() => {
    if (initialized.current) return;
    if (tableData?.columns) {
      setCols(tableData.columns);
      setRows(tableData.rows ?? []);
      initialized.current = true;
    }
  }, [tableData]); // eslint-disable-line

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

  /* ─── Status cycle ─── */
  function cycleStatus(rowId) {
    const row = rows.find((r) => r.id === rowId);
    if (!row) return;
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
                      {!isLocked && (
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
            <th className={`${styles.th} ${styles.deleteColHeader}`}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={styles.tr}>
              {/* Name */}
              <td
                className={`${styles.td} ${styles.nameCell}`}
                onClick={() => {
                  if (row.agentId) {
                    onAgentRowClick?.(row);
                  } else if (!(editingCell?.rowId === row.id && editingCell?.colId === 'name')) {
                    startCellEdit(row.id, 'name', row.name);
                  }
                }}
              >
                {editingCell?.rowId === row.id && editingCell?.colId === 'name' ? (
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
                  <span className={row.agentId ? styles.nameLink : styles.nameValue}>
                    {row.name || <span className={styles.emptyCell}>—</span>}
                  </span>
                )}
              </td>

              {/* Status */}
              <td
                className={`${styles.td} ${styles.statusCell}`}
                onClick={() => cycleStatus(row.id)}
              >
                <Chip
                  label={row.status || 'Draft'}
                  colorType={STATUS_COLOR[row.status] || 'grey'}
                  size="small"
                />
              </td>

              {/* Editable cols */}
              {cols.map((col) => {
                const isEditing = editingCell?.rowId === row.id && editingCell?.colId === col.id;
                return (
                  <td
                    key={col.id}
                    className={styles.td}
                    onClick={() => { if (!isEditing) startCellEdit(row.id, col.id, row[col.id]); }}
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
              <td className={`${styles.td} ${styles.deleteCell}`} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.deleteRowBtn}
                  title="Remove row"
                  onClick={() => deleteRow(row.id)}
                >
                  <span className={`material-symbols-outlined ${styles.deleteRowBtnIcon}`}>close</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.addRowBtn} onClick={addRow}>
        <span className="material-symbols-outlined">add</span>
        Add row
      </button>
    </div>
  );
}
