# Full-Stack Interactive Pathfinding Visualiser


An engaging, web-based visualiser for pathfinding algorithms, featuring user authentication, customizable wall patterns, and real-time maze generation. Users can register or log in to save up to three unique pattern “slots,” ensuring a personalized experience. Guest users can still explore the visualiser with temporary patterns, which remain until the application is refreshed or closed.

## Table of Contents
1. Key Features
2. Technology Used
3. Prerequisites
4. Installation and Running
## 
### 1. Key Features
#### Token-Based Authentication
- Users log in/register with secure JWT tokens.
- Each user maintains three persistent wall-pattern slots in MongoDB.
- Guest users can draw and run pathfinding but do not have persistent storage.

#### Manual Wall Drawing
- Grid cells toggle as walls or free space.
- Bresenham’s Line Algorithm refines the drawing process, making manual wall creation smoother.

#### Maze Generation
- Fractal Maze, derived from Box Patterns(which is a maze pattern on itself).
![image](https://github.com/user-attachments/assets/553b7f6f-4d4a-4421-b996-85b27a5b6674)
- Fisher-Yates Shuffle for uniform randomization of random maze pattern.
![image](https://github.com/user-attachments/assets/28b2cd80-74f9-45fb-9a45-0d1b2f5b4128)



#### Multiple Algorithms
- Depth-First Search, Breadth-First Search, Greedy Best-First Search, A Algorithm*.
- Animations highlight visited nodes, allowing users to observe search behavior in real time.
![image](https://github.com/user-attachments/assets/2f9ce7cf-91e1-4316-97ff-77dcfecb9365)


#### Asynchronous Visualization Control
- Pause, resume, or change animation speed mid-search.
- Ideal for in-depth analysis or quick overviews of each algorithm.


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
   
