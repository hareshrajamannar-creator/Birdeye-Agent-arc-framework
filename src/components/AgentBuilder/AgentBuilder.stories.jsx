import React, { useState } from 'react';
import AgentBuilder from './AgentBuilder';
import AppShell from '../AppShell/AppShell';
import LHSDrawer from '../LHSDrawer/LHSDrawer';
import FlowCanvas from '../FlowCanvas/FlowCanvas';
import RHS from '../Organisms/Panels/RHS/RHS';
import './AgentBuilder.css';

export default {
  title: 'Agent Builder/Templates/AgentBuilderTemplate',
  component: AgentBuilder,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = {
  render: () => (
    <AgentBuilder
      appTitle="Reviews AI"
      pageTitle="Review response agent  1"
      activeNavId="reviews"
    />
  ),
};

const NODE_WIDTH = 400;
const CENTER_X = 300;

const FILLED_NODES = [
  {
    id: 'start',
    type: 'start',
    position: { x: CENTER_X - 220, y: 0 },
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

const FILLED_NODE_DATA = {
  start: {
    agentName: 'Review response agent replying autonomously',
    goals: 'Automatically respond to customer reviews across all locations, maintaining brand voice and addressing specific customer feedback.',
    outcomes: 'Faster response times, improved customer satisfaction, and consistent brand messaging across all review platforms.',
    locations: [
      { id: '1001', name: 'Mountain View, CA' },
      { id: '1002', name: 'Seattle, WA' },
      { id: '1003', name: 'Chicago, IL' },
    ],
    moreLocationsCount: 2,
  },
  trigger: {
    triggerName: 'New or updated review',
    description: 'Agent triggers on new or updated reviews across all sources and locations',
  },
  'task-entity': {
    taskName: 'Fetch customer profile',
    description: 'Retrieve account details and review history for the customer',
  },
  'task-llm': {
    taskName: 'Generate response',
    description: 'Generate a contextual response based on review content and customer profile',
    llmModel: 'Fast',
    systemPrompt: 'You are a professional customer service agent representing our brand. Respond to customer reviews in a friendly, helpful, and professional manner. Always acknowledge the customer\'s feedback and offer a resolution where applicable.',
    userPrompt: 'Generate a response to the following review:\n\nReview: {{review_text}}\nRating: {{review_rating}}\nCustomer: {{customer_name}}\nLocation: {{location_name}}',
  },
  branch: {
    basedOn: 'conditions',
    branches: [
      { id: 1, name: 'Support' },
      { id: 2, name: 'Product' },
    ],
  },
  'path-support': {
    branchName: 'Support',
    description: 'Reviews related to customer support experience',
    logic: 'OR',
  },
  'path-product': {
    branchName: 'Product',
    description: 'Reviews related to product quality or features',
    logic: 'OR',
  },
  'path-none': {
    branchName: 'No conditions met',
    description: 'Default path when no other branch conditions are matched',
    logic: 'OR',
  },
  'task-support': {
    taskName: 'Create ticket in Birdeye',
    description: 'Create ticket for reviews related to customer support experience',
  },
  'task-product': {
    taskName: 'Send a review response',
    description: 'Reply to the review using the generated response',
  },
};

function getFilledVariant(node) {
  if (node.type === 'start') return { variant: 'agentDetails', title: 'Agent details' };
  if (node.type === 'trigger') return { variant: 'entityTrigger', title: 'Trigger' };
  if (node.type === 'branch') return { variant: 'controlBranch', title: 'Branch details' };
  if (node.type === 'branchPath') return { variant: 'branch', title: node.data?.label || 'Branch details' };
  if (node.data?.hasAiIcon) return { variant: 'llmTask', title: 'LLM Task' };
  return { variant: 'entityTask', title: 'Task' };
}

let storyNodeCounter = 100;
function nextStoryId() {
  storyNodeCounter += 1;
  return `story-node-${storyNodeCounter}`;
}

function FilledPreview() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nodes, setNodes] = useState(FILLED_NODES);
  const [edges, setEdges] = useState(FILLED_EDGES);

  const handleNodeClick = (node) => {
    if (node.type === 'end') return;
    setSelectedNodeId(node.id);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setSelectedNodeId(null);
    setDrawerOpen(false);
  };

  const handleDropNode = ({ type, label, description, position }) => {
    const id = nextStoryId();
    const flowType = type === 'trigger' ? 'trigger' : 'task';
    const newNode = {
      id,
      type: flowType,
      position,
      data: {
        title: flowType === 'trigger' ? 'Trigger' : 'Task',
        stepNumber: nodes.filter((n) => n.type === flowType).length + 1,
        description,
        subtitle: (description && description !== label) ? description : '',
        hasAiIcon: label === 'Custom',
        hasToggle: true,
        toggleEnabled: true,
      },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const rhsConfig = selectedNode ? getFilledVariant(selectedNode) : null;
  const nodeData = selectedNodeId ? (FILLED_NODE_DATA[selectedNodeId] || {}) : {};
  const bodyProps = rhsConfig?.variant === 'agentDetails'
    ? { values: nodeData }
    : { initialValues: nodeData };

  return (
    <AppShell
      appTitle="Reviews AI"
      pageTitle="Review response agent 1"
      activeNavId="reviews"
      publishDisabled
    >
      <div className="agent-builder">
        <div className="agent-builder__lhs">
          <LHSDrawer defaultTab="Create manually" triggerOpen tasksOpen={false} controlsOpen={false} />
        </div>
        <div className={`agent-builder__canvas ${drawerOpen ? 'agent-builder__canvas--with-rhs' : ''}`}>
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            onDropNode={handleDropNode}
            selectedNodeId={selectedNodeId}
            orientation="vertical"
          />
        </div>
        {drawerOpen && rhsConfig && (
          <div className="agent-builder__rhs">
            <RHS
              variant={rhsConfig.variant}
              title={rhsConfig.title}
              bodyProps={bodyProps}
              onClose={handleClose}
              onSave={handleClose}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}

export const Filled = {
  render: () => <FilledPreview />,
};
