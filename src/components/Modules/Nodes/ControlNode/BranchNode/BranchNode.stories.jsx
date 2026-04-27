import React from 'react';
import { CardRow } from '../../../../LHSDrawer/LHSDrawer';
import '../../../../LHSDrawer/LHSDrawer.css';
import CanvasNode from '../../../../Molecules/Canvas/CanvasNode/CanvasNode';
import ExpandedRHSModal from '../../../ExpandedRHSModal/ExpandedRHSModal/ExpandedRHSModal';
import RHS from '../../../../Organisms/Panels/RHS/RHS';

export default {
  title: 'Agent Builder/Modules/Nodes/Control/Branch',
  parameters: { layout: 'centered' },
};

export const LHSPreview = {
  render: () => (
    <div className="lhs-drawer" style={{ padding: '12px 24px' }}>
      <CardRow label="Branch" icon="account_tree" action="drag" />
    </div>
  ),
};

export const CanvasPreview = {
  render: () => (
    <CanvasNode
      nodeType="branch"
      label="Branch"
      hasToggle
      toggleEnabled
      hasAddButton
      stepNumber={3}
      title="Based on conditions"
      description="Build condition-specific flows"
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
      <RHS variant="controlBranch" title="Branch" onClose={() => {}} onSave={() => {}} />
    </div>
  ),
};
