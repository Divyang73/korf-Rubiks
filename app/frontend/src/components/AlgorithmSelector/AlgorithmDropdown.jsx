const ALGORITHMS = [
  {
    key: 'bfs',
    label: 'BFS - Breadth-First Search',
    bestFor: '<= 7 moves, guaranteed optimal'
  },
  {
    key: 'dfs',
    label: 'DFS - Depth-First Search',
    bestFor: 'quick non-optimal solutions'
  },
  {
    key: 'iddfs',
    label: 'IDDFS - Iterative Deepening DFS',
    bestFor: 'balanced optimal solving'
  },
  {
    key: 'idastar',
    label: 'IDA* - Iterative Deepening A* (Recommended)',
    bestFor: 'production use, deeper scrambles'
  }
]

export default function AlgorithmDropdown({ selectedAlgorithm, onSelect, disabled }) {
  return (
    <div className="algorithm-select-wrap">
      <label htmlFor="algorithm-select">Select Algorithm</label>
      <select
        id="algorithm-select"
        value={selectedAlgorithm}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        data-testid="algorithm-select"
      >
        {ALGORITHMS.map((algo) => (
          <option key={algo.key} value={algo.key}>
            {algo.label}
          </option>
        ))}
      </select>
      <p className="muted">Best for: {ALGORITHMS.find((a) => a.key === selectedAlgorithm)?.bestFor}</p>
    </div>
  )
}
