import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Handle,
  Position,
  BaseEdge,
  getStraightPath,
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

/* ─── Drag handle ─── */
function DragHandle() {
  return (
    <div className={DRAG_HANDLE_CLASS} title="Drag to reorder">
      <span className="material-symbols-outlined">drag_indicator</span>
    </div>
  );
}

/* ─── Custom Node Wrappers ─── */
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
        <CanvasNode nodeType="trigger" label={data.headerLabel || (data.subtype === 'Schedule-based' ? 'Schedule-based trigger' : 'Trigger')} stepNumber={data.stepNumber} title={data.title} description={data.subtitle} titlePlaceholder={data.titlePlaceholder} descriptionPlaceholder={data.descriptionPlaceholder} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} />
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
        <CanvasNode nodeType="task" label="Task" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} titlePlaceholder={data.titlePlaceholder} descriptionPlaceholder={data.descriptionPlaceholder} hasAiIcon={data.hasAiIcon} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} />
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
        <CanvasNode nodeType="branch" label="Branch" stepNumber={data.stepNumber} title={data.title} description={data.subtitle} titlePlaceholder={data.titlePlaceholder} descriptionPlaceholder={data.descriptionPlaceholder} hasToggle={data.hasToggle} toggleEnabled={data.toggleEnabled} hasAddButton onAddClick={data.onAddBranch} state={isSelected ? 'selected' : 'default'} onDelete={data.onDelete} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function ControlNodeWrapper({ id, data, nodeType, label }) {
  const isSelected = id === data.selectedNodeId;
  return (
    <div className="flow-canvas__node-center">
      <Handle type="target" position={Position.Top} />
      <div className="flow-canvas__node-draggable-row">
        <DragHandle />
        <CanvasNode
          nodeType={nodeType}
          label={label}
          stepNumber={data.stepNumber}
          title={data.title}
          description={data.subtitle}
          titlePlaceholder={data.titlePlaceholder}
          descriptionPlaceholder={data.descriptionPlaceholder}
          hasToggle={data.hasToggle}
          toggleEnabled={data.toggleEnabled}
          state={isSelected ? 'selected' : 'default'}
          onDelete={data.onDelete}
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

function DelayNodeWrapper(props) {
  return <ControlNodeWrapper {...props} nodeType="delay" label="Delay" />;
}

function ParallelNodeWrapper(props) {
  return <ControlNodeWrapper {...props} nodeType="parallel" label="Parallel tasks" />;
}

function LoopNodeWrapper(props) {
  return <ControlNodeWrapper {...props} nodeType="loop" label="Loop" />;
}

function BranchPathNodeWrapper({ id, data }) {
  const isSelected = id === data.selectedNodeId;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

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
        <div className={branchStyles.chipMenuWrapper} ref={menuRef}>
          <span
            className={`material-symbols-outlined ${branchStyles.chipMenu}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!data.isFallback) setMenuOpen((m) => !m);
            }}
          >more_vert</span>
          {menuOpen && !data.isFallback && (
            <div className={branchStyles.chipDropdown}>
              <button
                className={branchStyles.chipDropdownItem}
                type="button"
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); data.onDelete?.(); }}
              >
                <span className="material-symbols-outlined">delete</span>
                Delete branch
              </button>
            </div>
          )}
        </div>
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

function BranchEndNodeWrapper() {
  return (
    <div className="flow-canvas__branch-end-wrapper">
      <Handle type="target" position={Position.Top} />
      <div className="flow-canvas__branch-end">
        End
      </div>
    </div>
  );
}

/* ─── Custom Edge: main connector with + button ─── */
function AddButtonEdge({ id, sourceX, sourceY, targetX, targetY, style, data }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const isDraggingFromLHS = data?.isDraggingFromLHS;
  const viewOnly = data?.viewOnly;

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
      {!viewOnly && (
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
      )}
    </>
  );
}

/* ─── Custom Edge: branch fan ─── */
function BranchFanEdge({ sourceX, sourceY, targetX, targetY }) {
  const midY = sourceY + 30;
  const d = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;
  return <path d={d} className="flow-canvas__branch-fan" fill="none" />;
}

/* ─── Stable maps ─── */
const NODE_TYPES = {
  start: StartNodeWrapper,
  trigger: TriggerNodeWrapper,
  task: TaskNodeWrapper,
  branch: BranchNodeWrapper,
  delay: DelayNodeWrapper,
  parallel: ParallelNodeWrapper,
  loop: LoopNodeWrapper,
  branchPath: BranchPathNodeWrapper,
  branchEnd: BranchEndNodeWrapper,
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
  viewOnly = false,
}) {
  const { screenToFlowPosition, zoomTo, fitView, getNodes } = useReactFlow();
  const [zoom, setZoom] = useState(110);
  const [isDraggingFromLHS, setIsDraggingFromLHS] = useState(false);

  const onDropNodeRef = useRef(onDropNode);
  useEffect(() => { onDropNodeRef.current = onDropNode; }, [onDropNode]);
  const onNodesReorderRef = useRef(onNodesReorder);
  useEffect(() => { onNodesReorderRef.current = onNodesReorder; }, [onNodesReorder]);

  // Enrich nodes: inject selectedNodeId + restrict drag to handle element
  const styledNodes = useMemo(
    () => nodes.map((n) => ({
      ...n,
      data: { ...n.data, selectedNodeId },
      dragHandle: DRAGGABLE_TYPES.has(n.type) ? `.${DRAG_HANDLE_CLASS}` : undefined,
    })),
    [nodes, selectedNodeId]
  );

  // Local node state so React Flow can own positions during canvas drag
  const [localNodes, setLocalNodes] = useState(() => styledNodes);
  const isDraggingRef = useRef(false);

  // Sync parent → local whenever nodes change and no drag is in progress
  useEffect(() => {
    if (!isDraggingRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalNodes(styledNodes);
    }
  }, [styledNodes]);

  // Let React Flow mutate node positions during drag
  const handleNodesChange = useCallback((changes) => {
    const posChange = changes.find((c) => c.type === 'position');
    if (posChange) isDraggingRef.current = posChange.dragging === true;
    setLocalNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Fit view whenever a node is added or removed
  const prevNodeCountRef = useRef(nodes.length);
  useEffect(() => {
    if (nodes.length !== prevNodeCountRef.current) {
      prevNodeCountRef.current = nodes.length;
      setTimeout(() => fitView({ padding: 0.25, duration: 300, maxZoom: 1.1 }), 80);
    }
  }, [nodes.length, fitView]);

  // Detect LHS drag start/end (HTML5 drag API, separate from RF node drag)
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

  // On drag-stop: clear drag flag, sort canvas nodes by Y, call reorder
  const handleNodeDragStop = useCallback(() => {
    isDraggingRef.current = false;
    if (!onNodesReorderRef.current) return;
    const allNodes = getNodes();
    const draggable = allNodes
      .filter((n) => DRAGGABLE_TYPES.has(n.type))
      .sort((a, b) => a.position.y - b.position.y);
    onNodesReorderRef.current(draggable.map((n) => n.id));
  }, [getNodes]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // Canvas-wide drop — skip if landed inside a foreignObject (edge + buttons handle their own drops)
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (event.target.closest('foreignObject')) return;
      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');
      const description = event.dataTransfer.getData('application/reactflow-description');
      if (!type) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      onDropNodeRef.current?.({ type, label, description, position });
    },
    [screenToFlowPosition]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          isDraggingFromLHS,
          viewOnly,
          onDropOnEdge: viewOnly ? undefined : (type, label, description) => {
            onDropNodeRef.current?.({
              type,
              label,
              description,
              afterNodeId: edge.data?.afterNodeId ?? edge.source,
              branchPathId: edge.data?.branchPathId,
            });
          },
        },
      })),
    [edges, isDraggingFromLHS, viewOnly]
  );

  const handleViewportChange = useCallback(({ zoom: z }) => {
    setZoom(Math.round(z * 100));
  }, []);

  return (
    <div
      className={`flow-canvas${isDraggingFromLHS ? ' flow-canvas--lhs-dragging' : ''}`}
      onDragOver={viewOnly ? undefined : handleDragOver}
      onDrop={viewOnly ? undefined : handleDrop}
    >
      <div className="flow-canvas__toolbar-anchor">
        <GraphControls
          orientation={orientation}
          onOrientationChange={onOrientationChange}
          onRun={onRun}
          zoom={zoom}
          onZoomSelect={(z) => zoomTo(z, { duration: 200 })}
          onFitView={() => fitView({ padding: 0.25, duration: 200 })}
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
        onNodeDragStop={viewOnly ? undefined : handleNodeDragStop}
        onViewportChange={handleViewportChange}
        fitView
        fitViewOptions={{ padding: 0.25, maxZoom: 1.1 }}
        nodeOrigin={[0.5, 0]}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={!viewOnly}
        nodesConnectable={false}
        panOnScroll
        zoomOnScroll
      />
    </div>
  );
}

export default function FlowCanvas(props) {
  return (
    <FlowCanvasInner {...props} />
  );
}
