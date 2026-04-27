import React from 'react';
import RHS from './RHS';
import ScheduleBased from '../../../Molecules/RHS/Trigger/ScheduleBased/ScheduleBased';

export default {
  title: 'Agent Builder/Organisms/Panels/RHS',
  component: RHS,
  parameters: { layout: 'fullscreen' },
};

const wrap = (children) => (
  <div style={{ width: 390, height: '100vh' }}>{children}</div>
);

const noop = () => {};

// ─── Shared fixture data ─────────────────────────────────────────────────────

const conditionFieldOptions = [
  { value: 'rating', label: 'Rating' },
  { value: 'sentiment', label: 'Sentiment' },
  { value: 'source', label: 'Source' },
  { value: 'location', label: 'Location' },
];
const conditionOperatorOptions = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater than' },
];
const conditionValueOptions = [
  { value: '1', label: '1 star' },
  { value: '2', label: '2 stars' },
  { value: '3', label: '3 stars' },
  { value: '4', label: '4 stars' },
  { value: '5', label: '5 stars' },
];
const makeCondition = (id, fieldValue = '', operatorValue = '', valueValue = '') => ({
  id,
  fieldOptions: conditionFieldOptions,
  operatorOptions: conditionOperatorOptions,
  valueOptions: conditionValueOptions,
  fieldValue,
  operatorValue,
  valueValue,
});

const FREQUENCY_OPTIONS = ['Hourly', 'Daily', 'Weekly', 'Monthly'];
const DAY_OPTIONS = ['1 day', '2 days', '3 days', '7 days', '14 days', '30 days'];
const TIME_OPTIONS = [
  '12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '6:00 AM', '6:30 AM',
  '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '9:00 PM',
];

const variantArgType = {
  variant: { control: 'select', options: ['Empty', 'Default', 'Filled'] },
};

// ─── RHSStart ────────────────────────────────────────────────────────────────

const rhsStartProps = {
  Empty: { initialValues: {} },
  Default: { initialValues: { agentName: 'Review Response Agent' } },
  Filled: { initialValues: {
    agentName: 'Review Response Agent',
    description: 'Automatically responds to new reviews across all locations',
  }},
};

export const RHSStart = {
  name: 'RHSStart',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="start" title="Start"
      onClose={noop} onSave={noop}
      bodyProps={rhsStartProps[variant]}
    />
  ),
};

// ─── RHSTask ─────────────────────────────────────────────────────────────────

const rhsTaskProps = {
  Empty: { initialValues: {} },
  Default: { initialValues: { taskName: 'Send Review Response' } },
  Filled: { initialValues: {
    taskName: 'Send Review Response',
    description: 'Post a reply to the selected review from the Reviews source',
  }},
};

export const RHSTask = {
  name: 'RHSTask',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="entityTask" title="Task"
      onClose={noop} onSave={noop} onPreview={noop} onExpand={noop}
      bodyProps={rhsTaskProps[variant]}
    />
  ),
};

// ─── RHSCustomTask ───────────────────────────────────────────────────────────

const rhsCustomTaskProps = {
  Empty: { initialValues: {} },
  Default: { initialValues: {
    taskName: 'Classify Sentiment',
    description: 'Determine the sentiment of the review',
    llmModel: 'Fast',
  }},
  Filled: { initialValues: {
    taskName: 'Classify Sentiment',
    description: 'Determine the sentiment and extract key themes from the review text',
    llmModel: 'Standard',
    systemPrompt: 'You are a sentiment analysis expert. Analyze the following review and classify its overall sentiment as positive, neutral, or negative.',
    userPrompt: 'Review: {{review_text}}\n\nProvide a sentiment score from 1–10 and list the key themes mentioned.',
    outputFields: [
      { fieldName: 'sentiment_score', fieldType: 'Number' },
      { fieldName: 'key_themes', fieldType: 'Text' },
      { fieldName: 'overall_rating', fieldType: 'Number' },
    ],
  }},
};

export const RHSCustomTask = {
  name: 'RHSCustomTask',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="llmTask" title="Custom task"
      onClose={noop} onSave={noop} onPreview={noop} onExpand={noop}
      bodyProps={rhsCustomTaskProps[variant]}
    />
  ),
};

// ─── RHSTrigger ──────────────────────────────────────────────────────────────

const rhsTriggerProps = {
  Empty: { initialValues: {} },
  Default: { initialValues: { triggerName: 'New Review' } },
  Filled: { initialValues: {
    triggerName: 'New Review Received',
    description: 'Triggers when a new or updated review is received across all sources and locations',
  }},
};

export const RHSTrigger = {
  name: 'RHSTrigger',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="entityTrigger" title="Trigger"
      onClose={noop} onSave={noop} onPreview={noop} onExpand={noop}
      bodyProps={rhsTriggerProps[variant]}
    />
  ),
};

// ─── RHSScheduledTrigger ─────────────────────────────────────────────────────

const rhsScheduledTriggerProps = {
  Empty: {},
  Default: { defaultFrequency: 'Daily', defaultDay: '7 days', defaultTime: '9:00 AM' },
  Filled: { defaultFrequency: 'Weekly', defaultDay: '14 days', defaultTime: '10:00 AM' },
};

export const RHSScheduledTrigger = {
  name: 'RHSScheduledTrigger',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <ScheduleBased
      onClose={noop} onExpand={noop} onPreview={noop} onSave={noop}
      frequencyOptions={FREQUENCY_OPTIONS}
      dayOptions={DAY_OPTIONS}
      timeOptions={TIME_OPTIONS}
      {...rhsScheduledTriggerProps[variant]}
    />
  ),
};

// ─── RHSBranchDetails ────────────────────────────────────────────────────────

const rhsBranchDetailsProps = {
  Empty: { initialValues: {} },
  Default: { initialValues: {
    branchName: 'Positive Reviews',
    conditions: [makeCondition(1)],
  }},
  Filled: { initialValues: {
    branchName: 'Positive Reviews',
    description: 'Branch for reviews with a rating of 4 stars or above',
    logic: 'AND',
    conditions: [
      makeCondition(1, 'rating', 'greater_than', '4'),
      makeCondition(2, 'sentiment', 'equals', '5'),
    ],
  }},
};

export const RHSBranchDetails = {
  name: 'RHSBranchDetails',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="branch" title="Branch details"
      onClose={noop} onSave={noop}
      bodyProps={rhsBranchDetailsProps[variant]}
    />
  ),
};

// ─── RHSControlBranch ────────────────────────────────────────────────────────

const rhsControlBranchProps = {
  Empty: { initialValues: { branches: [] } },
  Default: { initialValues: {
    basedOn: 'conditions',
    branches: [{ id: 1, name: 'Branch 1' }],
  }},
  Filled: { initialValues: {
    basedOn: 'conditions',
    branches: [
      { id: 1, name: 'Positive Reviews' },
      { id: 2, name: 'Negative Reviews' },
      { id: 3, name: 'Neutral Reviews' },
    ],
  }},
};

export const RHSControlBranch = {
  name: 'RHSControlBranch',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="controlBranch" title="Branch"
      onClose={noop} onSave={noop} onPreview={noop} onExpand={noop}
      bodyProps={rhsControlBranchProps[variant]}
    />
  ),
};

// ─── RHSDelay ────────────────────────────────────────────────────────────────

const rhsDelayProps = {
  Empty: { initialValues: {} },
  Default: { initialValues: { name: 'Wait for Processing' } },
  Filled: { initialValues: {
    name: 'Wait for Processing',
    duration: '24',
    unit: 'hours',
  }},
};

export const RHSDelay = {
  name: 'RHSDelay',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="delay" title="Delay"
      onClose={noop} onSave={noop}
      bodyProps={rhsDelayProps[variant]}
    />
  ),
};

// ─── RHSParallel ─────────────────────────────────────────────────────────────

const rhsParallelProps = {
  Empty: { initialValues: { branches: [] } },
  Default: { initialValues: {} },
  Filled: { initialValues: {
    nodeName: 'Process Multiple Sources',
    description: 'Handle reviews from different sources simultaneously',
    branches: [
      { name: 'Reviews Handler' },
      { name: 'Inbox Handler' },
      { name: 'Survey Handler' },
    ],
  }},
};

export const RHSParallel = {
  name: 'RHSParallel',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="parallel" title="Parallel tasks"
      onClose={noop} onSave={noop}
      bodyProps={rhsParallelProps[variant]}
    />
  ),
};

// ─── RHSLoop ─────────────────────────────────────────────────────────────────

const rhsLoopProps = {
  Empty: { initialValues: {} },
  Default: { initialValues: {
    name: 'Process Reviews',
    loopMode: 'manual',
  }},
  Filled: { initialValues: {
    name: 'Process All Reviews',
    description: 'Iterate through each review in the collection and apply the workflow',
    loopMode: 'variable',
    loopOver: 'reviews_list',
  }},
};

export const RHSLoop = {
  name: 'RHSLoop',
  argTypes: variantArgType,
  args: { variant: 'Empty' },
  render: ({ variant }) => wrap(
    <RHS variant="loop" title="Loop"
      onClose={noop} onSave={noop} onPreview={noop} onExpand={noop}
      bodyProps={rhsLoopProps[variant]}
    />
  ),
};
