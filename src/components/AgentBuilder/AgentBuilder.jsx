import React, { useState, useCallback } from 'react';
import AppShell from '../AppShell/AppShell';
import LHSDrawer from '../LHSDrawer/LHSDrawer';
import FlowCanvas from '../FlowCanvas/FlowCanvas';
import RHS from '../Organisms/Panels/RHS/RHS';
import ScheduleBased from '../Molecules/RHS/Trigger/ScheduleBased/ScheduleBased';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import CustomModal from '@birdeye/elemental/core/atoms/CustomModal/index.js';
import FormInput from '@birdeye/elemental/core/atoms/FormInput/index.js';
import TextArea from '@birdeye/elemental/core/atoms/TextArea/index.js';
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
      const spacing = 280;
      const startX = -((branches.length - 1) * spacing) / 2;
      branches.forEach((branch, bi) => {
        nodes.push({
          id: branch.id,
          type: 'branchPath',
          position: { x: startX + bi * spacing, y: y + 150 },
          data: { label: branch.name, parentId: nodeId, isFallback: !!branch.isFallback },
        });
        edges.push({
          id: `e-${nodeId}-${branch.id}`,
          source: nodeId,
          target: branch.id,
          type: 'branchFan',
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
  pageTitle = 'Review response agent 1',
  activeNavId = 'reviews',
  moduleContext = 'agents',
  initialDescription = '',
  initialNodes = null,
  initialNodeDetails = null,
  onSaveAgent,
  onClose,
}) {
  const [navId, setNavId] = useState(activeNavId);
  const [nodeList, setNodeList] = useState(() => initialNodes || []);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nodeDetails, setNodeDetails] = useState(() => initialNodeDetails || {});

  /* ─── Save modal ─── */
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [agentName, setAgentName] = useState(pageTitle || '');
  const [agentDesc, setAgentDesc] = useState(initialDescription);

  const handleSaveConfirm = useCallback(() => {
    if (!agentName.trim()) return;
    onSaveAgent?.({
      id: crypto.randomUUID(),
      name: agentName.trim(),
      description: agentDesc.trim(),
      createdAt: new Date().toISOString(),
      status: 'Draft',
      moduleContext,
      nodes: nodeList,
      nodeDetails,
    });
    setSaveModalOpen(false);
  }, [agentName, agentDesc, moduleContext, nodeList, nodeDetails, onSaveAgent]);

  /* ─── Download handler ─── */
  const handleExport = useCallback(() => {
    const payload = {
      name: agentName,
      description: agentDesc,
      moduleContext,
      exportedAt: new Date().toISOString(),
      nodes: nodeList,
      nodeDetails,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentName.replace(/\s+/g, '-').toLowerCase() || 'agent'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [agentName, agentDesc, moduleContext, nodeList, nodeDetails]);

  /* ─── Live node sync: RHS → canvas ─── */
  const handleNodeFieldChange = useCallback((nodeId, field, value) => {
    setNodeDetails((prev) => {
      const nodeDet = prev[nodeId] || {};
      const updated = { ...prev, [nodeId]: { ...nodeDet, [field]: value } };
      // When a branch path's name changes, sync it into the parent's branches array
      // so buildFlow picks up the new label for the canvas chip
      if (field === 'branchName' && nodeDet.isBranchPath && nodeDet.parentId) {
        const parentId = nodeDet.parentId;
        const parentDet = prev[parentId] || {};
        updated[parentId] = {
          ...parentDet,
          branches: (parentDet.branches || []).map((b) =>
            b.id === nodeId ? { ...b, name: value } : b
          ),
        };
      }
      return updated;
    });
    // Mirror name/description changes into the canvas node body
    setNodeList((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        const updates = {};
        if (field === 'triggerName' || field === 'taskName') updates.title = value;
        if (field === 'description') updates.subtitle = `${n.data.subtype || n.data.title}: ${value}`;
        return { ...n, data: { ...n.data, ...updates } };
      })
    );
  }, []);

  /* ─── Node management ─── */

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

  const handleAddBranchPath = useCallback((branchNodeId) => {
    const newPathId = `${branchNodeId}-path-${Date.now()}`;
    setNodeDetails((prev) => {
      const nodeD = prev[branchNodeId] || {};
      const existing = nodeD.branches || [];
      const nonFallback = existing.filter((b) => !b.isFallback);
      const fallback = existing.filter((b) => b.isFallback);
      const pathNumber = nonFallback.length + 1;
      const newPath = { id: newPathId, name: `Branch ${pathNumber}` };
      return {
        ...prev,
        [branchNodeId]: {
          ...nodeD,
          branches: [...nonFallback, newPath, ...fallback],
        },
        [newPathId]: {
          branchName: newPath.name,
          description: '',
          conditions: [],
          parentId: branchNodeId,
          isBranchPath: true,
        },
      };
    });
  }, []);

  const startAgentName = nodeDetails[START_NODE_ID]?.agentName || pageTitle;
  const startData = { title: startAgentName, subtitle: 'All locations' };
  const { nodes: rawNodes, edges } = buildFlow(nodeList, startData, nodeDetails);

  const nodes = rawNodes.map((n) => {
    if (n.id === START_NODE_ID || n.id === END_NODE_ID) return n;
    if (n.type === 'branchPath') return n;
    const extra = { onDelete: () => handleDeleteNode(n.id) };
    if (n.type === 'branch') extra.onAddBranch = () => handleAddBranchPath(n.id);
    return { ...n, data: { ...n.data, ...extra } };
  });

  const selectedNode = nodeList.find((n) => n.id === selectedNodeId);

  const handleDropNode = useCallback(({ type, label, description }) => {
    const id = nextId();

    let flowType = 'task';
    let title = 'Task';
    let hasAiIcon = false;

    if (type === 'trigger') {
      flowType = 'trigger';
      // body title = the specific trigger variant (e.g. "Review mentioned")
      title = label || 'Trigger';
    } else if (type === 'branch' && label === 'Branch') {
      flowType = 'branch';
      title = 'Based on conditions';
    } else if (label === 'Delay') {
      flowType = 'delay';
      title = 'Delay';
    } else if (label === 'Parallel') {
      flowType = 'parallel';
      title = 'Parallel tasks';
    } else if (label === 'Loop') {
      flowType = 'loop';
      title = 'Loop';
    } else if (type === 'task') {
      flowType = 'task';
      hasAiIcon = label === 'Custom';
      // body title = the LHS description for entity tasks; keep generic for LLM tasks
      title = hasAiIcon ? 'Task' : (description || 'Task');
    }

    const newNode = {
      id,
      flowType,
      data: {
        title,
        subtype: label,
        stepNumber: null,
        description,
        subtitle: flowType === 'branch' ? 'Build condition-specific flows' : `${label}: ${description}`,
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
    } else if (label === 'Branch') {
      const path1Id = `${id}-path-1`;
      const path2Id = `${id}-path-2`;
      const fallbackId = `${id}-path-fallback`;
      details = {
        basedOn: 'conditions',
        branches: [
          { id: path1Id, name: 'Branch 1' },
          { id: path2Id, name: 'Branch 2' },
          { id: fallbackId, name: 'No conditions met', isFallback: true },
        ],
      };
      extraDetails = {
        [path1Id]: { branchName: 'Branch 1', description: '', conditions: [], parentId: id, isBranchPath: true },
        [path2Id]: { branchName: 'Branch 2', description: '', conditions: [], parentId: id, isBranchPath: true },
        [fallbackId]: { branchName: 'No conditions met', description: '', conditions: [], parentId: id, isBranchPath: true, isFallback: true },
      };
    } else if (label === 'Delay') {
      details = { duration: '1', unit: 'hours' };
    } else if (label === 'Parallel') {
      details = { tasks: [] };
    } else if (label === 'Loop') {
      details = { iterations: 3, exitCondition: '' };
    } else if (label === 'Custom') {
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

  /* ─── Shared onFieldChange for the active node ─── */
  const activeFieldChange = useCallback(
    (field, value) => handleNodeFieldChange(selectedNodeId, field, value),
    [selectedNodeId, handleNodeFieldChange]
  );

  const renderRHSPanel = () => {
    if (!selectedNodeId) return null;

    if (selectedNodeId === START_NODE_ID) {
      const startDetails = nodeDetails[START_NODE_ID] || {
        agentName: pageTitle,
        goals: 'Respond to customer reviews promptly and professionally, maintaining brand voice and addressing specific customer feedback.',
        outcomes: 'Improved customer satisfaction scores, faster response times, and consistent brand messaging across all review platforms.',
        locations: [],
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
                [START_NODE_ID]: { ...(prev[START_NODE_ID] || startDetails), [field]: value },
              }));
              if (field === 'agentName') setAgentName(value);
            },
          }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (currentDetails.isBranchPath) {
      return (
        <RHS
          variant="branch"
          title="Branch"
          bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (!selectedNode) return null;
    const { flowType, data } = selectedNode;

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

    if (flowType === 'trigger') {
      return (
        <RHS
          variant="entityTrigger"
          title="Trigger"
          bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (flowType === 'branch') {
      return (
        <RHS
          variant="controlBranch"
          title="Branch details"
          bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (flowType === 'delay') {
      return (
        <RHS
          variant="delay"
          title="Delay"
          bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (flowType === 'parallel') {
      return (
        <RHS
          variant="parallel"
          title="Parallel tasks"
          bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (flowType === 'loop') {
      return (
        <RHS
          variant="loop"
          title="Loop"
          bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    if (data.hasAiIcon) {
      return (
        <RHS
          variant="llmTask"
          title="LLM Task"
          bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

    return (
      <RHS
        variant="entityTask"
        title="Task"
        bodyProps={{ initialValues: currentDetails, onFieldChange: activeFieldChange }}
        onClose={handleCloseDrawer}
        onSave={handleCloseDrawer}
      />
    );
  };

  /* ─── Header actions: Download + Save (replaces Publish) ─── */
  const headerActions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Button
        theme="secondary"
        label="Download"
        customIcon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>}
        onClick={handleExport}
      />
      <Button
        theme="primary"
        label="Save"
        onClick={() => setSaveModalOpen(true)}
      />
    </div>
  );

  return (
    <AppShell
      appTitle={appTitle}
      pageTitle={agentName}
      activeNavId={navId}
      onNavChange={setNavId}
      showBack={!!onClose}
      onBack={onClose}
      pageActions={headerActions}
    >
      <div className="agent-builder">
        <div className="agent-builder__lhs">
          <LHSDrawer defaultTab="Create manually" triggerOpen tasksOpen={false} controlsOpen={false} />
        </div>

        <div className={`agent-builder__canvas${drawerOpen ? ' agent-builder__canvas--with-rhs' : ''}`}>
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

      {/* ─── Save modal ─── */}
      {saveModalOpen && (
        <CustomModal
          title="Save agent"
          needPrimaryBtn
          primaryBtnLabel="Save"
          primaryBtnDisabled={!agentName.trim()}
          needSecondaryBtn
          secondaryBtnLabel="Cancel"
          onHideModal={() => setSaveModalOpen(false)}
          onHandleChangeModal={handleSaveConfirm}
        >
          <div className="agent-builder__save-form">
            <div className="agent-builder__save-field">
              <FormInput
                name="save-agent-name"
                type="text"
                label="Agent name"
                value={agentName}
                onChange={(e, val) => setAgentName(val ?? e.target.value)}
              />
            </div>
            <div className="agent-builder__save-field">
              <TextArea
                name="save-agent-desc"
                label="Description (optional)"
                value={agentDesc}
                onChange={(e, val) => setAgentDesc(val ?? e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CustomModal>
      )}
    </AppShell>
  );
}
