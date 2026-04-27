import React, { useState } from 'react';
import './AIPromptBox.css';

export default function AIPromptBox({ placeholder, onSend, onAttach }) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue('');
  };

  return (
    <div className="ai-prompt-box">
      <textarea
        className="ai-prompt-box__textarea"
        placeholder={placeholder || 'What would you like to build? For example: Review response agent replying autonomously.'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows={2}
      />
      <div className="ai-prompt-box__toolbar">
        <div className="ai-prompt-box__tools">
          <button className="ai-prompt-box__tool-btn" onClick={onAttach} title="Attach file">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <button className="ai-prompt-box__tool-btn" title="Edit note">
            <span className="material-symbols-outlined">edit_note</span>
          </button>
          <button className="ai-prompt-box__tool-btn" title="More">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        <button
          className={`ai-prompt-box__send-btn${value.trim() ? ' ai-prompt-box__send-btn--active' : ''}`}
          onClick={handleSend}
          title="Send"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
}
