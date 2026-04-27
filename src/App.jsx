import { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import AppShell from './components/AppShell/AppShell';
import SecondaryRailNav from './components/Organisms/Nav/SecondaryRailNav/SecondaryRailNav';
import AgentPerformanceTemplate from './components/Templates/AgentPerformanceTemplate/AgentPerformanceTemplate';
import AgentSection from './components/Shared/AgentSection';
import AgentBuilder from './components/AgentBuilder/AgentBuilder';
import ModuleEmptyState from './components/Patterns/ModuleEmptyState';
import '@xyflow/react/dist/style.css';

const LS_KEY = 'birdeye_agent_arc';

// ─── L2 NAV DEFINITIONS ───────────────────────────────────────────────────────

const AGENTS_L2_NAV = {
  title: 'Agents',
  ctaLabel: 'Create agent',
  menuItems: [
    {
      id: 'Actions',
      label: 'Actions',
      defaultExpanded: true,
      children: [
        { id: 'View all agents', label: 'View all agents' },
        { id: 'Create agent',    label: 'Create agent'    },
      ],
    },
    {
      id: 'Monitor',
      label: 'Monitor',
      children: [
        { id: 'Active', label: 'Active' },
        { id: 'Paused', label: 'Paused' },
        { id: 'Failed', label: 'Failed' },
      ],
    },
    {
      id: 'Reports',
      label: 'Reports',
      children: [
        { id: 'Performance', label: 'Performance' },
        { id: 'Accuracy',    label: 'Accuracy'    },
      ],
    },
    {
      id: 'Settings',
      label: 'Settings',
      children: [
        { id: 'Thresholds',    label: 'Thresholds'    },
        { id: 'Notifications', label: 'Notifications' },
      ],
    },
  ],
};

const L2_NAV_BY_MODULE = {
  agents: AGENTS_L2_NAV,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Load agents array from localStorage, falling back to []. */
function loadAgentsFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Convert a saved agent record to the display shape AgentSection expects. */
function toDisplayAgent(a) {
  return {
    ...a,
    status: a.status || 'Draft',
    lastRun: a.createdAt
      ? new Date(a.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
      : 'Never',
  };
}

// ─── L2 CONTENT ROUTING ───────────────────────────────────────────────────────

function renderAgentsContent(activeL2Item, { agents, onCreateAgent, onExportAgent, onImportAgent }) {
  switch (activeL2Item) {
    case 'View all agents':
      return (
        <AgentSection
          moduleName="Agents"
          agents={agents.map(toDisplayAgent)}
          onCreateAgent={onCreateAgent}
          onExportAgent={onExportAgent}
          onImportAgent={onImportAgent}
        />
      );
    case 'Performance':
      return <AgentPerformanceTemplate />;
    default:
      return <ModuleEmptyState moduleName={activeL2Item} />;
  }
}

function renderModuleContent(currentModule, activeL2Item, handlers) {
  switch (currentModule) {
    case 'agents': return renderAgentsContent(activeL2Item, handlers);
    default:       return <ModuleEmptyState moduleName={currentModule} />;
  }
}

// ─── APP ──────────────────────────────────────────────────────────────────────

function App() {
  const [currentModule, setCurrentModule] = useState('agents');
  const [activeL2Item, setActiveL2Item]   = useState('View all agents');

  /* ─── Agents state + localStorage persistence ─── */
  const [agents, setAgents] = useState(loadAgentsFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(agents));
    } catch {
      // storage unavailable — silently ignore
    }
  }, [agents]);

  /* ─── Builder overlay ─── */
  const [builderOpen, setBuilderOpen] = useState(false);

  function handleCreateAgent() {
    setBuilderOpen(true);
  }

  function handleSaveAgent(agentData) {
    setAgents((prev) => [agentData, ...prev]);
    setBuilderOpen(false);
    // Return to the agents list after saving
    setActiveL2Item('View all agents');
  }

  function handleExportAgent(agent) {
    // Find the full record in case agent is a display-mapped copy
    const full = agents.find((a) => a.id === agent.id) || agent;
    const blob = new Blob([JSON.stringify(full, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `${(full.name || 'agent').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleImportAgent(agentData) {
    const imported = {
      ...agentData,
      id: agentData.id || crypto.randomUUID(),
      name: agentData.name || 'Imported agent',
      createdAt: agentData.createdAt || new Date().toISOString(),
    };
    setAgents((prev) => [imported, ...prev]);
  }

  /* ─── L1 nav change resets L2 ─── */
  function handleModuleChange(moduleId) {
    setCurrentModule(moduleId);
    setActiveL2Item('View all agents');
    setBuilderOpen(false);
  }

  /* ─── Full-screen builder overlay ─── */
  if (builderOpen) {
    return (
      <ReactFlowProvider>
        <AgentBuilder
          moduleContext={currentModule}
          onSaveAgent={handleSaveAgent}
        />
      </ReactFlowProvider>
    );
  }

  /* ─── Normal app shell ─── */
  const l2Nav = L2_NAV_BY_MODULE[currentModule] ?? null;

  const agentHandlers = {
    agents,
    onCreateAgent:  handleCreateAgent,
    onExportAgent:  handleExportAgent,
    onImportAgent:  handleImportAgent,
  };

  return (
    <ReactFlowProvider>
      <AppShell
        activeNavId={currentModule}
        onNavChange={handleModuleChange}
        currentModule={currentModule}
      >
        <div style={{ display: 'flex', height: '100%' }}>

          {l2Nav && (
            <SecondaryRailNav
              title={l2Nav.title}
              ctaLabel={l2Nav.ctaLabel}
              menuItems={l2Nav.menuItems}
              activeItemId={activeL2Item}
              onItemClick={(id) => {
                if (id === 'Create agent') {
                  handleCreateAgent();
                } else {
                  setActiveL2Item(id);
                }
              }}
            />
          )}

          <div style={{ flex: 1, overflow: 'auto' }}>
            {renderModuleContent(currentModule, activeL2Item, agentHandlers)}
          </div>

        </div>
      </AppShell>
    </ReactFlowProvider>
  );
}

export default App;
