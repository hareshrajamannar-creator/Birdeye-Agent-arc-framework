import React, { useState, useRef, useEffect } from 'react';
import styles from './GroupMetrics.module.css';

const CARD_TYPES = [
  { type: 'metric', icon: 'bar_chart', label: 'Metric card' },
  { type: 'timesaved', icon: 'schedule', label: 'Time saved card' },
];

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function MetricCard({ card, onUpdate, onDelete }) {
  const [editingField, setEditingField] = useState(null);
  const [draft, setDraft] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [calcNoteOpen, setCalcNoteOpen] = useState(false);

  function startEdit(field) {
    setEditingField(field);
    setDraft(card[field] ?? '');
    setCalcNoteOpen(false);
  }

  function commit(field) {
    onUpdate({ ...card, [field]: draft });
    setEditingField(null);
  }

  function kd(e, field) {
    if (e.key === 'Enter') commit(field);
    if (e.key === 'Escape') setEditingField(null);
  }

  const isTimeSaved = card.type === 'timesaved';

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <span className={`material-symbols-outlined ${styles.typeIcon}`}>
          {isTimeSaved ? 'schedule' : 'bar_chart'}
        </span>
        <div className={styles.actions}>
          {isTimeSaved ? (
            <button
              className={styles.actionBtn}
              title="Calculation note"
              onClick={() => setCalcNoteOpen((p) => !p)}
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
          ) : (
            <div
              className={styles.infoContainer}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                className={styles.actionBtn}
                title="Edit tooltip"
                onClick={() => startEdit('tooltip')}
              >
                <span className="material-symbols-outlined">info</span>
              </button>
              {showTooltip && card.tooltip && (
                <div className={styles.tooltipBubble}>{card.tooltip}</div>
              )}
            </div>
          )}
          <button className={styles.deleteBtn} title="Remove metric" onClick={onDelete}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      {editingField === 'value' ? (
        <input
          autoFocus
          className={styles.valueInput}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit('value')}
          onKeyDown={(e) => kd(e, 'value')}
        />
      ) : (
        <span className={styles.value} onClick={() => startEdit('value')}>
          {card.value || <span className={styles.muted}>0</span>}
        </span>
      )}

      {editingField === 'label' ? (
        <input
          autoFocus
          className={styles.labelInput}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit('label')}
          onKeyDown={(e) => kd(e, 'label')}
        />
      ) : (
        <span className={styles.label} onClick={() => startEdit('label')}>
          {card.label || <span className={styles.muted}>Label</span>}
        </span>
      )}

      {editingField === 'tooltip' && (
        <input
          autoFocus
          className={styles.tooltipInput}
          placeholder="Tooltip text…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit('tooltip')}
          onKeyDown={(e) => kd(e, 'tooltip')}
        />
      )}

      {calcNoteOpen && (
        <div className={styles.calcNote}>
          <span className={styles.calcNoteLabel}>Calculation note</span>
          <textarea
            autoFocus
            className={styles.calcNoteArea}
            placeholder="How is this calculated?"
            value={card.calculationNote ?? ''}
            onChange={(e) => onUpdate({ ...card, calculationNote: e.target.value })}
            onBlur={() => setCalcNoteOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

export default function GroupMetrics({ metrics = [], onMetricsChange }) {
  const [items, setItems] = useState(metrics);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);
  const initialized = useRef(metrics.length > 0);

  useEffect(() => {
    if (initialized.current) return;
    if (metrics.length > 0) {
      setItems(metrics);
      initialized.current = true;
    }
  }, [metrics]); // eslint-disable-line

  useEffect(() => {
    if (!pickerOpen) return;
    function handler(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [pickerOpen]);

  function addCard(type) {
    const newCard = { id: uid(), type, value: '', label: '', tooltip: '', calculationNote: '' };
    const next = [...items, newCard];
    setItems(next);
    initialized.current = true;
    onMetricsChange(next);
    setPickerOpen(false);
  }

  function updateCard(id, updated) {
    const next = items.map((m) => (m.id === id ? updated : m));
    setItems(next);
    initialized.current = true;
    onMetricsChange(next);
  }

  function deleteCard(id) {
    const next = items.filter((m) => m.id !== id);
    setItems(next);
    initialized.current = true;
    onMetricsChange(next);
  }

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {items.map((card) => (
          <MetricCard
            key={card.id}
            card={card}
            onUpdate={(updated) => updateCard(card.id, updated)}
            onDelete={() => deleteCard(card.id)}
          />
        ))}
        <div className={styles.addWrap} ref={pickerRef}>
          <button className={styles.addBtn} onClick={() => setPickerOpen((p) => !p)}>
            <span className="material-symbols-outlined">add</span>
            Add metric
          </button>
          {pickerOpen && (
            <div className={styles.picker}>
              {CARD_TYPES.map(({ type, icon, label }) => (
                <button key={type} className={styles.pickerItem} onClick={() => addCard(type)}>
                  <span className={`material-symbols-outlined ${styles.pickerIcon}`}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
