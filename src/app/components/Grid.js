"use client"; // Required if React hooks are used here

import React from 'react';
import Node from './Node'; // Import the Node component
import './Grid.module.css'; // Import any styles for the grid

const Grid = ({ grid, setGrid }) => {
  // Event handler for clicking a node
  const handleNodeClick = (row, col) => {
    const newGrid = grid.map((currentRow, rowIndex) =>
      currentRow.map((node, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...node, isWall: !node.isWall }; // Toggle wall status
        }
        return node;
      })
    );
    setGrid(newGrid); // Update the grid state
  };

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((node, colIndex) => (
            <Node
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              isStart={node.isStart}
              isEnd={node.isEnd}
              isWall={node.isWall}
              onClick={() => handleNodeClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
