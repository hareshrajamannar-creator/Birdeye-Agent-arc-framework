import { useEffect, useMemo, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import AgentBuilder from './components/AgentBuilder/AgentBuilder';
import AgentsDashboardTemplate from './components/Templates/AgentsDashboardTemplate/AgentsDashboardTemplate';
import { getModuleTemplates } from './components/Modules/agentFrameworkData';
import { getModuleNav } from './components/Modules/moduleNavigation';
import '@xyflow/react/dist/style.css';

const LS_KEY = 'birdeye_agent_arc';

/* ─── Storage ─── */

function loadAgentsFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ─── Helpers ─── */

function formatTitle(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function toDashboardAgent(agent) {
  return {
    id: agent.id,
    name: agent.name,
    status: agent.status || 'Draft',
    reviewsResponded: agent.reviewsResponded || 0,
    responseRate: agent.responseRate || '—',
    avgResponseTime: agent.avgResponseTime || '—',
    timeSaved: agent.timeSaved || '—',
    locations: agent.locations || 0,
  };
}

function toTemplateAgent(template, index) {
  const regions = ['North Region', 'East Region', 'South Region', 'West Region'];
  const statuses = ['Running', 'Running', 'Paused', 'Draft'];

  return {
    id: `template-${index}`,
    name: `${template.title} - ${regions[index % regions.length]}`,
    status: statuses[index % statuses.length],
    reviewsResponded: 120 - index * 18,
    responseRate: `${92 - index * 4}%`,
    avgResponseTime: index % 2 === 0 ? '20m' : '45m',
    timeSaved: index % 2 === 0 ? '4h 20m' : '2h 10m',
    locations: 500 - index * 75,
  };
}

function getPageTitle(activeItemId, moduleNav) {
  const child = moduleNav.menuItems
    .flatMap((item) => item.children || [item])
    .find((item) => item.id === activeItemId);

  if (child?.label) return child.label;
  return `${formatTitle(activeItemId || 'agents')} agents`;
}

/* ─── Agent-section L2 items all end with '-agents' ─── */
function isAgentSection(itemId) {
  return !itemId || itemId.endsWith('-agents');
}

/* ─── App ─── */

function App() {
  const [currentModule, setCurrentModule] = useState('reviews');
  const [activeL2Item, setActiveL2Item] = useState(() => getModuleNav('reviews').defaultItemId);
  const [agents, setAgents] = useState(loadAgentsFromStorage);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderTemplate, setBuilderTemplate] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(agents));
    } catch {
      // Ignore unavailable storage.
    }
  }, [agents]);

  const moduleNav = getModuleNav(currentModule);
  const moduleTemplates = useMemo(() => getModuleTemplates(currentModule), [currentModule]);
  const moduleAgents = useMemo(
    () => agents.filter((a) => a.moduleContext === currentModule).map(toDashboardAgent),
    [agents, currentModule]
  );
  const dashboardAgents = moduleAgents.length > 0
    ? moduleAgents
    : moduleTemplates.map(toTemplateAgent);

  /* ─── Module change ─── */
  function handleModuleChange(moduleId) {
    const nextNav = getModuleNav(moduleId);
    setCurrentModule(moduleId);
    setActiveL2Item(nextNav.defaultItemId);
    setBuilderOpen(false);
    setBuilderTemplate(null);
    setEditingAgent(null);
  }

  /* ─── Agent builder open / close ─── */
  function handleCreateAgent(template) {
    setBuilderTemplate(template || null);
    setEditingAgent(null);
    setBuilderOpen(true);
  }

  function handleUseTemplate(templateId) {
    const template = moduleTemplates.find((item) => item.id === templateId);
    handleCreateAgent(template || null);
  }

  function handleL2ItemClick(itemId) {
    if (itemId === 'create-agent') {
      handleCreateAgent();
      return;
    }
    setActiveL2Item(itemId);
  }

  function handleOpenAgent(agentId) {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    setEditingAgent(agent);
    setBuilderTemplate(null);
    setBuilderOpen(true);
  }

  /* ─── Save / update ─── */
  function handleSaveAgent(agentData) {
    if (editingAgent) {
      setAgents((prev) =>
        prev.map((a) => (a.id === editingAgent.id ? { ...agentData, id: editingAgent.id } : a))
      );
    } else {
      setAgents((prev) => [agentData, ...prev]);
    }
    setBuilderOpen(false);
    setBuilderTemplate(null);
    setEditingAgent(null);
  }

  /* ─── Export / Import ─── */
  function handleExportAgent(agent) {
    const full = agents.find((a) => a.id === agent.id) || agent;
    const blob = new Blob([JSON.stringify(full, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${full.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportAgent(data) {
    const imported = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      moduleContext: data.moduleContext || currentModule,
      status: data.status || 'Draft',
    };
    setAgents((prev) => [imported, ...prev]);
  }

  /* ─── Builder view ─── */
  if (builderOpen) {
    return (
      <ReactFlowProvider>
        <AgentBuilder
          moduleContext={currentModule}
          appTitle={moduleNav.title}
          pageTitle={editingAgent?.name || builderTemplate?.title || 'Untitled agent'}
          activeNavId={currentModule}
          initialDescription={editingAgent?.description || builderTemplate?.description || ''}
          initialNodes={editingAgent?.nodes || null}
          initialNodeDetails={editingAgent?.nodeDetails || null}
          onSaveAgent={handleSaveAgent}
          onClose={() => {
            setBuilderOpen(false);
            setBuilderTemplate(null);
            setEditingAgent(null);
          }}
        />
      </ReactFlowProvider>
    );
  }

  /* ─── Dashboard routing ─── */
  const showDashboard = isAgentSection(activeL2Item);

  return (
    <AgentsDashboardTemplate
      navTitle={moduleNav.title}
      ctaLabel={moduleNav.ctaLabel}
      menuItems={moduleNav.menuItems}
      pageTitle={getPageTitle(activeL2Item, moduleNav)}
      activeNavId={currentModule}
      activeMenuItemId={activeL2Item}
      agents={dashboardAgents}
      templates={moduleTemplates}
      showDashboard={showDashboard}
      onCreateAgent={() => handleCreateAgent()}
      onUseTemplate={handleUseTemplate}
      onNavChange={handleModuleChange}
      onMenuItemClick={handleL2ItemClick}
      onOpenAgent={handleOpenAgent}
      onExportAgent={handleExportAgent}
      onImportAgent={handleImportAgent}
    />
  );
}

export default App;
