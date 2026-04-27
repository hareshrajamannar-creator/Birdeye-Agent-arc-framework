import React, { useState } from 'react';
import MetricCard from '../../Molecules/MetricCard/MetricCard';
import MetricCustomiserModal from '../Modals/MetricCustomiserModal/MetricCustomiserModal';

const PRIMARY_OPTIONS = {
  time: { title: 'Time saved' },
  cost: { title: 'Cost saved' },
};

export default function MetricsGroup({
  primaryValue,
  primaryType = 'time',
  primaryTrend,
  primaryTrendPositive = true,
  showTrend = false,
  metrics = [],
}) {
  const [type, setType] = useState(primaryType);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeValue, setTimeValue] = useState(5);
  const [wage, setWage] = useState(36);
  const [currency, setCurrency] = useState('USD');

  const handleSave = ({ mode, timeValue: tv, wage: w, currency: c }) => {
    setType(mode);
    setTimeValue(tv);
    setWage(w);
    setCurrency(c);
  };

  const additional = metrics.slice(0, 4);

  return (
    <>
      <div style={{ display: 'flex', gap: 12, width: '100%' }}>
        {additional.map((metric, i) => (
          <div key={i} style={{ flex: '1 0 0', minWidth: 0 }}>
            <MetricCard {...metric} />
          </div>
        ))}

        <div style={{ flex: '1 0 0', minWidth: 0 }}>
          <MetricCard
            value={primaryValue}
            title={PRIMARY_OPTIONS[type].title}
            showTrend={showTrend}
            trend={primaryTrend}
            trendPositive={primaryTrendPositive}
            showConfig
            onConfig={() => setModalOpen(true)}
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
