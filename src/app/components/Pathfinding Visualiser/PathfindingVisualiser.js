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
        waveIndex: -1,
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
  const [selectedWallPattern, setSelectedWallPattern] = useState(`Select A Wall Pattern`);
  const [hasStart, setHasStart] = useState(null);
  const [hasEnd, setHasEnd] = useState(null);
  const [isRunningAlgo, setIsRunningAlgo] = useState(false);
  const [isAlgoStart, setIsAlgoStart] = useState(false);
  const [isAlgoEnd, setIsAlgoEnd] = useState(false);
  const isRunningRef = useRef(false);
  const isRunningAlgoRef = useRef(false);
  let chunkSize = 10;

  //testing mouse dragging queue:
  const mouseOpQueue = useRef([]);
  const animationIndexRef = useRef(0);

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

  // DATA STRUCTURES FOR GREEDY BEST-FIRST SEARCH //
  // const greedyBfsSetRef = useRef([]);
  // const greedyBfsVisitedRef = useRef(null);
  // const greedyBfsVisitOrder = useRef([]); // probably in js you can push arrays into a 1D array to make 2D (tbc)
  const revealedVisitedCountRef = useRef(0);
  // DATA STRUCTURES FOR GREEDY BEST-FIRST SEARCH //

  // general replay data struct
  let frontierTimeline = [];
  let visitedOrder = [];

  const visitedDuringDragRef = useRef(new Set());

  const handleMouseDown = (row, col) => {
    // TODO: add boundary checking  
    setIsMouseDown(true);
    // for(let i = 0; i < GRID_ROWS; i++) {
    //   for(let j = 0; j < GRID_COLS; j++){
    //     console.log(grid[i][j].waveIndex);
    //   }
    // }
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

    frontierTimeline = [];
    visitedOrder = [];
    animationIndexRef.current = 0;
    revealedVisitedCountRef.current = 0;

    isRunningRef.current = false;
  }

  const handleClearPathButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isVisited: false, waveIndex: -1, isInFinalPath: false, gCost: Infinity, hCost: Infinity, fCost: Infinity, parent: null}))
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
      row.map((node) => ({ ...node, isVisited: false, waveIndex: -1, isWall: false, isStart: false, isEnd: false, isInFinalPath: false, gCost: Infinity, hCost: Infinity, fCost: Infinity, parent: null}))
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
        case `Greedy Best-First Search`:
          if(visitedOrder.length === 0) runGreedyBfs();
          animateGreedyBFS();
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
        bfsVisitedRef.current[curX][curY].waveIndex = -1;
  
        for(let i = 0; i < 4; i++) {
          const x = curX + dir[i][0];
          const y = curY + dir[i][1];
          if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !bfsVisitedRef.current[x][y].isWall && !bfsVisitedRef.current[x][y].isVisited) {
            bfsVisitedRef.current[x][y].parent = bfsVisitedRef.current[curX][curY];
            bfsVisitedRef.current[x][y].waveIndex = 1;
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
          chunkSize++;
        }
  
        if(chunkSize >= 10) {
          setGrid([...bfsVisitedRef.current]);
          chunkSize = 0;
        }
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
      dfsVisitedRef.current[row][col].waveIndex = -1;
      setGrid([...dfsVisitedRef.current]);

      for(let i = 0; i < 4; i++) {
        const x = row + dir[i][0];
        const y = col + dir[i][1];
        if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !dfsVisitedRef.current[x][y].isWall && !dfsVisitedRef.current[x][y].isVisited) {
          dfsStackRef.current.push([x,y]);
          dfsVisitedRef.current[x][y].waveIndex = 1;
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
      currentNode.waveIndex = -1;

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
          aStarVisitedRef.current[x][y].waveIndex = 1
          aStarOpenSetRef.current.push([x, y]);
        }
      }

      setGrid([...aStarVisitedRef.current]);
      //console.log(aStarVisitedRef.current[row][col].waveIndex);

      await animate(delay);
      AStarStep();
    };

    AStarStep();
  };

  const manhattanDist = (r1, c1, r2, c2) => {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
  };

  // const initGreedyBfs = () => {
  //   if(hasStart && hasEnd) {
  //     const newGrid = grid.map((row) => row.map((node) => ({ ...node })));

  //     const [sr, sc] = hasStart;
  //     const [er, ec] = hasEnd;

  //     newGrid[sr][sc].hCost = manhattanDist(sr, sc, er, ec);
  //     greedyBfsVisitedRef.current = newGrid;
  //     greedyBfsSetRef.current = [[sr, sc]];
  //     greedyBfsVisitOrder.current = [];

  //     setGrid(newGrid);
  //   }
  // };

  const runGreedyBfs = () => {
    const newGrid =  grid.map((row) => row.map((node) => ({ ...node })));
    console.log(newGrid);
    let openSet = [];
    openSet.push([hasStart[0], hasStart[1]]);

    newGrid[hasStart[0]][hasStart[1]].hCost = manhattanDist(hasStart[0], hasStart[1], hasEnd[0], hasEnd[1]);

    while(openSet.length > 0) {
      frontierTimeline.push([...openSet]);

      openSet.sort((a, b) => {
        const nodeA = newGrid[a[0]][a[1]];
        const nodeB = newGrid[b[0]][b[1]];

        return nodeA.hCost - nodeB.hCost;
      });

      const [curX, curY] = openSet.shift();
      const curNode = newGrid[curX][curY];

      if(curNode.isVisited) {
        continue;
      }

      curNode.isVisited = true;
      visitedOrder.push([curX, curY]);

      if(curX === hasEnd[0] && curY === hasEnd[1]) {
        newGrid[curX][curY].waveIndex = -1;
        return { frontierTimeline, visitedOrder };
      }

      for(let i = 0; i < 4; i++) {
        const x = curX + dir[i][0];
        const y = curY + dir[i][1];

        if(x < 0 || x >= GRID_ROWS || y < 0 || y >= GRID_COLS || newGrid[x][y].isVisited || newGrid[x][y].isWall) {
          continue;
        }
        newGrid[x][y].hCost = manhattanDist(x, y, hasEnd[0], hasEnd[1]);
        // newGrid marked for nodes since it does not need to be visualised first, grid marked for parents for reconstruction
        grid[x][y].parent = curNode;

        openSet.push([x, y]);
      }
    }

    return { frontierTimeline, visitedOrder };
  };

  const animateGreedyBFS = async () => {
    if(!isRunningRef.current) {
      console.log(`Greedy Best-First Search is paused.`);
      return;
    }
    const [endRow, endCol] = hasEnd;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    
    const CHUNK_SIZE = (frontierTimeline[animationIndexRef.current].length)*5;
    const delay = 5;
  
    let i = animationIndexRef.current;
    let revealed = revealedVisitedCountRef.current;
  
    while(i < frontierTimeline.length && isRunningRef.current) {
      const chunk = frontierTimeline.slice(i, i + CHUNK_SIZE);
      for(let j = 0; j < i; j++) {
        const arr = frontierTimeline[j];
        grid[arr[0][0]][arr[0][1]].waveIndex = -1;
      }
  
      for(const frontierSnap of chunk) {
        frontierSnap.forEach(([fx, fy]) => {
            grid[fx][fy].waveIndex = 1;
            grid[fx][fy].isVisited = true;
        });
      }
  
      setGrid([...grid]);
      for (let msGone = 0; msGone < delay && isRunningRef.current; msGone += 5) {
        await sleep(5); 
      }
  
      i += CHUNK_SIZE;
    }
  
    animationIndexRef.current = i;
    revealedVisitedCountRef.current = revealed;
  
    if(i >= frontierTimeline.length && isRunningRef.current) {
      visitedOrder.forEach(([vx, vy]) => {
        grid[vx][vy].isVisited = true;
      });
      setGrid([...grid]);
  
      if(grid[endRow][endCol].parent) {
        constructFinalPath(endRow, endCol);
        setGrid([...grid]);
      }
  
      animationIndexRef.current = 0;
      console.log("Greedy BFS animation complete");
      isRunningRef.current = false;
      isRunningAlgoRef.current = false;
      setIsRunningAlgo(false);
      setIsAlgoEnd(true);
    }
  };

  const handleGenerateWallButton = () => {
    switch(selectedWallPattern) {
      case `Random Maze Pattern`:
        generateRandomMaze();
        break;
      case `Box Pattern`:
        generateBoxPattern();
        break;
      case `Select A Wall Pattern`:
        console.log(`No Wall Patterns Selected Yet`);
        break;
      default:
        console.log(`Unexpected selectedWallPattern behaviour`);
        return;
    }
    setGrid([...grid]);
  };

  const checkStartOrEnd = (row, col) => {
    return grid[row][col].isStart || grid[row][col].isEnd;
  }
  
  function generateRandomMaze() {
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        grid[r][c].isWall = true;
      }
    }
  
    function inBounds(row, col) {
      return (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS
      );
    }
  
    // something called Fisher-Yates shuffle
    function shuffle(array) {
      for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]];

    function carvePassage(row, col) {
      grid[row][col].isWall = false;
      const dirs = shuffle([...directions]);
  
      for(const [dr, dc] of dirs) {
        const newRow = row + dr;
        const newCol = col + dc;
  
        if(inBounds(newRow, newCol) && grid[newRow][newCol].isWall) {
          const midRow = row + dr / 2;
          const midCol = col + dc / 2;
          grid[midRow][midCol].isWall = false;
          carvePassage(newRow, newCol);
        }
      }
    }
    let startRow = Math.floor(Math.random() * Math.floor(GRID_ROWS / 2)) * 2 + 1;
    let startCol = Math.floor(Math.random() * Math.floor(GRID_COLS / 2)) * 2 + 1;
  
    if(startRow >= GRID_ROWS) startRow = GRID_ROWS - 2; 
    if(startCol >= GRID_COLS) startCol = GRID_COLS - 2; 
  
    carvePassage(startRow, startCol);
    grid[hasStart[0]][hasStart[1]].isWall = false;
    grid[hasEnd[0]][hasEnd[1]].isWall = false;
  };

  const generateBoxPattern = () => {
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if(!checkStartOrEnd(r, c)) {
          grid[r][c].isWall = false;
        }
      }
    }
    
    const maxLayers = Math.min(Math.floor(GRID_ROWS / 2), Math.floor(GRID_COLS / 2));
    let flag = 0, counter = 0, rand = 0;

    for(let layer = 0; layer < maxLayers; layer += 2) {
      for(let col = layer; col < GRID_COLS - layer; col++) {
        counter++;
        if(!checkStartOrEnd(layer, col)) grid[layer][col].isWall = true;
        if(!checkStartOrEnd(GRID_ROWS - 1 - layer, col)) grid[GRID_ROWS - 1 - layer][col].isWall = true;
      }

      flag = Math.floor(Math.random() * counter); // randomly pick a wall in this box to be an empty node

      for(let col = layer; col < GRID_COLS - layer; col++) {
        if(flag === counter) {
          grid[layer][col].isWall = (Math.floor(Math.random() * 2) === 0)? false : true;
          grid[GRID_ROWS - 1 - layer][col].isWall = grid[layer][col].isWall? false : true;
          break;
        }
        else {
          counter--;
        }
      }

      counter = 0;

      for(let row = layer; row < GRID_ROWS - layer; row++) {
        counter++;
        if(!checkStartOrEnd(row, layer)) grid[row][layer].isWall = true;
        if(!checkStartOrEnd(row, GRID_COLS - 1 - layer)) grid[row][GRID_COLS - 1 - layer].isWall = true;
      }

      flag = Math.floor(Math.random() * counter); // randomly pick a wall in this box to be an empty node

      for(let row = layer; row < GRID_ROWS - layer; row++) {
        if(flag === counter) {
          grid[row][layer].isWall = (Math.floor(Math.random() * 2) === 0)? false : true;
          grid[row][GRID_COLS - 1 - layer].isWall = grid[row][layer].isWall? false : true;
          break;
        }
        else {
          counter--;
        }
      }
    }
  };
  
  return (
    <div className={styles.visualizerContainer}>  
      <h1 className={styles.h1}>
        Pathfinding Visualiser
      </h1>
      <ControlPanel handleSetStartButton={handleSetStartButton} handleSetEndButton={handleSetEndButton} setCurrentAction={setCurrentAction} selectedAlgorithm={selectedAlgorithm} setSelectedAlgorithm={setSelectedAlgorithm} selectedWallPattern={selectedWallPattern} setSelectedWallPattern={setSelectedWallPattern} hasStart={hasStart} hasEnd={hasEnd} handleRunButton={handleRunButton} handleGenerateWallButton={handleGenerateWallButton} handleClearPathButton={handleClearPathButton} handleClearWallsButton={handleClearWallsButton} handleClearGridButton={handleClearGridButton} isRunningAlgo={isRunningAlgo} isAlgoStart={isAlgoStart} isAlgoEnd={isAlgoEnd}>

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
