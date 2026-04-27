import MetricCard from './MetricCard';

export default {
  title: 'Agent Builder/Molecules/MetricCard',
  component: MetricCard,
  decorators: [
    (Story) => (
      <div style={{ padding: 24, width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    value: '6h 20m',
    title: 'Time saved',
  },
};

export const WithTrend = {
  args: {
    value: '6h 20m',
    title: 'Time saved',
    showTrend: true,
    trend: '+1.3%',
    trendPositive: true,
  },
};

export const WithNegativeTrend = {
  args: {
    value: '6h 20m',
    title: 'Time saved',
    showTrend: true,
    trend: '-2.1%',
    trendPositive: false,
  },
};

export const WithConfig = {
  args: {
    value: '6h 20m',
    title: 'Time saved',
    showConfig: true,
    onConfig: () => {},
  },
};

export const Full = {
  args: {
    value: '6h 20m',
    title: 'Time saved',
    showTrend: true,
    trend: '+1.3%',
    trendPositive: true,
    showConfig: true,
    onConfig: () => {},
  },
};

export const WithDollarValue = {
  args: {
    value: '5h',
    title: 'Time saved',
    showTrend: true,
    trend: '+1.3%',
    trendPositive: true,
    showConfig: true,
    onConfig: () => {},
    dollarValue: '$3,820',
  },
};
