import React from 'react';
import LHSNode from './LHSNode';

export default {
  title: 'Agent Builder/Molecules/LHS/LHSNode',
  component: LHSNode,
  parameters: { layout: 'padded' },
  argTypes: {
    action: { control: 'select', options: ['drag', 'chevron'] },
  },
};

const wrap = (Story) => (
  <div style={{ width: 312, padding: 16 }}>
    <Story />
  </div>
);

export const DragAction = {
  args: {
    icon: 'schedule',
    label: 'Schedule-based',
    action: 'drag',
    nodeType: 'trigger',
  },
  decorators: [wrap],
};

export const ChevronAction = {
  args: {
    icon: 'grade',
    label: 'Reviews',
    action: 'chevron',
    nodeType: 'trigger',
  },
  decorators: [wrap],
};

export const ActiveState = {
  args: {
    icon: 'grade',
    label: 'Reviews',
    action: 'chevron',
    isActive: true,
    nodeType: 'trigger',
  },
  decorators: [wrap],
};

export const AllNodes = {
  render: () => (
    <div style={{ width: 312, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <LHSNode icon="schedule" label="Schedule-based" action="drag" nodeType="trigger" />
      <LHSNode icon="grade" label="Reviews" action="chevron" isActive nodeType="trigger" />
      <LHSNode icon="sms" label="Inbox" action="chevron" nodeType="trigger" />
      <LHSNode icon="location_on" label="Listings" action="chevron" nodeType="trigger" />
      <LHSNode icon="workspaces" label="Social" action="chevron" nodeType="trigger" />
    </div>
  ),
};
