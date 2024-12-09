"use client"; // This makes the file a client component

import React, { useState } from 'react';
import Grid from './Grid';
import ControlPanel from './ControlPanel';
import './PathfindingVisualiser.module.css';

const PathfindingVisualiser = () => {
  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  // Function to initialize the grid
  const createGrid = () => {
    const newGrid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push({
          row,
          col,
          isStart: false,
          isEnd: false,
          isWall: false,
          isVisited: false,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  };

  // Initialize the grid when the component mounts
  React.useEffect(() => {
    setGrid(createGrid());
  }, []);

  return (
    <div className="pathfinding-visualiser">
      <h1>Pathfinding Visualiser</h1>
      <ControlPanel />
      <Grid grid={grid} setGrid={setGrid} />
    </div>
  );
};

export default PathfindingVisualiser;