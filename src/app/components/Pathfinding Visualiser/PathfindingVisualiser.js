'use client';
/*
- gradient
- collapsible path comparison
- fixed sets of wall patterns to choose from
- scaling issue
- tutorial/walkthrough that can runs on first render and when user clicks on the tutorial button
*/

import React, { useState, useEffect, useRef } from 'react';
import Grid from '../Grid/Grid';
import styles from './PathfindingVisualiser.module.css';
import ControlPanel from '../ControlPanel/ControlPanel';
import { GRID_ROWS, GRID_COLS, DEFAULT_ALGO_DROPDOWN_TEXT } from '../../config/config';

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
        isInFinalPath: false,
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
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(DEFAULT_ALGO_DROPDOWN_TEXT);
  const [hasStart, setHasStart] = useState(null);
  const [hasEnd, setHasEnd] = useState(null);
  const [isRunningAlgo, setIsRunningAlgo] = useState(false);
  const [isAlgoStart, setIsAlgoStart] = useState(false);
  const [isAlgoEnd, setIsAlgoEnd] = useState(false);
  const isRunningRef = useRef(false);
  const isRunningAlgoRef = useRef(false);

  //testing mouse dragging queue:
  const mouseOpQueue = useRef([]);

  // useEffect(() => {
  //   console.log(`isRunning changed to: ${isRunning}`);
  // }, [isRunning]);


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
        const flag = handleNodeState(row, col, 'isWall');
        visitedDuringDragRef.current.add(`${row},${col}`);
        if(flag === 1) {
          mouseOpQueue.current.push([row, col]);
        }
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
          visitedDuringDragRef.current.add(key);
          const flag = handleNodeState(row, col, 'isWall');
          // console.log(`the current mouseOpQueue:`, mouseOpQueue);
          if(flag === 0) {
            if(mouseOpQueue.current.length !== 0) {
              mouseOpQueue.current.shift();
            }
            setGrid([...grid]);
            break;
          }
          if(mouseOpQueue.current.length !== 0) {
            const [curX, curY] = mouseOpQueue.current.shift();
            patchWalls(grid[curX][curY], grid[row][col]);
          }
          else {
            patchWalls(grid[row][col], grid[row][col]);
          }
          mouseOpQueue.current.push([row,col]);
          setGrid([...grid]);
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
    mouseOpQueue.current = [];
  };

  function patchWalls(node1, node2) {
    let x1 = node1.row;
    let y1 = node1.col;
    const x2 = node2.row;
    const y2 = node2.col;
  
    if(x1 === x2 && y1 === y2) {
      grid[x1][y1].isWall = true;
      return;
    }
    if(Math.abs(x2 - x1) <= 1 && Math.abs(y2 - y1) <= 1) {
      grid[x2][y2].isWall = true;
      return;
    }
  
    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;
    const dy = -Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;
  
    let err = dx + dy;
  
    while(true) {
      grid[x1][y1].isWall = true;
  
      if(x1 === x2 && y1 === y2) {
        break;
      }
  
      const e2 = 2 * err;
  
      if(e2 >= dy) {
        err += dy;
        x1 += sx;
      }
      if(e2 <= dx) {
        err += dx;
        y1 += sy;
      }
    }
  }

  const handleNodeState = (row, col, attribute) => {
    if(attribute.localeCompare(`isWall`) === 0) {
      if(hasEnd && hasEnd[0] === row && hasEnd[1] === col) {
        return 0;
      }
      if(hasStart && hasStart[0] === row && hasStart[1] === col) {
        return 0;
      }
    }
    const newGrid = grid.map((currentRow, rowIndex) =>
      currentRow.map((node, colIndex) => {
        if(rowIndex === row && colIndex === col) {
          return { ...node, [attribute]: !node[attribute] };
        }
        return node;
      })
    );
    setGrid(newGrid);
    return 1;
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
  }

  const handleClearPathButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isVisited: false, isInFinalPath: false, gCost: Infinity, hCost: Infinity, fCost: Infinity, parent: null}))
    );
    setGrid(newGrid);
    resetDataStructs()
    isRunningAlgoRef.current = false;
    setIsRunningAlgo(false);
    setIsAlgoStart(false);
    setIsAlgoEnd(false);
  };

  const handleClearWallsButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isWall: false}))
    );
    setGrid(newGrid);
    resetDataStructs();
    isRunningAlgoRef.current = false;
    setIsRunningAlgo(false);
    setIsAlgoStart(false);
    setIsAlgoEnd(false);
  }

  const handleClearGridButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isVisited: false, isWall: false, isStart: false, isEnd: false, isInFinalPath: false, gCost: Infinity, hCost: Infinity, fCost: Infinity, parent: null}))
    );
    setGrid(newGrid);
    resetDataStructs();
    isRunningAlgoRef.current = false;
    setIsRunningAlgo(false);
    setHasStart(null);
    setHasEnd(null);
    setIsAlgoStart(false);
    setIsAlgoEnd(false);
  };

  const constructFinalPath = (row, col) => {
    if(row === hasStart[0] && col === hasStart[1]) {
      return;
    }

    grid[row][col].isInFinalPath = true;
    const parentNode = grid[row][col].parent;
    if(!parentNode) {
      return;
    }

    constructFinalPath(parentNode.row, parentNode.col);
  }

  const constructFinalPathAStar = (row, col) => {
    function backtrack(r, c) {
      if(r === hasStart[0] && c === hasStart[1]) {
        aStarVisitedRef.current[r][c].isInFinalPath = true;
        return;
      }
  
      aStarVisitedRef.current[r][c].isInFinalPath = true;
      const parentNode = aStarVisitedRef.current[r][c].parent;
      if(parentNode) {
        backtrack(parentNode.row, parentNode.col);
      }
    }
  
    backtrack(row, col);
    setGrid([...aStarVisitedRef.current]);
  };
  
  const handleRunButton = async () => {
    setCurrentAction('idle');
    setIsAlgoStart(true);
    if(!isRunningRef.current) {
      isRunningRef.current = true;
      isRunningAlgoRef.current = true;
      setIsRunningAlgo(true);
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
      setIsRunningAlgo(false);
    }
  }

  const initBFS = () => {
    if(hasStart && hasEnd) {
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
  
    const delay = 0;
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
            bfsVisitedRef.current[x][y].parent = bfsVisitedRef.current[curX][curY];
            if(x === hasEnd[0] && y === hasEnd[1]) {
              bfsVisitedRef.current[x][y].isVisited = true;
              setGrid([...bfsVisitedRef.current]);
              console.log("Path found!");
              isRunningRef.current = false;
              isRunningAlgoRef.current = false;
              setIsRunningAlgo(false);
              constructFinalPath(x, y);
              setIsAlgoEnd(true);
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
        return;
      }
  
      await animate(delay);
      setTimeout(BreadthFirstSearchStep, 0);
    };

    BreadthFirstSearchStep();
  };

  const initDFS = () => {
    if(hasStart && hasEnd) {
      const updatedGrid = [...grid];
      setGrid(updatedGrid);

      dfsVisitedRef.current = updatedGrid;
      dfsStackRef.current = [[hasStart[0], hasStart[1]]];
    }
  };

  const runDFS = () => {
    if(!dfsVisitedRef.current || dfsStackRef.current.length === 0) {
      console.log(`DFS has not been initialised\n`);
      return;
    }
    const delay = 0.05;
    const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const depthFirstSearch = async () => {
      if(!isRunningRef.current) {
        console.log(`DFS is paused`);
        return;
      }
      if(dfsStackRef.current.length === 0) {
        console.log(`DFS complete (no path or stack exhausted).`, dfsStackRef.current);
        isRunningRef.current = false;
        return;
      }

      const [row, col] = dfsStackRef.current.pop();
      
      if(row === hasEnd[0] && col === hasEnd[1]) {
        isRunningRef.current = false;
        isRunningAlgoRef.current = false;
        setIsRunningAlgo(false);
        constructFinalPath(row, col);
        setIsAlgoEnd(true);
        return;
      }
      dfsVisitedRef.current[row][col].isVisited = true;
      setGrid([...dfsVisitedRef.current]);

      for(let i = 0; i < 4; i++) {
        const x = row + dir[i][0];
        const y = col + dir[i][1];
        if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !dfsVisitedRef.current[x][y].isWall && !dfsVisitedRef.current[x][y].isVisited) {
          dfsStackRef.current.push([x,y]);
          dfsVisitedRef.current[x][y].parent = dfsVisitedRef.current[row][col];
        }
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

    const delay = 0;
    const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const AStarStep = async () => {
      if(!isRunningRef.current) {
        console.log('A* paused.');
        return;
      }

      if(aStarOpenSetRef.current.length === 0) {
        console.log('A* complete: no path found.');
        isRunningRef.current = false;
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
        setGrid([...aStarVisitedRef.current]);
        isRunningAlgoRef.current = false;
        setIsRunningAlgo(false);
        constructFinalPathAStar(row, col);
        setGrid([...aStarVisitedRef.current]);
        setIsAlgoEnd(true);
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
      <ControlPanel handleSetStartButton={handleSetStartButton} handleSetEndButton={handleSetEndButton} setCurrentAction={setCurrentAction} selectedAlgorithm={selectedAlgorithm} setSelectedAlgorithm={setSelectedAlgorithm} hasStart={hasStart} hasEnd={hasEnd} handleRunButton={handleRunButton} handleClearPathButton={handleClearPathButton} handleClearWallsButton={handleClearWallsButton} handleClearGridButton={handleClearGridButton} isRunningAlgo={isRunningAlgo} isAlgoStart={isAlgoStart} isAlgoEnd={isAlgoEnd}>

      </ControlPanel>
      <Grid grid={grid} setGrid={setGrid} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter} actionState={currentAction}/>
      {/* <div className={styles.debugDisplay}>
        <strong>Current Action:</strong> {currentAction}
      </div>
      <div className={styles.debugDisplay}>
        <strong>Algo Status:</strong> {isRunningAlgo? "running" : "not running"}
      </div>
      <div className={styles.debugDisplay}>
        <strong> Mouse Status:</strong> {isMouseDown? "mouseDown" : "mouseUp"}
      </div> */}
    </div>
  );
}
