import React from 'react';
import { ReactFlow, ReactFlowProvider, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RHS from '../../../../Organisms/Panels/RHS/RHS';
import CanvasNode from '../../../../Molecules/Canvas/CanvasNode/CanvasNode';

export default {
  title: 'Agent Builder/Modules/Nodes/Control/BranchDetails',
  parameters: { layout: 'centered' },
};

/* ─── Inline node types for branch canvas preview ─── */

function BranchNodeWrapper({ data }) {
  return (
    <div style={{ width: 400 }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <CanvasNode
        nodeType="branch"
        label={data.label}
        stepNumber={data.stepNumber}
        title={data.title}
        description={data.description}
        hasToggle={data.hasToggle}
        toggleEnabled={data.toggleEnabled}
      />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

function BranchPathNode({ data }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ccd5e4',
      borderRadius: 6,
      padding: '6px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      minWidth: 160,
      fontSize: 13,
      color: '#1a2b4a',
      whiteSpace: 'nowrap',
    }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <span style={{ flex: 1 }}>{data.label}</span>
      {data.hasIcons && (
        <>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#8d9dca' }}>info</span>
          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#8d9dca' }}>more_vert</span>
        </>
      )}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

function TaskNodeWrapper({ data }) {
  return (
    <div style={{ width: 400 }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <CanvasNode
        nodeType="task"
        label={data.label}
        stepNumber={data.stepNumber}
        title={data.title}
        description={data.description}
        hasToggle={data.hasToggle}
        toggleEnabled={data.toggleEnabled}
      />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const NODE_TYPES = {
  branchNode: BranchNodeWrapper,
  branchPath: BranchPathNode,
  taskNode: TaskNodeWrapper,
};

const EDGE_STYLE = { stroke: '#ccd5e4', strokeWidth: 1 };
const DASHED_EDGE_STYLE = { stroke: '#ccd5e4', strokeWidth: 1, strokeDasharray: '4 4' };

const CANVAS_NODES = [
  {
    id: 'branch',
    type: 'branchNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'Branch',
      stepNumber: 3,
      title: 'Based on conditions',
      description: 'Build condition-specific flows',
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'path-support',
    type: 'branchPath',
    position: { x: -340, y: 240 },
    data: { label: 'Support', hasIcons: true },
  },
  {
    id: 'path-product',
    type: 'branchPath',
    position: { x: 100, y: 240 },
    data: { label: 'Product', hasIcons: true },
  },
  {
    id: 'path-none',
    type: 'branchPath',
    position: { x: 520, y: 240 },
    data: { label: 'No conditions met', hasIcons: false },
  },
  {
    id: 'task-support',
    type: 'taskNode',
    position: { x: -440, y: 400 },
    data: {
      label: 'Task',
      stepNumber: 6,
      title: 'Create ticket in Birdeye',
      description: 'Create ticket for reviews related to customer support experience',
      hasToggle: true,
      toggleEnabled: true,
    },
  },
  {
    id: 'task-product',
    type: 'taskNode',
    position: { x: 0, y: 400 },
    data: {
      label: 'Task',
      stepNumber: 7,
      title: 'Create ticket in Birdeye',
      description: 'Create ticket for reviews related to product defects, features, or usability',
      hasToggle: true,
      toggleEnabled: true,
    },
  },
];

const CANVAS_EDGES = [
  { id: 'e-branch-support', source: 'branch', target: 'path-support', style: EDGE_STYLE },
  { id: 'e-branch-product', source: 'branch', target: 'path-product', style: EDGE_STYLE },
  { id: 'e-branch-none', source: 'branch', target: 'path-none', style: EDGE_STYLE },
  { id: 'e-support-task', source: 'path-support', target: 'task-support', style: DASHED_EDGE_STYLE },
  { id: 'e-product-task', source: 'path-product', target: 'task-product', style: DASHED_EDGE_STYLE },
];

export const CanvasPreview = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={CANVAS_NODES}
          edges={CANVAS_EDGES}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnScroll
          zoomOnScroll
        />
      </ReactFlowProvider>
    </div>
  ),
};

export const ExpandedRHSPreview = {
  render: () => null,
};

export const RHSPreview = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ width: 390, height: '100vh' }}>
      <RHS variant="branch" title="Branch details" onClose={() => {}} onSave={() => {}} />
    </div>
  ),
};
