import React, { useState } from 'react';
import CommonSideDrawer from '@birdeye/elemental/core/atoms/CommonSideDrawer/index.js';
import TabHeader from '@birdeye/elemental/core/atoms/TabHeader/index.js';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import './ToolSelectionDrawer.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const INTERNAL_TOOLS = [
  { id: 'fetch-tags',       name: 'Fetch tags',        desc: 'Fetch existing tags associated with reviews for analysis',                   icon: 'sell',               size: 'sm', bg: 'blue' },
  { id: 'get-reviews',      name: 'Get reviews',        desc: 'Retrieve reviews across different sources',                                 icon: 'grade',              size: 'md', bg: 'blue' },
  { id: 'review-responder', name: 'Review responder',   desc: 'Post response to review with chosen template',                             icon: 'grade',              size: 'md', bg: 'gray' },
  { id: 'create-tags',      name: 'Create tags',        desc: 'Identify and generate tags from review content based on business context', icon: 'sell',               size: 'md', bg: 'blue' },
  { id: 'assign-tags',      name: 'Assign tags',        desc: 'Apply relevant tags to reviews for categorization',                       icon: 'person_add',         size: 'md', bg: 'blue' },
  { id: 'update-tags',      name: 'Update tags',        desc: 'Modify or refine tags based on latest insights and trends',               icon: 'sell',               size: 'md', bg: 'blue' },
  { id: 'send-surveys',     name: 'Send Surveys',       desc: 'Send surveys to customers to collect feedback and insights',              icon: 'assignment_turned_in', size: 'sm', bg: 'blue' },
  { id: 'get-surveys',      name: 'Get Surveys',        desc: 'Access and analyze survey responses to drive insights',                   icon: 'assignment_turned_in', size: 'sm', bg: 'blue' },
];

const EXTERNAL_TOOLS = [
  { id: 'freshdesk',  name: 'Freshdesk',   desc: 'Create and manage support tickets seamlessly in Freshdesk.',                         connected: true,  color: '#25c16f', initials: 'F'  },
  { id: 'servicenow', name: 'ServiceNow',  desc: 'Create and manage support tickets seamlessly in Servicenow.',                        connected: true,  color: '#62d84e', initials: 'SN' },
  { id: 'dentrix',    name: 'Dentrix',     desc: 'Schedule and manage dental appointments in Dentrix from support tickets.',           connected: true,  color: '#e8571b', initials: 'Dx' },
  { id: 'zendesk',    name: 'Zendesk',     desc: 'Create and manage support tickets seamlessly in Zendesk.',                          connected: true,  color: '#03363d', initials: 'Z'  },
  { id: 'gmail',      name: 'Gmail',       desc: 'Trigger actions when a new email is received or labeled in Gmail.',                 connected: true,  color: '#ea4335', initials: 'G'  },
  { id: 'quickbooks', name: 'Quick books', desc: 'Create invoices or log payments directly in QuickBooks from ticket actions.',        connected: false, color: '#2ca01c', initials: 'QB' },
  { id: 'salesforce', name: 'Salesforce',  desc: 'Trigger actions when a new lead or contact is created in Salesforce.',              connected: false, color: '#00a1e0', initials: 'SF' },
];

const TABS = [
  { value: 'internal', label: 'Internal tools' },
  { value: 'external', label: 'External tools' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToolIconCircle({ icon, size, bg }) {
  return (
    <div className="tsd-card__icon-wrap">
      <div className={`tsd-card__icon-circle tsd-card__icon-circle--${bg}`} />
      <span className={`material-symbols-outlined tsd-card__icon tsd-card__icon--${size}`}>
        {icon}
      </span>
    </div>
  );
}

// Placeholder SVG logo for external tools
function ExternalLogo({ color, initials }) {
  return (
    <svg className="tsd-ext-card__logo" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill={color} />
      <text
        x="20"
        y="20"
        dominantBaseline="central"
        textAnchor="middle"
        fill="#fff"
        fontSize={initials.length > 1 ? '11' : '14'}
        fontFamily="Roboto, Arial, sans-serif"
        fontWeight="600"
      >
        {initials}
      </text>
    </svg>
  );
}

function InternalTab({ tools, searchQuery, onToolSelect }) {
  const [collapsed, setCollapsed] = useState(false);

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button className="tsd-section-header" onClick={() => setCollapsed((c) => !c)}>
        <span className="tsd-section-header__label">All tools</span>
        <span
          className={`material-symbols-outlined tsd-section-header__chevron${
            collapsed ? ' tsd-section-header__chevron--collapsed' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {!collapsed && (
        <div className="tsd-list">
          {filtered.map((tool) => (
            <button key={tool.id} className="tsd-card" onClick={() => onToolSelect?.(tool)}>
              <ToolIconCircle icon={tool.icon} size={tool.size} bg={tool.bg} />
              <div className="tsd-card__info">
                <span className="tsd-card__name">{tool.name}</span>
                <span className="tsd-card__desc">{tool.desc}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function ExternalTab({ tools, searchQuery, onConnect }) {
  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tsd-list">
      {filtered.map((tool) => (
        <div key={tool.id} className="tsd-ext-card">
          <ExternalLogo color={tool.color} initials={tool.initials} />
          <div className="tsd-ext-card__info">
            <span className="tsd-ext-card__name">{tool.name}</span>
            <span className="tsd-ext-card__desc">{tool.desc}</span>
          </div>
          {tool.connected ? (
            <div className="tsd-ext-card__status">
              <span className="tsd-ext-card__dot" />
              <span className="tsd-ext-card__connected">Connected</span>
            </div>
          ) : (
            <Button
              type="link"
              label="Connect"
              onClick={() => onConnect?.(tool)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ToolSelectionDrawer({
  isOpen = false,
  onClose,
  onToolSelect,
  onConnect,
  onAddCustom,
  defaultTab = 'internal',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CommonSideDrawer
      isOpen={isOpen}
      title="Add a tool"
      onClose={onClose}
      width="650px"
      shouldScroll={false}
      buttonPosition="left"
    >
      <div className="tsd-body">
        {/* Search */}
        <div className="tsd-search">
          <span className="material-symbols-outlined tsd-search__icon">search</span>
          <input
            className="tsd-search__input"
            placeholder="Search tools"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tabs + Add custom integration */}
        <div className="tsd-tabs-row">
          <TabHeader
            content={TABS}
            activeTab={activeTab}
            clickTab={setActiveTab}
          />
          <Button
            type="link"
            label="Add custom integration"
            onClick={onAddCustom}
          />
        </div>

        {/* Tab content */}
        {activeTab === 'internal' ? (
          <InternalTab
            tools={INTERNAL_TOOLS}
            searchQuery={searchQuery}
            onToolSelect={onToolSelect}
          />
        ) : (
          <ExternalTab
            tools={EXTERNAL_TOOLS}
            searchQuery={searchQuery}
            onConnect={onConnect}
          />
        )}
      </div>
    </CommonSideDrawer>
  );
}
