import React, { useState, useCallback, useRef, useEffect } from 'react';
import AppShell from '../AppShell/AppShell';
import LHSDrawer from '../LHSDrawer/LHSDrawer';
import FlowCanvas from '../FlowCanvas/FlowCanvas';
import RHS from '../Organisms/Panels/RHS/RHS';
import ScheduleBased from '../Molecules/RHS/Trigger/ScheduleBased/ScheduleBased';
import AIChatBubble from '../Molecules/AIChatBubble/AIChatBubble';
import AIPromptBox from '../Molecules/AIPromptBox/AIPromptBox';
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

/* ─── Prompt workflow helpers ─── */

function buildPromptNodeEntry(type, label, description) {
  const id = nextId();
  let flowType = 'task';
  let title = 'Task';
  let hasAiIcon = false;
  let details = {};
  let extraDetails = {};

  if (type === 'trigger') {
    flowType = 'trigger';
    title = 'Trigger';
    if (label === 'Schedule-based') {
      details = { frequency: 'Daily', day: '7 days', time: '9:00 AM' };
    } else {
      details = {
        triggerName: label,
        description,
        conditions: [
          { field: '', operator: '', value: '' },
          { field: '', operator: '', value: '' },
          { field: '', operator: '', value: '' },
        ],
      };
    }
  } else if (type === 'branch') {
    flowType = 'branch';
    title = label;
    const p1 = `${id}-path-1`;
    const p2 = `${id}-path-2`;
    details = {
      basedOn: 'Conditions',
      branches: [
        { id: p1, name: 'Branch 1' },
        { id: p2, name: 'Branch 2' },
      ],
    };
    extraDetails = {
      [p1]: { branchName: 'Branch 1', description: '', conditions: [], parentId: id, isBranchPath: true },
      [p2]: { branchName: 'Branch 2', description: '', conditions: [], parentId: id, isBranchPath: true },
    };
  } else {
    hasAiIcon = label === 'Custom';
    if (hasAiIcon) {
      details = { taskName: description, description: '', llmModel: 'Fast', systemPrompt: '', userPrompt: '' };
    } else {
      details = { taskName: description, description: '' };
    }
  }

  const node = {
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

  return { node, details, extraDetails };
}

function generateWorkflowFromPrompt(text) {
  const lower = text.toLowerCase();

  let specs;
  if (lower.includes('review')) {
    specs = [
      { type: 'trigger', label: 'Reviews',  description: 'When a new review is received' },
      { type: 'task',    label: 'Custom',   description: 'Analyze and respond to the review' },
    ];
  } else if (lower.includes('schedule')) {
    specs = [
      { type: 'trigger', label: 'Schedule-based', description: 'Runs on a set schedule' },
      { type: 'task',    label: 'Review',          description: 'Process scheduled items' },
    ];
  } else if (lower.includes('branch')) {
    specs = [
      { type: 'trigger', label: 'Reviews', description: 'When a new review is received' },
      { type: 'branch',  label: 'Branch',  description: 'Route based on conditions' },
      { type: 'task',    label: 'Custom',  description: 'Handle positive outcome' },
      { type: 'task',    label: 'Custom',  description: 'Handle negative outcome' },
    ];
  } else {
    specs = [
      { type: 'task', label: 'Custom', description: 'Process and respond' },
    ];
  }

  const nodes = [];
  const allDetails = {};

  specs.forEach(({ type, label, description }) => {
    const { node, details, extraDetails } = buildPromptNodeEntry(type, label, description);
    nodes.push(node);
    allDetails[node.id] = details;
    Object.assign(allDetails, extraDetails);
  });

  const numberedNodes = nodes.map((n, i) => ({
    ...n,
    data: { ...n.data, stepNumber: i + 1 },
  }));

  return { nodes: numberedNodes, details: allDetails };
}

/* ─── Component ─── */

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

  /* ─── Build mode ─── */
  const [buildMode, setBuildMode] = useState('manual');
  const [promptMessages, setPromptMessages] = useState([
    { role: 'ai', message: "Hi! Describe what your agent should do and I'll generate a workflow for you." },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [promptMessages]);

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
      creationMode: buildMode,
    });
    setSaveModalOpen(false);
  }, [agentName, agentDesc, moduleContext, nodeList, nodeDetails, buildMode, onSaveAgent]);

  /* ─── Prompt mode ─── */
  const handlePromptSend = useCallback((text) => {
    setPromptMessages((prev) => [...prev, { role: 'user', message: text }]);

    const { nodes: generatedNodes, details: newDetails } = generateWorkflowFromPrompt(text);

    setNodeList(generatedNodes);
    setNodeDetails(newDetails);
    setSelectedNodeId(null);
    setDrawerOpen(false);

    setPromptMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        message: `Done! I've generated a ${generatedNodes.length}-step workflow based on your description. Switch to Manual mode to edit individual nodes.`,
      },
    ]);
  }, []);

  /* ─── Manual-mode node management ─── */

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

  const startData = { title: pageTitle, subtitle: 'AI-powered workflow agent' };
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
          bodyProps={{ initialValues: currentDetails }}
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
          bodyProps={{ initialValues: currentDetails }}
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
          bodyProps={{ initialValues: currentDetails }}
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
          bodyProps={{ initialValues: currentDetails }}
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
          bodyProps={{ initialValues: currentDetails }}
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
          bodyProps={{ initialValues: currentDetails }}
          onClose={handleCloseDrawer}
          onSave={handleCloseDrawer}
        />
      );
    }

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
      showBack={!!onClose}
      onBack={onClose}
      publishDisabled
    >
      <div className="agent-builder-wrapper">

        {/* ─── Mode toggle bar ─── */}
        <div className="agent-builder__mode-bar">
          <div className="agent-builder__mode-bar-modes">
            <button
              className={`agent-builder__mode-btn${buildMode === 'manual' ? ' agent-builder__mode-btn--active' : ''}`}
              onClick={() => setBuildMode('manual')}
            >
              <span className="material-symbols-outlined">edit</span>
              Build manually
            </button>
            <button
              className={`agent-builder__mode-btn${buildMode === 'prompt' ? ' agent-builder__mode-btn--active' : ''}`}
              onClick={() => setBuildMode('prompt')}
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Build with prompt
            </button>
          </div>
          <div className="agent-builder__mode-bar-actions">
            <Button
              theme="secondary"
              label="Save agent"
              onClick={() => setSaveModalOpen(true)}
            />
          </div>
        </div>

        {/* ─── Main content ─── */}
        <div className="agent-builder">

          {buildMode === 'manual' && (
            <div className="agent-builder__lhs">
              <LHSDrawer defaultTab="Create manually" triggerOpen tasksOpen={false} controlsOpen={false} />
            </div>
          )}

          {buildMode === 'prompt' && (
            <div className="agent-builder__prompt-panel">
              <div className="agent-builder__prompt-messages">
                {promptMessages.map((msg, i) =>
                  msg.role === 'ai' ? (
                    <AIChatBubble key={i} message={msg.message} />
                  ) : (
                    <div key={i} className="agent-builder__prompt-user-msg">
                      {msg.message}
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="agent-builder__prompt-input">
                <AIPromptBox
                  placeholder="Describe what your agent should do..."
                  onSend={handlePromptSend}
                />
              </div>
            </div>
          )}

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
      </div>

      {/* ─── Save agent modal ─── */}
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
                onChange={(e, val) => setAgentName(val)}
              />
            </div>
            <div className="agent-builder__save-field">
              <TextArea
                name="save-agent-desc"
                label="Description (optional)"
                value={agentDesc}
                onChange={(e, val) => setAgentDesc(val)}
                rows={3}
              />
            </div>
          </div>
        </CustomModal>
      )}
    </AppShell>
  );
}
