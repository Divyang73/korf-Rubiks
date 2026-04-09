export default function Learn() {
  return (
    <main className="page learn-page">
      <section className="hero">
        <h1>Understanding Rubik&apos;s Cube Solving Algorithms</h1>
        <p>Learn how BFS, DFS, IDDFS, and IDA* differ in optimality, memory, and speed.</p>
      </section>

      <section className="panel learn-section">
        <h2>Rubik&apos;s Cube Basics</h2>
        <p>
          The 3x3x3 Rubik&apos;s Cube has 43 quintillion reachable states, and every legal state can be solved in
          20 moves or fewer (God&apos;s Number). Standard notation uses faces R, L, U, D, F, B with modifiers
          prime (counter-clockwise) and 2 (180 degrees).
        </p>
      </section>

      <section className="panel learn-section">
        <h2>Algorithms</h2>
        <h3>BFS</h3>
        <p>Explores level-by-level, guarantees shortest path, but uses high memory.</p>

        <h3>DFS</h3>
        <p>Explores deep paths first, low memory, but may return non-optimal solutions.</p>

        <h3>IDDFS</h3>
        <p>Runs depth-limited DFS repeatedly with increasing limits, combining optimality and low memory.</p>

        <h3>IDA*</h3>
        <p>
          Uses iterative deepening plus heuristic pruning. With admissible pattern-database heuristics,
          it is practical and production-friendly for deeper scrambles.
        </p>
      </section>

      <section className="panel learn-section">
        <h2>Comparison</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Optimal</th>
              <th>Time</th>
              <th>Space</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>BFS</td><td>Yes</td><td>O(b^d)</td><td>O(b^d)</td><td>Shallow scrambles</td></tr>
            <tr><td>DFS</td><td>No</td><td>O(b^d)</td><td>O(d)</td><td>Quick demo solving</td></tr>
            <tr><td>IDDFS</td><td>Yes</td><td>O(b^d)</td><td>O(d)</td><td>Balanced approach</td></tr>
            <tr><td>IDA*</td><td>Yes</td><td>O(b^d)*</td><td>O(d)</td><td>Production use</td></tr>
          </tbody>
        </table>
        <p className="muted">*Practical runtime improves with heuristic pruning.</p>
      </section>
    </main>
  )
}
