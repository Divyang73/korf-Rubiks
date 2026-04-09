import { useMemo } from 'react'
import LoadingSpinner from '../Common/LoadingSpinner'
import ErrorMessage from '../Common/ErrorMessage'
import MoveList from './MoveList'
import Statistics from './Statistics'

export default function SolutionDisplay({ result, isLoading, error }) {
  const moveCount = useMemo(() => {
    if (!result?.solution) return 0
    return result.solution.trim() ? result.solution.trim().split(/\s+/).length : 0
  }, [result])

  return (
    <section className="solution-card">
      <h3>Solution</h3>
      {isLoading && <LoadingSpinner label="Solving cube..." />}
      <ErrorMessage message={error} />
      {!isLoading && !error && result && (
        <>
          <p className="solution-headline">{moveCount} moves</p>
          <MoveList solution={result.solution} />
          <Statistics
            stats={result.statistics}
            moves={result.moves}
            timeMs={result.time_ms}
            algorithm={result.algorithm}
          />
        </>
      )}
    </section>
  )
}
