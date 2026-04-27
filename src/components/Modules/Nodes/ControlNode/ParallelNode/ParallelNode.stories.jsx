import React from 'react';
import { CardRow } from '../../../../LHSDrawer/LHSDrawer';
import '../../../../LHSDrawer/LHSDrawer.css';
import CanvasNode from '../../../../Molecules/Canvas/CanvasNode/CanvasNode';
import ExpandedRHSModal from '../../../ExpandedRHSModal/ExpandedRHSModal/ExpandedRHSModal';
import RHS from '../../../../Organisms/Panels/RHS/RHS';

export default {
  title: 'Agent Builder/Modules/Nodes/Control/Parallel',
  parameters: { layout: 'centered' },
};


export const LHSPreview = {
  render: () => (
    <div className="lhs-drawer" style={{ padding: '12px 24px' }}>
      <CardRow label="Parallel tasks" icon="splitscreen_add" action="drag" />
    </div>
  ),
};

export const CanvasPreview = {
  render: () => (
    <CanvasNode
      nodeType="parallel"
      label="Parallel tasks"
      hasToggle
      toggleEnabled
      hasAddButton
      stepNumber={3}
      title="Run tasks simultaneously"
      description="Execute multiple branches in parallel"
    />
  ),
};

export const ExpandedRHS = {
  render: () => <ExpandedRHSModal />,
};

export const RHSPreview = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ width: 390, height: '100vh' }}>
      <RHS variant="parallel" title="Parallel tasks" onClose={() => {}} onSave={() => {}} />
    </div>
  ),
};
