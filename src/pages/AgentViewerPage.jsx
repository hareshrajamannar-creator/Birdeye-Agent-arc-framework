import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import AgentBuilder from '../components/AgentBuilder/AgentBuilder';
import AgentsDashboardTemplate from '../components/Templates/AgentsDashboardTemplate/AgentsDashboardTemplate';
import EmptyStates from '../components/Patterns/EmptyStates/EmptyStates';
import { getAgent, getAgentBySlug, subscribeToAgents } from '../services/agentService';
import { getTemplate, subscribeToTemplates } from '../services/templateService';
import styles from './AgentViewerPage.module.css';

export default function AgentViewerPage() {
  const { templateId, moduleSlug, agentSlug, agentId } = useParams();
  const [agent, setAgent] = useState(undefined);
  const [sectionAgents, setSectionAgents] = useState([]);
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

  // When doc is a group/section page, subscribe to section agents and templates
  useEffect(() => {
    if (!agent || (!agent.isAgentGroup && !agent.isSectionConfig)) return;
    const mod = moduleSlug || agent.moduleSlug || agent.moduleContext;
    const sec = agentSlug || agent.agentSlug || agent.sectionContext;

    const unsubAgents = subscribeToAgents((all) => {
      setSectionAgents(
        all.filter(
          (a) =>
            (a.moduleSlug === mod || a.moduleContext === mod) &&
            (a.sectionContext === sec) &&
            !a.isAgentGroup &&
            !a.isSectionConfig
        )
      );
    });

    const unsubTemplates = subscribeToTemplates((all) => {
      setSectionTemplates(
        all.filter(
          (t) =>
            (t.moduleContext === mod) &&
            (t.sectionContext === sec)
        )
      );
    });

    return () => {
      unsubAgents();
      unsubTemplates();
    };
  }, [agent, moduleSlug, agentSlug]);

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
    const mod = moduleSlug || agent.moduleSlug || agent.moduleContext || 'reviews';
    const sec = agentSlug || agent.agentSlug || agent.sectionContext || '';
    const sectionLabel = agent.agentName || agent.name || 'Agents';

    return (
      <AgentsDashboardTemplate
        viewOnly
        isGroupPage
        pageTitle={sectionLabel}
        activeNavId={mod}
        activeMenuItemId={sec}
        navTitle={mod}
        menuItems={[{
          id: 'agents',
          label: 'Agents',
          defaultExpanded: true,
          children: [{ id: sec, label: sectionLabel }],
        }]}
        agents={sectionAgents}
        templates={sectionTemplates}
        groupDoc={agent}
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
