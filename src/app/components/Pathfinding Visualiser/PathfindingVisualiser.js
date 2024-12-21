'use client';

import React, { useState, useEffect } from 'react';
import Grid from '../Grid/Grid';
import styles from './PathfindingVisualiser.module.css';
import { GRID_ROWS, GRID_COLS } from '../../config/config';

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(() => {
    const rows = GRID_ROWS;
    const cols = GRID_COLS;
    return Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        isStart: false,
        isEnd: false,
        isWall: false,
      }))
    );
  });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentAction, setCurrentAction] = useState('idle');
  
  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (row, col) => {
    setIsMouseDown(true);
    switch(currentAction) {
      case 'toggleWall':
        handleNodeState(row, col, 'isWall');
        break;
      case 'setStart':
        tester(row, col);
        console.log(`hit set start`);
        break;
      case 'setEnd':
        handleNodeState(row, col, 'isEnd');
        break;
      case 'idle':
        // NOP
        break;
      default:
        console.warn('STATE HANDLING ERROR!');
    }
  };

  const handleMouseEnter = (row, col) => {
    if(isMouseDown) {
      switch(currentAction) {
        case 'toggleWall':
          handleNodeState(row, col, 'isWall');
          break;
        case 'setStart':
          tester(row, col);
          break;
        case 'setEnd':
          handleNodeState(row, col, 'isEnd');
          break;  
        case 'idle':
          // NOP
          break;
        default:
          console.warn('STATE HANDLING ERROR!');
      }
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };
  /* TODO: make it such that in a single stroke(from when M1 is pressed to when it is released) when a node is toggled,
  it cannot be toggled back. Via a static visited array or something */

  const handleNodeState = (row, col, attribute) => {
    console.log(`::: at handle node state${attribute}\n`)
    const newGrid = grid.map((currentRow, rowIndex) =>
      currentRow.map((node, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...node, [attribute]: !node[attribute] };
        }
        return node;
      })
    );
    setGrid(newGrid);
  };


  
  const tester = (row, col) => {
    const newGrid = grid.map((currentRow, rowIndex) =>
      currentRow.map((node, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...node, isStart: !node.isStart };
        }
        return node;
      })
    );
    setGrid(newGrid);
  };


  const findPath = () => {
    console.log('Pathfinding algorithm starts here');
  };

  return (
    <div className={styles.visualizerContainer}>
      <h1 className={styles.h1}>Pathfinding Visualizer</h1>
      <button onClick={findPath} className={styles.button}>
        Find Path
      </button>
      <button onClick = {()=>setCurrentAction('setStart')} className={styles.button}>
        Set Start Node
      </button>
      <button onClick = {()=>setCurrentAction('setEnd')} className={styles.button}>
        Set End Node
      </button>
      <button onClick = {()=>setCurrentAction('toggleWall')} className={styles.button}>
        Toggle Wall
      </button>
      <Grid grid={grid} setGrid={setGrid} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter} actionState={currentAction}/>
      <div className={styles.debugDisplay}>
        <strong>Current Action:</strong> {currentAction}
      </div>
    </div>
  );
}
