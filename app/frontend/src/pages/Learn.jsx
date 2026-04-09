export default function Learn() {
  return (
    <main className="page learn-page">
      <section className="hero">
        <h1>Rubik&apos;s Cube Learning Hub</h1>
        <p>
          Quick algorithm guide for BFS, DFS, and IDDFS, plus an in-depth IDA* explainer with heuristics,
          pattern databases, and practical performance intuition.
        </p>
      </section>

      <section className="panel learn-section">
        <h2>Jump To Section</h2>
        <nav className="learn-toc" aria-label="Learn page section navigation">
          <a href="#cube-basics">Cube Basics</a>
          <a href="#move-basics">Move Basics</a>
          <a href="#how-to-input">How to Input Your Cube</a>
          <a href="#quick-algorithms">Quick Algorithm Guide</a>
          <a href="#ida-star-deep-dive">IDA* Deep Dive</a>
          <a href="#fun-facts">Fun Facts</a>
        </nav>
      </section>

      <section id="cube-basics" className="panel learn-section">
        <h2>Rubik&apos;s Cube Basics</h2>
        <p>
          A 3x3x3 cube has 6 faces, 8 corners, and 12 edges. Only legal permutations are reachable, giving
          about 43 quintillion valid states. Every valid state can be solved in at most 20 face turns,
          known as God&apos;s Number.
        </p>
        <div className="learn-image-wrap">
          <img
            className="learn-image"
            src="https://upload.wikimedia.org/wikipedia/commons/1/19/Rubik%27s_Cube_Solved.png"
            alt="Solved Rubik's Cube"
            loading="lazy"
          />
          <p className="muted image-caption">Solved state reference cube.</p>
        </div>
      </section>

      <section id="move-basics" className="panel learn-section">
        <h2>Move Basics</h2>
        <p>
          Standard notation uses faces <strong>R, L, U, D, F, B</strong>. A plain letter means clockwise quarter-turn,
          <strong>&apos;</strong> means counter-clockwise, and <strong>2</strong> means half-turn.
        </p>
        <ul>
          <li><strong>R</strong>: turn right face clockwise</li>
          <li><strong>U&apos;</strong>: turn upper face counter-clockwise</li>
          <li><strong>F2</strong>: rotate front face by 180 degrees</li>
        </ul>
        <p className="muted">Tip: choose one move metric and stay consistent when comparing algorithms.</p>
      </section>

      <section id="how-to-input" className="panel learn-section">
        <h2>How to Input Your Cube</h2>
        <p>
          The solver uses a 2D unfolded net to represent your 3D scrambled cube. Understanding how to read and fill 
          this interface is key to getting valid input. Let&apos;s break it down step by step.
        </p>

        <h3>Understanding the Unfolded Layout</h3>
        <p>
          The cube is displayed as a cross net with 6 faces arranged like this:
        </p>
        <div className="code-block">
          <pre>{`        [U - Top/Up]
[L]  [F]  [R]  [B]
        [D - Bottom/Down]`}</pre>
        </div>
        <p>
          Each face is a 3×3 grid labeled with a center sticker that <strong>cannot be changed</strong> 
          (it&apos;s the anchor color for that face). The fixed center colors are:
        </p>
        <ul>
          <li><strong>U (Up)</strong> center: White</li>
          <li><strong>R (Right)</strong> center: Red</li>
          <li><strong>F (Front)</strong> center: Blue</li>
          <li><strong>D (Down)</strong> center: Yellow</li>
          <li><strong>L (Left)</strong> center: Orange</li>
          <li><strong>B (Back)</strong> center: Green</li>
        </ul>

        <h3>Sticker Position Reference</h3>
        <p>
          Each face has 9 positions numbered 0–8 in this pattern:
        </p>
        <div className="code-block">
          <pre>{`  0  1  2
  3  4  5
  6  7  8

(Position 4 is always the center and cannot be painted.)`}</pre>
        </div>

        <h3>Step-by-Step: Inputting a Scrambled Cube</h3>
        <ol>
          <li>
            <strong>Start from the real cube:</strong> Hold your physical scrambled cube and identify where each piece is.
          </li>
          <li>
            <strong>Pick a color palette:</strong> Click the color buttons at the top (W, Y, R, O, B, G correspond to 
            White, Yellow, Red, Orange, Blue, Green).
          </li>
          <li>
            <strong>Paint each sticker:</strong> Look at your physical cube face by face, and click on each sticker in the 
            unfolded interface to paint it the correct color. The center sticker is locked, so it will always show its 
            correct color.
          </li>
          <li>
            <strong>Validate:</strong> Click the &quot;Validate Cube&quot; button. If errors appear, check:
            <ul>
              <li>Did you accidentally paint a center sticker?</li>
              <li>Are all 9 of each color accounted for? (You need exactly 9 white, 9 yellow, 9 red, etc.)</li>
              <li>Is the configuration physically possible on a real cube?</li>
            </ul>
          </li>
          <li>
            <strong>Solve:</strong> Once validated, pick an algorithm and click &quot;Solve&quot;.
          </li>
        </ol>

        <h3>Common Input Errors & How to Fix Them</h3>

        <div className="error-example">
          <p><strong>❌ "Invalid color distribution: W appears 8 times"</strong></p>
          <p>You painted only 8 white stickers instead of 9. Check every white sticker on your physical cube 
          and make sure you painted all 9 in the interface. Remember the center counts as 1.</p>
        </div>

        <div className="error-example">
          <p><strong>❌ "Invalid center configuration at index 4: expected W"</strong></p>
          <p>The center of the U face should always be white. You may have accidentally grabbed the center 
          sticker (which should be disabled) or misidentified which face is which. Centers cannot change.</p>
        </div>

        <div className="error-example">
          <p><strong>❌ "Unsolvable configuration"</strong></p>
          <p>The cube configuration is physically impossible on a real 3×3 Rubik's Cube. This can happen if 
          you swapped two edges or corners or created an invalid parity state. Double-check your physical cube 
          against the interface.</p>
        </div>

        <div className="error-example">
          <p><strong>❌ "Invalid cube string length"</strong></p>
          <p>This should never happen through the UI, but it means the solver received a cube string that wasn&apos;t 
          exactly 54 characters (9 stickers × 6 faces). Don&apos;t modify the input manually.</p>
        </div>

        <h3>Pro Tips</h3>
        <ul>
          <li><strong>Use the "Generate Scramble" button</strong> to start with a known valid cube if you want to test 
          the solver without manual input.</li>
          <li><strong>Paint edge and corner stickers first,</strong> then validate. It&apos;s faster than painting centers.</li>
          <li><strong>If your real cube is mixed up,</strong> you can always reset it to solved state, scramble it yourself 
          with a specific sequence, then input that carefully.</li>
          <li><strong>Phone/tablet input:</strong> Paint carefully; the stickers are click-to-toggle colors for each face.</li>
        </ul>

        <h3>Example: A Simple Scramble</h3>
        <p>
          If you perform just <strong>R U R&apos;</strong> on a solved cube, only a few stickers move. The centers stay locked. 
          Try it—solve the scrambled result and verify the moves match!
        </p>
      </section>

      <section id="quick-algorithms" className="panel learn-section">
        <h2>Quick Algorithm Guide</h2>

        <div className="mini-algo-card">
          <h3>BFS</h3>
          <p><strong>Idea:</strong> Explore layer by layer from the start state.</p>
          <p><strong>Strength:</strong> Guarantees shortest solution in unweighted search space.</p>
          <p><strong>Tradeoff:</strong> Memory usage grows quickly as depth increases.</p>
        </div>

        <div className="mini-algo-card">
          <h3>DFS</h3>
          <p><strong>Idea:</strong> Go deep first, backtrack when stuck.</p>
          <p><strong>Strength:</strong> Very memory-efficient.</p>
          <p><strong>Tradeoff:</strong> Can return long non-optimal solutions and spend time in poor branches.</p>
        </div>

        <div className="mini-algo-card">
          <h3>IDDFS</h3>
          <p><strong>Idea:</strong> Repeated depth-limited DFS with increasing limit.</p>
          <p><strong>Strength:</strong> Finds optimal depth like BFS while keeping DFS-like memory usage.</p>
          <p><strong>Tradeoff:</strong> Re-expands upper levels multiple times.</p>
        </div>
      </section>

      <section id="ida-star-deep-dive" className="panel learn-section">
        <h2>IDA* Deep Dive</h2>
        <p>
          IDA* (Iterative Deepening A*) combines iterative deepening with heuristic guidance. Instead of exploring
          purely by depth, it explores by an <strong>f-cost</strong> threshold, where <strong>f(n) = g(n) + h(n)</strong>.
        </p>
        <ul>
          <li><strong>g(n)</strong>: exact cost from start to current state</li>
          <li><strong>h(n)</strong>: heuristic estimate from current state to goal</li>
          <li><strong>Bound</strong>: current cutoff on f-cost for a search pass</li>
        </ul>

        <h3>How A Single IDA* Cycle Works</h3>
        <ol>
          <li>Start with an initial bound, often from heuristic of the start state.</li>
          <li>Run depth-first search, but prune nodes with f(n) &gt; bound.</li>
          <li>If no solution is found, increase bound to the smallest pruned f(n).</li>
          <li>Repeat until a solution is discovered.</li>
        </ol>

        <h3>Why Pattern Databases (PDBs) Matter</h3>
        <p>
          A PDB stores exact move distances for a projected subproblem. During search, that table lookup gives a
          strong heuristic quickly. Better heuristics prune more nodes, which is exactly why IDA* scales better
          than uninformed search for deeper scrambles.
        </p>
        <p>
          In this project, IDA* uses a <strong>corner pattern database</strong> file loaded by the native C++ solver.
          That means heuristic values come from precomputed data rather than weak on-the-fly guesses.
        </p>

        <h3>Complexity Intuition</h3>
        <p>
          Worst-case complexity remains exponential, but practical runtime depends heavily on heuristic quality.
          With a strong admissible heuristic, the effective branching factor drops substantially.
        </p>

        <h3>When IDA* Is The Best Choice</h3>
        <ul>
          <li>When you need near-optimal or optimal solutions.</li>
          <li>When memory is limited compared to BFS.</li>
          <li>When search depth is beyond what BFS/IDDFS handle comfortably.</li>
        </ul>

        <div className="learn-image-wrap">
          <img
            className="learn-image"
            src="https://upload.wikimedia.org/wikipedia/commons/9/97/Rubik%27s_Cube_shuffle.svg"
            alt="Rubik's Cube in a scrambled state"
            loading="lazy"
          />
          <p className="muted image-caption">Scrambled state where heuristic pruning becomes crucial.</p>
        </div>

        <details className="ida-notes">
          <summary>Minor Details You Should Know</summary>
          <ul>
            <li>Admissible heuristics never overestimate true remaining cost.</li>
            <li>Consistent heuristics reduce unnecessary node re-expansions.</li>
            <li>Move ordering can strongly impact practical speed even with the same heuristic.</li>
            <li>Symmetry reduction and transposition handling can further improve search.</li>
            <li>PDB generation is expensive once, then cheap to query many times.</li>
          </ul>
        </details>
      </section>

      <section className="panel learn-section">
        <h2>Comparison</h2>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Optimal</th>
              <th>Space</th>
              <th>Pruning Strength</th>
              <th>Best Use</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>BFS</td><td>Yes</td><td>Very High</td><td>None</td><td>Shallow demonstrations</td></tr>
            <tr><td>DFS</td><td>No</td><td>Low</td><td>None</td><td>Quick exploratory path</td></tr>
            <tr><td>IDDFS</td><td>Yes</td><td>Low</td><td>Depth-limit only</td><td>Balanced baseline</td></tr>
            <tr><td>IDA*</td><td>Yes</td><td>Low</td><td>Heuristic + iterative bound</td><td>Deeper practical solves</td></tr>
          </tbody>
        </table>
      </section>

      <section id="fun-facts" className="panel learn-section">
        <h2>Fun Facts</h2>
        <ul>
          <li>The original cube was invented in 1974 by Ernő Rubik.</li>
          <li>God&apos;s Number for the 3x3 cube is 20 in face-turn metric.</li>
          <li>Speedcubers often plan around lookahead and finger tricks, not brute-force search.</li>
          <li>Algorithmic solvers and human methods optimize different goals.</li>
          <li>Heuristics are the reason modern search-based solvers are practical.</li>
        </ul>
        <p>
          Image sources: Wikimedia Commons (educational references).
        </p>
      </section>
    </main>
  )
}
