# Brutal Honest Review — korf-Rubiks for Internship Resume

> Written after reading every file in the repo, not just the README.  
> Sections: Claims vs Reality → Fake/Broken Features → Dead Code → Algorithm Issues → Code Quality Issues → Security/Practices → What to Fix (priority order).

---

## 1. Claims vs Reality — The Big Lies a CS Recruiter Will Catch

### ❌ "Performance Metrics — View solve time and algorithm efficiency"
**What the README says:** You display solve time and algorithm efficiency (nodes expanded, etc.).  
**What the code does:** Every single C++ solver adapter (bfs, dfs, iddfs, idastar) has this hardcoded:
```cpp
cout << "Nodes: 0\n";
```
All four files. `nodes_explored` is always 0 in every solve response. The "statistics" feature is a fake display of zeros. A recruiter running the app for 2 minutes will notice this immediately.

---

### ❌ "IDA* with pattern database" claims "Memory: Low" and "Space: O(d)"
**What the README/README table says:** IDA* has low memory and O(d) space complexity.  
**What `IDAstarSolver.h` actually implements:** It is NOT IDA*. It uses a **priority queue** inside each bound iteration and maintains an `unordered_map<T, bool> visited` that grows without bound. This is closer to **bounded A*** than IDA*. True IDA* is a simple DFS with a cost threshold — O(d) stack space. This implementation stores every visited state in a hash map, making it O(b^d) in memory — the same as BFS. The memory advantage of IDA* is completely lost.

If a recruiter or interviewer asks you to explain IDA* and your implementation, you won't be able to reconcile the two. This is the most dangerous technical lie in the project.

---

### ❌ "Pattern Database: 12MB (pre-built, included)"
**What the README says:** "Pattern database: 12MB."  
**What exists:** `cornerDepth5V1.txt` — 50MB on disk, depth-5 only. A proper Korf corner PDB encodes all 8 corners up to depth ~11 and is around 88MB. Depth-5 only means the heuristic is very weak — it will return 0 for almost any cube position more than 5 moves from solved, forcing the solver to explore millions of useless states. This directly contradicts the claim of "10–100ms for typical scrambles."

---

### ❌ "Easy (8–15 moves) and Medium (16–25 moves) scrambles"
**What the README says:** Easy = 8–15 moves, Medium = 16–25 moves.  
**What `solver_routes.py` actually does:**
```python
DIFFICULTY_RANGES = {
    "easy": (4, 6),
    "medium": (10, 12),
}
```
Easy is 4–6 moves. Medium is 10–12 moves. The README is completely wrong. These numbers are meaningfully different — a recruiter who verifies a "medium" scramble will find it's only 10–12 moves, not 16–25.

---

### ❌ "POST /api/scramble/difficulty" endpoint
**What the README API table shows:** `POST /api/scramble/difficulty`  
**What the actual route is:** `POST /api/scramble/by-difficulty`  
The README curl example would return a 404. This means the README was never tested end-to-end.

---

### ❌ Screenshots
**What the README says:** References 4 screenshots in `docs/screenshots/`.  
**What exists:** The `docs/` directory does not exist at all in the repo. The README literally says at the bottom: *"To add actual screenshots: Capture your app UI and place PNG files in docs/screenshots/ directory with the names above."* That instruction was never followed. The README has broken image links.

---

### ❌ "Average solve time (IDA*): 10–100ms for typical scrambles"
With a depth-5 PDB as heuristic, typical scrambles of 15+ moves will take many seconds or minutes, not milliseconds. This claim is not backed by any benchmark and contradicts the technical reality of the depth-5 PDB.

---

## 2. Dead Code and Unnecessary Dependencies

### ❌ `motor==3.6.0` in requirements.txt
`motor` is an async MongoDB driver. There is **zero MongoDB code anywhere in the project** — no models, no connection string, no database queries, no `.env` with a `MONGO_URI`. This dependency is completely dead. It adds ~10MB to the install and is a red flag: a recruiter reading `requirements.txt` will assume database features were planned and abandoned, or that you copy-pasted someone else's requirements file.

### ❌ `python-dotenv==1.0.1` in requirements.txt
`python-dotenv` is installed but `load_dotenv()` is never called anywhere in the Python code. No `.env` file exists, no `os.getenv()` calls for config. Completely unused.

### ❌ `moveNotation.js` in `app/frontend/src/utils/`
The file exists in the utils directory but is never imported anywhere in the frontend. Dead file.

### ❌ `state_to_pycuber_cube()` in `cube_utils.py`
This function raises a `ValueError` for any state that isn't the solved state:
```python
def state_to_pycuber_cube(cube_state: str) -> pc.Cube:
    if cube_state == SOLVED_CUBE_STATE:
        return pc.Cube()
    raise ValueError("Direct arbitrary state-to-pycuber conversion is not supported")
```
It is never called anywhere in the backend. It's a stub that adds confusion and does nothing.

---

## 3. The C++ Code Is Not Yours

`app/cpp_solver/README.md` contains:
```
git clone https://github.com/piyush932/Rubiks-Cube-Solver-Using-Korfs-IDA-Algo.git
```
The main `README.md` also lists this repo under References. The entire `cpp_solver/` folder — `RubiksCube.h`, `RubiksCube3dArray.cpp`, `BFSSolver.h`, `DFSSolver.h`, `IDDFSSolver.h`, `IDAstarSolver.h`, `CornerPatternDatabase`, `NibbleArray`, `PatternDatabase`, `PermutationIndexer` — is from an external GitHub repository.

**What you actually built:** The C++ adapter layer (`cpp_adapters/`, `wrapper.py`) and the full Python/React web application. That is the original work.

**The problem:** The README presents the project as if the C++ solver logic is also original work. The sentence *"integrating C++ algorithms"* implies you wrote those algorithms. If an interviewer asks you to walk through the IDA* implementation or explain the CornerPatternDatabase indexing, and you haven't deeply internalized that borrowed code, it will be obvious. You should explicitly credit the upstream C++ library in the README and describe your contribution as "built a web application on top of the korf IDA* C++ library."

---

## 4. IDDFS Implementation Problem

`IDDFSSolver.h` implements IDDFS by repeatedly instantiating a `DFSSolver` with increasing depth limits:
```cpp
for (int i = 1; i <= max_search_depth; i++) {
    DFSSolver<T, H> dfsSolver(rubiksCube, i);
    ...
}
```
But `max_search_depth` defaults to **7** in the IDDFS constructor. The adapter passes **20** from the CLI. So IDDFS with depth 20 means iterating DFS at depth 1, 2, 3... up to 20, and at depth 20 DFS explores 18^20 ≈ 10^25 nodes in the worst case. This will hang forever on any scramble deeper than ~7 moves. The 120-second timeout will always trigger for any real scramble if you're honest.

---

## 5. BFS Will Crash or Timeout on Medium Scrambles

BFS is only practical up to ~7 moves before memory exhaustion. The UI happily lets you pick BFS and then select "Medium Difficulty" (which generates 10–12 move scrambles). The result is a 2-minute wait and a timeout error. There's no UI warning or guard preventing this combination, which means a live demo can easily embarrass you.

---

## 6. Scramble Generator Quality

```python
while len(moves) < depth:
    face = rng.choice(base_faces)
    if face == last_face:
        continue
    ...
```
This prevents same-face repeats but not opposite-face redundancy. For example, `R L R'` is a valid sequence here — `L` and `R` are opposite faces, and `R` followed by `R'` via an intervening `L` is effectively a no-op on R. Proper scramble generators use WCA-style move generation that prevents opposite-face follow-ups as well. Not a critical bug but a detail that signals inexperience with the domain.

---

## 7. Compiled Binaries Committed to Git

```
app/backend/solvers/cpp_executables/bfs_solver    (53 KB)
app/backend/solvers/cpp_executables/dfs_solver    (51 KB)
app/backend/solvers/cpp_executables/idastar_solver (78 KB)
app/backend/solvers/cpp_executables/iddfs_solver  (51 KB)
```
Committing compiled platform-specific binaries to a Git repository is a red flag. They're Linux-only, bloat the repo, and anyone cloning on macOS/Windows won't get a working binary. The `build_cpp_solvers.sh` script already handles building them — there's no reason to commit the outputs. These should be in `.gitignore`.

Also, `cornerDepth5V1.txt` is a 50MB binary data file committed to git. Git is not the right place for large binary assets. This makes `git clone` slow and bloats the repo history forever.

---

## 8. Security Issues (Minor but Notable)

- **CORS is fully open:** `allow_origins=["*"]` — fine for a local demo but bad practice for something you're deploying or presenting as production-ready.
- **Subprocess with user-controlled input:** `wrapper.py` writes user-provided cube state to a temp file and passes it to a subprocess. The input is validated before this point, but if validation is ever bypassed the path injection surface is real.
- **`host="0.0.0.0"`** in `server.py` — the dev server binds to all interfaces, exposing the API on a network.

---

## 9. Test Coverage Is Almost Nonexistent

`tests/test_validator.py` has exactly **2 tests**:
1. Validate a solved cube — passes.
2. Validate 54 white stickers — fails correctly.

That's it. No tests for:
- The scramble generator
- The solve endpoint
- Algorithm routing
- Edge cases in validation (wrong center, solvability check)
- The C++ wrapper (timeout, bad output parsing)

The README says "Run Tests" prominently as if test coverage is a feature. Two tests is not a feature.

---

## 10. Minor Code Issues

| Location | Issue |
|---|---|
| `solver_routes.py` line 160 | Line is 107 characters — exceeds PEP 8's 79/99 limit |
| `IDAstarSolver.h` | `using namespace std` pulled in from header — pollutes every TU that includes it |
| `RubiksCube.h` | Same `using namespace std` in a header file — textbook bad practice in C++ |
| `Home.jsx` | `console.debug('validate response', response)` left in production code |
| All 4 C++ adapters | `cout << "Nodes: 0\n"` — the whole statistics feature is a hardcoded lie |
| `SolutionDisplay.jsx` | Receives `error` as a prop but `Home.jsx` passes `error?.message \|\| ''` — passing empty string instead of null means the error component renders with an empty message div |

---

## Priority Fix List (What to Do Before Submitting)

### Must Fix (Recruiters Will Notice)
1. **Remove `motor` and `python-dotenv` from requirements.txt** — they're dead and raise questions.
2. **Add compiled binaries and the DB file to `.gitignore`** and remove them from the repo.
3. **Fix the README difficulty ranges** — change "Easy (8–15)" and "Medium (16–25)" to match the actual code (4–6 and 10–12), or fix the code ranges.
4. **Fix the API endpoint in the README** — `scramble/difficulty` → `scramble/by-difficulty`.
5. **Either add real screenshots or remove the screenshot section** — broken image tags look unprofessional.
6. **Be explicit about attribution** — clearly state in the README that `app/cpp_solver/` is adapted from the piyush932 repository and describe your original contribution.

### Should Fix (Technical Interviewers Will Ask)
7. **Fix or honestly describe the IDA* implementation** — either correct it to a proper DFS-based IDA* with O(d) stack, or acknowledge it's bounded A* with a visited map. Don't claim O(d) space.
8. **Fix `nodes_explored`** — implement a counter in each C++ solver and emit the real value, or remove the statistics display entirely. Fake zeros are worse than no number.
9. **Add a UI guard** — disable BFS/IDDFS when "Medium" difficulty is selected, or show a warning that BFS/IDDFS will likely timeout on 10+ move scrambles.
10. **Remove dead functions** — `state_to_pycuber_cube()`, `moveNotation.js`.

### Nice to Have
11. Add 5–10 more tests (scramble endpoint, happy-path solve, timeout path).
12. Fix the scramble generator to avoid opposite-face follow-ups.
13. Replace the depth-5 PDB with a proper depth-11 corner PDB, or document the limitation honestly.

---

## What Is Actually Good

To be fair:

- **The web integration layer is solid.** The adapter pattern (Python subprocess wrapping C++ executables), the Pydantic models, the FastAPI routing with proper HTTP error codes, the retry/backoff logic in the frontend API client — these are well-structured and show real thought.
- **The frontend move simulation is non-trivial.** `cubeMoves.js` implements 3D coordinate rotation from scratch to simulate cube moves on the frontend. That's not copy-paste work — it required understanding cube geometry.
- **The Learn page is a thoughtful addition.** An educational page with algorithm explanations differentiates this from a bare solver.
- **Error handling is layered and intentional.** The `classifyError` → `buildErrorState` → `ErrorMessage` chain across the frontend is clean.
- **The project structure is well-organized** for a portfolio piece — clear separation of routers, models, utils, solvers.

---

## Summary Verdict

The project demonstrates real full-stack skill — Python/FastAPI backend, React frontend with non-trivial state management, C++/Python interop. That is genuinely good.

But a recruiter or technical interviewer who goes beyond the README will find:
- Dead dependencies that suggest abandoned or copy-pasted code (`motor`)
- A core claimed feature that is completely faked (node counts)
- A critical algorithm described incorrectly in both the README and implementation
- Committed binaries that signal beginner Git habits
- A README that was never verified against the running code (wrong endpoint, wrong difficulty numbers, broken screenshots)

Fix the lies first. Fix the binaries second. Then you have a project worth putting on a resume.
