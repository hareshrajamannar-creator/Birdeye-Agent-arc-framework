import React, { useState } from 'react';
import styles from './ShareModal.module.css';

export default function ShareModal({ agentId, onClose }) {
  const shareUrl = `${window.location.origin}/view/${agentId}`;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl).catch(() => {
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>Share agent</span>
          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.desc}>
            Anyone with this link can view this agent in read-only mode.
          </p>
          <div className={styles.urlRow}>
            <input
              className={styles.urlInput}
              value={shareUrl}
              readOnly
              onFocus={(e) => e.target.select()}
            />
            <button
              className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
              type="button"
              onClick={handleCopy}
            >
              <span className="material-symbols-outlined">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.doneBtn} type="button" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
