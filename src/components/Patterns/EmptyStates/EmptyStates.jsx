import React from 'react';
import PropTypes from 'prop-types';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import styles from './EmptyStates.module.css';

export default function EmptyStates({
  icon = 'inbox',
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div className={`${styles.container} ${compact ? styles.compact : ''}`}>
      <span className={`material-symbols-outlined ${styles.icon}`}>{icon}</span>
      <div className={styles.copy}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button theme="primary" label={actionLabel} onClick={onAction} />
      )}
    </div>
  );
}

EmptyStates.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  compact: PropTypes.bool,
};
