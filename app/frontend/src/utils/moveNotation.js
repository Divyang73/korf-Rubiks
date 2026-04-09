export const MOVE_DESCRIPTIONS = {
  R: 'Rotate right face clockwise',
  "R'": 'Rotate right face counter-clockwise',
  R2: 'Rotate right face 180 degrees',
  L: 'Rotate left face clockwise',
  "L'": 'Rotate left face counter-clockwise',
  L2: 'Rotate left face 180 degrees',
  U: 'Rotate up face clockwise',
  "U'": 'Rotate up face counter-clockwise',
  U2: 'Rotate up face 180 degrees',
  D: 'Rotate down face clockwise',
  "D'": 'Rotate down face counter-clockwise',
  D2: 'Rotate down face 180 degrees',
  F: 'Rotate front face clockwise',
  "F'": 'Rotate front face counter-clockwise',
  F2: 'Rotate front face 180 degrees',
  B: 'Rotate back face clockwise',
  "B'": 'Rotate back face counter-clockwise',
  B2: 'Rotate back face 180 degrees'
}

export function parseMoves(solution = '') {
  if (!solution.trim()) return []
  return solution.trim().split(/\s+/)
}
