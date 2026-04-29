import React, { useState, useRef } from 'react';
import './LHSEntityGroup.css';

export default function LHSEntityGroup({ title, items = [], nodeType, parentLabel, onItemsChange }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState('');
  const addGuardRef = useRef(false);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/reactflow-type', nodeType);
    e.dataTransfer.setData('application/reactflow-label', parentLabel);
    e.dataTransfer.setData('application/reactflow-description', item);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const startEdit = (idx) => {
    setEditingIdx(idx);
    setEditDraft(items[idx]);
  };

  const commitEdit = (idx) => {
    const trimmed = editDraft.trim();
    if (trimmed) {
      const next = items.map((it, i) => (i === idx ? trimmed : it));
      onItemsChange?.(next);
    }
    setEditingIdx(null);
  };

  const deleteItem = (idx) => {
    onItemsChange?.(items.filter((_, i) => i !== idx));
    setEditingIdx(null);
  };

  const commitAdd = () => {
    if (addGuardRef.current) return;
    addGuardRef.current = true;
    const trimmed = newDraft.trim();
    if (trimmed) {
      onItemsChange?.([...items, trimmed]);
    }
    setAddingNew(false);
    setNewDraft('');
  };

  const cancelAdd = () => {
    addGuardRef.current = true;
    setAddingNew(false);
    setNewDraft('');
  };

  return (
    <div className="lhs-entity-group">
      <p className="lhs-entity-group__title">{title}</p>

      <div className="lhs-entity-group__items">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`lhs-entity-group__item${editingIdx === idx ? ' lhs-entity-group__item--editing' : ''}`}
            draggable={editingIdx !== idx}
            onDragStart={(e) => editingIdx !== idx && handleDragStart(e, item)}
          >
            {editingIdx === idx ? (
              <input
                className="lhs-entity-group__item-input"
                value={editDraft}
                autoFocus
                onChange={(e) => setEditDraft(e.target.value)}
                onBlur={() => commitEdit(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitEdit(idx); }
                  if (e.key === 'Escape') { e.preventDefault(); setEditingIdx(null); }
                }}
              />
            ) : (
              <span className="lhs-entity-group__item-label">{item}</span>
            )}

            <div className="lhs-entity-group__item-actions">
              {editingIdx === idx ? (
                <button
                  className="lhs-entity-group__item-btn lhs-entity-group__item-btn--delete"
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => deleteItem(idx)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              ) : (
                <>
                  <button
                    className="lhs-entity-group__item-btn lhs-entity-group__item-btn--edit"
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => { e.stopPropagation(); startEdit(idx); }}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <span className="lhs-entity-group__item-drag material-symbols-outlined">
                    drag_indicator
                  </span>
                </>
              )}
            </div>
          </div>
        ))}

        {addingNew && (
          <div className="lhs-entity-group__item lhs-entity-group__item--editing">
            <input
              className="lhs-entity-group__item-input"
              value={newDraft}
              autoFocus
              placeholder="Item name…"
              onChange={(e) => setNewDraft(e.target.value)}
              onBlur={commitAdd}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); commitAdd(); }
                if (e.key === 'Escape') { e.preventDefault(); cancelAdd(); }
              }}
            />
          </div>
        )}
      </div>

      {onItemsChange && (
        <button
          className="lhs-entity-group__add-btn"
          type="button"
          onClick={() => { addGuardRef.current = false; setAddingNew(true); setNewDraft(''); }}
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add
        </button>
      )}
    </div>
  );
}
