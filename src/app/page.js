import Image from "next/image";
import PathfindingVisualiser from './components/Pathfinding Visualiser/PathfindingVisualiser';
import styles from './components/Pathfinding Visualiser/PathfindingVisualiser.module.css';

export default function Home() {
  return (
    <main>
      <PathfindingVisualiser className={styles.visualizerContainer}/>
    </main>
  );
}
