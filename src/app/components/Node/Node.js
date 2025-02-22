"use client";

import React, { useEffect } from 'react';
import styles from './Node.module.css';
import { NODE_SIZE } from '../../config/config';

const Node = React.memo(({ row, col, isStart, isEnd, isWall, isVisited, waveIndex, isInFinalPath, gCost, hCost, fCost, parent, onMouseDown, onMouseUp, onMouseEnter }) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--node-size', `${NODE_SIZE}px`);
  }, []);

  const extraClassName = isStart
    ? styles.nodeStart
    : isEnd
    ? styles.nodeEnd
    : isWall
    ? styles.nodeWall
    : isInFinalPath
    ? styles.isInFinalPath
    : waveIndex >= 0
    ? styles.waveColour
    : isVisited
    ? styles.nodeVisited
    : styles.default;
    
  return (
    <div
    className={`${styles.node} ${extraClassName} ${
      waveIndex >= 0 ? styles[`wave-${waveIndex % 2}`] : ""
    }`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    />
  );
});

export default Node;