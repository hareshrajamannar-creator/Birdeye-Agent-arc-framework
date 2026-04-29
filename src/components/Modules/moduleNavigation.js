const agentChildren = (items) => items.map((label) => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  label,
}));

const standardSections = (agentLabels) => [
  {
    id: 'actions',
    label: 'Actions',
    defaultExpanded: true,
    children: [
      { id: 'view-all-agents', label: 'View all agents' },
      { id: 'create-agent', label: 'Create agent' },
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    defaultExpanded: true,
    children: agentChildren(agentLabels),
  },
  {
    id: 'monitor',
    label: 'Monitor',
    children: [
      { id: 'active', label: 'Active' },
      { id: 'paused', label: 'Paused' },
      { id: 'failed', label: 'Failed' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    children: [
      { id: 'performance', label: 'Performance' },
      { id: 'accuracy', label: 'Accuracy' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    children: [
      { id: 'thresholds', label: 'Thresholds' },
      { id: 'notifications', label: 'Notifications' },
    ],
  },
];

const expandedSections = (sections) => sections.map(({ label, children = [] }) => ({
  id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  label,
  defaultExpanded: true,
  children: children.map((child) => ({
    id: child.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    label: child,
  })),
}));

export const MODULE_NAV = {
  overview: {
    title: 'Overview',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Business summary agents', 'Risk detection agents']),
  },
  inbox: {
    title: 'Inbox AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Conversation intent routing agents', 'Inbox reply assistant agents']),
  },
  listings: {
    title: 'Listings AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'recommendations',
    menuItems: expandedSections([
      {
        label: 'Actions',
        children: ['Recommendations', 'Suppress duplicates', 'Google suggestions'],
      },
      {
        label: 'Ranking reports',
        children: ['Keywords', 'Citations', 'Rankings'],
      },
    ]),
  },
  reviews: {
    title: 'Reviews AI',
    ctaLabel: 'Send a review request',
    defaultItemId: 'view-all-reviews',
    menuItems: expandedSections([
      {
        label: 'Actions',
        children: [
          'View all reviews',
          'Respond to reviews',
          'Approve replies',
          'Fix rejected replies',
          'View scheduled replies',
          'Fix failed replies',
        ],
      },
    ]),
  },
  referrals: {
    title: 'Referrals AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Referral request agents', 'Referral follow-up agents']),
  },
  payments: {
    title: 'Payments AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Payment reminder agents', 'Failed payment recovery agents']),
  },
  appointments: {
    title: 'Appointments AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Appointment reminder agents', 'No-show recovery agents']),
  },
  social: {
    title: 'Social AI',
    ctaLabel: 'Create post',
    defaultItemId: 'view-calendar',
    menuItems: expandedSections([
      {
        label: 'Publish',
        children: [
          'View calendar',
          'View drafts',
          'Approve posts',
          'Fix failed posts',
          'Fix rejected posts',
        ],
      },
      {
        label: 'Engage',
      },
    ]),
  },
  surveys: {
    title: 'Surveys AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Survey follow-up agents', 'Survey insights agents']),
  },
  ticketing: {
    title: 'Ticketing AI',
    ctaLabel: 'Create ticket',
    defaultItemId: 'my-tickets',
    menuItems: expandedSections([
      {
        label: 'Actions',
        children: ['My tickets', 'View all tickets'],
      },
      {
        label: 'Reports',
        children: ['Resolution time', 'Volume'],
      },
      {
        label: 'Agents',
      },
    ]),
  },
  contacts: {
    title: 'Contacts AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Contact enrichment agents', 'Duplicate merge agents']),
  },
  campaigns: {
    title: 'Campaigns AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Campaign QA agents', 'Campaign optimizer agents']),
  },
  reports: {
    title: 'Reports',
    ctaLabel: 'Create report agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Report digest agents', 'Anomaly insight agents']),
  },
  insights: {
    title: 'Insights',
    ctaLabel: 'Create insight agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Insight summary agents', 'Trend detection agents']),
  },
  competitors: {
    title: 'Competitors AI',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: standardSections(['Competitor monitoring agents', 'Benchmark summary agents']),
  },
  settings: {
    title: 'Settings',
    ctaLabel: 'Create agent',
    defaultItemId: 'view-all-agents',
    menuItems: [
      {
        id: 'workspace',
        label: 'Workspace',
        defaultExpanded: true,
        children: [
          { id: 'view-all-agents', label: 'View all agents' },
          { id: 'templates', label: 'Templates' },
          { id: 'permissions', label: 'Permissions' },
        ],
      },
    ],
  },
};

export function getModuleNav(moduleId) {
  return MODULE_NAV[moduleId] || MODULE_NAV.overview;
}
