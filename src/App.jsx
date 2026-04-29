import { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { ReactFlowProvider } from '@xyflow/react';
import AgentBuilder from './components/AgentBuilder/AgentBuilder';
import AgentsDashboardTemplate from './components/Templates/AgentsDashboardTemplate/AgentsDashboardTemplate';
import AgentViewerPage from './pages/AgentViewerPage';
import { getModuleTemplates } from './components/Modules/agentFrameworkData';
import { getModuleNav } from './components/Modules/moduleNavigation';
import { subscribeToAgents, deleteAgent, saveAgent } from './services/agentService';
import { deleteTemplate, saveTemplate, subscribeToTemplates } from './services/templateService';
import styles from './App.module.css';
import '@xyflow/react/dist/style.css';

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

function withTemplateContext(template, moduleId, sectionId) {
  return {
    ...template,
    moduleContext: template.moduleContext || moduleId,
    sectionContext: template.sectionContext || sectionId,
    source: template.source || 'default',
  };
}

function mergeTemplates(defaultTemplates, savedTemplates, moduleId, sectionId) {
  const moduleSaved = savedTemplates
    .filter((template) => template.moduleContext === moduleId && template.sectionContext === sectionId)
    .sort((a, b) => {
      const aTime = a.updatedAt?.seconds ?? 0;
      const bTime = b.updatedAt?.seconds ?? 0;
      return aTime - bTime;
    });
  const savedById = new Map(moduleSaved.map((template) => [template.id, template]));
  const defaults = defaultTemplates.map((template) => {
    const saved = savedById.get(template.id);
    if (saved?.deleted) return null;
    return withTemplateContext(saved ? { ...template, ...saved } : template, moduleId, sectionId);
  }).filter(Boolean);
  const custom = moduleSaved
    .filter((template) => !template.deleted && !defaultTemplates.some((item) => item.id === template.id))
    .map((template) => withTemplateContext(template, moduleId, sectionId));

  return [...defaults, ...custom];
}

/* ─── App ─── */

function App() {
  const [currentModule, setCurrentModule] = useState('reviews');
  const [activeL2Item, setActiveL2Item] = useState(() => getModuleNav('reviews').defaultItemId);
  const [agents, setAgents] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderTemplate, setBuilderTemplate] = useState(null);
  const [editingAgent, setEditingAgent] = useState(null);
  const [builderAgentId, setBuilderAgentId] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [dashboardInitialTab, setDashboardInitialTab] = useState('agents');
  const toastTimerRef = useRef(null);

  function showToast(message) {
    clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 3000);
  }

  // Subscribe to all agents in real-time from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToAgents((data) => {
      const sorted = data.sort((a, b) => {
        const ta = a.updatedAt?.seconds ?? 0;
        const tb = b.updatedAt?.seconds ?? 0;
        return tb - ta;
      });
      setAgents(sorted);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToTemplates((data) => {
      setSavedTemplates(data);
    });
    return () => unsubscribe();
  }, []);

  const moduleNav = getModuleNav(currentModule);
  const defaultModuleTemplates = useMemo(
    () => getModuleTemplates(currentModule, activeL2Item).map((template) => withTemplateContext(template, currentModule, activeL2Item)),
    [currentModule, activeL2Item]
  );
  const moduleTemplates = useMemo(
    () => mergeTemplates(defaultModuleTemplates, savedTemplates, currentModule, activeL2Item),
    [defaultModuleTemplates, savedTemplates, currentModule, activeL2Item]
  );
  const moduleAgents = useMemo(
    () =>
      agents
        .filter((a) => {
          if (a.moduleContext !== currentModule) return false;
          if (activeL2Item === 'view-all-agents') return true;
          if (!a.sectionContext) return true;
          return a.sectionContext === activeL2Item;
        })
        .map(toDashboardAgent),
    [agents, currentModule, activeL2Item]
  );

  /* ─── Module change ─── */
  function handleModuleChange(moduleId) {
    const nextNav = getModuleNav(moduleId);
    setCurrentModule(moduleId);
    setActiveL2Item(nextNav.defaultItemId);
    setDashboardInitialTab('agents');
    setBuilderOpen(false);
    setBuilderTemplate(null);
    setEditingAgent(null);
  }

  /* ─── Agent builder open / close ─── */
  function handleCreateAgent(template) {
    setBuilderAgentId(crypto.randomUUID());
    setBuilderTemplate(template || null);
    setEditingAgent(null);
    setBuilderOpen(true);
  }

  function handleUseTemplate(templateId) {
    const template = moduleTemplates.find((item) => item.id === templateId);
    handleCreateAgent(template || null);
  }

  async function handleSaveTemplate(template) {
    const templateId = template.id || crypto.randomUUID();
    await saveTemplate(templateId, {
      ...template,
      id: templateId,
      moduleContext: template.moduleContext || currentModule,
      sectionContext: template.sectionContext || activeL2Item,
      source: template.source || 'custom',
      title: template.title,
      description: template.description,
    });
    setDashboardInitialTab('library');
    showToast('Template saved successfully');
  }

  function handleCreateTemplate(template) {
    return handleSaveTemplate({
      ...template,
      id: crypto.randomUUID(),
      moduleContext: currentModule,
      sectionContext: activeL2Item,
      source: 'custom',
    });
  }

  function handleDeleteTemplate(templateId) {
    const template = moduleTemplates.find((item) => item.id === templateId);
    if (template?.source === 'default') {
      return saveTemplate(templateId, {
        ...template,
        deleted: true,
        moduleContext: template.moduleContext || currentModule,
        sectionContext: template.sectionContext || activeL2Item,
      });
    }
    return deleteTemplate(templateId);
  }

  function handleL2ItemClick(itemId) {
    if (itemId === 'create-agent') {
      handleCreateAgent();
      return;
    }
    setActiveL2Item(itemId);
  }

  function handleDeleteAgent(agentId) {
    deleteAgent(agentId);
  }

  async function handleAgentUpdate(agentId, field, value) {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    const rest = { ...agent };
    delete rest.updatedAt;
    await saveAgent(agentId, { ...rest, [field]: value });
  }

  function handleOpenAgent(agentId) {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    setBuilderAgentId(agentId);
    setEditingAgent(agent);
    setBuilderTemplate(null);
    setBuilderOpen(true);
  }

  /* ─── Save / Publish ─── */
  function handleSaveAgent(isPublish = false, publishedAgent = null) {
    if (publishedAgent) {
      setAgents((prev) => {
        const entry = { ...publishedAgent, updatedAt: { seconds: Math.floor(Date.now() / 1000) } };
        const rest = prev.filter((a) => a.id !== publishedAgent.id);
        return [entry, ...rest];
      });
    }
    setBuilderOpen(false);
    setBuilderTemplate(null);
    setEditingAgent(null);
    if (isPublish) {
      showToast('Agent published successfully');
    }
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

  async function handleImportAgent(data) {
    const agentId = crypto.randomUUID();
    const imported = {
      ...data,
      id: agentId,
      moduleContext: data.moduleContext || currentModule,
      status: data.status || 'Draft',
    };
    await saveAgent(agentId, imported);
  }

  /* ─── Toast portal (always mounted so it survives builder unmount) ─── */
  const toast = toastVisible
    ? ReactDOM.createPortal(
        <div className={styles.toast}>
          <span className="material-symbols-outlined">check_circle</span>
          {toastMessage}
        </div>,
        document.body
      )
    : null;

  /* ─── View-only shared agent route ─── */
  if (window.location.pathname.startsWith('/view/')) {
    return <AgentViewerPage />;
  }

  /* ─── Builder view ─── */
  if (builderOpen) {
    return (
      <>
        <ReactFlowProvider>
          <AgentBuilder
            agentId={builderAgentId}
            moduleContext={currentModule}
            sectionContext={editingAgent?.sectionContext || activeL2Item}
            templateId={!editingAgent ? builderTemplate?.id : undefined}
            templateSource={!editingAgent ? builderTemplate?.source : undefined}
            initialStatus={editingAgent?.status || 'Draft'}
            appTitle={moduleNav.title}
            pageTitle={editingAgent?.name || builderTemplate?.title || 'Untitled agent'}
            activeNavId={currentModule}
            initialDescription={editingAgent?.description || builderTemplate?.description || ''}
            initialNodes={editingAgent?.nodes || builderTemplate?.nodes || null}
            initialNodeDetails={editingAgent?.nodeDetails || builderTemplate?.nodeDetails || null}
            onSaveAgent={handleSaveAgent}
            onSaveTemplate={handleSaveTemplate}
            onClose={() => {
              setBuilderOpen(false);
              setBuilderTemplate(null);
              setEditingAgent(null);
            }}
          />
        </ReactFlowProvider>
        {toast}
      </>
    );
  }

  /* ─── Dashboard ─── */
  const showDashboard = isAgentSection(activeL2Item);

  return (
    <>
      <AgentsDashboardTemplate
        navTitle={moduleNav.title}
        ctaLabel={moduleNav.ctaLabel}
        menuItems={moduleNav.menuItems}
        pageTitle={getPageTitle(activeL2Item, moduleNav)}
        activeNavId={currentModule}
        activeMenuItemId={activeL2Item}
        agents={moduleAgents}
        templates={moduleTemplates}
        initialActiveTab={dashboardInitialTab}
        showDashboard={showDashboard}
        onCreateAgent={() => handleCreateAgent()}
        onCreateTemplate={handleCreateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        onSaveTemplate={handleSaveTemplate}
        onUseTemplate={handleUseTemplate}
        onNavChange={handleModuleChange}
        onMenuItemClick={handleL2ItemClick}
        onOpenAgent={handleOpenAgent}
        onDeleteAgent={handleDeleteAgent}
        onAgentUpdate={handleAgentUpdate}
        onExportAgent={handleExportAgent}
        onImportAgent={handleImportAgent}
      />
      {toast}
    </>
  );
}

export default App;
