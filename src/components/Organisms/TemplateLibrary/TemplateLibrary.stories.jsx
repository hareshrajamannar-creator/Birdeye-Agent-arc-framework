import TemplateLibrary from './TemplateLibrary';

const SAMPLE_TEMPLATES = [
  { id: '1', title: 'Review response agent replying using templates', description: 'Uses pre-defined templates and responds to reviews automatically.' },
  { id: '2', title: 'Review response agent replying autonomously', description: 'Uses AI to analyze review sentiment, generates and posts unique, context aware replies automatically.' },
  { id: '3', title: 'Review response agent replying after human approval', description: 'Uses AI to analyze review sentiment, generates and sends unique, context-aware replies for a human approval before posting.' },
  { id: '4', title: 'Review response agent suggesting replies in dashboard', description: 'Uses AI to analyze review sentiment, generates and shows unique, context-aware replies in the dashboard for one-click manual posting.' },
];

export default {
  title: 'Agent Builder/Organisms/DataViews/TemplateLibrary',
  component: TemplateLibrary,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ padding: 40, background: '#f4f6f7', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    variant: 'grid',
    templates: SAMPLE_TEMPLATES,
    onUseTemplate: () => {},
  },
};

export const WithSeeMore = {
  args: {
    variant: 'see-more',
    initialCount: 3,
    templates: SAMPLE_TEMPLATES,
    onUseTemplate: () => {},
    onSeeMore: () => {},
  },
};
