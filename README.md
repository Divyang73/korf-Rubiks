# Rubik's Cube Solver

A high-performance web application for solving Rubik's Cubes using multiple algorithms. Integrates optimized C++ solvers (BFS, DFS, IDDFS, IDA*) with a modern React frontend for an interactive solving experience.

## Features

- **Multiple Solving Algorithms** — BFS, DFS, IDDFS, and IDA* (with pattern database)
- **Interactive Cube Input** — Visual 2D unfolded cube net for intuitive state entry
- **Manual Move Controls** — Apply moves directly via buttons or text input
- **Difficulty Levels** — Easy (8-15 moves) and Medium (16-25 moves) scrambles
- **Real-time Validation** — Verify cube solvability before solving
- **Step-by-Step Solutions** — Clear move notation following standard Rubik's cube conventions
- **Performance Metrics** — View solve time and algorithm efficiency

## Tech Stack

**Backend:**
- FastAPI 0.115.0
- Python 3.8+ with Pydantic
- C++ solvers (compiled adapters)
- Kociemba for solvability validation

**Frontend:**
- React 19.0.0
- Vite 5.4.8
- Axios with custom retry/backoff logic
- CSS for responsive design

## Requirements

- **Python** 3.8 or higher
- **Node.js** 16+ with npm
- **C++ Compiler** (g++ or clang) for building solver adapters

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Divyang73/korf-Rubiks.git
cd korf-Rubiks
```

### 2. Set Up and Run Backend

```bash
cd app/backend

# Install Python dependencies
python -m pip install -r requirements.txt

# Build C++ solver executables
./solvers/build_cpp_solvers.sh

# Start FastAPI server
python server.py
```

Backend runs on `http://localhost:8001`  
Swagger API docs available at `http://localhost:8001/docs`

### 3. Set Up and Run Frontend (New Terminal)

```bash
cd app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
korf-Rubiks/
├── app/
│   ├── backend/
│   │   ├── routers/             # API endpoints
│   │   ├── solvers/
│   │   │   ├── cpp_adapters/    # C++ solver wrappers
│   │   │   ├── cpp_executables/ # Compiled binaries
│   │   │   └── build_cpp_solvers.sh
│   │   ├── models/              # Pydantic schemas
│   │   ├── utils/               # Cube state, validation, utils
│   │   ├── tests/               # Unit tests
│   │   ├── requirements.txt
│   │   └── server.py            # FastAPI app entry
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── pages/           # Home (solver)
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── api/             # HTTP client
│   │   │   └── utils/           # Cube state & move simulation
│   │   ├── package.json
│   │   └── vite.config.js
│   └── cpp_solver/              # Core algorithms (BFS/DFS/IDDFS/IDA*)
└── README.md
```

## API Overview

### Main Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/validate` | Check if cube state is valid and solvable |
| `POST` | `/api/scramble` | Generate random scramble |
| `POST` | `/api/scramble/difficulty` | Generate scramble by difficulty (easy/medium) |
| `POST` | `/api/solve` | Solve cube with selected algorithm |

### Example: Solve a Cube

```bash
curl -X POST http://localhost:8001/api/solve \
  -H "Content-Type: application/json" \
  -d '{
    "cube_state": "WWWWWWWWWRRRRRRRRRBBBBBBBBLLLLLLLLLYYYYYYYYYGGGGGGGGG",
    "algorithm": "idastar"
  }'
```

**Response:**
```json
{
  "success": true,
  "moves": ["R", "U'", "F2", "D"],
  "time_ms": 45.2,
  "statistics": {
    "nodes_expanded": 2150,
    "max_depth": 4
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

**Recommended:** IDA* provides optimal solutions with practical performance for most cube configurations.

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

- **Average solve time (IDA*)**: 10-100ms for typical scrambles
- **Memory usage**: <50MB per solve operation
- **Pattern database**: 12MB (pre-built, included)

## Development

### Code Style

- **Python**: Follow PEP 8
- **JavaScript**: ESLint (Vite default)
- **C++**: Uses `using namespace std;` for cleaner adapter code

### Run Tests

```bash
cd app/backend
python -m pytest tests/ -q
```

## Future Enhancements

- [ ] 3D cube visualization with threejs
- [ ] Solution animation playback
- [ ] Cube size variants (2x2, 4x4, 5x5)
- [ ] Performance profiling dashboard
- [ ] Mobile app (React Native)

## References

- **Korf's IDA* Algorithm**: https://github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo
- **Rubik's Cube Notation**: https://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
- **Pattern Databases**: https://en.wikipedia.org/wiki/Pattern_database

## License

MIT License — See LICENSE file for details

## Author

**Divyang73** — Full-stack portfolio project integrating C++ algorithms with modern web technologies.

---

**Have questions?** Open an issue or explore the Swagger API docs at `http://localhost:8001/docs`



End of Document.