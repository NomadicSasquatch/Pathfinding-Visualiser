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
import { useGlobalDelay } from '../GlobalDelayContext/GlobalDelayContext'; 
import ControlPanel from '../ControlPanel/ControlPanel';
import Heap from 'heap';
import styles from './PathfindingVisualiser.module.css';

import { GRID_ROWS, GRID_COLS, DEFAULT_ALGO_DROPDOWN_TEXT } from '../../config/config';

export default function PathfindingVisualizer() {
  const initialiseGrid = () => {
    return Array.from({ length: GRID_ROWS }, (_, rowIndex) =>
      Array.from({ length: GRID_COLS }, (_, colIndex) => ({
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
  }
  
  const [grid, setGrid] = useState(() => {
    return initialiseGrid();
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
  const [selectedUserPatternSlot, setSelectedUserPatternSlot] = useState(-1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestPatterns, setGuestPatterns] = useState([initialiseGrid(), initialiseGrid(), initialiseGrid()]);

  const isRunningRef = useRef(false);
  const isRunningAlgoRef = useRef(false);

  const { delayRef, chunkSizeRef } = useGlobalDelay();

  //testing mouse dragging queue:
  const mouseOpQueue = useRef([]);
  const animationIndexRef = useRef(0);

  // useEffect(() => {
  //   console.log(`isRunning changed to: ${isRunning}`);
  // }, [isRunning]);


  const dir = [[0, 1], [1, 0], [0, -1], [-1, 0]];

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
  // DATA STRUCTURES FOR GREEDY BEST-FIRST SEARCH //

  // general replay data struct
  const frontierTimeline = useRef([]);
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
        grid[row][col].isWall = false;
        handleNodeState(row, col, 'isStart');
        setHasStart([row, col]);
        setCurrentAction('idle');
        break;
  
      case 'setEnd':
        grid[row][col].isWall = false;
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

    frontierTimeline.current = [];
    visitedOrder = [];
    animationIndexRef.current = 0;

    isRunningRef.current = false;
  }

  const handleClearPathButton = () => {
    const newGrid = grid.map((row) =>
      row.map((node) => ({ ...node, isVisited: false, waveIndex: -1, isInFinalPath: false, gCost: Infinity, hCost: Infinity, fCost: Infinity, parent: null}))
    );
    setGrid(newGrid);
    resetDataStructs();
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
  };

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
          if(frontierTimeline.current.length === 0) runBFS();
          animatePath();
          break;
        case `Depth-First Search`:
          if(frontierTimeline.current.length === 0) runDFS();
          animatePath();
          break;
        case `Greedy Best-First Search`:
          if(frontierTimeline.current.length === 0) runGreedyBfs();
          animatePath();
          break;
        case `A* Algorithm`:
          if(frontierTimeline.current.length === 0) runAStar();
          animatePath();
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

  const animatePath = async () => {
    if(frontierTimeline.current.length === 0) {
      console.log(`${selectedAlgorithm} cannot run`);
      return;
    }
    if(!isRunningRef.current) { 
      console.log(`${selectedAlgorithm} is paused`);
      return;
    }
    const [endRow, endCol] = hasEnd;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    

    let i = animationIndexRef.current;
    while(i < frontierTimeline.current.length && isRunningRef.current) {
      const chunk = frontierTimeline.current.slice(i, i + chunkSizeRef.current);
      for(let j = 0; j < i; j++) {
        const arr = frontierTimeline.current[j];
        grid[arr[0][0]][arr[0][1]].waveIndex = -1;
      }
  
      for(const frontierSnap of chunk) {
        frontierSnap.forEach(([fx, fy]) => {
            grid[fx][fy].waveIndex = 1;
            grid[fx][fy].isVisited = true;
        });
      }
  
      setGrid([...grid]);
      for(let msGone = 0; msGone < delayRef.current && isRunningRef.current; msGone += 5) {
        await sleep(5);
      }
  
      i += chunkSizeRef.current;
    }
  
    animationIndexRef.current = i;
  
    if(i >= frontierTimeline.current.length && isRunningRef.current) {
      if(grid[endRow][endCol].parent) {
        constructFinalPath(endRow, endCol);
        setGrid([...grid]);
      }
  
      animationIndexRef.current = 0;
      console.log("${selectedAlgorithm} animation complete");
      isRunningRef.current = false;
      isRunningAlgoRef.current = false;
      setIsRunningAlgo(false);
      setIsAlgoEnd(true);
    }
  };

  const runBFS = () => {
    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    let front = 0;
    let rear = 0;
    let queue = [];
    queue[rear++] = [hasStart[0], hasStart[1]];

    while(front < rear) {
      let tmp = rear;
      frontierTimeline.current.push([...queue]);
      while(front  < tmp) {
        for(let i = 0; i < 4; i++) {
          let x = queue[front][0] + dir[i][0];
          let y = queue[front][1] + dir[i][1];
          if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !newGrid[x][y].isVisited && !newGrid[x][y].isWall) {
            queue[rear++] = [x, y];
            newGrid[x][y].isVisited = true;
            // parent marked in grid itself so the reconstruction can happen easily
            grid[x][y].parent = grid[queue[front][0]][queue[front][1]];
            if(x === hasEnd[0] && y === hasEnd[1]) {
              return;
            }
          }
        }
        front++;
      }
    }
  };

  const runDFS = () => {
    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    const stack = [[hasStart[0], hasStart[1]]];
  
    while(stack.length > 0) {
      frontierTimeline.current.push([...stack]);
      const [currentRow, currentCol] = stack.pop();

      newGrid[currentRow][currentCol].isVisited = true;
      if(currentRow == hasEnd[0] && currentCol == hasEnd[1]) {
        return;
      }
  
      for(let i = 0; i < 4; i++) {
        const x = currentRow + dir[i][0];
        const y = currentCol + dir[i][1];

        if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !newGrid[x][y].isWall && !newGrid[x][y].isVisited) {
          stack.push([x, y]);
          grid[x][y].parent = grid[currentRow][currentCol];
        }
      }
    }
  };
  
  const runAStar = () => {
    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    const openSet = new Heap((a, b) => a.fCost - b.fCost);

    openSet.push({
      row: hasStart[0],
      col: hasStart[1],
      gCost: 0,
      hCost: manhattanDist(hasStart[0], hasStart[1], hasEnd[0], hasEnd[1]),
      fCost: manhattanDist(hasStart[0], hasStart[1], hasEnd[0], hasEnd[1]),
    });

    newGrid[hasStart[0]][hasStart[1]].gCost = 0;
    newGrid[hasStart[0]][hasStart[1]].hCost = manhattanDist(hasStart[0], hasStart[1], hasEnd[0], hasEnd[1]);
    newGrid[hasStart[0]][hasStart[1]].fCost = newGrid[hasStart[0]][hasStart[1]].gCost + newGrid[hasStart[0]][hasStart[1]].hCost;

    while(!openSet.empty()) {
      frontierTimeline.current.push(openSet.toArray().map((node) => [node.row, node.col]));
      const { row: currentRow, col: currentCol } = openSet.pop();

      newGrid[currentRow][currentCol].isVisited = true;
  
      if(currentRow === hasEnd[0] && currentCol === hasEnd[1]) {
        console.log("Path found!");
        return;
      }

      for(let i = 0; i < 4; i++) {
        const newRow = currentRow + dir[i][0];
        const newCol = currentCol + dir[i][1];

        if(newRow >= 0 && newRow < GRID_ROWS && newCol >= 0 && newCol < GRID_COLS &&
            !newGrid[newRow][newCol].isWall && !newGrid[newRow][newCol].isVisited) {
          const tentativeG = newGrid[currentRow][currentCol].gCost + 1;

          if(tentativeG < newGrid[newRow][newCol].gCost) {
            newGrid[newRow][newCol].gCost = tentativeG;
            newGrid[newRow][newCol].fCost = tentativeG + manhattanDist(newRow, newCol, hasEnd[0], hasEnd[1]);
            grid[newRow][newCol].parent = grid[currentRow][currentCol];

            openSet.push({
              row: newRow,
              col: newCol,
              fCost: newGrid[newRow][newCol].fCost,
              gCost: tentativeG,
            });
          }
        }
      }
    }
  };

  const manhattanDist = (r1, c1, r2, c2) => {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
  };

  const runGreedyBfs = () => {
    const newGrid =  grid.map((row) => row.map((node) => ({ ...node })));
    let openSet = [];
    openSet.push([hasStart[0], hasStart[1]]);

    newGrid[hasStart[0]][hasStart[1]].hCost = manhattanDist(hasStart[0], hasStart[1], hasEnd[0], hasEnd[1]);

    while(openSet.length > 0) {
      frontierTimeline.current.push([...openSet]);

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
        if(x === hasEnd[0] && y === hasEnd[1]) {
          return;
        }
      }
    }
  };

  const handleGenerateWallButton = () => {
    switch(selectedWallPattern) {
      case `Random Maze Pattern`:
        generateRandomMaze();
        break;
      case `Box Pattern`:
        generateBoxPattern(0, 0, GRID_COLS, GRID_ROWS);
        break;
      case `Rectangle Fractal Pattern`:
        generateRectFract(0, 0, GRID_COLS, GRID_ROWS, 3);
        connectFractals();
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
    for(let r = 0; r < GRID_ROWS; r++) {
      for(let c = 0; c < GRID_COLS; c++) {
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
    if(hasStart) grid[hasStart[0]][hasStart[1]].isWall = false;
    if(hasEnd) grid[hasEnd[0]][hasEnd[1]].isWall = false;
  };

  const clearAWall = (row, col, tar) => {
    let idx = 0, x = row, y = col;
    while(tar > 0) {
      x += dir[idx][0];
      y += dir[idx][1];
      while(x < 0 || x >= GRID_ROWS || y < 0 || y >= GRID_COLS || !grid[x][y].isWall) {
        x -= dir[idx][0];
        y -= dir[idx][1];
        idx = (idx + 1) % 4;
        x += dir[idx][0];
        y += dir[idx][1];
      }
      tar--;
    }
    for(let i = 0; i < 4; i++) {
      if(grid[x+dir[i][0]][y+dir[i][1]].isWall) {
        grid[x+dir[i][0]][y+dir[i][1]].isWall = false;
        break;
      }
    }

    grid[x][y].isWall = false;
    return;
  };

  const generateBoxPattern = (srow, scol, width, height) => {
    const rlim = Math.min(GRID_ROWS, srow + height);
    const clim = Math.min(GRID_COLS, scol + width);
  
    const maxLayers = Math.min(Math.floor(width / 2), Math.floor(height / 2));
  
    for(let layer = 0; layer <= maxLayers; layer++) {
      const top = srow + layer;
      const bottom = rlim - 1 - layer;
      const left = scol + layer;
      const right = clim - 1 - layer;
      let counter = 0;
  
      if(top >= bottom || left >= right) break;
  
      const isWallLayer = layer % 2 === 0;
  
      for(let col = left; col <= right; col++) {
        counter++;
        if(!checkStartOrEnd(top, col)) grid[top][col].isWall = isWallLayer;
        if(!checkStartOrEnd(bottom, col)) grid[bottom][col].isWall = isWallLayer;
      }
  
      for(let row = top + 1; row <= bottom - 1; row++) {
        counter++;
        if(!checkStartOrEnd(row, left)) grid[row][left].isWall = isWallLayer;
        if(!checkStartOrEnd(row, right)) grid[row][right].isWall = isWallLayer;
      }
      // last two conditions to ensure that the thick rings (rings with no empty nodes in them) do not have empty walls
      if(grid[top][left].isWall && layer && top + 1 != bottom && left + 1 != right) {
        let tar = Math.floor(Math.random() * counter * 2);
        clearAWall(top, left, tar);
      }
    }
  };

  const generateRectFract = (srow, scol, width, height, depth) => {
    if(depth <= 0 || width < 2 || height < 2) return;
  
    generateBoxPattern(srow, scol, width, height);
  
    const splitRatioW = 0.3 + Math.random() * 0.4;
    const splitRatioH = 0.3 + Math.random() * 0.4;
  
    const splitW = Math.floor(width * splitRatioW);
    const splitH = Math.floor(height * splitRatioH);
  
    if(splitW < 1 || splitW >= width) return;
    if(splitH < 1 || splitH >= height) return;
  
    generateRectFract(srow, scol, splitW, splitH, depth - 1);
    generateRectFract(srow, scol + splitW, width - splitW, splitH, depth - 1);
    generateRectFract(srow + splitH, scol, splitW, height - splitH, depth - 1);
    generateRectFract(srow + splitH, scol + splitW, width - splitW, height - splitH, depth - 1
    );
  };

  // check for vertical beams(double layer wall) partitioning fractals
  const isVerticalBeam = (row, col) => {
    return (!grid[row][col].isWall && grid[row][col+1].isWall && grid[row][col+2].isWall && !grid[row][col+3].isWall);
  }

  const isHorizontalBeam = (row, col) => {
    return (!grid[row][col].isWall && grid[row+1][col].isWall && grid[row+2][col].isWall && !grid[row+3][col].isWall);
  }

  const connectFractals = () => {
    for(let i = 0; i < GRID_ROWS; i++) {
      for(let j = 0; j < GRID_COLS - 3; j++) {
        // last two conditionals to omit the thick inner rings, only accept beams
        if(isVerticalBeam(i, j)) {
          // check if vertical beam has been visited before
          if(isVerticalBeam(i - 1, j) || (!grid[i-1][j+1].isWall && !grid[i-1][j+2].isWall)) continue;
          let start = i;
          let end = i;
          // impossible to exceed GRID_ROWS, no need to check
          while(isVerticalBeam(end + 1, j)) {
            end++;
          }
          // to omit the thick inner rings, only accept beams
          if(!grid[end+1][j+1].isWall && !grid[end+1][j+2].isWall) continue;
          let randRow = Math.floor(Math.random() * (end - start));
          grid[randRow + start][j+1].isWall = grid[randRow + start][j+2].isWall = false;
        }
      }
    }
    // random side to choose from, only affects beams that stretch throughout the entire col space. Without random the hole will
    // always be placed in the first partition
    let randFlag = Math.floor(Math.random() * 2);
    let randStart = 0, randDir = 1;
    if(randFlag === 1) {
      randStart = GRID_COLS - 1;
      randDir = -1;
    }
    // if every horizontal beam has a gap, search becomes too easy/fast, for every column, there can only be one beam with a gap
    for(let i = 0; i < GRID_ROWS - 3; i++) {
      for(let j = randStart; j < GRID_COLS && j >= 0; j += randDir) {
        if(isHorizontalBeam(i, j)) {
          let start = j;
          let end = j;
          while(isHorizontalBeam(i, end + randDir)) {
            end += randDir;
          }
          // to omit the thick inner rings, only accept beams
          if(!grid[i+1][end+randDir].isWall && !grid[i+2][end+randDir].isWall) continue;
          let randCol = Math.floor(Math.random() * (end - start));
          grid[i+1][randCol + start].isWall = grid[i+2][randCol + start].isWall = false;
          break;
        }
      }
    }
  }

  const handleLoadButton = async () => {
    if(isLoggedIn) {
      try {
        const response = await fetch(`http://localhost:4000/api/user/patterns/${selectedUserPatternSlot}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if(!response.ok) {
          const err = await response.json();
          console.error('Load pattern error:', err);
          return;
        }
        const data = await response.json(); 
    
        if(data.pattern && Array.isArray(data.pattern.patternData)) {
          setGrid(data.pattern.patternData);
          console.log(`Loaded pattern slot ${selectedUserPatternSlot}`);
        } else {
          console.error('Invalid pattern data from server');
        }
      } catch (error) {
        console.error('Network error while loading pattern:', error);
      }
    }
    else {
      setGrid(guestPatterns[selectedUserPatternSlot]);
    }
  };

  const handleSaveButton = async () => {
    if(isLoggedIn) {
      try {
        const body = {
          name: `Pattern ${selectedUserPatternSlot}`,
          patternData: grid
        };
        const response = await fetch(`http://localhost:4000/api/user/patterns/${selectedUserPatternSlot}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(body)
        });
        if(!response.ok) {
          const err = await response.json();
          console.error('Save pattern error:', err);
          return;
        }
        const data = await response.json();
        console.log(`Saved pattern slot ${selectedUserPatternSlot}`, data);
      } catch (error) {
        console.error('Network error while saving pattern:', error);
      }
    }
    else {
      const updatedPatterns = [...guestPatterns];
      updatedPatterns[selectedUserPatternSlot] = grid.map(row => row.map(node => ({ ...node })));
      setGuestPatterns(updatedPatterns);
    }
  };

  return (
    <div className={styles.visualizerContainer}>  
      <h1 className={styles.h1}>
        Pathfinding Visualiser
      </h1>
      <ControlPanel handleSetStartButton={handleSetStartButton} handleSetEndButton={handleSetEndButton} setCurrentAction={setCurrentAction} selectedAlgorithm={selectedAlgorithm} setSelectedAlgorithm={setSelectedAlgorithm} selectedWallPattern={selectedWallPattern} setSelectedWallPattern={setSelectedWallPattern} hasStart={hasStart} hasEnd={hasEnd} handleRunButton={handleRunButton} handleGenerateWallButton={handleGenerateWallButton} handleClearPathButton={handleClearPathButton} handleClearWallsButton={handleClearWallsButton} handleClearGridButton={handleClearGridButton} isRunningAlgo={isRunningAlgo} isAlgoStart={isAlgoStart} isAlgoEnd={isAlgoEnd} handleLoadButton={handleLoadButton} handleSaveButton={handleSaveButton} selectedUserPatternSlot={selectedUserPatternSlot} setSelectedUserPatternSlot={setSelectedUserPatternSlot}>

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
