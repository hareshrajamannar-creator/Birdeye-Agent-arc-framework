import React from 'react';
import styles from './DelayNode.module.css';

export default function DelayNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* DelayNode — implementation pending */}
    </div>
  );
}
