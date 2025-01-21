  /* Step-wise BFS, animate while executing --> too slow */
  // const initBFS = () => {
  //   if(hasStart && hasEnd) {
  //     const updatedGrid = [...grid];
  //     updatedGrid[hasStart[0]][hasStart[1]].isVisited = true;
  //     setGrid(updatedGrid);

  //     bfsVisitedRef.current = updatedGrid; 
  //     bfsQueueRef.current = [[hasStart[0], hasStart[1]]];
  //   }
  // };

  // const runBFS = async () => {
  //   if(!bfsVisitedRef.current || bfsQueueRef.current.length === 0) {
  //     console.log("BFS cannot run; either paused or completed.");
  //     return;
  //   }
  
  //   const delay = 0;
  //   const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  //   const BreadthFirstSearchStep = async () => {
  //     if(!isRunningRef.current) {
  //       console.log("BFS paused.");
  //       return;
  //     }
  
  //     if(bfsQueueRef.current.length > 0) {
  //       const [curX, curY] = bfsQueueRef.current.shift();
  //       bfsVisitedRef.current[curX][curY].waveIndex = -1;
  
  //       for(let i = 0; i < 4; i++) {
  //         const x = curX + dir[i][0];
  //         const y = curY + dir[i][1];
  //         if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !bfsVisitedRef.current[x][y].isWall && !bfsVisitedRef.current[x][y].isVisited) {
  //           bfsVisitedRef.current[x][y].parent = bfsVisitedRef.current[curX][curY];
  //           bfsVisitedRef.current[x][y].waveIndex = 1;
  //           if(x === hasEnd[0] && y === hasEnd[1]) {
  //             bfsVisitedRef.current[x][y].isVisited = true;
  //             setGrid([...bfsVisitedRef.current]);
  //             console.log("Path found!");
  //             isRunningRef.current = false;
  //             isRunningAlgoRef.current = false;
  //             setIsRunningAlgo(false);
  //             constructFinalPath(x, y);
  //             setIsAlgoEnd(true);
  //             return;
  //           }
  
  //           bfsVisitedRef.current[x][y].isVisited = true;
  //           bfsQueueRef.current.push([x, y]);
  //         }
  //         chunkSize++;
  //       }
  
  //       if(chunkSize >= 10) {
  //         setGrid([...bfsVisitedRef.current]);
  //         chunkSize = 0;
  //       }
  //     } 
  //     else {
  //       isRunningRef.current = false;
  //       return;
  //     }
  
  //     await animate(delay);
  //     setTimeout(BreadthFirstSearchStep, 0);
  //   };

  //   BreadthFirstSearchStep();
  // };

/* Step-wise DFS, animate while executing, using stacks --> too slow */
// const initDFS = () => {
//   if(hasStart && hasEnd) {
//     const updatedGrid = [...grid];
//     setGrid(updatedGrid);

//     dfsVisitedRef.current = updatedGrid;
//     dfsStackRef.current = [[hasStart[0], hasStart[1]]];
//   }
// };

// const runDFS = () => {
//   if(!dfsVisitedRef.current || dfsStackRef.current.length === 0) {
//     console.log(`DFS has not been initialised\n`);
//     return;
//   }
//   const delay = 0.05;
//   const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//   const depthFirstSearch = async () => {
//     if(!isRunningRef.current) {
//       console.log(`DFS is paused`);
//       return;
//     }
//     if(dfsStackRef.current.length === 0) {
//       console.log(`DFS complete (no path or stack exhausted).`, dfsStackRef.current);
//       isRunningRef.current = false;
//       return;
//     }

//     const [row, col] = dfsStackRef.current.pop();
    
//     if(row === hasEnd[0] && col === hasEnd[1]) {
//       isRunningRef.current = false;
//       isRunningAlgoRef.current = false;
//       setIsRunningAlgo(false);
//       constructFinalPath(row, col);
//       setIsAlgoEnd(true);
//       return;
//     }
//     dfsVisitedRef.current[row][col].isVisited = true;
//     dfsVisitedRef.current[row][col].waveIndex = -1;
//     setGrid([...dfsVisitedRef.current]);

//     for(let i = 0; i < 4; i++) {
//       const x = row + dir[i][0];
//       const y = col + dir[i][1];
//       if(x >= 0 && x < GRID_ROWS && y >= 0 && y < GRID_COLS && !dfsVisitedRef.current[x][y].isWall && !dfsVisitedRef.current[x][y].isVisited) {
//         dfsStackRef.current.push([x,y]);
//         dfsVisitedRef.current[x][y].waveIndex = 1;
//         dfsVisitedRef.current[x][y].parent = dfsVisitedRef.current[row][col];
//       }
//     }
//     await animate(delay);
//     depthFirstSearch();
//   }
//   depthFirstSearch();
// };


/* Step-wise AStar, animate while executing, using stacks --> too slow */
// const initAStar = () => {
//   if(hasStart && hasEnd) {
//     const newGrid = grid.map((row) => row.map((node) => ({ ...node })));

//     const [sr, sc] = hasStart;
//     const [er, ec] = hasEnd;

//     newGrid[sr][sc].gCost = 0;
//     newGrid[sr][sc].hCost = manhattanDist(sr, sc, er, ec);
//     newGrid[sr][sc].fCost = newGrid[sr][sc].gCost + newGrid[sr][sc].hCost;

//     setGrid(newGrid);

//     aStarVisitedRef.current = newGrid;
//     aStarOpenSetRef.current = [[sr, sc]];
//   }
// };

// const runAStar = () => {
//   if(!aStarVisitedRef.current || aStarOpenSetRef.current.length === 0) {
//     console.log('A* cannot run; not initialized or openSet empty.');
//     return;
//   }

//   const delay = 0;
//   const animate = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   const AStarStep = async () => {
//     if(!isRunningRef.current) {
//       console.log('A* paused.');
//       return;
//     }

//     if(aStarOpenSetRef.current.length === 0) {
//       console.log('A* complete: no path found.');
//       isRunningRef.current = false;
//       return;
//     }

//     aStarOpenSetRef.current.sort((a, b) => {
//       const nodeA = aStarVisitedRef.current[a[0]][a[1]];
//       const nodeB = aStarVisitedRef.current[b[0]][b[1]];
//       return nodeA.fCost - nodeB.fCost;
//     });

//     const [row, col] = aStarOpenSetRef.current.shift();
//     const currentNode = aStarVisitedRef.current[row][col];
//     currentNode.isVisited = true;
//     currentNode.waveIndex = -1;

//     if(row === hasEnd[0] && col === hasEnd[1]) {
//       isRunningRef.current = false;
//       setGrid([...aStarVisitedRef.current]);
//       isRunningAlgoRef.current = false;
//       setIsRunningAlgo(false);
//       constructFinalPathAStar(row, col);
//       setGrid([...aStarVisitedRef.current]);
//       setIsAlgoEnd(true);
//       return;
//     }

//     for(let i = 0; i < 4; i++) {
//       const x = row + dir[i][0];
//       const y = col + dir[i][1];
//       if(x < 0 || x >= GRID_ROWS || y < 0 || y >= GRID_COLS || aStarVisitedRef.current[x][y].isWall || aStarVisitedRef.current[x][y].isVisited) {
//         continue;
//       }

//       const tentativeG = currentNode.gCost + 1;
//       const neighborNode = aStarVisitedRef.current[x][y];
//       if(tentativeG < neighborNode.gCost) {
//         neighborNode.gCost = tentativeG;
//         neighborNode.hCost = manhattanDist(x, y, hasEnd[0], hasEnd[1]);
//         neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
//         neighborNode.parent = currentNode;
//         aStarVisitedRef.current[x][y].waveIndex = 1
//         aStarOpenSetRef.current.push([x, y]);
//       }
//     }

//     setGrid([...aStarVisitedRef.current]);
//     //console.log(aStarVisitedRef.current[row][col].waveIndex);

//     await animate(delay);
//     AStarStep();
//   };

//   AStarStep();
// };

  
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