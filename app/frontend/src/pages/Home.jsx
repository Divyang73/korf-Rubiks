import { useEffect, useState } from 'react'
import AlgorithmDropdown from '../components/AlgorithmSelector/AlgorithmDropdown'
import ColorPalette from '../components/CubeInput/ColorPalette'
import DifficultySelector from '../components/CubeInput/DifficultySelector'
import UnfoldedCube from '../components/CubeInput/UnfoldedCube'
import Button from '../components/Common/Button'
import ErrorMessage from '../components/Common/ErrorMessage'
import LoadingSkeleton from '../components/Common/LoadingSkeleton'
import SolutionDisplay from '../components/SolutionDisplay/SolutionDisplay'
import {
  generateDifficultyScramble,
  generateScramble,
  solveCube,
  validateCube
} from '../api/client'
import {
  CLEAR_STATE,
  SOLVED_STATE,
  cloneCubeState,
  cubeStateToString,
  stringToCubeState
} from '../utils/cubeStateManager'
import { applyMovesToState, applySingleMove } from '../utils/cubeMoves'

const MOVE_ROWS = [
  ['F', 'R', 'U', 'B', 'L', 'D'],
  ["F'", "R'", "U'", "B'", "L'", "D'"]
]

export default function Home() {
  const [cubeState, setCubeState] = useState(cloneCubeState(SOLVED_STATE))
  const [activeColor, setActiveColor] = useState('W')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('idastar')
  const [result, setResult] = useState(null)
  const [validation, setValidation] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [scrambleText, setScrambleText] = useState('')
  const [manualMoves, setManualMoves] = useState('')
  const [moveHistory, setMoveHistory] = useState([])
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [lastAction, setLastAction] = useState(null)

  // Keep a very short initial skeleton so first paint feels intentional.
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 220)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) return undefined
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isLoading])

  // Normalize network/timeout/server failures into a UI-friendly object.
  function buildErrorState(err, fallbackMessage) {
    return {
      message: err?.message || fallbackMessage,
      detail:
        err?.category === 'timeout'
          ? 'The backend took too long. Try IDA* for deep scrambles or regenerate a lighter scramble.'
          : err?.category === 'connection'
            ? 'Auto-retry was attempted. If this persists, ensure backend is running and reachable.'
            : err?.raw?.response?.data?.detail?.details?.join(' | ') || null,
      retryable: Boolean(err?.retryable),
      category: err?.category || 'server'
    }
  }

  async function handleValidate() {
    setError(null)
    setLastAction(() => handleValidate)
    try {
      const response = await validateCube(cubeStateToString(cubeState))
      console.debug('validate response', response)
      setValidation(response)
      if (!response.valid) {
        setError({
          message: response.message,
          detail: response.errors?.join(' | ') || null,
          retryable: false,
          category: 'validation'
        })
      }
    } catch (err) {
      console.error('validate request failed', err?.response?.data || err)
      setError(buildErrorState(err, 'Validation failed'))
    }
  }

  async function handleSolve() {
    setElapsedSeconds(0)
    setIsLoading(true)
    setError(null)
    setLastAction(() => handleSolve)
    setResult(null)
    try {
      // We validate first so solver errors only represent execution issues.
      const validationResponse = await validateCube(cubeStateToString(cubeState))
      setValidation(validationResponse)
      if (!validationResponse.valid) {
        setError({
          message: validationResponse.message,
          detail: validationResponse.errors?.join(' | ') || null,
          retryable: false,
          category: 'validation'
        })
        return
      }

      const response = await solveCube({
        cube_state: cubeStateToString(cubeState),
        algorithm: selectedAlgorithm,
        include_stats: true
      })
      setResult(response)
    } catch (err) {
      console.error('solve request failed', err?.response?.data || err)
      setError(buildErrorState(err, 'Unable to solve cube'))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleScramble() {
    setError(null)
    setLastAction(() => handleScramble)
    try {
      const response = await generateScramble(10)
      setScrambleText(response.scramble)
      setCubeState(stringToCubeState(response.cube_state))
      setValidation(null)
      setResult(null)
      setMoveHistory([])
    } catch (err) {
      setError(buildErrorState(err, 'Failed to generate scramble'))
    }
  }

  async function handleDifficultyScramble(difficulty) {
    setError(null)
    setLastAction(() => () => handleDifficultyScramble(difficulty))
    try {
      const response = await generateDifficultyScramble(difficulty)
      setScrambleText(`${difficulty.toUpperCase()} -> ${response.scramble}`)
      setCubeState(stringToCubeState(response.cube_state))
      setValidation(null)
      setResult(null)
      setMoveHistory([])
      if (difficulty === 'easy') setSelectedAlgorithm('bfs')
      if (difficulty === 'medium') setSelectedAlgorithm('iddfs')
    } catch (err) {
      setError(buildErrorState(err, `Failed to generate ${difficulty} scramble`))
    }
  }

  function applyMove(move) {
    setCubeState((prev) => applySingleMove(prev, move))
    setMoveHistory((prev) => [...prev, move])
    setValidation(null)
    setError(null)
  }

  function handleApplyManualMoves() {
    if (!manualMoves.trim()) return
    setLastAction(() => handleApplyManualMoves)
    setCubeState((prev) => applyMovesToState(prev, manualMoves))
    setMoveHistory((prev) => [...prev, ...manualMoves.trim().split(/\s+/)])
    setValidation(null)
    setError(null)
  }

  function handleUndoMove() {
    const last = moveHistory[moveHistory.length - 1]
    if (!last) return
    const inverse = last.endsWith("'") ? last.slice(0, -1) : `${last}'`
    setCubeState((prev) => applySingleMove(prev, inverse))
    setMoveHistory((prev) => prev.slice(0, -1))
    setValidation(null)
  }

  // Retry always replays the exact last user action (scramble/solve/validate/apply moves).
  function handleRetry() {
    if (typeof lastAction === 'function') {
      lastAction()
    }
  }

  function handleStickerClick(face, index) {
    setCubeState((prev) => {
      const next = cloneCubeState(prev)
      next[face][index] = activeColor
      return next
    })
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>Interactive Rubik&apos;s Cube Solver</h1>
      </section>

      {isBooting && (
        <section className="panel">
          <h2>Loading Workspace</h2>
          <LoadingSkeleton lines={6} />
        </section>
      )}

      <div className="layout-two-col">
        <section className="panel cube-panel">
          <h2>Cube Input Net</h2>
          <UnfoldedCube
            cubeState={cubeState}
            onStickerClick={handleStickerClick}
            activeColor={activeColor}
            isLocked={isLoading}
          />
          <ColorPalette activeColor={activeColor} onColorSelect={setActiveColor} />
        </section>

        <section className="panel control-panel">
          <h2>Control Deck</h2>

          <DifficultySelector
            onSelect={handleDifficultyScramble}
            disabled={isLoading}
          />

          <div className="move-pad">
            {MOVE_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="move-row">
                {row.map((move) => (
                  <button
                    key={move}
                    type="button"
                    className="move-btn"
                    onClick={() => applyMove(move)}
                    disabled={isLoading}
                  >
                    {move}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="manual-move-row">
            <input
              className="move-input"
              placeholder="Moves: e.g. F R2 U'"
              value={manualMoves}
              onChange={(event) => setManualMoves(event.target.value)}
              disabled={isLoading}
            />
            <Button variant="secondary" onClick={handleApplyManualMoves} disabled={isLoading}>
              Apply
            </Button>
            <Button variant="secondary" onClick={handleUndoMove} disabled={isLoading || moveHistory.length === 0}>
              Undo
            </Button>
          </div>

          <div className="algorithm-strip">
            <AlgorithmDropdown
              selectedAlgorithm={selectedAlgorithm}
              onSelect={setSelectedAlgorithm}
              disabled={isLoading}
            />
          </div>

          <div className="controls-row">
            <Button
              variant="secondary"
              onClick={() => {
                setCubeState(cloneCubeState(CLEAR_STATE))
                setMoveHistory([])
                setValidation(null)
                setResult(null)
                setError(null)
              }}
              disabled={isLoading}
            >
              Clear
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCubeState(cloneCubeState(SOLVED_STATE))
                setMoveHistory([])
                setValidation(null)
                setResult(null)
                setError(null)
              }}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button variant="secondary" onClick={handleScramble} disabled={isLoading} data-testid="scramble-button">
              Random Scramble
            </Button>
            <Button variant="secondary" onClick={handleValidate} disabled={isLoading}>
              Validate
            </Button>
          </div>

          {scrambleText && <p className="muted">Generated Scramble: {scrambleText}</p>}
          {validation && !validation.valid && (
            <ErrorMessage message={validation.message} detail={validation.errors?.join(' | ')} />
          )}
          {validation?.valid && <p className="success">Cube configuration is valid.</p>}

          <div className="solve-row">
            <Button onClick={handleSolve} disabled={isLoading} data-testid="solve-button">
              {isLoading ? 'Solving...' : 'Solve'}
            </Button>
            {isLoading && (
              <p className="muted timeout-indicator">
                Elapsed: {elapsedSeconds}s
                {elapsedSeconds >= 60 ? ' (deep search can take longer)' : ''}
              </p>
            )}
          </div>

          {isLoading && <LoadingSkeleton lines={4} compact />}

          {error && (
            <ErrorMessage
              message={error.message}
              detail={error.detail}
              onRetry={error.retryable ? handleRetry : null}
              retryDisabled={isLoading}
            />
          )}

          <SolutionDisplay result={result} isLoading={isLoading} error={error?.message || ''} />
        </section>
      </div>
    </main>
  )
}
