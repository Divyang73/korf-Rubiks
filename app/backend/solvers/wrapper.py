from __future__ import annotations

import os
import re
import subprocess
import tempfile
from enum import Enum
from typing import Any

from utils.cube_utils import SOLVED_CUBE_STATE


class AlgorithmType(str, Enum):
    BFS = "bfs"
    DFS = "dfs"
    IDDFS = "iddfs"
    IDASTAR = "idastar"


DEFAULT_TIMEOUTS = {
    AlgorithmType.BFS: 120,
    AlgorithmType.DFS: 120,
    AlgorithmType.IDDFS: 120,
    AlgorithmType.IDASTAR: 120,
}


class CppSolverWrapper:
    """Wrapper for C++ Rubik's Cube solvers."""

    def __init__(self, executables_dir: str):
        self.executables_dir = executables_dir
        self.solvers = {
            AlgorithmType.BFS: os.path.join(executables_dir, "bfs_solver"),
            AlgorithmType.DFS: os.path.join(executables_dir, "dfs_solver"),
            AlgorithmType.IDDFS: os.path.join(executables_dir, "iddfs_solver"),
            AlgorithmType.IDASTAR: os.path.join(executables_dir, "idastar_solver"),
        }

    def solve(
        self,
        cube_state: str,
        algorithm: AlgorithmType,
        timeout: int | None = None,
    ) -> dict[str, Any]:
        timeout = timeout or DEFAULT_TIMEOUTS[algorithm]

        if cube_state == SOLVED_CUBE_STATE:
            return {
                "success": True,
                "solution": "",
                "moves": 0,
                "time_ms": 0,
                "nodes_explored": 0,
                "algorithm": algorithm.value,
                "solver_backend": "cpp-korf-repo",
            }

        solver_path = self.solvers[algorithm]
        if not (os.path.exists(solver_path) and os.access(solver_path, os.X_OK)):
            return {
                "success": False,
                "error": (
                    f"C++ solver executable not found or not executable: {solver_path}. "
                    "Build solvers via app/backend/solvers/build_cpp_solvers.sh"
                ),
            }

        return self._run_cpp_solver(solver_path, cube_state, algorithm, timeout)

    def _run_cpp_solver(
        self, solver_path: str, cube_state: str, algorithm: AlgorithmType, timeout: int
    ) -> dict[str, Any]:
        with tempfile.NamedTemporaryFile("w", delete=False) as fp:
            fp.write(cube_state)
            input_file = fp.name

        try:
            extra_args: list[str] = []
            if algorithm == AlgorithmType.DFS:
                extra_args = ["20"]
            elif algorithm == AlgorithmType.IDDFS:
                extra_args = ["20"]

            result = subprocess.run(
                [solver_path, input_file, *extra_args],
                capture_output=True,
                text=True,
                timeout=timeout,
            )
            if result.returncode != 0:
                return {"success": False, "error": result.stderr.strip() or "C++ solver failed"}
            return self._parse_cpp_output(result.stdout, algorithm)
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": f"Solver timed out after {timeout} seconds",
            }
        finally:
            try:
                os.remove(input_file)
            except OSError:
                pass

    def _parse_cpp_output(self, output: str, algorithm: AlgorithmType) -> dict[str, Any]:
        lines = [line.strip() for line in output.splitlines() if line.strip()]
        if not lines:
            return {"success": False, "error": "Empty solver output"}

        solution = lines[0]
        moves = len(solution.split()) if solution else 0
        time_ms = self._extract_int(lines, r"time\s*:\s*(\d+)")
        nodes = self._extract_int(lines, r"nodes\s*:\s*(\d+)")

        return {
            "success": True,
            "solution": solution,
            "moves": moves,
            "time_ms": time_ms,
            "nodes_explored": nodes,
            "algorithm": algorithm.value,
            "solver_backend": "cpp-korf-repo",
        }

    @staticmethod
    def _extract_int(lines: list[str], pattern: str) -> int:
        regex = re.compile(pattern, re.IGNORECASE)
        for line in lines:
            match = regex.search(line)
            if match:
                return int(match.group(1))
        return 0
