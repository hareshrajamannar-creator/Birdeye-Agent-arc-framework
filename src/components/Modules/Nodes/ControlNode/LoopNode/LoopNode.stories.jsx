import React from 'react';
import { CardRow } from '../../../../LHSDrawer/LHSDrawer';
import '../../../../LHSDrawer/LHSDrawer.css';
import CanvasNode from '../../../../Molecules/Canvas/CanvasNode/CanvasNode';
import ExpandedRHSModal from '../../../ExpandedRHSModal/ExpandedRHSModal/ExpandedRHSModal';
import RHS from '../../../../Organisms/Panels/RHS/RHS';

export default {
  title: 'Agent Builder/Modules/Nodes/Control/Loop',
  parameters: { layout: 'centered' },
};


export const LHSPreview = {
  render: () => (
    <div className="lhs-drawer" style={{ padding: '12px 24px' }}>
      <CardRow label="Loop" icon="repeat" action="drag" />
    </div>
  ),
};

export const CanvasPreview = {
  render: () => (
    <CanvasNode
      nodeType="loop"
      label="Loop"
      hasToggle
      toggleEnabled
      stepNumber={4}
      title="Repeat until condition is met"
      description="Iterate over a set of steps until the exit condition is true"
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
      <RHS variant="loop" title="Loop" onClose={() => {}} onSave={() => {}} />
    </div>
  ),
};
