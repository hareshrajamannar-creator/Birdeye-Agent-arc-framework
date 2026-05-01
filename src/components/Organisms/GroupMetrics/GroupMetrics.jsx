import React, { useState, useRef, useEffect } from 'react';
import MetricCard from '../../Molecules/MetricCard/MetricCard';
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

export default function GroupMetrics({ metrics = [], onMetricsChange }) {
  const [items, setItems] = useState(metrics);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [calcNoteOpenId, setCalcNoteOpenId] = useState(null);
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

  function push(next) {
    setItems(next);
    initialized.current = true;
    onMetricsChange(next);
  }

  function addCard(type) {
    const newCard = { id: uid(), type, value: '', label: '', calculationNote: '' };
    push([...items, newCard]);
    setPickerOpen(false);
  }

  function updateCard(id, patch) {
    push(items.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function deleteCard(id) {
    push(items.filter((m) => m.id !== id));
    if (calcNoteOpenId === id) setCalcNoteOpenId(null);
  }

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {items.map((card) => (
          <div key={card.id} className={styles.cardWrap}>
            <MetricCard
              value={card.value}
              title={card.label}
              showConfig={card.type === 'timesaved'}
              onConfig={() => setCalcNoteOpenId(calcNoteOpenId === card.id ? null : card.id)}
              onValueChange={(v) => updateCard(card.id, { value: v })}
              onTitleChange={(t) => updateCard(card.id, { label: t })}
            />
            <button
              className={styles.deleteBtn}
              title="Remove metric"
              onClick={() => deleteCard(card.id)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            {calcNoteOpenId === card.id && (
              <div className={styles.calcNotePanel}>
                <span className={styles.calcNoteLabel}>Calculation note</span>
                <textarea
                  autoFocus
                  className={styles.calcNoteArea}
                  placeholder="How is this calculated?"
                  value={card.calculationNote ?? ''}
                  onChange={(e) => updateCard(card.id, { calculationNote: e.target.value })}
                />
              </div>
            )}
          </div>
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
