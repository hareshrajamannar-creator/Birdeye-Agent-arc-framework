import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import AgentBuilder from '../components/AgentBuilder/AgentBuilder';
import EmptyStates from '../components/Patterns/EmptyStates/EmptyStates';
import { getAgent, getAgentBySlug } from '../services/agentService';
import { getTemplate } from '../services/templateService';
import styles from './AgentViewerPage.module.css';

export default function AgentViewerPage() {
  const { templateId, moduleSlug, agentSlug, agentId } = useParams();
  const [agent, setAgent] = useState(undefined);

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
