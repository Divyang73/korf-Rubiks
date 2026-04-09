#include <chrono>
#include <iostream>

#include "common_solver_adapter.hpp"
#include "../../../cpp_solver/Solver/DFSSolver.h"
#include "../../../cpp_solver/Solver/IDDFSSolver.h"

using namespace std;

int main(int argc, char** argv) {
    if (argc < 2) {
        cerr << "Usage: iddfs_solver <input_file> [max_depth]\n";
        return 2;
    }

    int maxDepth = 20;
    if (argc >= 3) {
        maxDepth = max(1, stoi(argv[2]));
    }

    try {
        const string state = readStateFromInputFile(argv[1]);
        RubiksCube3dArray cube = cubeFromProjectState(state);

        auto started = chrono::high_resolution_clock::now();
        IDDFSSolver<RubiksCube3dArray, Hash3d> solver(cube, maxDepth);
        auto moves = solver.solve();
        auto ended = chrono::high_resolution_clock::now();

        const auto elapsedMs = chrono::duration_cast<chrono::milliseconds>(ended - started).count();

        cout << movesToString(moves) << "\n";
        cout << "Moves: " << moves.size() << "\n";
        cout << "Time: " << elapsedMs << "ms\n";
        cout << "Nodes: 0\n";
        return 0;
    } catch (const exception& ex) {
        cerr << ex.what() << "\n";
        return 1;
    }
}
