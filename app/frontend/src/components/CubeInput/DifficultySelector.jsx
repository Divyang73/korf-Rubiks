import Button from '../Common/Button'

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy (4-6)', description: 'Best with BFS' },
  { key: 'medium', label: 'Medium (10-12)', description: 'Best with IDDFS' }
]

export default function DifficultySelector({ onSelect, disabled }) {
  return (
    <div className="difficulty-wrap" aria-label="Difficulty scramble controls">
      <p className="muted difficulty-title">Difficulty Tiers</p>
      <div className="difficulty-row">
        {DIFFICULTIES.map((difficulty) => (
          <Button
            key={difficulty.key}
            variant="secondary"
            onClick={() => onSelect(difficulty.key)}
            disabled={disabled}
            title={difficulty.description}
          >
            {difficulty.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
