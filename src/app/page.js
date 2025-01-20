import PathfindingVisualiser from './components/Pathfinding Visualiser/PathfindingVisualiser';
import { GlobalDelayProvider } from './components/GlobalDelayContext/GlobalDelayContext';
import styles from './page.module.css';

export default function Home() {
  return (
    <GlobalDelayProvider>
      <main className={styles.page}>
        <PathfindingVisualiser />
      </main>
    </GlobalDelayProvider>
  );
}