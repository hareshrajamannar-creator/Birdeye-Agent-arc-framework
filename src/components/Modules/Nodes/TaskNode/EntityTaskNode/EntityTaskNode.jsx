import React from 'react';
import styles from './EntityTaskNode.module.css';

export default function EntityTaskNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* EntityTaskNode — implementation pending */}
    </div>
  );
}
