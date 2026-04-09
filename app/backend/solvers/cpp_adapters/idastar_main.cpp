#include <chrono>
#include <filesystem>
#include <iostream>

#include "common_solver_adapter.hpp"
#include "../../../cpp_solver/PatternDatabases/NibbleArray.cpp"
#include "../../../cpp_solver/PatternDatabases/PatternDatabase.cpp"
#include "../../../cpp_solver/PatternDatabases/CornerPatternDatabase.cpp"
#include "../../../cpp_solver/PatternDatabases/math.cpp"
#include "../../../cpp_solver/Solver/IDAstarSolver.h"

using namespace std;

int main(int argc, char** argv) {
    if (argc < 2) {
        cerr << "Usage: idastar_solver <input_file> [corner_db_path]\n";
        return 2;
    }

    try {
        const string state = readStateFromInputFile(argv[1]);
        RubiksCube3dArray cube = cubeFromProjectState(state);

        string dbPath;
        if (argc >= 3) {
            dbPath = argv[2];
        } else {
            // Default path keeps adapter portable after build script copies DB next to executables.
            const auto exePath = filesystem::absolute(argv[0]);
            dbPath = (exePath.parent_path() / "Database" / "cornerDepth5V1.txt").string();
        }

        auto started = chrono::high_resolution_clock::now();
        IDAstarSolver<RubiksCube3dArray, Hash3d> solver(cube, dbPath);
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
