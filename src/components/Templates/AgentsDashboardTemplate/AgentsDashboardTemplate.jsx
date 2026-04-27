import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import Avatar from '@birdeye/elemental/core/atoms/Avatar/index.js';
import TabHeader from '@birdeye/elemental/core/atoms/TabHeader/index.js';
import PrimaryRailNav from '../../Organisms/Nav/PrimaryRailNav/PrimaryRailNav';
import SecondaryRailNav from '../../Organisms/Nav/SecondaryRailNav/SecondaryRailNav';
import MetricsGroup from '../../Organisms/MetricsGroup/MetricsGroup';
import AgentsTable from '../../Organisms/DataViews/AgentsTable/AgentsTable';
import TemplateLibrary from '../../Organisms/TemplateLibrary/TemplateLibrary';

const font = '"Roboto", sans-serif';

/* ─── Template ─── */

const DEFAULT_TABS = [
  { id: 'agents',  label: 'Agents' },
  { id: 'library', label: 'Library' },
];

const DEFAULT_METRICS = [
  { value: '835', title: 'Reviews responded',     showTrend: true, trend: '+1.3%', trendPositive: true },
  { value: '92%', title: 'Response rate',          showTrend: true, trend: '+1.3%', trendPositive: true },
  { value: '20m', title: 'Average response time',  showTrend: true, trend: '+1.3%', trendPositive: true },
];

export default function AgentsDashboardTemplate({
  pageTitle = 'Review response agents',
  tabs = DEFAULT_TABS,
  metrics = DEFAULT_METRICS,
  primaryMetricValue = '6h 20m',
  agents,
  onCreateAgent,
  onUseTemplate,
  avatarSrc,
  activeNavId = 'reviews',
  activeMenuItemId = 'review-response',
  navTitle = 'ReviewsAI',
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [currentNavId, setCurrentNavId] = useState(activeNavId);
  const [currentMenuItemId, setCurrentMenuItemId] = useState(activeMenuItemId);
  const [libraryView, setLibraryView] = useState('grid');

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: font, color: '#212121', overflow: 'hidden' }}>

      {/* Primary Rail Nav */}
      <PrimaryRailNav
        activeNavId={currentNavId}
        onNavChange={setCurrentNavId}
      />

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
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 18, fontWeight: 400, lineHeight: '26px', letterSpacing: '-0.36px', color: '#212121' }}>
            {pageTitle}
          </span>

          {activeTab === 'library' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button style={{ width: 36, height: 36, border: '1px solid #e5e9f0', borderRadius: 4, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>search</span>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 36, border: '1px solid #e5e9f0', borderRadius: 4, background: '#fff', padding: '0 8px' }}>
                <button
                  onClick={() => setLibraryView('grid')}
                  style={{ width: 24, height: 24, border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: libraryView === 'grid' ? '#e5e9f0' : '#fff' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#212121', lineHeight: 1 }}>grid_view</span>
                </button>
                <button
                  onClick={() => setLibraryView('table')}
                  style={{ width: 24, height: 24, border: 'none', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: libraryView === 'table' ? '#e5e9f0' : '#fff' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#212121', lineHeight: 1 }}>table_rows</span>
                </button>
              </div>
              <button style={{ width: 36, height: 36, border: '1px solid #e5e9f0', borderRadius: 4, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>filter_list</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button style={{ width: 28, height: 28, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>search</span>
              </button>
              <Button theme="primary" label="Create agent" onClick={onCreateAgent} />
              <button style={{ width: 36, height: 36, border: '1px solid #e5e9f0', borderRadius: 4, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#555', lineHeight: 1 }}>filter_list</span>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#fff', overflow: 'auto' }}>
          <div style={{ paddingLeft: 24 }}>
            <TabHeader
              content={tabs.map(t => ({ value: t.id, label: t.label }))}
              activeTab={activeTab}
              clickTab={setActiveTab}
            />
          </div>

          {activeTab === 'agents' && (
            <>
              <div style={{ padding: '20px 24px 0' }}>
                <MetricsGroup
                  primaryValue={primaryMetricValue}
                  primaryType="time"
                  showTrend
                  primaryTrend="+1.3%"
                  primaryTrendPositive
                  metrics={metrics}
                />
              </div>
              <div style={{ padding: '20px 24px 24px' }}>
                <AgentsTable agents={agents} />
              </div>
            </>
          )}

          {activeTab === 'library' && (
            <div style={{ padding: 24 }}>
              <TemplateLibrary variant={libraryView === 'table' ? 'list' : 'grid'} onUseTemplate={onUseTemplate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AgentsDashboardTemplate.propTypes = {
  pageTitle: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })),
  metrics: PropTypes.array,
  primaryMetricValue: PropTypes.string,
  agents: PropTypes.array,
  onCreateAgent: PropTypes.func,
  onUseTemplate: PropTypes.func,
  avatarSrc: PropTypes.string,
  activeNavId: PropTypes.string,
  activeMenuItemId: PropTypes.string,
  navTitle: PropTypes.string,
};
