"use client"; // Mark as a client component for interactivity

import React from 'react';
import Grid from '../Grid/Grid'; // Import the Grid component
import './ControlPanel.module.css'; // Import styles specific to the GridPanel

const GridPanel = ({ grid, setGrid, resetGrid, runAlgorithm }) => {
  return (
    <div className="grid-panel">
      <div className="controls">
        <h2>Pathfinding Visualizer</h2>
        <div className="buttons">
          <button onClick={resetGrid} className="btn btn-reset">
            Reset Grid
          </button>
          <button onClick={() => runAlgorithm("Dijkstra")} className="btn btn-algo">
            Run Dijkstra
          </button>
          <button onClick={() => runAlgorithm("A*")} className="btn btn-algo">
            Run A*
          </button>
        </div>
      </div>
      <div className="grid-container">
        <Grid grid={grid} setGrid={setGrid} />
      </div>
    </div>
  );
};

export default GridPanel;
