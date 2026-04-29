import React from 'react';

export default function ReactList({ itemRenderer, length = 0 }) {
  return (
    <>
      {Array.from({ length }, (_, index) => itemRenderer?.(index, index))}
    </>
  );
}
