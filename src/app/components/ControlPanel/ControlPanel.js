"use client";

import React from 'react';
import Dropdown from '../Dropdown/Dropdown';
import Slider from '../Slider/Slider';
import styles from './ControlPanel.module.css';
import { DEFAULT_ALGO_DROPDOWN_TEXT  } from '../../config/config';

const ControlPanel = ({ handleSetStartButton, handleSetEndButton, setCurrentAction, selectedAlgorithm, setSelectedAlgorithm, selectedWallPattern, setSelectedWallPattern, hasStart, hasEnd, handleRunButton, handleGenerateWallButton, handleClearPathButton, handleClearWallsButton, handleClearGridButton, isRunningAlgo, isAlgoStart, isAlgoEnd, handleLoadButton, handleSaveButton, selectedUserPatternSlot, setSelectedUserPatternSlot }) => {
  const algorithms = [`Breadth-First Search`, `Depth-First Search`, `Greedy Best-First Search`, `A* Algorithm`];
  const patterns = [`Random Maze Pattern`, `Box Pattern`, `Rectangle Fractal Pattern`];
  const defaultWallPatternText = `Select A Wall Pattern`;
  const userPatterns = [`Pattern 1`, `Pattern 2`, `Pattern 3`];

  return (
    <div className={styles.gridPanel}>
      <div className={styles.topGroup}>
        <div className={styles.firstGroup}>
          <button onClick = {()=>handleSetStartButton()} className={styles.button} disabled={isAlgoStart}>
            Set Start Node
          </button>
          <button onClick = {()=>handleSetEndButton()} className={styles.button} disabled={isAlgoStart}>
            Set End Node
          </button>
        </div>
        <div className={styles.secondGroup}>
          <button onClick = {()=>setCurrentAction('toggleWall')} className={styles.button} disabled={isAlgoStart}>
            Toggle Wall
          </button>
          <Dropdown options={patterns} defaultText={`Select A Wall Pattern`} setSelectedWallPattern={setSelectedWallPattern} isAlgoStart={isAlgoStart} isAlgoEnd={isAlgoEnd} type={0}>
            
          </Dropdown>
          <button onClick = {()=>handleGenerateWallButton()} className={styles.button} disabled={!(defaultWallPatternText.localeCompare(selectedWallPattern)) || isAlgoStart}>
            Generate Wall Pattern
          </button>
        </div>
        <div className={styles.thirdGroup}>
          <Dropdown options={userPatterns} defaultText={`Save/Load Pattern`} setSelectedUserPatternSlot={setSelectedUserPatternSlot} isAlgoStart={isAlgoStart} isAlgoEnd={isAlgoEnd} type={2}>

          </Dropdown>
          <button className={styles.button} onClick = {()=>handleLoadButton()} disabled={isAlgoStart || selectedUserPatternSlot === -1}>
            Load Saved Pattern
          </button>
          <button className={styles.button} onClick = {()=>handleSaveButton()} disabled={isAlgoStart || selectedUserPatternSlot === -1}>
            Save Current Pattern
          </button>
        </div>
        <div className={styles.fourthGroup}>
          <Dropdown options={algorithms} defaultText={DEFAULT_ALGO_DROPDOWN_TEXT} setSelectedAlgorithm={setSelectedAlgorithm} isAlgoStart={isAlgoStart} isAlgoEnd={isAlgoEnd} type={1}>

          </Dropdown>
          <button onClick = {()=>handleRunButton()} className={styles.button} style={{ width: '200px' }} disabled={!(DEFAULT_ALGO_DROPDOWN_TEXT.localeCompare(selectedAlgorithm) && hasStart && hasEnd && !isAlgoEnd)}>
            {isRunningAlgo ? "Pause Algorithm" : "Run Algorithm"}
          </button>
        </div>
        <div className={styles.fifthGroup}>
          <button onClick = {()=>handleClearPathButton()} disabled={isRunningAlgo} className={styles.button}>
            Clear Paths
          </button>
          <button onClick = {()=>handleClearWallsButton()} disabled={isAlgoStart || isAlgoEnd} className={styles.button}>
            Clear Walls
          </button>
          <button onClick = {()=>handleClearGridButton()} disabled={isRunningAlgo} className={styles.button}>
            Clear Grid
          </button>
        </div>
      </div>
      <Slider>

      </Slider>
    </div>
  );
};

export default ControlPanel;
