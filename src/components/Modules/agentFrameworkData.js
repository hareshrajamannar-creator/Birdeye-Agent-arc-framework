export const MODULE_DEFINITIONS = {
  overview: {
    name: 'Overview',
    icon: 'home',
    description: 'Summarize business health and highlight operational risks across modules.',
    agents: [
      {
        id: 'overview-summary',
        title: 'Business summary agent',
        description: 'Creates a daily rollup of reviews, inbox, social, and campaign performance.',
        steps: ['Daily schedule', 'Collect module signals', 'Summarize changes', 'Share digest'],
      },
      {
        id: 'overview-risk',
        title: 'Risk detection agent',
        description: 'Flags sudden changes in sentiment, SLA misses, or performance drops.',
        steps: ['Hourly scan', 'Detect anomalies', 'Rank impact', 'Notify owner'],
      },
    ],
  },
  reviews: {
    name: 'Reviews',
    icon: 'grade',
    description: 'Automate review response, escalation, tagging, and quality monitoring workflows.',
    agents: [
      {
        id: 'reviews-response-templates',
        title: 'Review response agent replying using templates',
        description: 'Uses pre-defined templates and responds to reviews automatically.',
        steps: ['New review trigger', 'Sentiment check', 'LLM reply draft', 'Approval or publish'],
      },
      {
        id: 'reviews-response-autonomous',
        title: 'Review response agent replying autonomously',
        description: 'Uses AI to analyze review sentiment, generates and posts unique, context aware replies automatically.',
        steps: ['New review trigger', 'Sentiment check', 'LLM reply draft', 'Publish reply'],
      },
      {
        id: 'reviews-response-human-approval',
        title: 'Review response agent replying after human approval',
        description: 'Uses AI to analyze review sentiment, generates and sends unique, context-aware replies for a human approval before posting.',
        steps: ['New review trigger', 'Sentiment check', 'LLM reply draft', 'Approval or publish'],
      },
      {
        id: 'reviews-response-dashboard-suggestions',
        title: 'Review response agent suggesting replies in dashboard',
        description: 'Uses AI to analyze review sentiment, generates and shows unique, context-aware replies in the dashboard for one-click manual posting.',
        steps: ['Low rating trigger', 'Branch by urgency', 'Create ticket', 'Notify owner'],
      },
    ],
  },
  referrals: {
    name: 'Referrals',
    icon: 'featured_seasonal_and_gifts',
    description: 'Create referral requests, reminders, and conversion follow-up workflows.',
    agents: [
      {
        id: 'referrals-request',
        title: 'Referral request agent',
        description: 'Finds happy customers and sends referral requests at the right moment.',
        steps: ['Positive signal trigger', 'Check eligibility', 'Send request', 'Track response'],
      },
      {
        id: 'referrals-follow-up',
        title: 'Referral follow-up agent',
        description: 'Follows up with customers and referred leads when referral activity stalls.',
        steps: ['Referral created', 'Wait period', 'Branch by status', 'Send follow-up'],
      },
    ],
  },
  payments: {
    name: 'Payments',
    icon: 'monetization_on',
    description: 'Automate payment reminders, failed-payment recovery, and status updates.',
    agents: [
      {
        id: 'payments-reminder',
        title: 'Payment reminder agent',
        description: 'Sends friendly reminders before invoices become overdue.',
        steps: ['Due date schedule', 'Check payment status', 'Send reminder', 'Log outcome'],
      },
      {
        id: 'payments-recovery',
        title: 'Failed payment recovery agent',
        description: 'Routes failed payments through retries, customer messages, and owner alerts.',
        steps: ['Payment failed', 'Retry branch', 'Notify customer', 'Escalate unresolved'],
      },
    ],
  },
  appointments: {
    name: 'Appointments',
    icon: 'calendar_month',
    description: 'Reduce no-shows and keep appointment communications on schedule.',
    agents: [
      {
        id: 'appointments-reminder',
        title: 'Appointment reminder agent',
        description: 'Sends appointment reminders with location, service, and rescheduling context.',
        steps: ['Upcoming appointment', 'Check preferences', 'Send reminder', 'Confirm status'],
      },
      {
        id: 'appointments-no-show',
        title: 'No-show recovery agent',
        description: 'Follows up on missed appointments and helps customers rebook.',
        steps: ['No-show trigger', 'Generate message', 'Offer slots', 'Notify staff'],
      },
    ],
  },
  inbox: {
    name: 'Inbox',
    icon: 'sms',
    description: 'Triage customer conversations, suggest replies, and move high-intent leads forward.',
    agents: [
      {
        id: 'inbox-intent',
        title: 'Conversation intent routing agent',
        description: 'Classifies new messages and routes sales, support, billing, or urgent conversations.',
        steps: ['New message trigger', 'Intent classifier', 'Branch by intent', 'Assign owner'],
      },
      {
        id: 'inbox-reply',
        title: 'Inbox reply assistant',
        description: 'Creates brand-safe suggested replies for teams to review and send quickly.',
        steps: ['Message received', 'Fetch context', 'Generate reply', 'Wait for approval'],
      },
    ],
  },
  listings: {
    name: 'Listings',
    icon: 'location_on',
    description: 'Keep profile data accurate across location networks and flag sync issues.',
    agents: [
      {
        id: 'listings-scan',
        title: 'Listings scan agent',
        description: 'Checks location fields for missing or mismatched data before publishing updates.',
        steps: ['Scheduled scan', 'Validate fields', 'Create mismatch report', 'Notify POD'],
      },
      {
        id: 'listings-hours',
        title: 'Holiday hours agent',
        description: 'Detects upcoming holidays and prepares hours updates for affected locations.',
        steps: ['Weekly schedule', 'Find holidays', 'Generate updates', 'Request approval'],
      },
    ],
  },
  social: {
    name: 'Social',
    icon: 'workspaces',
    description: 'Plan, publish, monitor, and respond to social content across networks.',
    agents: [
      {
        id: 'social-publishing',
        title: 'Social publishing agent',
        description: 'Turns campaign briefs into platform-ready posts with schedule and approval steps.',
        steps: ['Campaign brief', 'Generate copy', 'Branch by channel', 'Schedule post'],
      },
      {
        id: 'social-engagement',
        title: 'Social engagement agent',
        description: 'Monitors comments and mentions, then routes engagement opportunities or risks.',
        steps: ['Mention trigger', 'Classify sentiment', 'Generate response', 'Escalate risky comments'],
      },
    ],
  },
  surveys: {
    name: 'Surveys',
    icon: 'assignment_turned_in',
    description: 'Create feedback loops that analyze survey responses and trigger follow-up.',
    agents: [
      {
        id: 'surveys-follow-up',
        title: 'Survey follow-up agent',
        description: 'Responds to detractors, promoters, and missing fields with targeted actions.',
        steps: ['Survey submitted', 'Score branch', 'Draft follow-up', 'Create task'],
      },
      {
        id: 'surveys-insights',
        title: 'Survey insights agent',
        description: 'Summarizes recurring themes for PM and Design teams on a schedule.',
        steps: ['Weekly schedule', 'Cluster responses', 'Summarize themes', 'Share digest'],
      },
    ],
  },
  ticketing: {
    name: 'Ticketing',
    icon: 'shapes',
    description: 'Prioritize issues, automate handoffs, and maintain SLA discipline.',
    agents: [
      {
        id: 'ticketing-priority',
        title: 'Ticket priority agent',
        description: 'Scores incoming tickets by urgency, customer tier, and business impact.',
        steps: ['Ticket created', 'Extract severity', 'Set priority', 'Notify queue'],
      },
      {
        id: 'ticketing-sla',
        title: 'SLA rescue agent',
        description: 'Detects tickets near breach and escalates them to the next available owner.',
        steps: ['Hourly schedule', 'Find at-risk tickets', 'Escalate owner', 'Post update'],
      },
    ],
  },
  contacts: {
    name: 'Contacts',
    icon: 'group',
    description: 'Enrich profiles, clean duplicates, and trigger lifecycle moments.',
    agents: [
      {
        id: 'contacts-enrichment',
        title: 'Contact enrichment agent',
        description: 'Completes missing profile fields from approved sources and flags conflicts.',
        steps: ['New contact', 'Find missing fields', 'Enrich profile', 'Request review'],
      },
      {
        id: 'contacts-duplicate',
        title: 'Duplicate merge agent',
        description: 'Identifies probable duplicate contacts and prepares merge recommendations.',
        steps: ['Daily scan', 'Match contacts', 'Score confidence', 'Create merge task'],
      },
    ],
  },
  campaigns: {
    name: 'Campaigns',
    icon: 'campaign',
    description: 'Build campaign QA, targeting, performance, and follow-up automations.',
    agents: [
      {
        id: 'campaigns-qa',
        title: 'Campaign QA agent',
        description: 'Checks audience, content, links, and compliance before a campaign is launched.',
        steps: ['Pre-launch trigger', 'Validate setup', 'Branch by issue', 'Approve or block'],
      },
      {
        id: 'campaigns-optimizer',
        title: 'Campaign optimizer agent',
        description: 'Reviews campaign results and recommends copy, timing, and audience improvements.',
        steps: ['Weekly schedule', 'Analyze metrics', 'Generate recommendations', 'Share summary'],
      },
    ],
  },
  reports: {
    name: 'Reports',
    icon: 'pie_chart',
    description: 'Create recurring reporting workflows for teams and leadership.',
    agents: [
      {
        id: 'reports-digest',
        title: 'Report digest agent',
        description: 'Builds recurring performance digests for selected modules and recipients.',
        steps: ['Weekly schedule', 'Pull metrics', 'Generate digest', 'Send report'],
      },
      {
        id: 'reports-anomaly',
        title: 'Anomaly insight agent',
        description: 'Finds metric outliers and adds narrative context to reporting.',
        steps: ['Metric scan', 'Detect outlier', 'Explain driver', 'Share insight'],
      },
    ],
  },
  insights: {
    name: 'Insights',
    icon: 'lightbulb',
    description: 'Turn customer signals into actionable product and operations insights.',
    agents: [
      {
        id: 'insights-summary',
        title: 'Insight summary agent',
        description: 'Summarizes emerging themes from feedback, messages, and social mentions.',
        steps: ['Signal collection', 'Cluster themes', 'Generate summary', 'Route to POD'],
      },
      {
        id: 'insights-trend',
        title: 'Trend detection agent',
        description: 'Tracks fast-moving themes and alerts teams when trends become significant.',
        steps: ['Daily scan', 'Compare baseline', 'Score trend', 'Notify team'],
      },
    ],
  },
  competitors: {
    name: 'Competitors',
    icon: 'leaderboard',
    description: 'Monitor competitor movements, benchmarks, and reputation signals.',
    agents: [
      {
        id: 'competitors-monitoring',
        title: 'Competitor monitoring agent',
        description: 'Tracks competitor rating, listing, and content changes across markets.',
        steps: ['Scheduled scan', 'Compare competitors', 'Summarize changes', 'Alert owner'],
      },
      {
        id: 'competitors-benchmark',
        title: 'Benchmark summary agent',
        description: 'Summarizes where a business is winning or losing against local competitors.',
        steps: ['Monthly schedule', 'Pull benchmarks', 'Generate insights', 'Share plan'],
      },
    ],
  },
  settings: {
    name: 'Settings',
    icon: 'settings',
    description: 'Manage reusable agent templates, permissions, and framework defaults.',
    agents: [
      {
        id: 'settings-template-audit',
        title: 'Template audit agent',
        description: 'Reviews saved templates for missing owners, stale fields, or duplicate intent.',
        steps: ['Weekly schedule', 'Scan templates', 'Flag issues', 'Notify admins'],
      },
      {
        id: 'settings-permission-review',
        title: 'Permission review agent',
        description: 'Checks agent permissions and highlights risky or outdated access.',
        steps: ['Monthly schedule', 'Review access', 'Find risks', 'Create admin task'],
      },
    ],
  },
};

export const MODULE_ORDER = [
  'overview',
  'reviews',
  'inbox',
  'listings',
  'referrals',
  'payments',
  'appointments',
  'social',
  'surveys',
  'ticketing',
  'contacts',
  'campaigns',
  'reports',
  'insights',
  'competitors',
  'settings',
];

export function getModuleTemplates(moduleId) {
  return MODULE_DEFINITIONS[moduleId]?.agents || [];
}

export function getAllTemplates() {
  return MODULE_ORDER.flatMap((moduleId) =>
    getModuleTemplates(moduleId).map((agent) => ({
      ...agent,
      moduleId,
      moduleName: MODULE_DEFINITIONS[moduleId].name,
    }))
  );
}
