#include <chrono>
#include <iostream>

#include "common_solver_adapter.hpp"
#include "../../../cpp_solver/Solver/DFSSolver.h"
#include "../../../cpp_solver/Solver/IDDFSSolver.h"

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "Usage: iddfs_solver <input_file> [max_depth]\n";
        return 2;
    }

    int maxDepth = 20;
    if (argc >= 3) {
        maxDepth = std::max(1, std::stoi(argv[2]));
    }

    try {
        const std::string state = readStateFromInputFile(argv[1]);
        RubiksCube3dArray cube = cubeFromProjectState(state);

        auto started = std::chrono::high_resolution_clock::now();
        IDDFSSolver<RubiksCube3dArray, Hash3d> solver(cube, maxDepth);
        auto moves = solver.solve();
        auto ended = std::chrono::high_resolution_clock::now();

        const auto elapsedMs = std::chrono::duration_cast<std::chrono::milliseconds>(ended - started).count();

        std::cout << movesToString(moves) << "\n";
        std::cout << "Moves: " << moves.size() << "\n";
        std::cout << "Time: " << elapsedMs << "ms\n";
        std::cout << "Nodes: 0\n";
        return 0;
    } catch (const std::exception& ex) {
        std::cerr << ex.what() << "\n";
        return 1;
    }
}
