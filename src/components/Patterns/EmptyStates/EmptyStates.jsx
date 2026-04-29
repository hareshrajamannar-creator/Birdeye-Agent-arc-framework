import React from 'react';
import PropTypes from 'prop-types';
import Button from '@birdeye/elemental/core/atoms/Button/index.js';
import styles from './EmptyStates.module.css';

function AgentIllustration() {
  return (
    <div className={styles.outerBox}>
      <div className={styles.card}>
        <div className={styles.contentBox}>
          <div className={styles.imgArea}>
            <svg width="88" height="76" viewBox="0 0 88 76" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="17" r="12" fill="rgba(141,157,202,0.55)" />
              <circle cx="16" cy="17" r="7" fill="rgba(141,157,202,0.85)" />
              <path d="M0 48 C15 36 32 43 48 39 C64 35 78 27 88 31 L88 76 L0 76 Z" fill="rgba(141,157,202,0.45)" />
              <path d="M0 62 C18 51 38 57 58 53 C72 50 84 45 88 47 L88 76 L0 76 Z" fill="rgba(141,157,202,0.3)" />
            </svg>
          </div>
          <div className={styles.bars}>
            <div className={styles.barFull} />
            <div className={styles.barShort} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmptyStates({ title, description, actionLabel, onAction }) {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <AgentIllustration />
        <div className={styles.copy}>
          {title && <p className={styles.title}>{title}</p>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actionLabel && onAction && (
          <Button theme="primary" label={actionLabel} onClick={onAction} />
        )}
      </div>
    </div>
  );
}

EmptyStates.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};
