# Software Requirements Specification (SRS)
## Rubik's Cube Solver Web Application

---

Document Version: 1.0  
Date: April 9, 2025  
Project Name: Interactive Rubik's Cube Solver  
Author: Development Team

Reference Algorithm Repository (for study/integration):
- https://github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo

---

## Implementation Status (This Repository)

Implemented in this repo:
- FastAPI backend with `/api/`, `/api/validate`, `/api/scramble`, `/api/solve`, and `/api/algorithms/{name}`
- Cube validation (length, color count, center invariance, solvability via kociemba)
- Scramble generation with legal turns and state serialization
- Solver wrapper mapped to native C++ BFS/DFS/IDDFS/IDA* executables from the referenced Korf-style repository
- C++ adapter build pipeline: `app/backend/solvers/build_cpp_solvers.sh` (builds `bfs_solver`, `dfs_solver`, `iddfs_solver`, `idastar_solver`)
- React frontend with Home solver workflow and Learn page
- Unit test baseline for validation

Run locally:

```bash
# Backend
cd app/backend
python -m pip install -r requirements.txt
./solvers/build_cpp_solvers.sh
python server.py

# Frontend (new terminal)
cd app/frontend
npm install
npm run dev
```

Frontend: http://localhost:3000  
Backend docs: http://localhost:8001/docs

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Project Overview](#2-project-overview)
3. [System Architecture](#3-system-architecture)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Technical Specifications](#6-technical-specifications)
7. [User Interface Requirements](#7-user-interface-requirements)
8. [API Specifications](#8-api-specifications)
9. [Database Schema](#9-database-schema)
10. [Algorithm Integration Details](#10-algorithm-integration-details)
11. [Educational Content](#11-educational-content)
12. [Future Enhancements](#12-future-enhancements)
13. [Testing Requirements](#13-testing-requirements)
14. [Deployment and Performance](#14-deployment-and-performance)
15. [Success Metrics](#15-success-metrics)
16. [Appendices](#16-appendices)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the complete requirements for a web-based Rubik's Cube solver application that integrates high-performance C++ solving algorithms (BFS, DFS, IDDFS, IDA*) with a modern, user-friendly web interface. The application is designed as a professional portfolio project demonstrating full-stack development, algorithm integration, and clean software architecture.

### 1.2 Scope
The application enables users to:
- Input scrambled Rubik's Cube configurations via an interactive 2D interface
- Select from multiple solving algorithms with varying performance characteristics
- Receive step-by-step solutions with detailed move notation
- Learn about different solving algorithms through an educational portal
- Visualize solutions on a 3D cube (Phase 2 - Future Enhancement)

### 1.3 Target Audience
- Primary: Technical recruiters and hiring managers evaluating portfolio projects
- Secondary: Cubing enthusiasts, students learning algorithms, educators

### 1.4 Definitions and Acronyms
- BFS: Breadth-First Search
- DFS: Depth-First Search
- IDDFS: Iterative Deepening Depth-First Search
- IDA*: Iterative Deepening A* (with pattern database heuristics)
- Move Notation: Standard Rubik's Cube notation (R, L, U, D, F, B with modifiers ', 2)
- Pattern Database: Precomputed heuristic database for optimal solving
- Solvability: A cube configuration that can be legally achieved from a solved state

---

## 2. Project Overview

### 2.1 Project Goals
1. Technical Excellence: Demonstrate integration of compiled C++ algorithms with modern web stack
2. User Experience: Provide intuitive, responsive interface for cube solving
3. Educational Value: Explain algorithm differences and computational complexity
4. Performance: Deliver solutions within reasonable time constraints (<= 1 minute)
5. Portfolio Quality: Clean, maintainable code suitable for professional review

### 2.2 Key Features
#### Phase 1 (Current Implementation)
- 2D unfolded cube input interface with color palette
- Multiple algorithm selection (BFS, DFS, IDDFS, IDA*)
- Step-by-step solution display
- Algorithm comparison and educational content
- Random scramble generator
- Cube configuration validation

#### Phase 2 (Future Enhancement)
- 3D cube visualization using Three.js
- Animated solution playback
- Multiple camera angles and viewing modes

### 2.3 Success Criteria
- All algorithms produce correct solutions for valid cube configurations
- IDA* solver completes within 60 seconds for typical scrambles
- Clean, professional UI suitable for portfolio presentation
- Comprehensive algorithm explanations for educational purposes
- 100% uptime during demonstrations
- Mobile-responsive design (optional but recommended)

---

## 3. System Architecture

### 3.1 High-Level Architecture

```text
Client Layer (React, Port 3000)
	-> HTTP/REST
Backend Layer (FastAPI, Port 8001)
	-> Python subprocess.run()
C++ Solver Executables (BFS, DFS, IDDFS, IDA*)
	-> MongoDB Driver
Database Layer (MongoDB, optional analytics/history)
```

### 3.2 Technology Stack

#### Frontend
- Framework: React 19.0.0
- UI Library: Radix UI components
- Styling: Tailwind CSS 3.4+
- HTTP Client: Axios
- Routing: React Router DOM 7.5+
- State Management: React Hooks
- 3D Visualization (Phase 2): Three.js

#### Backend
- Framework: FastAPI 0.110+
- Language: Python 3.10+
- C++ Integration: subprocess
- Validation: Pydantic 2.6+
- CORS: Starlette CORSMiddleware
- Async Support: asyncio

#### Database
- Database: MongoDB 4.5+
- Driver: Motor (AsyncIOMotorClient)
- Use Cases: Optional solve history, metrics, logs

#### C++ Solver
- Language: C++17
- Build System: CMake 3.10+, Ninja
- Algorithms: BFS, DFS, IDDFS, IDA* with corner pattern database
- Compilation: Pre-compiled binaries included in backend deployment

### 3.3 Component Interaction Flow
User Input (2D Cube) -> React validates colors -> API Request to FastAPI -> Pydantic validation -> Python wrapper invokes C++ executable -> C++ solver returns solution -> FastAPI formats response -> React displays solution step-by-step.

### 3.4 Directory Structure

```text
/app
|- backend/
|  |- server.py
|  |- requirements.txt
|  |- .env
|  |- solvers/
|  |  |- cpp_executables/
|  |  |  |- bfs_solver
|  |  |  |- dfs_solver
|  |  |  |- iddfs_solver
|  |  |  `- idastar_solver
|  |  |- wrapper.py
|  |  `- validator.py
|  |- models/
|  |  |- cube_state.py
|  |  |- solve_request.py
|  |  `- solve_response.py
|  |- routers/
|  |  |- solver_routes.py
|  |  `- education_routes.py
|  `- utils/
|     |- cube_validator.py
|     `- move_parser.py
|
|- frontend/
|  |- public/
|  |- src/
|  |  |- components/
|  |  |  |- CubeInput/
|  |  |  |  |- UnfoldedCube.js
|  |  |  |  |- ColorPalette.js
|  |  |  |  `- CubeInput.css
|  |  |  |- AlgorithmSelector/
|  |  |  |  |- AlgorithmDropdown.js
|  |  |  |  `- AlgorithmCard.js
|  |  |  |- SolutionDisplay/
|  |  |  |  |- MoveList.js
|  |  |  |  |- Statistics.js
|  |  |  |  `- SolutionDisplay.css
|  |  |  |- Common/
|  |  |  |  |- LoadingSpinner.js
|  |  |  |  |- ErrorMessage.js
|  |  |  |  `- Button.js
|  |  |  `- ThreeDCube/
|  |  |     `- CubeVisualization.js
|  |  |- pages/
|  |  |  |- Home.js
|  |  |  |- Learn.js
|  |  |  `- NotFound.js
|  |  |- utils/
|  |  |  |- cubeStateManager.js
|  |  |  |- moveNotation.js
|  |  |  `- scrambleGenerator.js
|  |  |- App.js
|  |  |- App.css
|  |  `- index.js
|  |- package.json
|  `- tailwind.config.js
|
|- cpp_solver/
|  |- Model/
|  |- Solver/
|  |- PatternDatabases/
|  |- cmake-build-debug/
|  `- CMakeLists.txt
|
`- README.md
```

---

## 4. Functional Requirements

### 4.1 Cube Input Interface (FR-01)

#### FR-01.1 2D Unfolded Cube Display
Priority: High

Description: Display a 2D unfolded representation of a Rubik's Cube showing all 6 faces.

Layout: Cross/T-shape

```text
				[  U  ]
		[L] [F] [R] [B]
				[  D  ]
```

Acceptance Criteria:
- All 54 stickers are clearly visible
- Each face is labeled (U, D, L, R, F, B)
- Default state shows a solved cube
- Clear visual separation between faces
- Center stickers are visually distinct

#### FR-01.2 Color Selection
Priority: High

Description: Users can assign colors to stickers via click interaction.

Color Palette:
- White (U)
- Yellow (D)
- Red (R)
- Orange (L)
- Blue (F)
- Green (B)

Acceptance Criteria:
- Color palette displays all 6 colors with labels
- Active color is visually highlighted
- Click on sticker immediately updates its color
- No drag-and-drop required
- Visual feedback on hover

#### FR-01.3 Control Buttons
Priority: High

Buttons:
1. Clear
2. Reset
3. Random Scramble
4. Validate

Acceptance Criteria:
- Clear resets stickers to blank/neutral
- Reset restores solved state
- Random Scramble applies random valid moves
- Scramble depth configurable (default 7-12)
- Validate checks solvability before solve
- Buttons are disabled during solve

#### FR-01.4 Cube State Validation
Priority: High

Validation Checks:
1. Color Count (each color appears 9 times)
2. Center Invariance
3. Edge/Corner Parity
4. Edge/Corner Orientation

Acceptance Criteria:
- Validation runs before solve attempt
- Clear error messages for invalid states
- Solve button disabled until validation passes
- Validation completes in <500ms

### 4.2 Algorithm Selection (FR-02)

#### FR-02.1 Algorithm Dropdown Menu
Priority: High

Algorithms Available:
1. BFS
2. DFS
3. IDDFS
4. IDA* (recommended, default)

Acceptance Criteria:
- Dropdown shows all 4 algorithms
- Each has brief description
- Best-for usage shown
- IDA* marked as recommended
- Keyboard accessible

#### FR-02.2 Algorithm Characteristics Display
Priority: Medium

Display:
- Time and space complexity
- Optimality
- Typical move count
- Expected solve time
- Memory usage

Acceptance Criteria:
- Updates with selected algorithm
- Accurate and educational
- Uses icons/tooltips where useful

### 4.3 Solution Generation (FR-03)

#### FR-03.1 Solve Request Processing
Priority: High

Timeouts:
- BFS/DFS: 10s
- IDDFS: 30s
- IDA*: 60s

Acceptance Criteria:
- Solve button triggers API request
- Loading indicator displayed
- Timeout handled gracefully
- Solution returned in standard notation
- Invalid states rejected before solve

#### FR-03.2 Solution Display (Step-by-Step)
Priority: High

Acceptance Criteria:
- Moves displayed in standard notation
- Move count displayed
- Copy-to-clipboard available
- Expandable step-by-step breakdown
- Per-move descriptions on hover

#### FR-03.3 Solution Statistics (Optional)
Priority: Low

Display (optional):
- Move count
- Computation time
- Nodes explored
- Memory used
- Algorithm used

### 4.4 Educational Content (FR-04)

#### FR-04.1 Learning Page
Priority: Medium

Requirements:
- Separate route: /learn
- Explain BFS, DFS, IDDFS, IDA*
- Include complexity and comparison table
- Add beginner-friendly visuals and explanations
- Responsive layout

### 4.5 Random Scramble Generator (FR-05)

#### FR-05.1 Scramble Generation
Priority: Medium

Requirements:
- Generate 7-12 move valid scramble
- Avoid redundant consecutive face turns
- Return scramble sequence + resulting cube state
- Allow regeneration

### 4.6 Error Handling (FR-06)

#### FR-06.1 User-Friendly Error Messages
Priority: High

Required Scenarios:
- Invalid cube configuration
- Solver timeout
- Server connectivity/internal errors
- Unsolvable cube

Acceptance Criteria:
- Actionable error messages
- Technical details logged (not user-facing)
- UI remains recoverable without refresh

---

## 5. Non-Functional Requirements

### 5.1 Performance (NFR-01)
- BFS: < 5s for <= 7 moves
- DFS: < 2s
- IDDFS: < 15s for <= 10 moves
- IDA*: < 60s
- Validation: < 500ms
- Page load: < 2s

### 5.2 Usability (NFR-02)
- Modern, professional UI
- WCAG 2.1 AA accessibility
- Learnability for first-time users in <= 2 minutes
- Mobile responsiveness optional but recommended

### 5.3 Reliability (NFR-03)
- 99%+ uptime during demos
- No unhandled exceptions
- Correctness for valid cube states

### 5.4 Maintainability (NFR-04)
- Clean modular architecture
- Consistent style and linting
- Documentation and tests for critical paths

### 5.5 Security (NFR-05)
- Strict backend input validation
- Prevent injection vectors
- Rate limiting on API endpoints
- No personal data required for MVP

---

## 6. Technical Specifications

### 6.1 C++ Solver Integration

Build steps:

```bash
cd /app/backend
./solvers/build_cpp_solvers.sh
```

Pattern database source:

```bash
cp /app/cpp_solver/Database/cornerDepth5V1.txt /app/backend/solvers/cpp_executables/Database/cornerDepth5V1.txt
```

Expected solver I/O:
- Input: 54-character cube string (URFDLB face order)
- Output: solution sequence, moves, time, nodes

### 6.2 Cube State Representation

- Internal format: 54-character string in U R F D L B order
- Solved state:

```text
WWWWWWWWWRRRRRRRRRBBBBBBBBBYYYYYYYYYOOOOOOOOOGGGGGGGGG
```

### 6.3 Cube Validation Logic

Required checks:
1. String length = 54
2. Allowed symbols only: W, Y, R, O, B, G
3. Each color appears exactly 9 times
4. Fixed centers
5. Edge parity/orientation constraints
6. Corner parity/orientation constraints

---

## 7. User Interface Requirements

### 7.1 Design System
- Visual style: modern minimalist, portfolio-grade
- Consistent color and spacing tokens
- Clear typography and hierarchy
- Accessible interactions and keyboard support

### 7.2 Page Layouts
- Home: cube input + controls + algorithm selection + solution panel
- Learn: educational sections, comparison table, diagrams
- Responsive: desktop side-by-side, mobile stacked

### 7.3 Component Specifications
- UnfoldedCube
- ColorPalette
- AlgorithmDropdown
- SolutionDisplay
- LoadingSpinner

### 7.4 Interaction Flows
- Standard solving flow: input -> validate -> solve -> display
- Learning flow: home -> learn -> return to solver

---

## 8. API Specifications

### 8.1 Endpoints
- GET /api/ (health)
- POST /api/solve
- POST /api/validate
- POST /api/scramble
- GET /api/algorithms/{algorithm_name}

### 8.2 Standard Error Format

```json
{
	"error": {
		"code": "INVALID_CUBE_STATE",
		"message": "User-friendly error message",
		"details": "Technical details for debugging",
		"timestamp": "2025-04-09T12:34:56Z"
	}
}
```

### 8.3 FastAPI Docs
- Swagger: /docs
- ReDoc: /redoc
- OpenAPI JSON: /openapi.json

---

## 9. Database Schema

Optional MongoDB collections:
- solve_history
- algorithm_stats

Use for analytics, reliability tracking, and algorithm comparisons. MVP can skip DB persistence if needed.

---

## 10. Algorithm Integration Details

### 10.1 Algorithm Characteristics

- BFS: optimal, high memory, good for shallow depth
- DFS: low memory, non-optimal, educational/quick path finder
- IDDFS: optimal + low memory, moderate depth
- IDA*: optimal + heuristic pruning + low memory, recommended for production

### 10.2 Comparison

| Feature | BFS | DFS | IDDFS | IDA* |
|---|---|---|---|---|
| Optimal | Yes | No | Yes | Yes |
| Time Complexity | O(b^d) | O(b^d) | O(b^d) | O(b^d)* |
| Space Complexity | O(b^d) | O(d) | O(d) | O(d) |
| Practical Depth | ~7 | Any (non-optimal) | ~12 | ~20 |
| Recommended | Demo | No | Demo | Yes |

*Practical speed improved heavily by heuristic pruning.

### 10.3 C++ Notes
- Multiple cube representations (3D array, 1D array, bitboard)
- Pattern database support via corner heuristics
- Standardized solver I/O required for clean backend integration

---

## 11. Educational Content

Learning page should include:
- Rubik's Cube basics and notation
- Detailed algorithm sections (BFS/DFS/IDDFS/IDA*)
- Complexity and tradeoff explanations
- Comparison table and practical guidance
- Deep dive on pattern databases and admissible heuristics

Optional:
- Diagrams/SVGs/flowcharts
- Interactive quiz/visualization

---

## 12. Future Enhancements

### 12.1 3D Visualization
- Three.js-based cube
- Step controls (prev/next/play/pause)
- Animated move playback

### 12.2 Additional Features
- More cube sizes (2x2, 4x4, 5x5)
- Timer/challenge modes
- Side-by-side solver comparisons
- WASM/parallel performance improvements

---

## 13. Testing Requirements

### 13.1 Unit Tests
- Backend validator tests
- Solver wrapper tests
- Optional frontend component tests

### 13.2 Integration Tests
- API endpoint success/error paths
- Solve flow with known states

### 13.3 E2E Tests (Optional)
- Full user flow with Playwright/Selenium

### 13.4 Performance Tests
- Batch scramble test suite per algorithm
- Enforce per-algorithm timeout and average performance budgets

---

## 14. Deployment and Performance

### 14.1 Deployment Targets
- Development: localhost frontend/backend
- Production: containerized deployment (single instance acceptable for portfolio)

### 14.2 Targets
- Solver times by algorithm per NFR section
- UI response under 200ms for interactions
- Lighthouse > 90 (if frontend shipped)

### 14.3 Scalability (Future)
- Horizontal backend scale
- Job queue for long solves
- Caching repeated cube states
- IP-level rate limiting

### 14.4 Monitoring
- Structured backend logs
- Track success/fail rate and solve timings by algorithm

---

## 15. Success Metrics

### 15.1 Technical
- Correct solutions for valid cubes
- Reliable validation and error handling
- IDA* within 60s target

### 15.2 UX
- Clear first-use flow
- Professional interface quality
- Educational content clarity

### 15.3 Portfolio
- Demonstrates full-stack integration and algorithmic depth
- Clean repository and documentation
- Stable demo readiness

---

## 16. Appendices

### Appendix A: Move Notation
- Faces: R, L, U, D, F, B
- Modifiers: ' for counter-clockwise, 2 for 180-degree turns

### Appendix B: Development Checklist

Phase 1: Backend
- Compile and integrate C++ solvers
- Implement wrapper and validation
- Build solve/validate/scramble APIs

Phase 2: Frontend
- Build cube input and algorithm UI
- Integrate API and solution display
- Add error/loading states

Phase 3: Education
- Add /learn page and algorithm explanations
- Add comparison and visual aids

Phase 4: Testing and Polish
- Unit/integration/performance tests
- UX polish and reliability checks

Phase 5: Documentation and Deployment
- Final README/docs/screenshots
- Deploy and verify demo flow

### Appendix C: Glossary
- Admissible heuristic
- Branching factor
- God's Number
- Pattern database
- Permutation parity
- Pruning

---

## Document Sign-off

This SRS is a complete blueprint for building a portfolio-grade Rubik's Cube Solver web application with React, FastAPI, and C++ algorithms (including IDA* with pattern database heuristics).

Estimated MVP timeline: 12-18 days.

End of Document.