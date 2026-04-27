import React from 'react';
import EndNode from '../../../Molecules/Canvas/EndNode/EndNode';
import ExpandedRHSModal from '../../ExpandedRHSModal/ExpandedRHSModal/ExpandedRHSModal';

export default {
  title: 'Agent Builder/Modules/Nodes/End',
  parameters: { layout: 'centered' },
};

export const LHSPreview = {
  render: () => (
    <div style={{ padding: 24, color: '#9e9e9e', fontFamily: 'sans-serif', fontSize: 14 }}>
      EndNode LHS Preview — not yet implemented
    </div>
  ),
};

export const CanvasPreview = {
  render: () => <EndNode />,
};

export const ExpandedRHS = {
  render: () => <ExpandedRHSModal />,
};

export const RHSPreview = {
  render: () => null,
};
