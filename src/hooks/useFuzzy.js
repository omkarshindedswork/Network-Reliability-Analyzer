import { useState, useEffect, useCallback } from 'react'
import { computeReliability, SCENARIOS } from '../logic/FuzzyEngine'

const DEFAULT_STATE = { signal: -60, noise: 30, traffic: 50 }

export function useFuzzy() {
  const [params, setParams] = useState(DEFAULT_STATE)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  // Re-compute whenever inputs change
  useEffect(() => {
    const r = computeReliability(params.signal, params.noise, params.traffic)
    setResult(r)
    setHistory(prev => {
      const entry = { ...params, score: r.score, category: r.category, ts: Date.now() }
      return [...prev.slice(-19), entry]
    })
  }, [params.signal, params.noise, params.traffic])

  const setSignal  = useCallback(v => setParams(p => ({ ...p, signal: v })), [])
  const setNoise   = useCallback(v => setParams(p => ({ ...p, noise: v })), [])
  const setTraffic = useCallback(v => setParams(p => ({ ...p, traffic: v })), [])

  const reset = useCallback(() => setParams(DEFAULT_STATE), [])

  const randomize = useCallback(() => {
    setParams({
      signal:  Math.round(Math.random() * 60 - 90),
      noise:   Math.round(Math.random() * 60),
      traffic: Math.round(Math.random() * 100),
    })
  }, [])

  const applyScenario = useCallback(s => {
    setParams({ signal: s.signal, noise: s.noise, traffic: s.traffic })
  }, [])

  return { params, result, history, setSignal, setNoise, setTraffic, reset, randomize, applyScenario }
}
