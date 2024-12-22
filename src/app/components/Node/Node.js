"use client";

import React, { useEffect } from 'react';
import styles from './Node.module.css';
import { NODE_SIZE } from '../../config/config';

const Node = React.memo(({ row, col, isStart, isEnd, isWall, isVisited, onMouseDown, onMouseUp, onMouseEnter }) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--node-size', `${NODE_SIZE}px`);
  }, []);

  const extraClassName = isStart
    ? styles.nodeStart
    : isEnd
    ? styles.nodeEnd
    : isWall
    ? styles.nodeWall
    : isVisited
    ? styles.nodeVisited
    : styles.default;
    
  return (
    <div
      className={`${styles.node} ${extraClassName}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    />
  );
});

export default Node;