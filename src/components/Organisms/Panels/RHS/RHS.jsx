import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import RHSSidePanelHeader from '../../../Molecules/RHS/RHSHeader/RHSHeader';
import RHSSidePanelFooter from '../../../Molecules/RHS/RHSFooter/RHSFooter';
import AgentDetailsBody from './AgentDetailsBody';
import LLMTaskBody from './LLMTaskBody';
import EntityTaskBody from './EntityTaskBody';
import EntityTriggerBody from './EntityTriggerBody';
import BranchBody from './BranchBody';
import DelayBody from './DelayBody';
import ParallelBody from './ParallelBody';
import LoopBody from './LoopBody';
import ControlBranchBody from './ControlBranchBody';
import StartBody from './StartBody';
import ExpandedRHSModal from '../../../Modules/ExpandedRHSModal/ExpandedRHSModal/ExpandedRHSModal';
import ExpandedRHSTestInput from '../../../Molecules/ExpandedRHS/ExpandedRHSTestInput/ExpandedRHSTestInput';
import ExpandedRHSTestOutput from '../../../Molecules/ExpandedRHS/ExpandedRHSTestOutput/ExpandedRHSTestOutput';
import ExpandedRHSTestFeedback from '../../../Molecules/ExpandedRHS/ExpandedRHSTestFeedback/ExpandedRHSTestFeedback';

const VARIANTS = {
  start: {
    body: StartBody,
    showActions: false,
    showPromptStrength: false,
  },
  agentDetails: {
    body: AgentDetailsBody,
    showActions: false,
    showPromptStrength: false,
  },
  llmTask: {
    body: LLMTaskBody,
    showActions: true,
    showPromptStrength: true,
  },
  entityTask: {
    body: EntityTaskBody,
    showActions: true,
    showPromptStrength: false,
  },
  entityTrigger: {
    body: EntityTriggerBody,
    showActions: true,
    showPromptStrength: false,
  },
  branch: {
    body: BranchBody,
    showActions: false,
    showPromptStrength: false,
  },
  delay: {
    body: DelayBody,
    showActions: false,
    showPromptStrength: false,
  },
  parallel: {
    body: ParallelBody,
    showActions: false,
    showPromptStrength: false,
  },
  loop: {
    body: LoopBody,
    showActions: true,
    showPromptStrength: false,
  },
  controlBranch: {
    body: ControlBranchBody,
    showActions: true,
    showPromptStrength: false,
  },
};

export default function RHS({ variant = 'agentDetails', title, bodyProps, onClose, onSave, onPreview, onExpand }) {
  const config = VARIANTS[variant];
  const Body = config.body;
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState('');

  const handleExpand = () => {
    setIsExpanded(true);
    onExpand?.();
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false);
  };

  const testContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ExpandedRHSTestInput fields={[]} />
      <ExpandedRHSTestOutput rows={[]} />
      <ExpandedRHSTestFeedback
        value={feedbackValue}
        onChange={(e) => setFeedbackValue(e.target.value)}
        onSubmit={() => setFeedbackValue('')}
      />
    </div>
  );

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: 390,
        height: '100%',
        background: '#ffffff',
        borderLeft: '1px solid #e5e9f0',
        fontFamily: '"Roboto", arial, sans-serif',
      }}>
        <RHSSidePanelHeader
          title={title || 'Title'}
          onPreview={onPreview}
          onExpand={handleExpand}
          onClose={onClose}
          showActions={config.showActions}
        />

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 15px',
          boxSizing: 'border-box',
        }}>
          <Body {...(bodyProps || {})} />
        </div>

        <RHSSidePanelFooter
          onSave={onSave}
          showPromptStrength={config.showPromptStrength}
          promptStrength="Weak"
          promptFillWidth={52}
          onViewSuggestions={() => {}}
        />
      </div>

      {isExpanded && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{ width: '90vw', height: '85vh', borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <ExpandedRHSModal
              title={title || 'Title'}
              onClose={handleCloseExpanded}
              onCancel={handleCloseExpanded}
              onSave={onSave}
              showPromptStrength={config.showPromptStrength}
              promptStrength="Weak"
              promptFillWidth={52}
              formContent={<Body {...(bodyProps || {})} />}
              testContent={testContent}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
