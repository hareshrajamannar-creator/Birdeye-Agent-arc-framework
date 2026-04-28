import React from 'react';
import styles from './ParallelNode.module.css';

export default function ParallelNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* ParallelNode — implementation pending */}
    </div>
  );
}
