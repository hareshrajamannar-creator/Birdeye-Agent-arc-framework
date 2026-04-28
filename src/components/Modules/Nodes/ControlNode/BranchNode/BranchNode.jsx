import React from 'react';
import styles from './BranchNode.module.css';

export default function BranchNode({ id, data }) {
  const isSelected = id === data?.selectedNodeId;
  return (
    <div className={`${styles.node}${isSelected ? ` ${styles['node--selected']}` : ''}`}>
      {/* BranchNode — implementation pending */}
    </div>
  );
}
