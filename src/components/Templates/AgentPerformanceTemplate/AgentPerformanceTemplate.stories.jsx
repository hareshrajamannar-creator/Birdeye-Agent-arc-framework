import AgentPerformanceTemplate from './AgentPerformanceTemplate';

export default {
  title: 'Agent Builder/Templates/AgentPerformanceTemplate',
  component: AgentPerformanceTemplate,
  parameters: { layout: 'fullscreen' },
};

export const Default = {};

export const Paused = {
  args: {
    agentName: 'Review response agent - South Region',
    agentStatus: 'Paused',
    tableRows: [
      { location: 'Miami, FL',    reviewsResponded: 5,  responseRate: '80%', avgResponseTime: '4h 00m', timeSaved: '1h 40m' },
      { location: 'Orlando, FL',  reviewsResponded: 3,  responseRate: '75%', avgResponseTime: '5h 10m', timeSaved: '0h 45m' },
    ],
  },
};
