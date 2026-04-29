import React from 'react';

function ReactModal({ isOpen, children, style, onRequestClose }) {
  if (!isOpen) return null;

  return (
    <div style={style?.overlay} onClick={onRequestClose}>
      <div style={style?.content} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

ReactModal.setAppElement = () => {};

export default ReactModal;
