import React, { useState } from 'react';
import MetricCard from '../../Molecules/MetricCard/MetricCard';
import MetricCustomiserModal from '../Modals/MetricCustomiserModal/MetricCustomiserModal';

const PRIMARY_OPTIONS = {
  time: { title: 'Time saved' },
  cost: { title: 'Cost saved' },
};

export default function MetricsGroup({
  primaryValue: initialPrimaryValue,
  primaryType = 'time',
  primaryTrend,
  primaryTrendPositive = true,
  showTrend = false,
  metrics: initialMetrics = [],
}) {
  const [type, setType] = useState(primaryType);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(5);
  const [wage, setWage] = useState(36);
  const [currency, setCurrency] = useState('USD');

  // Editable state for all metrics
  const [primaryValue, setPrimaryValue] = useState(initialPrimaryValue);
  const [primaryTitle, setPrimaryTitle] = useState(PRIMARY_OPTIONS[primaryType].title);
  const [metrics, setMetrics] = useState(initialMetrics);

  const handleSave = ({ mode, timeValue: tv, wage: w, currency: c }) => {
    setType(mode);
    setTimeValue(tv);
    setWage(w);
    setCurrency(c);
    setPrimaryTitle(PRIMARY_OPTIONS[mode]?.title || primaryTitle);
  };

  function updateMetricValue(index, newValue) {
    setMetrics((prev) => prev.map((m, i) => i === index ? { ...m, value: newValue } : m));
  }

  function updateMetricTitle(index, newTitle) {
    setMetrics((prev) => prev.map((m, i) => i === index ? { ...m, title: newTitle } : m));
  }

  const additional = metrics.slice(0, 4);

  return (
    <>
      <div style={{ display: 'flex', gap: 12, width: '100%' }}>
        {additional.map((metric, i) => (
          <div key={i} style={{ flex: '1 0 0', minWidth: 0 }}>
            <MetricCard
              {...metric}
              onValueChange={(v) => updateMetricValue(i, v)}
              onTitleChange={(t) => updateMetricTitle(i, t)}
            />
          </div>
        ))}

        <div style={{ flex: '1 0 0', minWidth: 0 }}>
          <MetricCard
            value={primaryValue}
            title={primaryTitle}
            showTrend={showTrend}
            trend={primaryTrend}
            trendPositive={primaryTrendPositive}
            showConfig
            onConfig={() => setModalOpen(true)}
            onValueChange={setPrimaryValue}
            onTitleChange={setPrimaryTitle}
          />
        </div>
      </div>

      <MetricCustomiserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        defaultMode={type}
        defaultTimeValue={timeValue}
        defaultWage={wage}
        defaultCurrency={currency}
      />
    </>
  );
}
