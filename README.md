# Korf Rubik's Solver

A web application that solves 3x3 Rubik's Cubes using four classic search algorithms implemented in C++ and exposed through a Python/FastAPI backend with a React frontend.

## What it does

You paint a 2D unfolded net of your scrambled cube in the browser. The frontend serializes the 54-sticker state into a string and sends it to the backend. The backend validates the state (checking color counts, center consistency, and solvability via the Kociemba library), then spawns the requested C++ solver as a subprocess. The solver reads the cube state from a temp file, runs the search algorithm, and prints the solution moves to stdout. The backend parses that output and returns the move sequence to the frontend, which displays it as step-by-step notation.

The four algorithms are:

- **BFS**: Breadth-first search. Guaranteed optimal. Practical only for shallow scrambles (up to about 7 moves) because memory grows exponentially with depth.
- **DFS**: Depth-limited depth-first search. Very fast, low memory, but not optimal. Useful for testing.
- **IDDFS**: Iterative-deepening DFS. Calls DFS with increasing depth limits. Finds optimal solutions with DFS-level memory.
- **IDA\***: True iterative-deepening A* (Korf 1985). DFS with a heuristic cost bound that increases each iteration. Uses a partial corner pattern database as the admissible heuristic. No visited map, no priority queue -- O(d) memory where d is the solution depth. The current PDB covers corner positions up to depth 5; a complete corner PDB would improve solution quality for deeper scrambles significantly.

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

## API

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/validate | Validate cube state |
| POST | /api/scramble | Generate random scramble |
| POST | /api/scramble/difficulty | Scramble by difficulty level |
| POST | /api/solve | Solve with selected algorithm |

## Troubleshooting

**Build fails: command not found: g++**
```bash
# Ubuntu/Debian
sudo apt-get install build-essential
# macOS
xcode-select --install
```

**Backend fails to start: ModuleNotFoundError**
```bash
pip install -r requirements.txt
```

**Frontend: connection refused**
Confirm backend is running on port 8001 and there are no port conflicts.

## References

- Korf, R. E. (1985). Depth-first iterative-deepening: An optimal admissible tree search. Artificial Intelligence, 27(1), 97-109.
- Upstream C++ solver library: https://github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo
- Pattern databases: https://en.wikipedia.org/wiki/Pattern_database