import MetricsGroup from './MetricsGroup';

export default {
  title: 'Agent Builder/Organisms/DataViews/MetricsGroup',
  component: MetricsGroup,
  parameters: { layout: 'padded' },
};

export const Default = {
  args: {
    primaryValue: '6h 20m',
    primaryType: 'time',
    showTrend: true,
    primaryTrend: '+1.3%',
    primaryTrendPositive: true,
    metrics: [
      { value: '1,240', title: 'Tasks completed', showTrend: true, trend: '+4.2%', trendPositive: true },
      { value: '98.5%', title: 'Success rate', showTrend: true, trend: '-0.5%', trendPositive: false },
      { value: '3.2s', title: 'Avg. response time', showTrend: true, trend: '+0.8%', trendPositive: false },
      { value: '842', title: 'Active users', showTrend: true, trend: '+12.5%', trendPositive: true },
    ],
  },
};
