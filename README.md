# Korf Rubik's Solver

<<<<<<< HEAD
A web application that solves 3x3 Rubik's Cubes using four classic search algorithms implemented in C++ and exposed through a Python/FastAPI backend with a React frontend.
=======
A portfolio Rubik's Cube solver that combines a React frontend, a FastAPI backend, and native C++ solver adapters (BFS, DFS, IDDFS, and IDA*). It is a real working demo project with interactive cube input, validation, and solver integration, but it is not presented here as production software.
>>>>>>> be3c2dd (solved some errors.)

## What it does

<<<<<<< HEAD
You paint a 2D unfolded net of your scrambled cube in the browser. The frontend serializes the 54-sticker state into a string and sends it to the backend. The backend validates the state (checking color counts, center consistency, and solvability via the Kociemba library), then spawns the requested C++ solver as a subprocess. The solver reads the cube state from a temp file, runs the search algorithm, and prints the solution moves to stdout. The backend parses that output and returns the move sequence to the frontend, which displays it as step-by-step notation.
=======
- **Multiple Solving Algorithms** — BFS, DFS, IDDFS, and IDA* with a corner pattern database
- **Interactive Cube Input** — Visual 2D unfolded cube net for intuitive state entry
- **Manual Move Controls** — Apply moves directly via buttons or text input
- **Difficulty Levels** — Easy (8-15 moves) and Medium (16-25 moves) scrambles
- **Validation Before Solving** — The backend checks cube shape, color counts, centers, and solvability before solving
- **Step-by-Step Solutions** — Clear move notation following standard Rubik's cube conventions
- **Basic Solve Statistics** — View the reported solve time and solver output from the native adapters
>>>>>>> be3c2dd (solved some errors.)

The four algorithms are:

<<<<<<< HEAD
- **BFS**: Breadth-first search. Guaranteed optimal. Practical only for shallow scrambles (up to about 7 moves) because memory grows exponentially with depth.
- **DFS**: Depth-limited depth-first search. Very fast, low memory, but not optimal. Useful for testing.
- **IDDFS**: Iterative-deepening DFS. Calls DFS with increasing depth limits. Finds optimal solutions with DFS-level memory.
- **IDA\***: True iterative-deepening A* (Korf 1985). DFS with a heuristic cost bound that increases each iteration. Uses a partial corner pattern database as the admissible heuristic. No visited map, no priority queue -- O(d) memory where d is the solution depth. The current PDB covers corner positions up to depth 5; a complete corner PDB would improve solution quality for deeper scrambles significantly.
=======
**Backend:**
- FastAPI 0.115.0
- Python 3.8+ with Pydantic
- C++ solver adapters compiled from the repository sources
- Kociemba for solvability validation
>>>>>>> be3c2dd (solved some errors.)

The C++ solver library (`app/cpp_solver/`) is adapted from [github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo](https://github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo). The backend adapter layer, API, and frontend are original work.

## How to run it

Requirements: Python 3.8+, Node.js 16+, g++ or clang with C++17 support.

**1. Clone**

```bash
git clone https://github.com/Divyang73/korf-Rubiks.git
cd korf-Rubiks
```

**2. Build the C++ solvers**

```bash
cd app/backend/solvers
bash build_cpp_solvers.sh
```

This compiles the four solver adapters and copies the pattern database file into `app/backend/solvers/cpp_executables/`. The compiled binaries are not committed to the repo; you must build them locally.

**3. Start the backend**

```bash
cd app/backend
pip install -r requirements.txt
python server.py
```

Backend runs on `http://localhost:8001`. Swagger docs at `http://localhost:8001/docs`.

**4. Start the frontend** (new terminal)

```bash
cd app/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Project structure

```
korf-Rubiks/
  app/
    backend/
      routers/             API route handlers
      solvers/
        cpp_adapters/      C++ main files (one per algorithm)
        build_cpp_solvers.sh
      models/              Pydantic request/response schemas
      utils/               Cube state serialization, validation helpers
      tests/
      requirements.txt
      server.py
    frontend/
      src/
        pages/             Home page (solver UI)
        components/        UI components
        api/               HTTP client with retry/backoff
        utils/             Cube state and move simulation
    cpp_solver/            Core algorithm library (BFS, DFS, IDDFS, IDA*)
  README.md
```

<<<<<<< HEAD
## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/validate | Validate cube state |
| POST | /api/scramble | Generate random scramble |
| POST | /api/scramble/difficulty | Scramble by difficulty level |
| POST | /api/solve | Solve with selected algorithm |
=======
## Project Status

- The solver pipeline is implemented and runnable locally.
- The UI is interactive and supports scramble, validate, solve, and manual move flows.
- Testing is minimal at the moment, so the project should be described as a portfolio/demo app rather than production-ready software.

## API Overview

### Main Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/validate` | Check if cube state is valid and solvable |
| `POST` | `/api/scramble` | Generate random scramble |
| `POST` | `/api/scramble/by-difficulty` | Generate scramble by difficulty (easy/medium) |
| `POST` | `/api/solve` | Solve cube with selected algorithm |

### Example: Solve a Cube

```bash
curl -X POST http://localhost:8001/api/solve \
  -H "Content-Type: application/json" \
  # Korf Rubik's Solver

  A portfolio Rubik's Cube solver that combines a React frontend, a FastAPI backend, and native C++ solver adapters (BFS, DFS, IDDFS, and IDA*). It is a real working demo project with interactive cube input, validation, and solver integration, but it is not presented here as production software.

  ## What it does

  - Multiple solving algorithms: BFS, DFS, IDDFS, and IDA* with a corner pattern database
  - Interactive cube input: visual 2D unfolded cube net for intuitive state entry
  - Manual move controls: apply moves directly via buttons or text input
  - Difficulty levels: easy and medium scrambles
  - Validation before solving: the backend checks cube shape, color counts, centers, and solvability before solving
  - Step-by-step solutions: clear move notation following standard Rubik's cube conventions
  - Basic solve statistics: reported solve time and solver output from the native adapters

  The backend validates the cube state, then spawns the requested C++ solver as a subprocess. The solver reads the cube state from a temp file, runs the search algorithm, and prints the solution moves to stdout. The backend parses that output and returns the move sequence to the frontend, which displays it as step-by-step notation.

  ## Project status

  - The solver pipeline is implemented and runnable locally.
  - The UI is interactive and supports scramble, validate, solve, and manual move flows.
  - Testing is minimal at the moment, so the project should be described as a portfolio/demo app rather than production-ready software.

  ## Tech Stack

  **Backend:**
  - FastAPI 0.115.0
  - Python 3.8+ with Pydantic
  - C++ solver adapters compiled from the repository sources
  - Kociemba for solvability validation

  **Frontend:**
  - React 19.0.0
  - Vite 5.4.8
  - Axios with custom retry/backoff logic
  - CSS for responsive design

  ## How to run it

  Requirements: Python 3.8+, Node.js 16+, g++ or clang with C++17 support.

  **1. Clone**

  ```bash
  git clone https://github.com/Divyang73/korf-Rubiks.git
  cd korf-Rubiks
  ```

  **2. Build the C++ solvers**

  ```bash
  cd app/backend/solvers
  bash build_cpp_solvers.sh
  ```

  This compiles the four solver adapters and copies the pattern database file into `app/backend/solvers/cpp_executables/`. The compiled binaries are not committed to the repo; you must build them locally.

  **3. Start the backend**

  ```bash
  cd app/backend
  pip install -r requirements.txt
  python server.py
  ```

  Backend runs on `http://localhost:8001`. Swagger docs are at `http://localhost:8001/docs`.

  **4. Start the frontend**

  ```bash
  cd app/frontend
  npm install
  npm run dev
  ```

  Frontend runs on `http://localhost:3000`.

  ## Project structure

  ```
  korf-Rubiks/
    app/
      backend/
        routers/             API route handlers
        solvers/
          cpp_adapters/      C++ main files (one per algorithm)
          build_cpp_solvers.sh
        models/              Pydantic request/response schemas
        utils/               Cube state serialization, validation helpers
        tests/
        requirements.txt
        server.py
      frontend/
        src/
          pages/             Home page (solver UI)
          components/        UI components
          api/               HTTP client with retry/backoff
          utils/             Cube state and move simulation
      cpp_solver/            Core algorithm library (BFS, DFS, IDDFS, IDA*)
    README.md
  ```

  ## API

  | Method | Path | Purpose |
  |--------|------|---------|
  | `POST` | `/api/validate` | Validate cube state |
  | `POST` | `/api/scramble` | Generate random scramble |
  | `POST` | `/api/scramble/by-difficulty` | Scramble by difficulty level |
  | `POST` | `/api/solve` | Solve with selected algorithm |

  ### Example: Solve a Cube

  ```bash
  curl -X POST http://localhost:8001/api/solve \
    -H "Content-Type: application/json" \
    -d '{
      "cube_state": "WWWWWWWWWRRRRRRRRRBBBBBBBBBYYYYYYYYYOOOOOOOOOGGGGGGGGG",
      "algorithm": "idastar"
    }'
  ```

  **Response:**
  ```json
  {
    "success": true,
    "solution": "R U' F2 D",
    "moves": 4,
    "time_ms": 45,
    "statistics": {
      "nodes_explored": 2150,
      "solver_backend": "cpp-korf-repo"
    }
  }
  ```

  ## Solving Algorithms

  | Algorithm | Type | Speed | Optimality | Memory |
  |-----------|------|-------|------------|--------|
  | **BFS** | Breadth-First Search | Slow | Optimal | High |
  | **DFS** | Depth-First Search | Fast | Non-optimal | Low |
  | **IDDFS** | Iterative Deepening DFS | Medium | Optimal | Low |
  | **IDA*** | Iterative Deepening A* + PDB | Fast | Optimal | Low |

  **Recommended:** The UI defaults to IDA* because it is the most practical option for deeper scrambles in this project.

  ## Screenshots

  ### Home Page - Cube Input & Controls
  ![Cube Solver Interface](docs/screenshots/home-cube-input.png)

  ### Manual Move Controls & Move History
  ![Move Controls](docs/screenshots/move-controls.png)

  ### Solution Results with Statistics
  ![Solution Display](docs/screenshots/solution-results.png)

  ### Algorithm & Difficulty Selection
  ![Algorithm and Difficulty Selection](docs/screenshots/algorithm-difficulty.png)

  *To add actual screenshots: Capture your app UI and place PNG files in `docs/screenshots/` directory with the names above.*

  ## Build and Deploy

  ### Production Frontend Build

  ```bash
  cd app/frontend
  npm run build
  # Output: dist/
  ```

  ### Run Tests

  ```bash
  cd app/backend
  python -m pytest tests/ -v
  ```

  At the moment, test coverage is limited to a small backend validation suite. If you want to use this README for resumes or interviews, avoid claiming strong automated test coverage until more solver and integration tests are added.

  ## Troubleshooting

  ### Backend fails to start: "ModuleNotFoundError"

  ```bash
  # Ensure dependencies are installed
  pip install -r requirements.txt --upgrade
  ```

  ### C++ solver build fails: "command not found: g++"

  ```bash
  # Install build tools (Ubuntu/Debian)
  sudo apt-get install build-essential

  # macOS
  brew install gcc
  ```

  ### Frontend shows "Connection refused"

  - Verify backend is running: `curl http://localhost:8001/docs`
  - Check that frontend env is set to correct backend URL
  - Ensure ports 3000 and 8001 are not in use

  ### Cube validation fails but state looks correct

  - Cube must be in a solvable configuration (achievable from solved state)
  - Use `/api/scramble` endpoint to generate valid states
  - Ensure all 54 stickers are present (9 per face, 6 faces)

  ## Performance

  - Solve time depends heavily on scramble depth, algorithm choice, and local machine speed
  - Memory usage varies by algorithm; BFS is much heavier than IDDFS/IDA*
  - Pattern database: included as a prebuilt file for the IDA* adapter

  ## Development

  ### Code Style

  - Python: Follow PEP 8
  - JavaScript: ESLint (Vite default)
  - C++: Uses `using namespace std;` for cleaner adapter code

  ## Resume-Safe Summary

  If you want to describe this project accurately on a resume, the safest wording is:

  - Built a full-stack Rubik's Cube solver using React, FastAPI, and native C++ solver adapters.
  - Implemented cube validation, scramble generation, manual move application, and solve flows.
  - Integrated BFS, DFS, IDDFS, and IDA* search strategies with a pattern-database heuristic.
  - Added frontend error handling and retry logic for solver requests.

  Avoid saying the project is production-ready, heavily tested, or benchmarked unless you add that evidence first.

  ## References

  - Korf, R. E. (1985). Depth-first iterative-deepening: An optimal admissible tree search. Artificial Intelligence, 27(1), 97-109.
  - Upstream C++ solver library: https://github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo
  - Pattern databases: https://en.wikipedia.org/wiki/Pattern_database