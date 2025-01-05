"use client";

import React from 'react';
import Grid from '../Grid/Grid';
import Dropdown from '../Dropdown/Dropdown';
import styles from './ControlPanel.module.css';
import dropStyle from '../Dropdown/Dropdown.module.css'
import { DEFAULT_ALGO_DROPDOWN_TEXT  } from '../../config/config';

const GridPanel = ({ handleSetStartButton, handleSetEndButton, setCurrentAction, selectedAlgorithm, setSelectedAlgorithm, setSelectedWallPattern, hasStart, hasEnd, handleRunButton, handleGenerateWallButton, handleClearPathButton, handleClearWallsButton, handleClearGridButton, isRunningAlgo, isAlgoStart, isAlgoEnd }) => {
  const algorithms = [`Breadth-First Search`, `Depth-First Search`, `Greedy Best-First Search`, `A* Algorithm`];
  const patterns = [`Random Maze Pattern`, `Box Pattern`];

  return (
    <div className={styles.gridPanel}>
      <div className={styles.leftGroup}>
        <button onClick = {()=>handleSetStartButton()} className={styles.button} disabled={isAlgoStart}>
          Set Start Node
        </button>
        <button onClick = {()=>handleSetEndButton()} className={styles.button} disabled={isAlgoStart}>
          Set End Node
        </button>
        <button onClick = {()=>setCurrentAction('toggleWall')} className={styles.button} disabled={isAlgoStart}>
          Toggle Wall
        </button>
        <Dropdown options={patterns} defaultText={`Select A Wall Pattern`} setSelectedWallPattern={setSelectedWallPattern} type={0}>
          
        </Dropdown>
        <button onClick = {()=>handleGenerateWallButton()} className={styles.button} disabled={isAlgoStart}>
          Generate Wall Pattern
        </button>
        <Dropdown options={algorithms} defaultText={DEFAULT_ALGO_DROPDOWN_TEXT} setSelectedAlgorithm={setSelectedAlgorithm} isAlgoStart={isAlgoStart} isAlgoEnd={isAlgoEnd} type={1}>

        </Dropdown>
        <button onClick = {()=>handleRunButton()} className={styles.button} disabled={!(DEFAULT_ALGO_DROPDOWN_TEXT.localeCompare(selectedAlgorithm) && hasStart && hasEnd && !isAlgoEnd)}>
          {isRunningAlgo ? "Pause Algorithm" : "Run Algorithm"}
        </button>
      </div>
      <div className={styles.rightGroup}>
        <button onClick = {()=>handleClearPathButton()} className={styles.button}>
          Clear Paths
        </button>
        <button onClick = {()=>handleClearWallsButton()} disabled={isAlgoStart} className={styles.button}>
          Clear Walls
        </button>
        <button onClick = {()=>handleClearGridButton()} className={styles.button}>
          Clear Grid
        </button>
      </div>
    </div>
  );
};

export default GridPanel;
