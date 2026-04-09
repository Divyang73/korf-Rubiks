import { MOVE_DESCRIPTIONS, parseMoves } from '../../utils/moveNotation'

export default function MoveList({ solution }) {
  const moves = parseMoves(solution)
  if (!moves.length) {
    return <p className="muted">No moves required. Cube is already solved.</p>
  }

  return (
    <div className="moves-section">
      <code className="solution-inline">{solution}</code>
      <ol className="move-list">
        {moves.map((move, index) => (
          <li key={`${move}-${index}`} title={MOVE_DESCRIPTIONS[move] || 'Cube move'}>
            <span className="move-token">{move}</span>
            <span className="muted">{MOVE_DESCRIPTIONS[move] || 'Standard move'}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
