import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Handle,
  Position,
  BaseEdge,
  getStraightPath,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
} from '@xyflow/react';
import GraphControls from '../Modules/FlowCanvas/GraphControls/GraphControls';
import '@xyflow/react/dist/style.css';
import StartNode from '../Molecules/Canvas/StartNode/StartNode';
import EndNode from '../Molecules/Canvas/EndNode/EndNode';
import CanvasNode from '../Molecules/Canvas/CanvasNode/CanvasNode';
import './FlowCanvas.css';
import branchStyles from './BranchPath.module.css';

const DRAG_HANDLE_CLASS = 'flow-canvas__drag-handle';
const DRAGGABLE_TYPES = new Set(['trigger', 'task', 'branch', 'delay', 'parallel', 'loop']);

/* ─── Custom Node Wrappers ─── */
function DragHandle() {
  return (
    <div className={DRAG_HANDLE_CLASS} title="Drag to reorder">
      <span className="material-symbols-outlined">drag_indicator</span>
    </div>
  );
}

function StartNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <StartNode title={data.title} subtitle={data.subtitle} selected={isSelected} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function TriggerNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <div className="flow-canvas__node-draggable-row">
        <DragHandle />
        <CanvasNode nodeType="trigger" label="Trigger" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function TaskNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <div className="flow-canvas__node-draggable-row">
        <DragHandle />
        <CanvasNode nodeType="task" label="Task" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} hasAiIcon={data.hasAiIcon} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function BranchNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <div className="flow-canvas__node-draggable-row">
        <DragHandle />
        <CanvasNode nodeType="branch" label="Branch" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} hasAddButton onAddClick={data.onAddBranch} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function BranchPathNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  const chipClass = [
    branchStyles.chip,
    data.isFallback ? branchStyles.chipFallback : '',
    isSelected ? branchStyles.chipSelected : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={branchStyles.pathWrapper}>
      <Handle type="target" position={Position.Top} />
      <div className={chipClass}>
        <span className={branchStyles.chipLabel}>{data.label}</span>
        {!data.isFallback && (
          <span className={`material-symbols-outlined ${branchStyles.chipIcon}`}>info</span>
        )}
        <span className={`material-symbols-outlined ${branchStyles.chipMenu}`}>more_vert</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function EndNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <EndNode selected={isSelected} />
    </div>
  );
}

/* ─── Custom Edge: main connector with + button ─── */
function AddButtonEdge({ id, sourceX, sourceY, targetX, targetY, style, data }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const isDraggingFromLHS = data?.isDraggingFromLHS;

  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const type = e.dataTransfer.getData('application/reactflow-type');
    const label = e.dataTransfer.getData('application/reactflow-label');
    const description = e.dataTransfer.getData('application/reactflow-description');
    if (type && data?.onDropOnEdge) {
      data.onDropOnEdge(type, label, description);
    }
  }, [data]);

  const btnClass = [
    'flow-canvas__edge-add',
    isDraggingFromLHS ? 'flow-canvas__edge-add--lhs-drag' : '',
    isDragOver ? 'flow-canvas__edge-add--drop-target' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} />
      <foreignObject width={56} height={56} x={labelX - 28} y={labelY - 28}>
        <div
          className="flow-canvas__edge-add-wrapper"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button className={btnClass} type="button">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </foreignObject>
    </>
  );
}

/* ─── Custom Edge: branch fan ─── */
function BranchFanEdge({ sourceX, sourceY, targetX, targetY }) {
  const midY = sourceY + 30;
  const d = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  return <path d={d} className="flow-canvas__branch-fan" fill="none" />;
}

/* ─── Stable node / edge type maps ─── */
const NODE_TYPES = {
  start: StartNodeWrapper,
  trigger: TriggerNodeWrapper,
  task: TaskNodeWrapper,
  branch: BranchNodeWrapper,
  branchPath: BranchPathNodeWrapper,
  end: EndNodeWrapper,
};

const EDGE_TYPES = {
  addButton: AddButtonEdge,
  branchFan: BranchFanEdge,
};

/* ─── Main FlowCanvas ─── */
function FlowCanvasInner({
  nodes = [],
  edges = [],
  onNodeClick,
  onDropNode,
  onNodesReorder,
  orientation = 'vertical',
  onOrientationChange,
  onRun,
  selectedNodeId,
}) {
  const { screenToFlowPosition, zoomTo, fitView, getNodes } = useReactFlow();
  const [zoom, setZoom] = useState(100);
  const [isDraggingFromLHS, setIsDraggingFromLHS] = useState(false);

  // ─── Stable callback refs ───
  const onDropNodeRef = useRef(onDropNode);
  useEffect(() => { onDropNodeRef.current = onDropNode; }, [onDropNode]);
  const onNodesReorderRef = useRef(onNodesReorder);
  useEffect(() => { onNodesReorderRef.current = onNodesReorder; }, [onNodesReorder]);

  // ─── Enrich controlled nodes with selectedNodeId + dragHandle ───
  const styledNodes = useMemo(
    () => nodes.map((n) => ({
      ...n,
      data: { ...n.data, selectedNodeId },
      // Restrict drag to the handle element so clicking the node body
      // selects it without accidentally starting a drag
      dragHandle: DRAGGABLE_TYPES.has(n.type) ? `.${DRAG_HANDLE_CLASS}` : undefined,
    })),
    [nodes, selectedNodeId]
  );

  // ─── Local node state for smooth drag ───
  // Controlled `nodes` drives layout; `localNodes` lets React Flow update
  // positions ONLY while actively dragging (dragging: true changes).
  // Any other change type (dimensions, select, reset, etc.) is ignored to
  // prevent React Flow's internal bookkeeping from corrupting our layout.
  const [localNodes, setLocalNodes] = useState(styledNodes);
  const isDraggingNodeRef = useRef(false);
  const prevNodeCountRef = useRef(styledNodes.length);

  // Sync parent → local whenever styledNodes changes, but not mid-drag
  useEffect(() => {
    if (isDraggingNodeRef.current) return;
    setLocalNodes(styledNodes);
    // Fit view whenever nodes are added or removed
    if (styledNodes.length !== prevNodeCountRef.current) {
      prevNodeCountRef.current = styledNodes.length;
      setTimeout(() => fitView({ padding: 0.3, duration: 300 }), 50);
    }
  }, [styledNodes, fitView]);

  // CRITICAL FIX: only apply position changes while the node is actively
  // being dragged (dragging === true). React Flow also emits position changes
  // with dragging:false during viewport sync — applying those corrupts the layout.
  const handleNodesChange = useCallback((changes) => {
    const activePositionChanges = changes.filter(
      (c) => c.type === 'position' && c.dragging === true
    );
    if (activePositionChanges.length === 0) return;
    setLocalNodes((nds) => applyNodeChanges(activePositionChanges, nds));
  }, []);

  const handleNodeDragStart = useCallback(() => {
    isDraggingNodeRef.current = true;
  }, []);

  // After drag ends, sort all draggable nodes by final Y and reorder
  const handleNodeDragStop = useCallback(() => {
    isDraggingNodeRef.current = false;
    if (!onNodesReorderRef.current) return;
    const allNodes = getNodes();
    const draggable = allNodes
      .filter((n) => n.type !== 'start' && n.type !== 'end' && n.type !== 'branchPath')
      .sort((a, b) => a.position.y - b.position.y);
    onNodesReorderRef.current(draggable.map((n) => n.id));
  }, [getNodes]);

  // Detect LHS panel drag start/end (HTML5 drag API)
  useEffect(() => {
    const onDragStart = (e) => {
      if (e.dataTransfer?.types?.includes('application/reactflow-type')) {
        setIsDraggingFromLHS(true);
      }
    };
    const onDragEnd = () => setIsDraggingFromLHS(false);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragend', onDragEnd);
    return () => {
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('dragend', onDragEnd);
    };
  }, []);

  const defaultEdgeOptions = useMemo(
    () => ({ type: 'addButton', style: { stroke: '#ccd5e4', strokeWidth: 1 } }),
    []
  );

  const handleNodeClick = useCallback(
    (event, node) => onNodeClick?.(node),
    [onNodeClick]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Canvas-wide drop (append to end) — only fires if not caught by an edge foreignObject
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');
      const description = event.dataTransfer.getData('application/reactflow-description');
      if (!type) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      onDropNodeRef.current?.({ type, label, description, position });
    },
    [screenToFlowPosition]
  );

  // Enrich edges with drop callbacks and LHS-drag flag
  const styledEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          isDraggingFromLHS,
          onDropOnEdge: (type, label, description) => {
            onDropNodeRef.current?.({ type, label, description, afterNodeId: edge.source });
          },
        },
      })),
    [edges, isDraggingFromLHS]
  );

  const handleViewportChange = useCallback(({ zoom: z }) => {
    setZoom(Math.round(z * 100));
  }, []);

  return (
    <div className={`flow-canvas${isDraggingFromLHS ? ' flow-canvas--lhs-dragging' : ''}`}>
      <div className="flow-canvas__toolbar-anchor">
        <GraphControls
          orientation={orientation}
          onOrientationChange={onOrientationChange}
          onRun={onRun}
          zoom={zoom}
          onZoomSelect={(z) => zoomTo(z, { duration: 200 })}
          onFitView={() => fitView({ padding: 0.3, duration: 200 })}
        />
      </div>

      <ReactFlow
        nodes={localNodes}
        edges={styledEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={handleNodesChange}
        onNodeClick={handleNodeClick}
        onNodeDragStart={handleNodeDragStart}
        onNodeDragStop={handleNodeDragStop}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onViewportChange={handleViewportChange}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        panOnScroll
        zoomOnScroll
      />
    </div>
  );
}

export default function FlowCanvas(props) {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
