import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || ''

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 130000
})

export async function healthCheck() {
  const { data } = await http.get('/api/')
  return data
}

export async function validateCube(cubeState) {
  const { data } = await http.post('/api/validate', { cube_state: cubeState })
  return data
}

export async function solveCube(payload) {
  const { data } = await http.post('/api/solve', payload)
  return data
}

export async function generateScramble(depth = 10) {
  const { data } = await http.post('/api/scramble', { depth })
  return data
}

export async function getAlgorithmInfo(name) {
  const { data } = await http.get(`/api/algorithms/${name}`)
  return data
}
