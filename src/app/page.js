import Image from "next/image";
import styles from "./page.module.css";
import PathfindingVisualiser from './components/Pathfinding Visualiser/PathfindingVisualiser';

export default function Home() {
  return (
    <main>
      <PathfindingVisualiser />
    </main>
  );
}
