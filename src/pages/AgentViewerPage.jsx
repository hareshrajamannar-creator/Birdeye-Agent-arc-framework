import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import AgentBuilder from '../components/AgentBuilder/AgentBuilder';
import AgentsDashboardTemplate from '../components/Templates/AgentsDashboardTemplate/AgentsDashboardTemplate';
import EmptyStates from '../components/Patterns/EmptyStates/EmptyStates';
import { getModuleNav } from '../components/Modules/moduleNavigation';
import { getAgent, getAgentBySlug, subscribeToAgents } from '../services/agentService';
import { getTemplate, subscribeToTemplates } from '../services/templateService';
import styles from './AgentViewerPage.module.css';

export default function AgentViewerPage() {
  const { templateId, moduleSlug, agentSlug, agentId } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(undefined);
  const [allModuleAgents, setAllModuleAgents] = useState([]);
  const [sectionTemplates, setSectionTemplates] = useState([]);

  useEffect(() => {
    if (templateId) {
      getTemplate(templateId)
        .then((t) => t
          ? setAgent({ id: t.id, name: t.title || 'Untitled template', nodes: t.nodes || null, nodeDetails: t.nodeDetails || null, moduleContext: t.moduleContext || 'reviews' })
          : setAgent(null))
        .catch(() => setAgent(null));
    } else if (moduleSlug && agentSlug) {
      getAgentBySlug(moduleSlug, agentSlug)
        .then((a) => setAgent(a || null))
        .catch(() => setAgent(null));
    } else if (agentId) {
      getAgent(agentId)
        .then((a) => setAgent(a || null))
        .catch(() => setAgent(null));
    } else {
      setAgent(null);
    }
  }, [templateId, moduleSlug, agentSlug, agentId]);

  // When doc is a group/section page, subscribe to all module agents (for nav + table) and templates
  useEffect(() => {
    if (!agent || (!agent.isAgentGroup && !agent.isSectionConfig)) return;
    const mod = moduleSlug || agent.moduleSlug || agent.moduleContext;
    const sec = agentSlug || agent.agentSlug || agent.sectionContext;

    const unsubAgents = subscribeToAgents((all) => {
      setAllModuleAgents(
        all.filter(
          (a) => a.moduleSlug === mod || a.moduleContext === mod
        )
      );
    });

    const unsubTemplates = subscribeToTemplates((all) => {
      setSectionTemplates(
        all.filter(
          (t) => (t.moduleContext === mod) && (t.sectionContext === sec)
        )
      );
    });

    return () => {
      unsubAgents();
      unsubTemplates();
    };
  }, [agent, moduleSlug, agentSlug]);

  // Build section agents and full nav items from allModuleAgents
  const mod = agent ? (moduleSlug || agent.moduleSlug || agent.moduleContext || 'reviews') : 'reviews';
  const sec = agent ? (agentSlug || agent.agentSlug || agent.sectionContext || '') : '';

  const sectionAgents = useMemo(
    () => allModuleAgents.filter(
      (a) => a.sectionContext === sec && !a.isAgentGroup && !a.isSectionConfig
    ),
    [allModuleAgents, sec]
  );

  const menuItems = useMemo(() => {
    if (!agent || (!agent.isAgentGroup && !agent.isSectionConfig)) return [];
    const moduleNav = getModuleNav(mod);
    const dynamicGroups = allModuleAgents
      .filter((a) => a.isAgentGroup === true)
      .sort((a, b) => (b.updatedAt?.seconds ?? 0) - (a.updatedAt?.seconds ?? 0))
      .map((a) => ({ id: a.agentSlug || a.id, label: a.name || 'Untitled' }));

    return moduleNav.menuItems.map((item) => {
      if (item.id !== 'agents') return item;
      return { ...item, children: [...dynamicGroups, ...(item.children || [])] };
    });
  }, [agent, mod, allModuleAgents]);

  if (agent === undefined) {
    return (
      <div className={styles.loading}>
        <span className="material-symbols-outlined">hourglass_empty</span>
        <span>Loading agent…</span>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className={styles.notFound}>
        <EmptyStates
          title="Agent not found"
          description="This shared link is no longer valid or the agent has been deleted."
        />
      </div>
    );
  }

  // Group page / section config — render view-only dashboard
  if (agent.isAgentGroup || agent.isSectionConfig) {
    const moduleNav = getModuleNav(mod);
    const sectionLabel = agent.agentName || agent.name || 'Agents';

    function handleOpenAgent(agentId) {
      const clicked = allModuleAgents.find((a) => a.id === agentId);
      if (clicked?.agentSlug && (clicked.moduleSlug || clicked.moduleContext)) {
        navigate(`/view/${clicked.moduleSlug || clicked.moduleContext}/${clicked.agentSlug}`);
      }
    }

    return (
      <AgentsDashboardTemplate
        viewOnly
        isGroupPage
        pageTitle={sectionLabel}
        activeNavId={mod}
        activeMenuItemId={sec}
        navTitle={moduleNav.title}
        ctaLabel={moduleNav.ctaLabel}
        menuItems={menuItems}
        agents={sectionAgents}
        templates={sectionTemplates}
        groupDoc={agent}
        onOpenAgent={handleOpenAgent}
      />
    );
  }

  // Workflow agent — render builder in view-only mode
  return (
    <ReactFlowProvider>
      <AgentBuilder
        agentId={agent.id}
        moduleContext={agent.moduleContext || 'reviews'}
        appTitle="Agent Arc"
        pageTitle={agent.name || 'Shared agent'}
        initialDescription={agent.description || ''}
        initialNodes={agent.nodes || null}
        initialNodeDetails={agent.nodeDetails || null}
        viewOnly
      />
    </ReactFlowProvider>
  );
}
