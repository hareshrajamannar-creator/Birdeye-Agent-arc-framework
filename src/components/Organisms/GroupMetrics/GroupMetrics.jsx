import React, { useState, useRef, useEffect } from 'react';
import MetricCard from '../../Molecules/MetricCard/MetricCard';
import MetricCustomiserModal from '../Modals/MetricCustomiserModal/MetricCustomiserModal';
import styles from './GroupMetrics.module.css';

const CARD_TYPES = [
  { type: 'metric', icon: 'bar_chart', label: 'Metric card' },
  { type: 'timesaved', icon: 'schedule', label: 'Time saved card' },
];

const PRIMARY_LABELS = { time: 'Time saved', cost: 'Cost saved' };

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export default function GroupMetrics({ metrics = [], onMetricsChange }) {
  const [items, setItems] = useState(metrics);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [configCardId, setConfigCardId] = useState(null);
  const [newCardId, setNewCardId] = useState(null);
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
    const id = uid();
    const newCard = {
      id,
      type,
      value: '',
      label: type === 'timesaved' ? 'Time saved' : '',
      tooltip: '',
      metricConfig: type === 'timesaved'
        ? { mode: 'time', timeValue: 5, wage: 36, currency: 'USD' }
        : undefined,
    };
    push([...items, newCard]);
    setNewCardId(id);
    setPickerOpen(false);
  }

  function updateCard(id, patch) {
    push(items.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function deleteCard(id) {
    push(items.filter((m) => m.id !== id));
    if (newCardId === id) setNewCardId(null);
  }

  const configCard = items.find((m) => m.id === configCardId);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        {items.map((card) => (
          <div key={card.id} className={styles.cardWrap}>
            <MetricCard
              value={card.value}
              title={card.label}
              tooltipText={card.tooltip}
              onTooltipChange={(t) => updateCard(card.id, { tooltip: t })}
              showConfig={card.type === 'timesaved'}
              onConfig={() => setConfigCardId(card.id)}
              onValueChange={(v) => updateCard(card.id, { value: v })}
              onTitleChange={(t) => updateCard(card.id, { label: t })}
              autoEdit={card.id === newCardId}
            />
            <button
              className={styles.deleteBtn}
              title="Remove metric"
              onClick={() => deleteCard(card.id)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
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

      <MetricCustomiserModal
        isOpen={!!configCard}
        onClose={() => setConfigCardId(null)}
        onSave={({ mode, timeValue, wage, currency }) => {
          if (!configCard) return;
          updateCard(configCard.id, {
            label: PRIMARY_LABELS[mode] ?? configCard.label,
            metricConfig: { mode, timeValue, wage, currency },
          });
          setConfigCardId(null);
        }}
        defaultMode={configCard?.metricConfig?.mode ?? 'time'}
        defaultTimeValue={configCard?.metricConfig?.timeValue ?? 5}
        defaultWage={configCard?.metricConfig?.wage ?? 36}
        defaultCurrency={configCard?.metricConfig?.currency ?? 'USD'}
      />
    </div>
  );
}
