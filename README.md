# Korf Rubik's Solver

A portfolio Rubik's Cube solver that combines a React frontend, a FastAPI backend, and native C++ solver adapters for BFS, DFS, IDDFS, and IDA*. It is a real working demo project with interactive cube input, validation, and solver integration, but it should be described as a portfolio/demo app rather than production software.

## What It Does

- Multiple solving algorithms: BFS, DFS, IDDFS, and IDA* with a corner pattern database
- Interactive cube input: visual 2D unfolded cube net for intuitive state entry
- Manual move controls: apply moves directly via buttons or text input
- Difficulty levels: easy and medium scrambles
- Validation before solving: the backend checks cube shape, color counts, centers, and solvability
- Step-by-step solutions: standard Rubik's Cube move notation
- Basic solve statistics: reported solve time and solver output from the native adapters

The backend validates cube state, spawns the requested C++ solver as a subprocess, and parses the solver output before returning it to the frontend. The frontend displays the result as step-by-step notation.

## Tech Stack

**Backend**

- FastAPI 0.115.0
- Python 3.8+ with Pydantic
- C++ solver adapters compiled from the repository sources
- Kociemba for solvability validation

**Frontend**

- React 19.0.0
- Vite 5.4.8
- Axios with custom retry/backoff logic
- CSS for responsive design

## Project Status

- The solver pipeline is implemented and runnable locally.
- The UI is interactive and supports scramble, validate, solve, and manual move flows.
- Testing is minimal, so avoid describing the project as production-ready or heavily tested.

## How To Run It

Requirements: Python 3.8+, Node.js 16+, and g++ or clang with C++17 support.

1. Clone the repository

```bash
git clone https://github.com/Divyang73/korf-Rubiks.git
cd korf-Rubiks
```

2. Build the C++ solvers

```bash
cd app/backend/solvers
bash build_cpp_solvers.sh
```

This compiles the four solver adapters and copies the pattern database file into `app/backend/solvers/cpp_executables/`.

3. Start the backend

```bash
cd app/backend
pip install -r requirements.txt
python server.py
```

Backend runs on `http://localhost:8001`. Swagger docs are at `http://localhost:8001/docs`.

4. Start the frontend

```bash
cd app/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Project Structure

```
korf-Rubiks/
  app/
    backend/
      routers/             API route handlers
      solvers/
        cpp_adapters/      C++ main files for each algorithm
        build_cpp_solvers.sh
      models/              Pydantic request/response schemas
      utils/               Cube state serialization and validation helpers
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
| `POST` | `/api/scramble/by-difficulty` | Generate scramble by difficulty |
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

**Response**

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

The UI defaults to IDA* because it is the most practical option for deeper scrambles in this project.

## Build and Test

### Frontend build

```bash
cd app/frontend
npm run build
```

### Backend tests

```bash
cd app/backend
python -m pytest tests/ -v
```

Test coverage is currently limited to a small backend validation suite.

## Troubleshooting

### Backend fails to start

```bash
pip install -r requirements.txt
```

### C++ solver build fails

```bash
sudo apt-get install build-essential
```

### Frontend shows connection refused

- Verify backend is running at `http://localhost:8001/docs`
- Check the frontend backend URL setting
- Ensure ports 3000 and 8001 are free

### Cube validation fails

- Ensure the cube is in a physically solvable configuration
- Use `/api/scramble` to generate valid states
- Confirm all 54 stickers are present

## Performance

- Solve time depends on scramble depth, algorithm choice, and local machine speed
- Memory usage varies by algorithm; BFS is much heavier than IDDFS and IDA*
- The pattern database is included as a prebuilt file for the IDA* adapter

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
