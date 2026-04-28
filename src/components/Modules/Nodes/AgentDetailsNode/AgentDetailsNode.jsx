import React from 'react';
import styles from './AgentDetailsNode.module.css';

export default function AgentDetailsNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* AgentDetailsNode — implementation pending */}
    </div>
  );
}
