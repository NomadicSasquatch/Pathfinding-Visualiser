"use client";

import React, { useState } from "react";
import Grid from "../Grid/Grid";
import styles from "./PathfindingVisualiser.module.css";

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(() => {
    const rows = 20;
    const cols = 40;
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

  const findPath = () => {
    console.log("Pathfinding algorithm starts here");
  };

  return (
    <div className={styles.visualizerContainer}>
      <h1>Pathfinding Visualizer</h1>
      <button onClick={findPath} className={styles.findPathButton}>
        Find Path
      </button>
      <Grid grid={grid} setGrid={setGrid} />
    </div>
  );
}
