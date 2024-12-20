"use client";

import React from 'react';
import styles from './Node.module.css';

const Node = ({ row, col, isStart, isEnd, isWall, onClick }) => {
  // Assign additional CSS classes based on the type of node
  const extraClassName = isStart
    ? styles.nodeStart
    : isEnd
    ? styles.nodeEnd
    : isWall
    ? styles.nodeWall
    : '';
    
  return (
    <div
      className={`${styles.node} ${extraClassName}`}
      onClick={onClick}
    />
  );
};

export default Node;