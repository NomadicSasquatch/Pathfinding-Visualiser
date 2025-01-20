# Full-Stack Interactive Pathfinding Visualiser


An engaging, web-based visualiser for pathfinding algorithms, featuring user authentication, customizable wall patterns, and real-time maze generation. Users can register or log in to save up to three unique pattern “slots,” ensuring a personalized experience. Guest users can still explore the visualiser with temporary patterns, which remain until the application is refreshed or closed.

## Table of Contents
1. Key Features
2. Technology Used
3. Prerequisites
4. Installation and Running
5. Usage Overview
## 
### 1. Key Features
#### Token-Based Authentication
- Users log in/register with secure JWT tokens.
- Each user maintains three persistent wall-pattern slots in MongoDB.
- Guest users can draw and run pathfinding but do not have persistent storage.

#### Manual Wall Drawing
- Grid cells toggle as walls or free space.
- Bresenham’s Line Algorithm refines the drawing process, making manual wall creation smoother.
![2025-01-1715-21-26-ezgif com-speed](https://github.com/user-attachments/assets/0b32d949-a9be-481e-b0bd-89fcaefced91)


#### Maze Generation
- Fractal Maze, derived from Box Patterns(which is a maze pattern on itself).
![2025-01-1715-19-12-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/93b87516-013a-4f0d-a6d3-c46b5715836c)
- Fisher-Yates Shuffle for uniform randomization of random maze pattern.
![2025-01-1715-14-19-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/6d265583-8a30-48b6-bab0-d5bf0453bc23)




#### Multiple Algorithms
- Depth-First Search, Breadth-First Search, Greedy Best-First Search, A Algorithm*.
- Animations highlight visited nodes, allowing users to observe search behavior in real time.

#### Asynchronous Visualization Control
- Pause, resume, or change animation speed mid-search.
- Ideal for in-depth analysis or quick overviews of each algorithm.

![2025-01-1715-27-12-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/8c88afa5-874f-4553-a436-ba54171e8dbe)

### 2. Technology Used
#### Frontend
- React (with Next.js scaffolding)
- CSS Modules for styling
- JavaScript (ES6+)
- Heap package for A* open set priority queue

#### Backend
- Node.js / Express.js
- MongoDB / Mongoose for data persistence
- JSON Web Tokens (JWT) for authentication

#### Other
- Cors, dotenv, and other utility libraries


### 3. Prerequisites
- Node.js (v14 or later) installed globally
- npm (comes with Node.js) or yarn package manager
- MongoDB:
Local installation, or
Access to a cloud-hosted MongoDB cluster (e.g., MongoDB Atlas)


### 4. Installation and Running
1. Clone the repository
```
git clone https://github.com/NomadicSasquatch/pathfinder.git
cd pathfinder
```
2. Install Dependencies
   - Frontend
     ```
     npm install
     ```
   - Backend
     ```
     cd backend
     npm install
     ```
3. Configure Environment
   - In /backend create an .env file that contains the MONGOURI, a key and a port number
4. Start the Backend
   ```
   cd backend
   npm run dev
   ```
5. Start the Frontend
   ```
   cd ../src
   npm run dev
   ```

### 5. Usage Overview
   1. Registration & Login
      - Click "Register"(top right) to create an account, then "Login" using those credentials
      - A JWT token is stored locally for subsequent requests
      - Even with no registration or log in, users will be considered as "guest users" where the loading and saving of patterns can be used until the page is refreshed or closed
   2. Setting Start and End Nodes
      - Click on "Set Start Node" and select a desired node to be the start node
      - Click on "Set End Node" and select a desired node to be the end node
   3. Drawing Walls
      - Click on "Toggle Wall" and click/drag in the grid to create walls
      - Click on "Toggle Node" and click/drag in the grid to create empty nodes
      - Click on the dropdown "Select A Wall Pattern" and select a desired wall pattern, and then "Generate Wall Pattern" to generate a random maze of walls in that style
   4. Saving/Loading Patterns
      - Click on the "Save/Load Pattern" dropdown and select a pattern slot to either save the current grid pattern into or load into the grid
      - Click on "Save Pattern" or "Load Pattern" to save and load patterns respectively
   5. Selecting an Algorithm
      - Click on the "Select an Algorithm" dropdown and select one of four algorithms to run
      - Click on "Run Algorithm" to start running the selected algorithm
      - "Run Algorithm" Toggles to "Pause Algorithm" when an algorithm is running, allowing you to pause the animation anytime
      - Drag the Slider at the top center of the screen labelled "Animation Speed" to control the animation speed, even as the animation executes
   
