"use client";

import React from 'react';
import Grid from '../Grid/Grid';
import Dropdown from '../Dropdown/Dropdown';
import styles from './ControlPanel.module.css';

const GridPanel = ({ handleSetStartButton, handleSetEndButton, setCurrentAction, setSelectedAlgorithm, handleRunButton }) => {
  const algorithms = [`Breadth-First Search`, `Depth-First Search`, `Dijkstra's Algorithm`, `A* Algorithm`];

  return (
    <div className={styles.gridPanel}>
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
        Run Algorithm
      </button>
    </div>
  );
};

export default GridPanel;
