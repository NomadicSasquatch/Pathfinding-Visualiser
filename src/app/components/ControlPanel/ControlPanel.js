"use client";

import React from 'react';
import Grid from '../Grid/Grid';
import Dropdown from '../Dropdown/Dropdown';
import styles from './ControlPanel.module.css';

const GridPanel = ({ handleSetStartButton, handleSetEndButton, setCurrentAction, setSelectedAlgorithm, handleRunButton, isRunning, handleClearPathButton, handleClearGridButton }) => {
  const algorithms = [`Breadth-First Search`, `Depth-First Search`, `Dijkstra's Algorithm`, `A* Algorithm`];

  return (
    <div className={styles.gridPanel}>
      <div className={styles.leftGroup}>
        <button onClick = {()=>handleSetStartButton()} className={styles.button}>
          Set Start Node
        </button>
        <button onClick = {()=>handleSetEndButton()} className={styles.button}>
          Set End Node
        </button>
        <button onClick = {()=>setCurrentAction('toggleWall')} className={styles.button}>
          Toggle Wall
        </button>
        <Dropdown options={algorithms} defaultText={`Select an Algorithm`} setSelectedAlgorithm={setSelectedAlgorithm}>

        </Dropdown>
        <button onClick = {()=>handleRunButton()} className={styles.button}>
          {isRunning ? "Pause Algorithm" : "Run Algorithm"}
        </button>
      </div>
      <div className={styles.rightGroup}>
        <button onClick = {()=>handleClearPathButton()} className={styles.button}>
          Clear Paths
        </button>
        <button onClick = {()=>handleClearGridButton()} className={styles.button}>
          Clear Grid
        </button>
      </div>
    </div>
  );
};

export default GridPanel;
