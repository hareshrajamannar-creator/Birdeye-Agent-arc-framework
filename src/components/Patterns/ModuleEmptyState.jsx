import React from 'react';
import PropTypes from 'prop-types';
import EmptyStates from './EmptyStates/EmptyStates';
import styles from './ModuleEmptyState.module.css';

export default function ModuleEmptyState({ moduleName }) {
  return (
    <div className={styles.container}>
      <EmptyStates
        icon="category"
        title={`${moduleName} is not built yet`}
        description="This area is reserved for future module-specific workflows."
      />
    </div>
  );
}

ModuleEmptyState.propTypes = {
  moduleName: PropTypes.string,
};
