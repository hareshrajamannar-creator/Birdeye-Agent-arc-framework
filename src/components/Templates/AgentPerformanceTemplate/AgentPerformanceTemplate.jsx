import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@birdeye/elemental/core/atoms/Avatar/index.js';
import Chip from '@birdeye/elemental/core/atoms/Chip/index.js';
import PrimaryRailNav from '../../Organisms/Nav/PrimaryRailNav/PrimaryRailNav';
import SecondaryRailNav from '../../Organisms/Nav/SecondaryRailNav/SecondaryRailNav';
import MetricCard from '../../Molecules/MetricCard/MetricCard';
import PerformanceTable from '../../Organisms/DataViews/PerformanceTable/PerformanceTable';

const font = '"Roboto", sans-serif';

const STATUS_COLOR = { Running: 'green', Paused: 'yellow', Draft: 'grey' };

const DEFAULT_METRICS = [
  { value: '120',    title: 'Reviews responded',     showTrend: true, trend: '+1.3%', trendPositive: true },
  { value: '82%',    title: 'Response rate',          showTrend: true, trend: '+1.3%', trendPositive: true },
  { value: '20m',    title: 'Average response time',  showTrend: true, trend: '+1.3%', trendPositive: true },
  { value: '2h 20m', title: 'Time saved',             showTrend: true, trend: '+1.3%', trendPositive: true, showConfig: true },
];

export default function AgentPerformanceTemplate({
  agentName = 'Outcomes for Review response agent - East Region',
  agentStatus = 'Running',
  metrics = DEFAULT_METRICS,
  tableRows,
  onBack,
  onConfigMetric,
  avatarSrc,
  activeNavId = 'reviews',
  activeMenuItemId = 'review-response',
  navTitle = 'ReviewsAI',
}) {
  const [currentNavId, setCurrentNavId] = useState(activeNavId);
  const [currentMenuItemId, setCurrentMenuItemId] = useState(activeMenuItemId);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: font, color: '#212121', overflow: 'hidden' }}>

      {/* Primary Rail Nav */}
      <PrimaryRailNav activeNavId={currentNavId} onNavChange={setCurrentNavId} />

      {/* Secondary Rail Nav */}
      <SecondaryRailNav
        title={navTitle}
        activeItemId={currentMenuItemId}
        onItemClick={setCurrentMenuItemId}
      />

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#fff' }}>

        {/* Top Nav */}
        <div style={{
          height: 52,
          background: '#fff',
          borderBottom: '1px solid #e9e9eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 24px',
          gap: 4,
          flexShrink: 0,
        }}>
          <button style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#1976d2', fontVariationSettings: "'FILL' 1", lineHeight: 1 }}>add_circle</span>
          </button>
          <button style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#212121', lineHeight: 1 }}>help</span>
          </button>
          <button style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, padding: 2 }}>
            <Avatar alt="User" src={avatarSrc} size="extra-small" variant="circular" />
          </button>
          <button style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>menu</span>
          </button>
        </div>

        {/* Page Header */}
        <div style={{
          height: 64,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          gap: 8,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <button
              onClick={onBack}
              style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, flexShrink: 0 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#212121', lineHeight: 1 }}>arrow_left_alt</span>
            </button>
            <span style={{ fontSize: 18, fontWeight: 400, lineHeight: '26px', letterSpacing: '-0.36px', color: '#212121', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {agentName}
            </span>
            <Chip
              label={agentStatus}
              variant="tonal"
              colorType={STATUS_COLOR[agentStatus] || 'grey'}
              size="small"
            />
          </div>

          {/* Filter button */}
          <button style={{
            width: 36, height: 36,
            border: '1px solid #e5e9f0', borderRadius: 4,
            background: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>filter_list</span>
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#fff', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 20, padding: '0 24px 24px' }}>

          {/* Metrics row */}
          <div style={{ display: 'flex', gap: 16, paddingTop: 20 }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ flex: '0 0 310px', maxWidth: 310 }}>
                <MetricCard
                  value={m.value}
                  title={m.title}
                  showTrend={m.showTrend}
                  trend={m.trend}
                  trendPositive={m.trendPositive}
                  showConfig={m.showConfig}
                  onConfig={onConfigMetric}
                />
              </div>
            ))}
          </div>

          {/* Performance table */}
          <PerformanceTable rows={tableRows} />
        </div>
      </div>
    </div>
  );
}

AgentPerformanceTemplate.propTypes = {
  agentName: PropTypes.string,
  agentStatus: PropTypes.oneOf(['Running', 'Paused', 'Draft']),
  metrics: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    title: PropTypes.string,
    showTrend: PropTypes.bool,
    trend: PropTypes.string,
    trendPositive: PropTypes.bool,
    showConfig: PropTypes.bool,
  })),
  tableRows: PropTypes.array,
  onBack: PropTypes.func,
  onConfigMetric: PropTypes.func,
  avatarSrc: PropTypes.string,
  activeNavId: PropTypes.string,
  activeMenuItemId: PropTypes.string,
  navTitle: PropTypes.string,
};
