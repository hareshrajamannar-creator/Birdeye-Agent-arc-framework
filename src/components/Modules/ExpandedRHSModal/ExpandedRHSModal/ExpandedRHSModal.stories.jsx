import React from 'react';
import ExpandedRHSModal from './ExpandedRHSModal';
import ExpandedRHSTest from '../ExpandedRHSTest/ExpandedRHSTest';
import LLMTaskBody from '../../../Organisms/Panels/RHS/LLMTaskBody';
import EntityTaskBody from '../../../Organisms/Panels/RHS/EntityTaskBody';
import EntityTriggerBody from '../../../Organisms/Panels/RHS/EntityTriggerBody';
import AgentDetailsBody from '../../../Organisms/Panels/RHS/AgentDetailsBody';
import BranchBody from '../../../Organisms/Panels/RHS/BranchBody';
import ControlBranchBody from '../../../Organisms/Panels/RHS/ControlBranchBody';
import DelayBody from '../../../Organisms/Panels/RHS/DelayBody';
import ParallelBody from '../../../Organisms/Panels/RHS/ParallelBody';
import LoopBody from '../../../Organisms/Panels/RHS/LoopBody';
import { ScheduleBasedBody } from '../../../Molecules/RHS/Trigger/ScheduleBased/ScheduleBased';

export default {
  title: 'Agent Builder/Organisms/Modals/ExpandedRHSModal',
  component: ExpandedRHSModal,
  parameters: { layout: 'fullscreen' },
};

const noop = () => {};
const test = <ExpandedRHSTest />;

const conditionFieldOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'sentiment', label: 'Sentiment' },
  { value: 'source', label: 'Source' },
];
const conditionOperatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does not equal' },
  { value: 'greater_than', label: 'Greater than' },
];
const conditionValueOptions = [
  { value: '4', label: '4 stars' },
  { value: '5', label: '5 stars' },
];

const wrap = (story) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <ExpandedRHSModal {...story} />
  </div>
);

// ─── Custom Task ─────────────────────────────────────────────────────────────

export const CustomTask = {
  render: () => wrap({
    title: 'Task',
    onCancel: noop, onSave: noop, onClose: noop,
    showPromptStrength: true, promptStrength: 'Weak', promptFillWidth: 83,
    formContent: (
      <LLMTaskBody initialValues={{
        taskName: 'Identify relevant mentions in the review',
        description: 'Extract product or service–specific feedback from the review',
        llmModel: 'Fast',
        systemPrompt: 'You are a classification agent who identifies the products and services mentioned in the review comment',
        userPrompt: 'Identify service or product mentioned in the review. If multiple are identified, prioritize by relevance and select only one.',
        outputFields: [{ fieldName: 'Identified_product', fieldType: 'Text' }],
      }} />
    ),
    testContent: test,
  }),
};

// ─── Entity Task ─────────────────────────────────────────────────────────────

export const EntityTask = {
  render: () => wrap({
    title: 'Task',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <EntityTaskBody initialValues={{
        taskName: 'Send Review Response',
        description: 'Post a reply to the selected review from the Reviews source',
      }} />
    ),
    testContent: test,
  }),
};

// ─── Entity Trigger ──────────────────────────────────────────────────────────

export const EntityTrigger = {
  render: () => wrap({
    title: 'Trigger',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <EntityTriggerBody initialValues={{
        triggerName: 'New Review Received',
        description: 'Triggers when a new or updated review is received across all sources and locations',
      }} />
    ),
    testContent: test,
  }),
};

// ─── Scheduled Trigger ───────────────────────────────────────────────────────

export const ScheduledTrigger = {
  render: () => wrap({
    title: 'Trigger',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <ScheduleBasedBody
        frequencyOptions={['Hourly', 'Daily', 'Weekly', 'Monthly']}
        dayOptions={['1 day', '2 days', '3 days', '7 days', '14 days', '30 days']}
        timeOptions={['12:00 AM', '6:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '12:00 PM', '3:00 PM', '6:00 PM']}
        defaultFrequency="Daily"
        defaultDay="7 days"
        defaultTime="9:00 AM"
      />
    ),
    testContent: test,
  }),
};

// ─── Agent Details ───────────────────────────────────────────────────────────

export const AgentDetails = {
  render: () => wrap({
    title: 'Agent details',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: <AgentDetailsBody />,
    testContent: test,
  }),
};

// ─── Branch ──────────────────────────────────────────────────────────────────

export const Branch = {
  render: () => wrap({
    title: 'Branch details',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <BranchBody initialValues={{
        branchName: 'Positive Reviews',
        description: 'Branch for reviews with a rating of 4 stars or above',
        logic: 'AND',
        conditions: [{
          id: 1,
          fieldOptions: conditionFieldOptions,
          operatorOptions: conditionOperatorOptions,
          valueOptions: conditionValueOptions,
          fieldValue: 'rating',
          operatorValue: 'greater_than',
          valueValue: '4',
        }],
      }} />
    ),
    testContent: test,
  }),
};

// ─── Control Branch ──────────────────────────────────────────────────────────

export const ControlBranch = {
  render: () => wrap({
    title: 'Branch',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <ControlBranchBody initialValues={{
        basedOn: 'conditions',
        branches: [
          { id: 1, name: 'Positive Reviews' },
          { id: 2, name: 'Negative Reviews' },
          { id: 3, name: 'Neutral Reviews' },
        ],
      }} />
    ),
    testContent: test,
  }),
};

// ─── Delay ───────────────────────────────────────────────────────────────────

export const Delay = {
  render: () => wrap({
    title: 'Delay',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <DelayBody initialValues={{ name: 'Wait for Processing', duration: '24', unit: 'hours' }} />
    ),
    testContent: test,
  }),
};

// ─── Parallel ────────────────────────────────────────────────────────────────

export const Parallel = {
  render: () => wrap({
    title: 'Parallel tasks',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <ParallelBody initialValues={{
        nodeName: 'Process Multiple Sources',
        description: 'Handle reviews from different sources simultaneously',
        branches: [{ name: 'Reviews Handler' }, { name: 'Inbox Handler' }, { name: 'Survey Handler' }],
      }} />
    ),
    testContent: test,
  }),
};

// ─── Loop ────────────────────────────────────────────────────────────────────

export const Loop = {
  render: () => wrap({
    title: 'Loop',
    onCancel: noop, onSave: noop, onClose: noop,
    formContent: (
      <LoopBody initialValues={{
        name: 'Process All Reviews',
        description: 'Iterate through each review in the collection and apply the workflow',
        loopMode: 'variable',
        loopOver: 'reviews_list',
      }} />
    ),
    testContent: test,
  }),
};
