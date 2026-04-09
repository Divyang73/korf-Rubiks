# Rubik's Cube Solver

A high-performance Rubik's Cube solver written in C++ using multiple cube representations and advanced search algorithms.  
Supports 3D, 1D, and bitboard cube models, and implements BFS, DFS, IDDFS, and IDA* solvers, including pattern database heuristics.

---

## Features

- **Multiple Cube Models:** 3D array, 1D array, and bitboard representations.
- **Solvers:** 
  - Depth-First Search (DFS)
  - Breadth-First Search (BFS)
  - Iterative Deepening DFS (IDDFS)
  - Iterative Deepening A* (IDA*) with pattern database heuristic
- **Pattern Database:** Fast heuristic lookup for IDA* using precomputed corner pattern database.
- **Random Scrambling:** Shuffle the cube with random moves.
- **Easy to Extend:** Modular code structure for adding new algorithms or representations.

---

## 🚀 Getting Started

Follow the steps below to set up, build, and run the Rubik’s Cube Solver from scratch.

---

### ✅ 1. Prerequisites

Ensure the following tools are installed on your system:

- [Git](https://git-scm.com/)
- C++17-compatible compiler (e.g., GCC, Clang, MSVC)
- [CMake](https://cmake.org/) (version **3.10** or higher)
- [Ninja](https://ninja-build.org/) build system

---

### 📦 2. Clone the Repository

Open your terminal or command prompt and run:

```bash
git clone https://github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo.git
cd RubiksCubeSolver
mkdir build
cd build
cmake -G "Ninja" ..
cmake --build .
./RubiksCubeSolver
```

## Project Structure

| Directory/File                          | Purpose                                      |
|------------------------------------------|----------------------------------------------|
| `main.cpp`                              | Entry point and test harness                 |
| `Model/`                                | Cube representations (3D, 1D, Bitboard)      |
| `Solver/`                               | Solver algorithms (DFS, BFS, IDDFS, IDA*)    |
| `PatternDatabases/`                     | Pattern DB, math helpers, and utilities      |
| `CMakeLists.txt`                        | Build configuration                          |

## Acknowledgments

- Inspired by Korf's optimal cube solving algorithms.
- Uses C++ STL and modern C++ features.


