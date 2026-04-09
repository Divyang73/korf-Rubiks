import { useEffect, useState } from 'react'
import AlgorithmCard from '../components/AlgorithmSelector/AlgorithmCard'
import AlgorithmDropdown from '../components/AlgorithmSelector/AlgorithmDropdown'
import ColorPalette from '../components/CubeInput/ColorPalette'
import UnfoldedCube from '../components/CubeInput/UnfoldedCube'
import Button from '../components/Common/Button'
import ErrorMessage from '../components/Common/ErrorMessage'
import SolutionDisplay from '../components/SolutionDisplay/SolutionDisplay'
import { generateScramble, getAlgorithmInfo, solveCube, validateCube } from '../api/client'
import {
  CLEAR_STATE,
  SOLVED_STATE,
  cloneCubeState,
  cubeStateToString,
  stringToCubeState
} from '../utils/cubeStateManager'

export default function Home() {
  const [cubeState, setCubeState] = useState(cloneCubeState(SOLVED_STATE))
  const [activeColor, setActiveColor] = useState('W')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('idastar')
  const [algorithmInfo, setAlgorithmInfo] = useState(null)
  const [result, setResult] = useState(null)
  const [validation, setValidation] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [scrambleText, setScrambleText] = useState('')

  useEffect(() => {
    getAlgorithmInfo(selectedAlgorithm)
      .then(setAlgorithmInfo)
      .catch(() => setAlgorithmInfo(null))
  }, [selectedAlgorithm])

  async function handleValidate() {
    setError('')
    try {
      const response = await validateCube(cubeStateToString(cubeState))
      console.debug('validate response', response)
      setValidation(response)
      if (!response.valid) setError(response.errors?.join(' | ') || response.message)
    } catch (err) {
      console.error('validate request failed', err?.response?.data || err)
      setError(err?.response?.data?.detail?.message || err.message || 'Validation failed')
    }
  }

  async function handleSolve() {
    setIsLoading(true)
    setError('')
    setResult(null)
    try {
      const validationResponse = await validateCube(cubeStateToString(cubeState))
      setValidation(validationResponse)
      if (!validationResponse.valid) {
        setError(validationResponse.errors?.join(' | ') || validationResponse.message)
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
      const detail = err?.response?.data?.detail
      setError(
        typeof detail === 'string'
          ? detail
          : detail?.message || detail?.error || err.message || 'Unable to solve cube'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleScramble() {
    setError('')
    try {
      const response = await generateScramble(10)
      setScrambleText(response.scramble)
      setCubeState(stringToCubeState(response.cube_state))
      setValidation(null)
      setResult(null)
    } catch (err) {
      setError(err.message || 'Failed to generate scramble')
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
        <p>Input a cube state, choose an algorithm, and get step-by-step notation.</p>
      </section>

      <div className="layout-two-col">
        <section className="panel">
          <h2>Cube Input</h2>
          <UnfoldedCube
            cubeState={cubeState}
            onStickerClick={handleStickerClick}
            activeColor={activeColor}
            isLocked={isLoading}
          />
          <ColorPalette activeColor={activeColor} onColorSelect={setActiveColor} />

          <div className="controls-row">
            <Button variant="secondary" onClick={() => setCubeState(cloneCubeState(CLEAR_STATE))} disabled={isLoading}>
              Clear
            </Button>
            <Button variant="secondary" onClick={() => setCubeState(cloneCubeState(SOLVED_STATE))} disabled={isLoading}>
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
          {validation && !validation.valid && <ErrorMessage message={validation.message} />}
          {validation?.valid && <p className="success">Cube configuration is valid.</p>}
        </section>

        <section className="panel">
          <h2>Algorithm and Solution</h2>
          <AlgorithmDropdown
            selectedAlgorithm={selectedAlgorithm}
            onSelect={setSelectedAlgorithm}
            disabled={isLoading}
          />
          <AlgorithmCard info={algorithmInfo} />

          <div className="solve-row">
            <Button onClick={handleSolve} disabled={isLoading} data-testid="solve-button">
              {isLoading ? 'Solving...' : 'Solve'}
            </Button>
          </div>

          <SolutionDisplay result={result} isLoading={isLoading} error={error} />
        </section>
      </div>
    </main>
  )
}
