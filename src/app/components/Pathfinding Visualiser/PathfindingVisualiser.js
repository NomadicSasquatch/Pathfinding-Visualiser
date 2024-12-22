'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);

  useEffect(() => {
    console.log(`isRunning changed to: ${isRunning}`);
  }, [isRunning]);



  // DATA STRUCTURES FOR BFS //
  const bfsQueueRef = useRef([]);
  const bfsVisitedRef = useRef(null);
  // DATA STRUCTURES FOR BFS //

  const visitedDuringDrag = new Set();

  const handleMouseDown = (row, col) => {
    // TODO: add boundary checking  
    setIsMouseDown(true); 
    visitedDuringDrag.clear();
    switch(currentAction) {
      case 'toggleWall':
        handleNodeState(row, col, 'isWall');
        visitedDuringDrag.add(`${row},${col}`);
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
          if(!visitedDuringDrag.has(`${row},${col}`)) {
            handleNodeState(row, col, 'isWall');
            visitedDuringDrag.add(`${row},${col}`);
          }
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
    visitedDuringDrag.clear();
  };
  /* TODO: make it such that in a single stroke(from when M1 is pressed to when it is released) when a node is toggled,
  it cannot be toggled back. Via a static visited array or something */

  const handleNodeState = (row, col, attribute) => {
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
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isStart: false }))
    );
    setGrid(newGrid);
    setCurrentAction('setStart');
  };

  const handleSetEndButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isEnd: false }))
    );
    setGrid(newGrid);
    setCurrentAction('setEnd');
  };

  const handleRunButton = async () => {
    if(!isRunningRef.current) {
      isRunningRef.current = true;
      setIsRunning(true);
      switch(selectedAlgorithm) {
        case `Breadth-First Search`:
          if(bfsQueueRef.current.length === 0) initBFS();
          runBFS();
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
    else {
      isRunningRef.current = false;
      setIsRunning(false);
    }
  }

  const initBFS = () => {
    if(hasStart && hasEnd && hasStart.length === 2 && hasEnd.length === 2) {
      const updatedGrid = [...grid];
      updatedGrid[hasStart[0]][hasStart[1]].isVisited = true;
      setGrid(updatedGrid);

      bfsVisitedRef.current = updatedGrid; 
      bfsQueueRef.current = [[hasStart[0], hasStart[1]]];
    }
  };

  const runBFS = async () => {
    if(!bfsVisitedRef.current || bfsQueueRef.current.length === 0) {
      console.log("BFS cannot run; either paused or completed.");
      return;
    }
  
    const delay = 10;
    const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    const dir = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  
    const BreadthFirstSearchStep = async () => {
      if(!isRunningRef.current) {
        console.log("BFS paused.");
        return;
      }
  
      if(bfsQueueRef.current.length > 0) {
        const [curX, curY] = bfsQueueRef.current.shift();
  
        for(let i = 0; i < 4; i++) {
          const x = curX + dir[i][0];
          const y = curY + dir[i][1];
          if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !bfsVisitedRef.current[x][y].isWall && !bfsVisitedRef.current[x][y].isVisited) {
            if(x === hasEnd[0] && y === hasEnd[1]) {
              bfsVisitedRef.current[x][y].isVisited = true;
              setGrid([...bfsVisitedRef.current]);
              console.log("Path found!");
              isRunningRef.current = false;
              setIsRunning(false);
              return;
            }
  
            bfsVisitedRef.current[x][y].isVisited = true;
            bfsQueueRef.current.push([x, y]);
          }
        }
  
        setGrid([...bfsVisitedRef.current]);
      } 
      else {
        isRunningRef.current = false;
        setIsRunning(false);
        return;
      }
  
      await animate(delay);
      setTimeout(BreadthFirstSearchStep, 0);
    };

    BreadthFirstSearchStep();
  };
  

  return (
    <div className={styles.visualizerContainer}>
      <h1 className={styles.h1}>Pathfinding Visualizer</h1>
      <ControlPanel handleSetStartButton={handleSetStartButton} handleSetEndButton={handleSetEndButton} setCurrentAction={setCurrentAction} setSelectedAlgorithm={setSelectedAlgorithm} handleRunButton={handleRunButton} isRunning={isRunning}>

      </ControlPanel>
      <Grid grid={grid} setGrid={setGrid} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter} actionState={currentAction}/>
      <div className={styles.debugDisplay}>
        <strong>Current Action:</strong> {currentAction}
      </div>
      <div className={styles.debugDisplay}>
        <strong>Algo Status:</strong> {isRunning? "running" : "not running"}
      </div>
    </div>
  );
}
