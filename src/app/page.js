import Image from "next/image";
import PathfindingVisualiser from './components/Pathfinding Visualiser/PathfindingVisualiser';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <PathfindingVisualiser/>
    </main>
  )
}