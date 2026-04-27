import React, { useState } from 'react';
import CanvasNodeHeader from './CanvasNodeHeader';

export default {
  title: 'Agent Builder/Molecules/Canvas/CanvasNodeHeader',
  component: CanvasNodeHeader,
  parameters: { layout: 'padded' },
};

const wrap = (Story) => (
  <div style={{ width: 400, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
    <Story />
  </div>
);

export const TriggerHeader = {
  render: () => (
    <div style={{ width: 400, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
      <CanvasNodeHeader nodeType="trigger" label="Trigger" />
    </div>
  ),
};

export const TaskHeader = {
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <div style={{ width: 400, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
        <CanvasNodeHeader
          nodeType="task"
          label="Task"
          hasAiIcon
          hasToggle
          toggleEnabled={on}
          onToggleChange={setOn}
        />
      </div>
    );
  },
};

export const BranchHeader = {
  render: () => {
    const [on, setOn] = useState(true);
    return (
      <div style={{ width: 400, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
        <CanvasNodeHeader
          nodeType="branch"
          label="Branch"
          hasToggle
          toggleEnabled={on}
          onToggleChange={setOn}
          hasAddButton
        />
      </div>
    );
  },
};

export const AllTypes = {
  render: () => {
    const [taskOn, setTaskOn] = useState(true);
    const [branchOn, setBranchOn] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 400 }}>
        <div style={{ padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
          <CanvasNodeHeader nodeType="trigger" label="Trigger" />
        </div>
        <div style={{ padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
          <CanvasNodeHeader nodeType="task" label="Task" hasAiIcon hasToggle toggleEnabled={taskOn} onToggleChange={setTaskOn} />
        </div>
        <div style={{ padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(33,33,33,0.06)' }}>
          <CanvasNodeHeader nodeType="branch" label="Branch" hasToggle toggleEnabled={branchOn} onToggleChange={setBranchOn} hasAddButton />
        </div>
      </div>
    );
  },
};
