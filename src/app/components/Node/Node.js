"use client";

import React from 'react';
import './Node.module.css';

const Node = ({ row, col, isStart, isEnd, isWall, onClick }) => {
  // Assign additional CSS classes based on the type of node
  const extraClassName = isStart
    ? 'node-start'
    : isEnd
    ? 'node-end'
    : isWall
    ? 'node-wall'
    : '';

  return (
    <div
      className={`node ${extraClassName}`} // Combine base and conditional classes
      onClick={onClick} // Trigger the passed click event handler
      data-row={row} // Optional: Useful for debugging or data attributes
      data-col={col} // Optional: Useful for debugging or data attributes
    >
      {/* You can add text or icons inside the node if needed */}
    </div>
  );
};

export default Node;