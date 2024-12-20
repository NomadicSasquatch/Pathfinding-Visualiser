"use client";

import React from "react";
import Node from "../Node/Node";
import styles from "./Grid.module.css";

const Grid = ({ grid, setGrid }) => {
  console.log("Grid received:", grid);

  if (!grid || grid.length === 0) {
    return <div>Loading grid...</div>;
  }

  const handleNodeClick = (row, col) => {
    const newGrid = grid.map((currentRow, rowIndex) =>
      currentRow.map((node, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...node, isWall: !node.isWall }; // Toggle wall status
        }
        return node;
      })
    );
    setGrid(newGrid); // Update grid in the parent state
  };

  return (
    <div className={styles.grid}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((node, colIndex) => (
            <Node
              key={`${rowIndex}-${colIndex}`}
              row={node.row}
              col={node.col}
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
