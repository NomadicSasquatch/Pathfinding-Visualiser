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
        isVisited: false,
        // attributes for A* (consider workarounds)
        gCost: Infinity,
        hCost: Infinity,
        fCost: Infinity,
        parent: null,
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


  const dir = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  // DATA STRUCTURES FOR BFS //
  const bfsQueueRef = useRef([]);
  const bfsVisitedRef = useRef(null);
  // DATA STRUCTURES FOR BFS //
  
  // DATA STRUCTURES FOR DFS //
  const dfsStackRef = useRef([]);
  const dfsVisitedRef = useRef(null);
  // DATA STRUCTURES FOR DFS //

  // DATA STRUCTURES FOR A* //
  const aStarOpenSetRef = useRef([]);
  const aStarVisitedRef = useRef(null);
  // DATA STRUCTURES FOR A* //

  const visitedDuringDragRef = useRef(new Set());

  const handleMouseDown = (row, col) => {
    // TODO: add boundary checking  
    setIsMouseDown(true);
    switch(currentAction) {
      case 'toggleWall':
        handleNodeState(row, col, 'isWall');
        visitedDuringDragRef.current.add(`${row},${col}`);
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
        //NOP
        break;
      default:
        console.warn('STATE HANDLING ERROR!');
    }
  };
  
  const handleMouseEnter = (row, col) => {
    if(!isMouseDown) return;
  
    switch(currentAction) {
      case 'toggleWall':
        const key = `${row},${col}`;
        if(!visitedDuringDragRef.current.has(key)) {
          handleNodeState(row, col, 'isWall');
          console.log(`the set is`, visitedDuringDragRef.current);
          visitedDuringDragRef.current.add(key);
          console.log(` + `, visitedDuringDragRef.current);
        }
        else {
          console.log(`THE CURRENT TOTAL SET:`, visitedDuringDragRef.current);
        }
        break;
  
      case 'setStart':
        setCurrentAction('idle');
        break;
      case 'setEnd':
        setCurrentAction('idle');
        break;
      case 'idle':
        //NOP
        break;
      default:
        console.warn('STATE HANDLING ERROR!');
        break;
    }
  };
  
  const handleMouseUp = () => {
    setIsMouseDown(false);
    visitedDuringDragRef.current.clear();
  };

  const handleNodeState = (row, col, attribute) => {
    const newGrid = grid.map((currentRow, rowIndex) =>
      currentRow.map((node, colIndex) => {
        if(rowIndex === row && colIndex === col) {
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

  const resetDataStructs = () => {
    bfsQueueRef.current = [];
    bfsVisitedRef.current = null;
    dfsStackRef.current = [];
    dfsVisitedRef.current = null;
    aStarOpenSetRef.current = [];
    aStarVisitedRef.current = null;
  
    isRunningRef.current = false;
    setIsRunning(false);
  }

  const handleClearPathButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isVisited: false, gCost: Infinity, hCost: Infinity, fCost: Infinity, parent: null}))
    );
    setGrid(newGrid);
    resetDataStructs()
  };

  const handleClearGridButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isVisited: false, isWall: false, isStart: false, isEnd: false, gCost: Infinity, hCost: Infinity, fCost: Infinity, parent: null}))
    );
    setGrid(newGrid);
    resetDataStructs();
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
          if(dfsStackRef.current.length === 0) initDFS();
          runDFS();
          break;
        case `Dijkstra's Algorithm`:

          break;
        case `A* Algorithm`:
          if(aStarOpenSetRef.current.length === 0) initAStar();
          runAStar();
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
  
    const delay = 0.5;
    const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
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

  const initDFS = () => {
    if(hasStart && hasEnd && hasStart.length === 2 && hasEnd.length === 2) {
      const updatedGrid = [...grid];
      setGrid(updatedGrid);

      dfsVisitedRef.current = updatedGrid;
      dfsStackRef.current = [[hasStart[0], hasStart[1]]];
      console.log(`DFS initialisation complete\n`, dfsStackRef.current);
    }
  };

  const runDFS = () => {
    if(!dfsVisitedRef.current || dfsStackRef.current.length === 0) {
      console.log(`DFS has not been initialised\n`);
      return;
    }
    const delay = 0.5;
    const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    console.log(`DFS begins\n`);
    const depthFirstSearch = async () => {
      if(!isRunningRef.current) {
        console.log(`DFS is paused`);
        return;
      }
      if(dfsStackRef.current.length === 0) {
        console.log(`DFS complete (no path or stack exhausted).`, dfsStackRef.current);
        isRunningRef.current = false;
        setIsRunning(false);
        return;
      }

      const [row, col] = dfsStackRef.current.pop();

      if(row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS || dfsVisitedRef.current[row][col].isWall || dfsVisitedRef.current[row][col].isVisited) {
        await animate(delay);
        depthFirstSearch();
        return;
      }
      if(row === hasEnd[0] && col === hasEnd[1]) {
        isRunningRef.current = false;
        setIsRunning(false);
        return;
      }
      dfsVisitedRef.current[row][col].isVisited = true;
      setGrid([...dfsVisitedRef.current]);

      for(let i = 0; i < 4; i++) {
        const x = row + dir[i][0];
        const y = col + dir[i][1];
        dfsStackRef.current.push([x,y]);
      }
      await animate(delay);
      depthFirstSearch();
    }
    depthFirstSearch();
  };

  const initAStar = () => {
    if(hasStart && hasEnd) {
      const newGrid = grid.map((row) => row.map((node) => ({ ...node })));

      const [sr, sc] = hasStart;
      const [er, ec] = hasEnd;

      newGrid[sr][sc].gCost = 0;
      newGrid[sr][sc].hCost = manhattanDist(sr, sc, er, ec);
      newGrid[sr][sc].fCost = newGrid[sr][sc].gCost + newGrid[sr][sc].hCost;

      setGrid(newGrid);

      aStarVisitedRef.current = newGrid;
      aStarOpenSetRef.current = [[sr, sc]];
    }
  };

  const runAStar = () => {
    if(!aStarVisitedRef.current || aStarOpenSetRef.current.length === 0) {
      console.log('A* cannot run; not initialized or openSet empty.');
      return;
    }

    const delay = 0.5;
    const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const AStarStep = async () => {
      if(!isRunningRef.current) {
        console.log('A* paused.');
        return;
      }

      if(aStarOpenSetRef.current.length === 0) {
        console.log('A* complete: no path found.');
        isRunningRef.current = false;
        setIsRunning(false);
        return;
      }

      aStarOpenSetRef.current.sort((a, b) => {
        const nodeA = aStarVisitedRef.current[a[0]][a[1]];
        const nodeB = aStarVisitedRef.current[b[0]][b[1]];
        return nodeA.fCost - nodeB.fCost;
      });

      const [row, col] = aStarOpenSetRef.current.shift();
      const currentNode = aStarVisitedRef.current[row][col];
      currentNode.isVisited = true;

      if(row === hasEnd[0] && col === hasEnd[1]) {
        isRunningRef.current = false;
        setIsRunning(false);
        setGrid([...aStarVisitedRef.current]);
        return;
      }

      for(let i = 0; i < 4; i++) {
        const x = row + dir[i][0];
        const y = col + dir[i][1];
        if(x < 0 || x >= GRID_ROWS || y < 0 || y >= GRID_COLS || aStarVisitedRef.current[x][y].isWall || aStarVisitedRef.current[x][y].isVisited) {
          continue;
        }

        const tentativeG = currentNode.gCost + 1;
        const neighborNode = aStarVisitedRef.current[x][y];
        if(tentativeG < neighborNode.gCost) {
          neighborNode.gCost = tentativeG;
          neighborNode.hCost = manhattanDist(x, y, hasEnd[0], hasEnd[1]);
          neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
          neighborNode.parent = currentNode;

          aStarOpenSetRef.current.push([x, y]);
        }
      }

      setGrid([...aStarVisitedRef.current]);

      await animate(delay);
      AStarStep();
    };

    AStarStep();
  };

  const manhattanDist = (r1, c1, r2, c2) => {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
  };
  

  return (
    <div className={styles.visualizerContainer}>
      <h1 className={styles.h1}>Pathfinding Visualizer</h1>
      <ControlPanel handleSetStartButton={handleSetStartButton} handleSetEndButton={handleSetEndButton} setCurrentAction={setCurrentAction} setSelectedAlgorithm={setSelectedAlgorithm} handleRunButton={handleRunButton} isRunning={isRunning} handleClearPathButton={handleClearPathButton} handleClearGridButton={handleClearGridButton}>

      </ControlPanel>
      <Grid grid={grid} setGrid={setGrid} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter} actionState={currentAction}/>
      <div className={styles.debugDisplay}>
        <strong>Current Action:</strong> {currentAction}
      </div>
      <div className={styles.debugDisplay}>
        <strong>Algo Status:</strong> {isRunning? "running" : "not running"}
      </div>
      <div className={styles.debugDisplay}>
        <strong> Mouse Status:</strong> {isMouseDown? "mouseDown" : "mouseUp"}
      </div>
    </div>
  );
}
