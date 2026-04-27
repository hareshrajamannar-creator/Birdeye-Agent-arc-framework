import React from 'react';
import FlowCanvas from './FlowCanvas';

export default {
  title: 'Agent Builder/Modules/FlowCanvas/CanvasContainer',
  component: FlowCanvas,
  parameters: {
    layout: 'fullscreen',
  },
};

const NODE_WIDTH = 400;
const CENTER_X = 300;

const SAMPLE_NODES = [
  {
    id: 'start',
    type: 'start',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 0 },
    data: {
      title: 'Review response agent replying autonomously',
      subtitle: 'All locations',
    },
  },
  {
    id: 'end',
    type: 'end',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 200 },
    data: {},
  },
];

const SAMPLE_EDGES = [
  { id: 'e-start-end', source: 'start', target: 'end', type: 'addButton' },
];

export const Default = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FlowCanvas
        nodes={SAMPLE_NODES}
        edges={SAMPLE_EDGES}
        orientation="vertical"
      />
    </div>
  ),
};

export const Empty = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FlowCanvas nodes={[]} edges={[]} orientation="vertical" />
    </div>
  ),
};

const FILLED_NODES = [
  {
    id: 'start',
    type: 'start',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 0 },
    data: {
      title: 'Review response agent replying autonomously',
      subtitle: 'All locations',
    },
  },
  {
    id: 'trigger',
    type: 'trigger',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 150 },
    data: {
      title: 'Trigger',
      stepNumber: 1,
      description: 'When a new review is received or updated',
      subtitle: 'Agent triggers on new or updated reviews across all sources and locations',
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'task-entity',
    type: 'task',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 400 },
    data: {
      title: 'Task',
      stepNumber: 2,
      description: 'Fetch customer profile',
      subtitle: 'Retrieve account details and review history for the customer',
      hasAiIcon: false,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'task-llm',
    type: 'task',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 650 },
    data: {
      title: 'Task',
      stepNumber: 3,
      description: 'Generate response',
      subtitle: 'Generate a contextual response based on review content and customer profile',
      hasAiIcon: true,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'branch',
    type: 'branch',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 900 },
    data: {
      title: 'Branch',
      stepNumber: 4,
      description: 'Based on conditions',
      subtitle: 'Route flow based on review rating',
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  // Branch path labels
  {
    id: 'path-support',
    type: 'branchPath',
    position: { x: CENTER_X - 590, y: 1100 },
    data: { label: 'Support', hasIcons: true },
  },
  {
    id: 'path-product',
    type: 'branchPath',
    position: { x: CENTER_X + 20, y: 1100 },
    data: { label: 'Product', hasIcons: true },
  },
  {
    id: 'path-none',
    type: 'branchPath',
    position: { x: CENTER_X + 430, y: 1100 },
    data: { label: 'No conditions met', hasIcons: false },
  },
  // Tasks below paths
  {
    id: 'task-support',
    type: 'task',
    position: { x: CENTER_X - 650, y: 1280 },
    data: {
      title: 'Task',
      stepNumber: 5,
      description: 'Create ticket in Birdeye',
      subtitle: 'Create ticket for reviews related to customer support experience',
      hasAiIcon: false,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'task-product',
    type: 'task',
    position: { x: CENTER_X - NODE_WIDTH / 2, y: 1280 },
    data: {
      title: 'Task',
      stepNumber: 6,
      description: 'Send a review response',
      subtitle: 'Reply to the review using the generated response',
      hasAiIcon: false,
      hasToggle: true,
      toggleEnabled: true,
    },
  },
];

const FILLED_EDGES = [
  { id: 'e-start-trigger', source: 'start', target: 'trigger', type: 'addButton' },
  { id: 'e-trigger-task-entity', source: 'trigger', target: 'task-entity', type: 'addButton' },
  { id: 'e-task-entity-task-llm', source: 'task-entity', target: 'task-llm', type: 'addButton' },
  { id: 'e-task-llm-branch', source: 'task-llm', target: 'branch', type: 'addButton' },
  // Branch to paths (plain connectors, no + button)
  { id: 'e-branch-support', source: 'branch', target: 'path-support', type: 'default', style: { stroke: '#ccd5e4', strokeWidth: 1 } },
  { id: 'e-branch-product', source: 'branch', target: 'path-product', type: 'default', style: { stroke: '#ccd5e4', strokeWidth: 1 } },
  { id: 'e-branch-none', source: 'branch', target: 'path-none', type: 'default', style: { stroke: '#ccd5e4', strokeWidth: 1 } },
  // Path to task
  { id: 'e-support-task', source: 'path-support', target: 'task-support', type: 'addButton' },
  { id: 'e-product-task', source: 'path-product', target: 'task-product', type: 'addButton' },
];

export const Filled = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <FlowCanvas
        nodes={FILLED_NODES}
        edges={FILLED_EDGES}
        orientation="vertical"
      />
    </div>
  ),
};
