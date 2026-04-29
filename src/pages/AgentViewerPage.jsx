import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import AgentBuilder from '../components/AgentBuilder/AgentBuilder';
import EmptyStates from '../components/Patterns/EmptyStates/EmptyStates';
import { getAgent } from '../services/agentService';
import styles from './AgentViewerPage.module.css';

export default function AgentViewerPage() {
  const agentId = window.location.pathname.split('/view/').pop();
  const [agent, setAgent] = useState(undefined);

  useEffect(() => {
    if (!agentId) { setAgent(null); return; }
    getAgent(agentId).then(setAgent).catch(() => setAgent(null));
  }, [agentId]);

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
