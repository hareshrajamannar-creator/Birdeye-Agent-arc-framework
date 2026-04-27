import React from 'react';
import CanvasNodeBody from './CanvasNodeBody';

export default {
  title: 'Agent Builder/Molecules/Canvas/CanvasNodeBody',
  component: CanvasNodeBody,
  parameters: { layout: 'padded' },
};

const wrap = (children) => (
  <div style={{ width: 360, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
    {children}
  </div>
);

export const TriggerBody = {
  render: () => wrap(
    <CanvasNodeBody
      nodeType="trigger"
      stepNumber={1}
      title="When a new review is received or updated"
      description="Agent triggers on new or updated reviews across all sources and locations"
    />
  ),
};

export const TaskBody = {
  render: () => wrap(
    <CanvasNodeBody
      nodeType="task"
      stepNumber={2}
      title="Identify relevant mentions in the review"
      description="Extract product or service specific feedback from the review"
    />
  ),
};

export const BranchBody = {
  render: () => wrap(
    <CanvasNodeBody
      nodeType="branch"
      stepNumber={3}
      title="Based on conditions"
      description="Build condition-specific flows"
    />
  ),
};

export const AllBodies = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
      {wrap(<CanvasNodeBody nodeType="trigger" stepNumber={1} title="When a new review is received or updated" description="Agent triggers on new or updated reviews across all sources and locations" />)}
      {wrap(<CanvasNodeBody nodeType="task" stepNumber={2} title="Identify relevant mentions in the review" description="Extract product or service specific feedback from the review" />)}
      {wrap(<CanvasNodeBody nodeType="branch" stepNumber={3} title="Based on conditions" description="Build condition-specific flows" />)}
    </div>
  ),
};
