"use client";

import React, { useEffect } from "react";
import Node from "../Node/Node";
import styles from "./Grid.module.css";

const Grid = ({ grid, setGrid, onMouseDown, onMouseUp, onMouseEnter, actionState }) => {
  console.log("Grid received:", grid);

  if (!grid || grid.length === 0) {
    return <div>Loading grid...</div>;
  }

  return (
    <div className={styles.grid} onMouseLeave={() => onMouseUp()}>
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
              isVisited={node.isVisited}
              onMouseDown={() => onMouseDown(rowIndex, colIndex, actionState)}
              onMouseUp={() => onMouseUp()}
              onMouseEnter={() => onMouseEnter(rowIndex, colIndex, actionState)}
              actionState
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
