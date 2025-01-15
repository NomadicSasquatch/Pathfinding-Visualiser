# Full-Stack Interactive Pathfinding Visualizer


An engaging, web-based visualizer for pathfinding algorithms, featuring user authentication, customizable wall patterns, and real-time maze generation. Users can register or log in to save up to three unique pattern “slots,” ensuring a personalized experience. Guest users can still explore the visualizer with temporary patterns, which remain until the application is refreshed or closed.

## Table of Contents
1. Key Features
2. Technology Used
## 
### 1. Key Features

#### Token-Based Authentication
-Users log in/register with secure JWT tokens.
-Each user maintains three persistent wall-pattern slots in MongoDB.
-Guest users can draw and run pathfinding but do not have persistent storage.


#### Manual Wall Drawing
-Grid cells toggle as walls or free space.
-Bresenham’s Line Algorithm refines the drawing process, making manual wall creation smoother.


#### Maze Generation
-Random Maze, Fractal Maze, and Box Patterns.
-Fisher-Yates Shuffle for uniform randomization.


#### Multiple Algorithms
-Depth-First Search, Breadth-First Search, Greedy Best-First Search, A Algorithm*.
-Animations highlight visited nodes, allowing users to observe search behavior in real time.


#### Asynchronous Visualization Control
-Pause, resume, or change animation speed mid-search.
-Ideal for in-depth analysis or quick overviews of each algorithm.

### 2. Technology Used

#### Frontend
-React (with Next.js scaffolding)
-CSS Modules for styling
-JavaScript (ES6+)
-Heap package for A* open set priority queue

#### Backend
-Node.js / Express.js
-MongoDB / Mongoose for data persistence
-JSON Web Tokens (JWT) for authentication

#### Other
Cors, dotenv, and other utility libraries
