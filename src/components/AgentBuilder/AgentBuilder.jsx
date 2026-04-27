import React, { useState, useCallback } from 'react';
import AppShell from '../AppShell/AppShell';
import LHSDrawer from '../LHSDrawer/LHSDrawer';
import FlowCanvas from '../FlowCanvas/FlowCanvas';
import RHS from '../Organisms/Panels/RHS/RHS';
import ScheduleBased from '../Molecules/RHS/Trigger/ScheduleBased/ScheduleBased';
import './AgentBuilder.css';

const START_NODE_ID = '__start__';
const END_NODE_ID = '__end__';

function buildFlow(nodeList, startData, nodeDetails = {}) {
  let y = 0;
  const nodes = [];
  const edges = [];

  nodes.push({
    id: START_NODE_ID,
    type: 'start',
    position: { x: 0, y },
    data: { title: startData.title, subtitle: startData.subtitle },
  });
  y += 150;

  nodeList.forEach((item, i) => {
    const nodeId = item.id;
    const prevId = i === 0 ? START_NODE_ID : nodeList[i - 1].id;
    nodes.push({
      id: nodeId,
      type: item.flowType,
      position: { x: 0, y },
      data: { ...item.data },
    });
    edges.push({
      id: `e-${prevId}-${nodeId}`,
      source: prevId,
      target: nodeId,
      type: 'addButton',
    });

    if (item.flowType === 'branch') {
      const branches = nodeDetails[nodeId]?.branches || [];
      const spacing = 220;
      const startX = -((branches.length - 1) * spacing) / 2;
      branches.forEach((branch, bi) => {
        nodes.push({
          id: branch.id,
          type: 'branchPath',
          position: { x: startX + bi * spacing, y: y + 150 },
          data: { label: branch.name, hasIcons: true, parentId: nodeId },
        });
        edges.push({
          id: `e-${nodeId}-${branch.id}`,
          source: nodeId,
          target: branch.id,
          style: { stroke: '#ccd5e4', strokeWidth: 1 },
        });
      });
      y += 150;
    }

    y += 250;
  });

  const lastId = nodeList.length > 0 ? nodeList[nodeList.length - 1].id : START_NODE_ID;
  nodes.push({
    id: END_NODE_ID,
    type: 'end',
    position: { x: 0, y },
    data: {},
  });
  edges.push({
    id: `e-${lastId}-${END_NODE_ID}`,
    source: lastId,
    target: END_NODE_ID,
    type: 'addButton',
  });

  return { nodes, edges };
}

let nodeIdCounter = 0;
function nextId() {
  nodeIdCounter += 1;
  return `node-${nodeIdCounter}`;
}

export default function AgentBuilder({
  appTitle = 'Reviews AI',
  pageTitle = 'Review response agent  1',
  activeNavId = 'reviews',
}) {
  const [navId, setNavId] = useState(activeNavId);
  const [nodeList, setNodeList] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nodeDetails, setNodeDetails] = useState({});

  const handleDeleteNode = useCallback((nodeId) => {
    setNodeList((prev) => {
      const updated = prev.filter((n) => n.id !== nodeId);
      return updated.map((n, i) => ({
        ...n,
        data: { ...n.data, stepNumber: i + 1 },
      }));
    });
    setNodeDetails((prev) => {
      const copy = { ...prev };
      // Remove the node and any branch path details that belong to it
      Object.keys(copy).forEach((key) => {
        if (key === nodeId || copy[key]?.parentId === nodeId) {
          delete copy[key];
        }
      });
      return copy;
    });
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setDrawerOpen(false);
    }
  }, [selectedNodeId]);

  const startData = { title: pageTitle, subtitle: 'AI-powered review response agent' };
  const { nodes: rawNodes, edges } = buildFlow(nodeList, startData, nodeDetails);

  const nodes = rawNodes.map((n) => {
    if (n.id === START_NODE_ID || n.id === END_NODE_ID) return n;
    if (n.type === 'branchPath') return n;
    return {
      ...n,
      data: { ...n.data, onDelete: () => handleDeleteNode(n.id) },
    };
  });

  const selectedNode = nodeList.find((n) => n.id === selectedNodeId);

  const handleDropNode = useCallback(({ type, label, description }) => {
    const id = nextId();

    let flowType = 'task';
    let title = 'Task';
    let hasAiIcon = false;

    if (type === 'trigger') {
      flowType = 'trigger';
      title = 'Trigger';
    } else if (type === 'branch') {
      flowType = 'branch';
      title = label;
    } else if (type === 'delay') {
      flowType = 'delay';
      title = 'Delay';
    } else if (type === 'parallel') {
      flowType = 'parallel';
      title = 'Parallel tasks';
    } else if (type === 'loop') {
      flowType = 'loop';
      title = 'Loop';
    } else if (type === 'task') {
      flowType = 'task';
      title = 'Task';
      hasAiIcon = label === 'Custom';
    }

    const newNode = {
      id,
      flowType,
      data: {
        title,
        subtype: label,
        stepNumber: null,
        description,
        subtitle: `${label}: ${description}`,
        hasAiIcon,
        hasToggle: true,
        toggleEnabled: true,
      },
    };

    setNodeList((prev) => {
      const updated = [...prev, newNode];
      return updated.map((n, i) => ({
        ...n,
        data: { ...n.data, stepNumber: i + 1 },
      }));
    });

    let details = {};
    let extraDetails = {};

    if (type === 'trigger' && label === 'Schedule-based') {
      details = { frequency: 'Daily', day: '7 days', time: '9:00 AM' };
    } else if (type === 'trigger') {
      details = {
        triggerName: label || '',
        description: description || '',
        conditions: [
          { field: '', operator: '', value: '' },
          { field: '', operator: '', value: '' },
          { field: '', operator: '', value: '' },
        ],
      };
    } else if (type === 'branch' && label === 'Branch') {
      const path1Id = `${id}-path-1`;
      const path2Id = `${id}-path-2`;
      details = {
        basedOn: 'Conditions',
        branches: [
          { id: path1Id, name: 'Branch 1' },
          { id: path2Id, name: 'Branch 2' },
        ],
      };
      extraDetails = {
        [path1Id]: { branchName: 'Branch 1', description: '', conditions: [], parentId: id, isBranchPath: true },
        [path2Id]: { branchName: 'Branch 2', description: '', conditions: [], parentId: id, isBranchPath: true },
      };
    } else if (type === 'delay') {
      details = { duration: '1', unit: 'hours' };
    } else if (type === 'parallel') {
      details = { tasks: [] };
    } else if (type === 'loop') {
      details = { iterations: 3, exitCondition: '' };
    } else if (type === 'task' && label === 'Custom') {
      details = {
        taskName: 'Identify relevant mentions in the review',
        description: 'Extract product or service-specific feedback from the review',
        llmModel: 'Fast',
        systemPrompt: '',
        userPrompt: '',
      };
    } else {
      details = {
        taskName: description,
        description: '',
      };
    }

    setNodeDetails((prev) => ({
      ...prev,
      [id]: details,
      ...extraDetails,
    }));
  }, []);

  const handleNodeClick = useCallback((node) => {
    if (node.type === 'end') return;
    setSelectedNodeId(node.id);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedNodeId(null);
  }, []);

  const currentDetails = selectedNodeId ? (nodeDetails[selectedNodeId] || {}) : {};

  const renderRHSPanel = () => {
    if (!selectedNodeId) return null;

    // Start node → agent details
    if (selectedNodeId === START_NODE_ID) {
      const startDetails = nodeDetails[START_NODE_ID] || {
        agentName: pageTitle,
        goals: 'Respond to customer reviews promptly and professionally, maintaining brand voice and addressing specific customer feedback.',
        outcomes: 'Improved customer satisfaction scores, faster response times, and consistent brand messaging across all review platforms.',
        locations: [
          { id: '1001', name: 'Mountain view, CA' },
          { id: '1002', name: 'Seattle, WA' },
          { id: '1004', name: 'Chicago, IL' },
        ],
        moreLocationsCount: 1,
      };
      return (
        <RHS
          variant="agentDetails"
          title="Agent details"
          bodyProps={{
            values: startDetails,
            onChange: (field, value) => {
              setNodeDetails((prev) => ({
                ...prev,
                [START_NODE_ID]: { ...startDetails, [field]: value },
              }));
            },
          }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    // Branch path node → branch details
    if (currentDetails.isBranchPath) {
      return (
        <RHS
          variant="branch"
          title={currentDetails.branchName || 'Branch details'}
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (!selectedNode) return null;
    const { flowType, data } = selectedNode;

    // Schedule trigger
    if (flowType === 'trigger' && data.subtype === 'Schedule-based') {
      return (
        <ScheduleBased
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
          onPreview={() => {}}
          onExpand={() => {}}
          frequencyOptions={['Hourly', 'Daily', 'Weekly', 'Monthly']}
          dayOptions={['1 day', '2 days', '3 days', '7 days', '14 days', '30 days']}
          timeOptions={['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM']}
          defaultFrequency={currentDetails.frequency || 'Daily'}
          defaultDay={currentDetails.day || '7 days'}
          defaultTime={currentDetails.time || '9:00 AM'}
        />
      );
    }

    // Entity trigger
    if (flowType === 'trigger') {
      return (
        <RHS
          variant="entityTrigger"
          title="Trigger"
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    // Branch node → branch overview (controlBranch)
    if (flowType === 'branch') {
      return (
        <RHS
          variant="controlBranch"
          title="Branch details"
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    // Delay node
    if (flowType === 'delay') {
      return (
        <RHS
          variant="delay"
          title="Delay"
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    // Parallel node
    if (flowType === 'parallel') {
      return (
        <RHS
          variant="parallel"
          title="Parallel tasks"
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    // Loop node
    if (flowType === 'loop') {
      return (
        <RHS
          variant="loop"
          title="Loop"
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    // LLM task (Custom)
    if (data.hasAiIcon) {
      return (
        <RHS
          variant="llmTask"
          title="LLM Task"
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    // Entity task (default)
    return (
      <RHS
        variant="entityTask"
        title="Task"
        bodyProps={{ initialValues: currentDetails }}
        onClose={handleCloseDrawer}
        onSave={handleCloseDrawer}
      />
    );
  };

  return (
    <AppShell
      appTitle={appTitle}
      pageTitle={pageTitle}
      activeNavId={navId}
      onNavChange={setNavId}
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
        {drawerOpen && (
          <div className="agent-builder__rhs">
            {renderRHSPanel()}
          </div>
        )}
      </div>
    </AppShell>
  );
}
