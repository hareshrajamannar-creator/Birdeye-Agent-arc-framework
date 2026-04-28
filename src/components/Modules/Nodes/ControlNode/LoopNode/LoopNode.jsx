import React from 'react';
import styles from './LoopNode.module.css';

export default function LoopNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* LoopNode — implementation pending */}
    </div>
  );
}
