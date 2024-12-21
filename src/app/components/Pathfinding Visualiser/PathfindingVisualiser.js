"use client";

import React, { useState, useEffect } from "react";
import Grid from "../Grid/Grid";
import styles from "./PathfindingVisualiser.module.css";
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
      }))
    );
  });
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (row, col) => {
    setIsMouseDown(true);
    handleNodeState(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (isMouseDown) {
      handleNodeState(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleNodeState = (row, col) => {
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

  const findPath = () => {
    console.log("Pathfinding algorithm starts here");
  };

  return (
    <div className={styles.visualizerContainer}>
      <h1>Pathfinding Visualizer</h1>
      <button onClick={findPath} className={styles.findPathButton}>
        Find Path
      </button>
      <Grid grid={grid} setGrid={setGrid} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseEnter={handleMouseEnter} />
    </div>
  );
}
