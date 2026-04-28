import React from 'react';
import styles from './EndNode.module.css';

export default function EndNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* EndNode — implementation pending */}
    </div>
  );
}
