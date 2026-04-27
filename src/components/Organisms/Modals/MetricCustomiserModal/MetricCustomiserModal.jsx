import React, { useState, useEffect } from 'react';
import './MetricCustomiserModal.css';

export default function MetricCustomiserModal({
  isOpen,
  onClose,
  onSave,
  defaultMode = 'time',
  defaultTimeValue = 5,
  defaultWage = 36,
  defaultCurrency = 'USD',
}) {
  const [mode, setMode] = useState(defaultMode);
  const [timeValue, setTimeValue] = useState(defaultTimeValue);
  const [wage, setWage] = useState(defaultWage);
  const [currency, setCurrency] = useState(defaultCurrency);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setTimeValue(defaultTimeValue);
      setWage(defaultWage);
      setCurrency(defaultCurrency);
    }
  }, [isOpen, defaultMode, defaultTimeValue, defaultWage, defaultCurrency]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSave = () => {
    onSave?.({ mode, timeValue: Number(timeValue), wage: Number(wage), currency });
    onClose();
  };

  return (
    <div className="metric-customiser-modal__overlay" onClick={handleOverlayClick}>
      <div className="metric-customiser-modal__dialog">
        <div className="metric-customiser-modal__header">
          <div className="metric-customiser-modal__titles">
            <p className="metric-customiser-modal__title">Estimate savings</p>
            <p className="metric-customiser-modal__subtitle">
              Define how savings are calculated for your agents
            </p>
          </div>
          <button className="metric-customiser-modal__close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="metric-customiser-modal__body">
          <div className="metric-customiser-modal__radios">
            <label className="metric-customiser-modal__radio-label">
              <input
                type="radio"
                name="metric-mode"
                value="time"
                checked={mode === 'time'}
                onChange={() => setMode('time')}
              />
              Time saved
            </label>
            <label className="metric-customiser-modal__radio-label">
              <input
                type="radio"
                name="metric-mode"
                value="cost"
                checked={mode === 'cost'}
                onChange={() => setMode('cost')}
              />
              Cost saved
            </label>
          </div>

          <div className="metric-customiser-modal__row">
            <p className="metric-customiser-modal__row-label">Time saved per listing optimization</p>
            <div className="metric-customiser-modal__input-group">
              <input
                className="metric-customiser-modal__input"
                type="number"
                value={timeValue}
                min={0}
                onChange={(e) => setTimeValue(e.target.value)}
              />
              <span className="metric-customiser-modal__unit">Mins</span>
            </div>
          </div>

          {mode === 'cost' && (
            <div className="metric-customiser-modal__row metric-customiser-modal__row--top">
              <div className="metric-customiser-modal__row-content">
                <p className="metric-customiser-modal__row-label">Average hourly wage</p>
                <p className="metric-customiser-modal__row-sublabel">
                  Based on Glassdoor data of average salary of [Role] in US
                </p>
              </div>
              <div className="metric-customiser-modal__wage-inputs">
                <div className="metric-customiser-modal__currency-select">
                  <select
                    className="metric-customiser-modal__select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="USD">USD</option>
                  </select>
                  <span className="material-symbols-outlined metric-customiser-modal__chevron">expand_more</span>
                </div>
                <div className="metric-customiser-modal__input-group metric-customiser-modal__input-group--wage">
                  <input
                    className="metric-customiser-modal__input metric-customiser-modal__input--right"
                    type="number"
                    value={wage}
                    min={0}
                    onChange={(e) => setWage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="metric-customiser-modal__footer">
          <button className="metric-customiser-modal__cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="metric-customiser-modal__save" onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
