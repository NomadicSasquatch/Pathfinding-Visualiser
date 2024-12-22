'use client';

import React, { useState, useEffect } from 'react';
import Grid from '../Grid/Grid';
import styles from './PathfindingVisualiser.module.css';
import ControlPanel from '../ControlPanel/ControlPanel';
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
        isVisited: false
      }))
    );
  });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentAction, setCurrentAction] = useState('idle');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [hasStart, setHasStart] = useState(null);
  const [hasEnd, setHasEnd] = useState(null);

  const handleMouseDown = (row, col) => {
    // TODO: add boundary checking  
    setIsMouseDown(true); 
    switch(currentAction) {
      case 'toggleWall':
        handleNodeState(row, col, 'isWall');
        break;
      case 'setStart':
        handleNodeState(row, col, 'isStart');
        setHasStart([row, col]);
        setCurrentAction('idle');
        break;
      case 'setEnd':
        handleNodeState(row, col, 'isEnd');
        setHasEnd([row, col]);
        setCurrentAction('idle');
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
          setCurrentAction('idle');
          break;
        case 'setEnd':
          setCurrentAction('idle');
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

  const handleSetStartButton = () => {
    for(let row = 0; row < GRID_ROWS; row++) {
      for(let col = 0; col < GRID_COLS; col++) {
        if(grid[row][col].isStart) {
          grid[row][col].isStart = !grid[row][col].isStart;
        }
      }
    }
    setCurrentAction('setStart');
  }

  const handleSetEndButton = () => {
    for(let row = 0; row < GRID_ROWS; row++) {
      for(let col = 0; col < GRID_COLS; col++) {
        if(grid[row][col].isEnd) {
          grid[row][col].isEnd = !grid[row][col].isEnd;
        }
      }
    }
    setCurrentAction('setEnd');
  }

  const handleRunButton = () => {
    switch(selectedAlgorithm) {
      case `Breadth-First Search`:
        breadthFirstSearch();
        break;
      case `Depth-First Search`:
      
        break;
      case `Dijkstra's Algorithm`:

        break;
      case `A* Algorithm`:

        break;
      default:
        //NOP
    }
  }

  const breadthFirstSearch = async () => {
    if(hasStart && hasEnd && hasStart.length === 2 && hasEnd.length === 2) {
      const dir = [[-1, 0], [0, 1], [1, 0], [0, -1]];
      const queue = [];
      queue.push([hasStart[0], hasStart[1]]);
  
      const updatedGrid = [...grid];
      updatedGrid[hasStart[0]][hasStart[1]].isVisited = true;
  
      let delay = 10;

      const animate = (callback) =>
        new Promise((resolve) => setTimeout(() => resolve(callback()), delay));
  
  
      while(queue.length > 0) {
        const [curX, curY] = queue.shift();
        for(let i = 0; i < 4; i++) {
          const x = curX + dir[i][0];
          const y = curY + dir[i][1];
          if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !updatedGrid[x][y].isWall && !updatedGrid[x][y].isVisited) {
            if(x === hasEnd[0] && y === hasEnd[1]) {
              updatedGrid[x][y].isVisited = true;
              setGrid(updatedGrid);
              return;
            }
  
            updatedGrid[x][y].isVisited = true;
            queue.push([x, y]);
          }
        }
        setGrid([...updatedGrid]);
        await animate(() => {});
      }
  
      console.log("Path not found.");
    } else {
      console.error("Start or end node is invalid.");
    }
  };
  

  return (
    <div className={styles.visualizerContainer}>
      <h1 className={styles.h1}>Pathfinding Visualizer</h1>
      <ControlPanel handleSetStartButton={handleSetStartButton} handleSetEndButton={handleSetEndButton} setCurrentAction={setCurrentAction} setSelectedAlgorithm={setSelectedAlgorithm} handleRunButton={handleRunButton}>

      </ControlPanel>
      <Grid grid={grid} setGrid={setGrid} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter} actionState={currentAction}/>
      <div className={styles.debugDisplay}>
        <strong>Current Action:</strong> {currentAction}
      </div>
    </div>
  );
}
