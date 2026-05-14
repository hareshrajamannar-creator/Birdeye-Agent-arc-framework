import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import Avatar from '@birdeye/elemental/core/atoms/Avatar/index.js';
import TabHeader from '@birdeye/elemental/core/atoms/TabHeader/index.js';
import PrimaryRailNav from '../../Organisms/Nav/PrimaryRailNav/PrimaryRailNav';
import AgentL2Nav from '../../Organisms/Nav/AgentL2Nav/AgentL2Nav';
import MetricsGroup from '../../Organisms/MetricsGroup/MetricsGroup';
import AgentsTable from '../../Organisms/DataViews/AgentsTable/AgentsTable';
import GroupMetrics from '../../Organisms/GroupMetrics/GroupMetrics';
import GroupTable from '../../Organisms/GroupTable/GroupTable';
import TemplateLibrary from '../../Organisms/TemplateLibrary/TemplateLibrary';
import EmptyStates from '../../Patterns/EmptyStates/EmptyStates';
import ShareModal from '../../Organisms/Modals/ShareModal/ShareModal';
import { getAgentsByModuleSlug, getCustomToolsByIds } from '../../../services/agentService';
import styles from './AgentsDashboardTemplate.module.css';

const font = '"Roboto", sans-serif';

/* ─── Empty state copy per agent section ─── */

const EMPTY_STATE_COPY = {
  // Social AI
  'Social publishing agents': {
    title: 'Create your first social publishing agent',
    description: 'Automatically create and publish social posts to keep your audience engaged',
  },
  'Social engagement agents': {
    title: 'Create your first social engagement agent',
    description: 'Automatically engage and respond to your audience across social platforms',
  },
  // Reviews AI
  'Review response agents': {
    title: 'Create your first review response agent',
    description: 'Automatically respond to customer reviews and protect your reputation',
  },
  'Review generation agents': {
    title: 'Create your first review generation agent',
    description: 'Automatically request reviews from customers at the perfect moment',
  },
  'Negative review escalation agents': {
    title: 'Create your first escalation agent',
    description: 'Automatically flag and escalate negative reviews before they affect your business',
  },
  // Inbox AI
  'Conversation intent routing agents': {
    title: 'Create your first routing agent',
    description: 'Automatically route conversations to the right team based on intent',
  },
  'Inbox reply assistant agents': {
    title: 'Create your first reply assistant agent',
    description: 'Automatically suggest and send replies to inbox messages',
  },
  // Listings AI
  'Listings scan agents': {
    title: 'Create your first listings scan agent',
    description: 'Automatically scan and fix listing inaccuracies across directories',
  },
  'Holiday hours agents': {
    title: 'Create your first holiday hours agent',
    description: 'Automatically update your business hours for holidays and special events',
  },
  // Overview
  'Business summary agents': {
    title: 'Create your first business summary agent',
    description: 'Automatically generate business performance summaries',
  },
  'Risk detection agents': {
    title: 'Create your first risk detection agent',
    description: 'Automatically detect and alert on business risks before they escalate',
  },
  // Referrals AI
  'Referral request agents': {
    title: 'Create your first referral request agent',
    description: 'Automatically request referrals from satisfied customers',
  },
  'Referral follow-up agents': {
    title: 'Create your first referral follow-up agent',
    description: 'Automatically follow up on referral leads to drive conversions',
  },
  // Payments AI
  'Payment reminder agents': {
    title: 'Create your first payment reminder agent',
    description: 'Automatically send payment reminders to reduce late and missed payments',
  },
  'Failed payment recovery agents': {
    title: 'Create your first recovery agent',
    description: 'Automatically recover failed payments and reduce customer churn',
  },
  // Appointments AI
  'Appointment reminder agents': {
    title: 'Create your first reminder agent',
    description: 'Automatically remind customers of upcoming appointments to reduce no-shows',
  },
  'No-show recovery agents': {
    title: 'Create your first no-show recovery agent',
    description: 'Automatically re-engage customers who missed their appointments',
  },
  // Surveys AI
  'Survey follow-up agents': {
    title: 'Create your first survey follow-up agent',
    description: 'Automatically follow up with survey respondents based on their answers',
  },
  'Survey insights agents': {
    title: 'Create your first insights agent',
    description: 'Automatically surface key insights and patterns from survey responses',
  },
  // Ticketing AI
  'Ticket priority agents': {
    title: 'Create your first ticket priority agent',
    description: 'Automatically prioritize tickets based on urgency and customer value',
  },
  'SLA rescue agents': {
    title: 'Create your first SLA rescue agent',
    description: 'Automatically alert and escalate tickets at risk of missing SLAs',
  },
  // Contacts AI
  'Contact enrichment agents': {
    title: 'Create your first enrichment agent',
    description: 'Automatically enrich contact data to keep your CRM accurate and complete',
  },
  'Duplicate merge agents': {
    title: 'Create your first duplicate merge agent',
    description: 'Automatically identify and merge duplicate contact records',
  },
  // Campaigns AI
  'Campaign QA agents': {
    title: 'Create your first QA agent',
    description: 'Automatically review campaigns for errors before they go live',
  },
  'Campaign optimizer agents': {
    title: 'Create your first optimizer agent',
    description: 'Automatically optimize campaigns based on performance signals',
  },
  // Reports
  'Report digest agents': {
    title: 'Create your first report digest agent',
    description: 'Automatically generate and deliver regular performance reports',
  },
  'Anomaly insight agents': {
    title: 'Create your first anomaly agent',
    description: 'Automatically detect and surface anomalies in your data',
  },
  // Insights
  'Insight summary agents': {
    title: 'Create your first insight agent',
    description: 'Automatically summarize key insights from across your business',
  },
  'Trend detection agents': {
    title: 'Create your first trend detection agent',
    description: 'Automatically identify and surface emerging trends in your data',
  },
  // Search AI
  'FAQ generation agents': {
    title: 'Create your first FAQ generation agent',
    description: 'Automatically generate and update FAQs from your business content and customer questions',
  },
  // Competitors AI
  'Competitor monitoring agents': {
    title: 'Create your first monitoring agent',
    description: 'Automatically track competitor changes and surface key insights',
  },
  'Benchmark summary agents': {
    title: 'Create your first benchmark agent',
    description: 'Automatically compare your performance against competitors',
  },
};

const DEFAULT_EMPTY = {
  title: 'Create your first agent',
  description: 'Automate repetitive tasks and let AI handle the work for you',
};

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

const DEFAULT_GROUP_TABLE_COLUMNS = [
  { id: 'col1', label: 'Column 1' },
  { id: 'col2', label: 'Column 2' },
  { id: 'col3', label: 'Column 3' },
  { id: 'col4', label: 'Column 4' },
  { id: 'col5', label: 'Column 5' },
];

const CLAUDE_IMPORT_INSTRUCTIONS = 'This file is an exported Birdeye Agent Arc agent group. To import it into a new project: (1) Read this file fully. (2) Create a new agent group entry in the L2 nav using the agentGroup.agentName and agentGroup.moduleSlug. (3) Restore metrics from agentGroup.metrics and table structure from agentGroup.table. (4) For each entry in the agents array, create a new agent document in Firestore using the agentName, nodeList, and nodeDetails provided. Link it to the agent group by moduleSlug. (5) For each entry in customTools, save it to the customTools Firestore collection using saveCustomTool. (6) All agent URLs should follow the pattern /{moduleSlug}/agents/{agentSlug}.';

function collectToolIds(value, toolIds = new Set(), key = '') {
  if (!value) return toolIds;
  if (Array.isArray(value)) {
    if (key === 'selectedTools' || key === 'toolIds') {
      value.forEach((item) => {
        if (typeof item === 'string') toolIds.add(item);
      });
    }
    value.forEach((item) => collectToolIds(item, toolIds));
    return toolIds;
  }
  if (typeof value !== 'object') return toolIds;
  Object.entries(value).forEach(([entryKey, entryValue]) => {
    if (entryKey === 'toolId' && typeof entryValue === 'string') {
      toolIds.add(entryValue);
      return;
    }
    collectToolIds(entryValue, toolIds, entryKey);
  });
  return toolIds;
}

function formatExportDate(date) {
  return date.toISOString().slice(0, 10);
}

function toExportFileSlug(value) {
  return (value || 'agent-group')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'agent-group';
}

export default function AgentsDashboardTemplate({
  pageTitle = 'Review response agents',
  tabs = DEFAULT_TABS,
  metrics = DEFAULT_METRICS,
  primaryMetricValue = '6h 20m',
  agents,
  templates,
  initialActiveTab = tabs[0]?.id,
  onCreateAgent,
  onCreateTemplate,
  onDeleteTemplate,
  onSaveTemplate,
  onUseTemplate,
  onShareTemplate,
  onDuplicateTemplate,
  onMoveTemplate,
  onOpenAgent,
  onDeleteAgent,
  onDuplicateAgent,
  onMoveAgent,
  onAgentUpdate,
  avatarSrc,
  activeNavId = 'reviews',
  activeMenuItemId = 'review-response-agents',
  navTitle = 'ReviewsAI',
  ctaLabel = 'Send a review request',
  menuItems,
  navItems,
  onNavChange,
  onMenuItemClick,
  onGroupCreate,
  onGroupDelete,
  onChildrenReorder,
  isGroupPage = false,
  groupDoc,
  onGroupUpdate,
  onCreateAgentFromRow,
  onExportError,
  viewOnly = false,
}) {
  const [activeTab, setActiveTab] = useState(initialActiveTab || tabs[0]?.id);
  const [libraryView, setLibraryView] = useState('grid');

  // Lifted metrics state — survives tab switches
  const [savedMetrics, setSavedMetrics] = useState(metrics);
  const [savedPrimaryValue, setSavedPrimaryValue] = useState(primaryMetricValue);

  // Share menu + modal state
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const shareMenuRef = useRef(null);

  const agentList = agents ?? [];
  const isEmpty = agentList.length === 0;
  const emptyCopy = EMPTY_STATE_COPY[pageTitle] ?? DEFAULT_EMPTY;

  const shareUrl = `${window.location.origin}/view/${activeNavId}/${activeMenuItemId}`;

  useEffect(() => {
    setActiveTab(initialActiveTab || tabs[0]?.id);
  }, [initialActiveTab, tabs]);

  // Close share menu on outside click
  useEffect(() => {
    if (!shareMenuOpen) return;
    function handleOutside(e) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) {
        setShareMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [shareMenuOpen]);

  const shareModal = shareModalOpen
    ? <ShareModal shareUrl={shareUrl} onClose={() => setShareModalOpen(false)} />
    : null;

  async function handleExportAgentGroup() {
    if (isExporting) return;
    const moduleSlug = groupDoc?.moduleSlug || groupDoc?.moduleContext || activeNavId;
    const agentSlug = groupDoc?.agentSlug || activeMenuItemId;
    const agentName = groupDoc?.name || pageTitle;
    const table = {
      columns: groupDoc?.table?.columns ?? DEFAULT_GROUP_TABLE_COLUMNS,
      rows: groupDoc?.table?.rows ?? [],
    };

    setIsExporting(true);
    try {
      const moduleAgentDocs = await getAgentsByModuleSlug(moduleSlug);
      const tableAgentIds = new Set(table.rows.map((row) => row.agentId).filter(Boolean));
      const groupAgents = moduleAgentDocs.filter((agent) => {
        if (agent.isAgentGroup || agent.isSectionConfig) return false;
        return agent.sectionContext === agentSlug || tableAgentIds.has(agent.id);
      });
      const toolIds = [...collectToolIds(groupAgents.map((agent) => agent.nodeDetails ?? {}))];
      const customTools = await getCustomToolsByIds(toolIds);
      const now = new Date();
      const exportData = {
        exportVersion: '1.0',
        exportedAt: now.toISOString(),
        claudeImportInstructions: CLAUDE_IMPORT_INSTRUCTIONS,
        agentGroup: {
          agentName,
          moduleSlug,
          agentSlug,
          metrics: groupDoc?.metrics ?? [],
          table,
        },
        agents: groupAgents.map((agent) => ({
          ...agent,
          agentId: agent.id,
          agentName: agent.name || '',
          agentSlug: agent.agentSlug || '',
          nodeList: agent.nodes ?? agent.nodeList ?? [],
          nodeDetails: agent.nodeDetails ?? {},
        })),
        customTools,
      };
      const filename = `${toExportFileSlug(agentSlug)}-export-${formatExportDate(now)}.json`;
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setShareMenuOpen(false);
    } catch (error) {
      console.error('Agent group export failed', error);
      onExportError?.();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: font, color: '#212121', overflow: 'hidden' }}>

      {/* Primary Rail Nav — locked in view-only mode */}
      <div className={viewOnly ? styles.l1NavLocked : undefined}>
        <PrimaryRailNav
          {...(navItems ? { navItems } : {})}
          activeNavId={activeNavId}
          onNavChange={onNavChange}
        />
      </div>

      {/* Secondary Rail Nav */}
      <AgentL2Nav
        title={navTitle}
        ctaLabel={ctaLabel}
        menuItems={menuItems}
        activeItemId={activeMenuItemId}
        onItemClick={onMenuItemClick}
        onCtaClick={onCreateAgent}
        onGroupCreate={onGroupCreate}
        onGroupDelete={onGroupDelete}
        onChildrenReorder={onChildrenReorder}
        viewOnly={viewOnly}
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

              {/* Three-dot share menu — only on group pages in non-viewOnly mode */}
              {isGroupPage && !viewOnly && (
                <div className={styles.shareMenuWrap} ref={shareMenuRef}>
                  <button
                    className={styles.shareMenuBtn}
                    onClick={() => setShareMenuOpen((v) => !v)}
                    title="More options"
                  >
                    <span className={`material-symbols-outlined ${styles.shareMenuBtnIcon}`}>more_vert</span>
                  </button>
                  {shareMenuOpen && (
                    <div className={styles.shareMenu}>
                      <button
                        className={styles.shareMenuItem}
                        onClick={() => { setShareMenuOpen(false); setShareModalOpen(true); }}
                      >
                        <span className={`material-symbols-outlined ${styles.shareMenuItemIcon}`}>share</span>
                        Share
                      </button>
                      <button
                        className={styles.shareMenuItem}
                        onClick={handleExportAgentGroup}
                        disabled={isExporting}
                      >
                        <span className={`material-symbols-outlined ${styles.shareMenuItemIcon}`}>download</span>
                        {isExporting ? 'Exporting...' : 'Export agent'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, background: '#fff', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ paddingLeft: 24, flexShrink: 0 }}>
            <TabHeader
              content={tabs.map(t => ({ value: t.id, label: t.label }))}
              activeTab={activeTab}
              clickTab={setActiveTab}
            />
          </div>

          {activeTab === 'agents' && (
            isGroupPage ? (
              <>
                <GroupMetrics
                  key={activeMenuItemId + '-metrics'}
                  metrics={groupDoc?.metrics ?? []}
                  onMetricsChange={(m) => onGroupUpdate?.('metrics', m)}
                  viewOnly={viewOnly}
                />
                <div style={{ padding: '20px 24px 24px' }}>
                  <GroupTable
                    key={`${activeMenuItemId}-table-${groupDoc?.tablePresetVersion || 'custom'}`}
                    tableData={groupDoc?.table}
                    agents={agentList}
                    onTableDataChange={(t) => onGroupUpdate?.('table', t)}
                    onAgentRowClick={(row) => {
                      if (row.agentId) onOpenAgent?.(row.agentId);
                      else if (row.name?.trim()) onCreateAgentFromRow?.(row);
                    }}
                    viewOnly={viewOnly}
                  />
                </div>
              </>
            ) : isEmpty ? (
              <EmptyStates
                title={emptyCopy.title}
                description={emptyCopy.description}
                actionLabel="Create agent"
                onAction={onCreateAgent}
              />
            ) : (
              <>
                <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
                  <MetricsGroup
                    primaryValue={savedPrimaryValue}
                    primaryType="time"
                    showTrend
                    primaryTrend="+1.3%"
                    primaryTrendPositive
                    metrics={savedMetrics}
                    onMetricsChange={setSavedMetrics}
                    onPrimaryValueChange={setSavedPrimaryValue}
                  />
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <AgentsTable
                    agents={agentList}
                    onRowClick={(agent) => onOpenAgent?.(agent.id)}
                    onDeleteAgent={onDeleteAgent}
                    onDuplicateAgent={onDuplicateAgent}
                    onMoveAgent={onMoveAgent}
                    onAgentUpdate={onAgentUpdate}
                  />
                </div>
              </>
            )
          )}

          {activeTab === 'library' && (
            <div style={{ padding: 24 }}>
              <TemplateLibrary
                templates={templates}
                variant={libraryView === 'table' ? 'list' : 'grid'}
                onCreateTemplate={onCreateTemplate}
                onDeleteTemplate={onDeleteTemplate}
                onSaveTemplate={onSaveTemplate}
                onUseTemplate={onUseTemplate}
                onShareTemplate={onShareTemplate}
                onDuplicateTemplate={onDuplicateTemplate}
                onMoveTemplate={onMoveTemplate}
                viewOnly={viewOnly}
              />
            </div>
          )}
        </div>
      </div>

      {shareModal}
    </div>
  );
}

AgentsDashboardTemplate.propTypes = {
  pageTitle: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, label: PropTypes.string })),
  metrics: PropTypes.array,
  primaryMetricValue: PropTypes.string,
  agents: PropTypes.array,
  templates: PropTypes.array,
  initialActiveTab: PropTypes.string,
  onCreateAgent: PropTypes.func,
  onCreateTemplate: PropTypes.func,
  onDeleteTemplate: PropTypes.func,
  onSaveTemplate: PropTypes.func,
  onUseTemplate: PropTypes.func,
  onOpenAgent: PropTypes.func,
  avatarSrc: PropTypes.string,
  activeNavId: PropTypes.string,
  activeMenuItemId: PropTypes.string,
  navTitle: PropTypes.string,
  ctaLabel: PropTypes.string,
  menuItems: PropTypes.array,
  navItems: PropTypes.array,
  onNavChange: PropTypes.func,
  onMenuItemClick: PropTypes.func,
  onGroupCreate: PropTypes.func,
  onGroupDelete: PropTypes.func,
  onChildrenReorder: PropTypes.func,
  isGroupPage: PropTypes.bool,
  groupDoc: PropTypes.object,
  onGroupUpdate: PropTypes.func,
  onCreateAgentFromRow: PropTypes.func,
  onExportError: PropTypes.func,
  viewOnly: PropTypes.bool,
};
