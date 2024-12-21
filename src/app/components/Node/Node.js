"use client";

import React, { useEffect } from 'react';
import styles from './Node.module.css';
import { NODE_SIZE } from '../../config/config';

const Node = ({ row, col, isStart, isEnd, isWall, onMouseDown, onMouseUp, onMouseEnter }) => {
  useEffect(() => {
    // Set the CSS variable in the root element
    document.documentElement.style.setProperty('--node-size', `${NODE_SIZE}px`);
  }, []);

  const extraClassName = isStart
    ? styles.nodeStart
    : isEnd
    ? styles.nodeEnd
    : isWall
    ? styles.nodeWall
    : styles.nodeDefault;
    
  return (
    <div
      className={`${styles.node} ${extraClassName}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    />
  );
};

export default Node;