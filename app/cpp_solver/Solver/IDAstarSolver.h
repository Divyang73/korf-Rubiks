#ifndef IDASTARSOLVER_H
#define IDASTARSOLVER_H

#include <algorithm>
#include <cassert>
#include <climits>
#include <cstdint>
#include <vector>

#include "../Model/RubiksCube.h"
#include "../PatternDatabases/CornerPatternDatabase.h"

// True IDA* (Korf 1985): iterative-deepening depth-first search with an
// admissible heuristic cost bound.  No visited map, no priority queue.
// Memory usage is O(d) where d is the solution depth.
template<typename T, typename H>
class IDAstarSolver {
private:
    CornerPatternDatabase cornerDB;
    std::vector<RubiksCube::MOVE> path;

    static const int FOUND = -1;

    // Returns inverse of move m.  MOVE enum layout per face group: cw=0, ccw=1, half=2.
    static RubiksCube::MOVE inverseMove(RubiksCube::MOVE m) {
        int idx = static_cast<int>(m);
        int type = idx % 3;
        if (type == 0) return RubiksCube::MOVE(idx + 1); // cw  -> ccw
        if (type == 1) return RubiksCube::MOVE(idx - 1); // ccw -> cw
        return m;                                          // half-turn is self-inverse
    }

    // DFS with f-cost bound.
    // Applies moves directly to `cube` (passed by reference from solve()).
    // Undoes each move before returning unless the solution was found.
    // Returns FOUND if goal reached, otherwise the minimum f-cost that exceeded the bound.
    int search(T& cube, int g, int bound) {
        int h = static_cast<int>(cornerDB.getNumMoves(cube));
        int f = g + h;
        if (f > bound) return f;
        if (cube.isSolved()) return FOUND;

        int minExceeded = INT_MAX;
        for (int i = 0; i < 18; i++) {
            RubiksCube::MOVE curr = RubiksCube::MOVE(i);
            // Skip the direct inverse of the last move: A then A' is a no-op.
            if (!path.empty() && inverseMove(curr) == path.back()) continue;

            cube.move(curr);
            path.push_back(curr);

            int result = search(cube, g + 1, bound);

            if (result == FOUND) return FOUND;
            if (result < minExceeded) minExceeded = result;

            path.pop_back();
            cube.invert(curr);
        }
        return minExceeded;
    }

public:
    T rubiksCube;

    IDAstarSolver(T _rubiksCube, const std::string& fileName) : rubiksCube(_rubiksCube) {
        cornerDB.fromFile(fileName);
    }

    // Returns the sequence of moves that solves the cube.
    // After solve() returns, rubiksCube holds the solved state.
    std::vector<RubiksCube::MOVE> solve() {
        int bound = static_cast<int>(cornerDB.getNumMoves(rubiksCube));
        path.clear();

        while (true) {
            int result = search(rubiksCube, 0, bound);
            if (result == FOUND) {
                assert(rubiksCube.isSolved());
                return path;
            }
            if (result == INT_MAX) {
                // No solution reachable — should not happen for a valid cube state.
                return {};
            }
            bound = result;
        }
    }
};

#endif // IDASTARSOLVER_H
