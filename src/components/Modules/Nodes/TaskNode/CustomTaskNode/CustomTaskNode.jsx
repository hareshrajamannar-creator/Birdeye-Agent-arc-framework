import React from 'react';
import styles from './CustomTaskNode.module.css';

export default function CustomTaskNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* CustomTaskNode — implementation pending */}
    </div>
  );
}
