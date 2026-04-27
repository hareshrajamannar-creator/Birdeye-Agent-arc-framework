import React from 'react';
import aiAvatar from '@birdeye/elemental/core/components/Copilot/assets/icons/ai-avatar.svg.js';
import './AIChatBubble.css';

export default function AIChatBubble({ message, options = [], onOptionSelect }) {
  return (
    <div className="ai-chat-bubble">
      <div className="ai-chat-bubble__avatar">
        <img src={aiAvatar} alt="" width={20} height={20} />
      </div>
      <div className="ai-chat-bubble__body">
        <p className="ai-chat-bubble__message">{message}</p>
        {options.length > 0 && (
          <div className="ai-chat-bubble__options">
            {options.map((opt, i) => (
              <button
                key={i}
                className="ai-chat-bubble__option"
                onClick={() => onOptionSelect?.(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
