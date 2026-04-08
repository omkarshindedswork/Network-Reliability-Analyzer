/**
 * FuzzyEngine.js
 * ──────────────────────────────────────────────────────────────
 * Complete fuzzy logic inference engine for communication link
 * reliability estimation.
 *
 * Pipeline:
 *   1. Fuzzification  — map crisp inputs to membership degrees
 *   2. Rule Evaluation — apply fuzzy IF-THEN rules via AND (min)
 *   3. Aggregation    — collect all rule activations per output
 *   4. Defuzzification — weighted average (centre of gravity)
 *   5. Output         — crisp reliability score 0–100
 */

// ─────────────────────────────────────────────
//  MEMBERSHIP FUNCTION PRIMITIVES
// ─────────────────────────────────────────────

/**
 * Triangular membership function
 * Returns degree of membership for value x in triangle (a, b, c)
 *   a = left foot, b = peak, c = right foot
 */
export function triangularMF(x, a, b, c) {
  if (x <= a || x >= c) return 0
  if (x <= b) return (x - a) / (b - a)
  return (c - x) / (c - b)
}

/**
 * Trapezoidal membership function — flat top between b and c
 *   a = left foot, b = left shoulder, c = right shoulder, d = right foot
 */
export function trapMF(x, a, b, c, d) {
  if (x <= a || x >= d) return 0
  if (x >= b && x <= c) return 1
  if (x < b) return (x - a) / (b - a)
  return (d - x) / (d - c)
}

// ─────────────────────────────────────────────
//  FUZZIFICATION
// ─────────────────────────────────────────────

/**
 * Fuzzify Signal Strength
 * Input range: -90 dBm to -30 dBm
 * Normalize to 0..1 internally for cleaner MF definitions
 */
export function fuzzifySignal(dBm) {
  const x = (dBm - (-90)) / 60   // normalise to [0..1]
  return {
    weak:   trapMF(x,   0,    0,    0.25, 0.50),
    medium: triangularMF(x,   0.25, 0.50, 0.75),
    strong: trapMF(x,   0.50, 0.75, 1.0,  1.0),
  }
}

/**
 * Fuzzify Noise Level
 * Input range: 0 dB to 60 dB
 */
export function fuzzifyNoise(dB) {
  const x = dB / 60   // normalise to [0..1]
  return {
    low:    trapMF(x,   0,    0,    0.25, 0.50),
    medium: triangularMF(x,   0.25, 0.50, 0.75),
    high:   trapMF(x,   0.50, 0.75, 1.0,  1.0),
  }
}

/**
 * Fuzzify Traffic Load
 * Input range: 0% to 100%
 */
export function fuzzifyTraffic(pct) {
  const x = pct / 100   // normalise to [0..1]
  return {
    low:    trapMF(x,   0,    0,    0.25, 0.50),
    medium: triangularMF(x,   0.25, 0.50, 0.75),
    high:   trapMF(x,   0.50, 0.75, 1.0,  1.0),
  }
}

// ─────────────────────────────────────────────
//  FUZZY RULE BASE
// ─────────────────────────────────────────────
//
//  Each rule:  { id, antecedent: [signal, noise, traffic], consequent, label }
//  Consequent is a singleton value (centre of each output set):
//    poor=12.5,  average=37.5,  good=62.5,  excellent=87.5
//
//  Activation strength = min(membership of all antecedents)   [Mamdani AND]
//

export const RULES = [
  // ── Signal: Strong ──
  { id: 1,  sig: 'strong', noi: 'low',    trf: 'low',    out: 'excellent', outVal: 95.0 },
  { id: 2,  sig: 'strong', noi: 'low',    trf: 'medium', out: 'excellent', outVal: 88.0 },
  { id: 3,  sig: 'strong', noi: 'low',    trf: 'high',   out: 'good',      outVal: 72.0 },
  { id: 4,  sig: 'strong', noi: 'medium', trf: 'low',    out: 'excellent', outVal: 85.0 },
  { id: 5,  sig: 'strong', noi: 'medium', trf: 'medium', out: 'good',      outVal: 75.0 },
  { id: 6,  sig: 'strong', noi: 'medium', trf: 'high',   out: 'average',   outVal: 58.0 },
  { id: 7,  sig: 'strong', noi: 'high',   trf: 'low',    out: 'good',      outVal: 65.0 },
  { id: 8,  sig: 'strong', noi: 'high',   trf: 'medium', out: 'average',   outVal: 50.0 },
  { id: 9,  sig: 'strong', noi: 'high',   trf: 'high',   out: 'average',   outVal: 40.0 },

  // ── Signal: Medium ──
  { id: 10, sig: 'medium', noi: 'low',    trf: 'low',    out: 'good',      outVal: 78.0 },
  { id: 11, sig: 'medium', noi: 'low',    trf: 'medium', out: 'good',      outVal: 68.0 },
  { id: 12, sig: 'medium', noi: 'low',    trf: 'high',   out: 'average',   outVal: 55.0 },
  { id: 13, sig: 'medium', noi: 'medium', trf: 'low',    out: 'good',      outVal: 65.0 },
  { id: 14, sig: 'medium', noi: 'medium', trf: 'medium', out: 'average',   outVal: 50.0 },
  { id: 15, sig: 'medium', noi: 'medium', trf: 'high',   out: 'poor',      outVal: 35.0 },
  { id: 16, sig: 'medium', noi: 'high',   trf: 'low',    out: 'average',   outVal: 45.0 },
  { id: 17, sig: 'medium', noi: 'high',   trf: 'medium', out: 'poor',      outVal: 30.0 },
  { id: 18, sig: 'medium', noi: 'high',   trf: 'high',   out: 'poor',      outVal: 20.0 },

  // ── Signal: Weak ──
  { id: 19, sig: 'weak',   noi: 'low',    trf: 'low',    out: 'average',   outVal: 50.0 },
  { id: 20, sig: 'weak',   noi: 'low',    trf: 'medium', out: 'average',   outVal: 40.0 },
  { id: 21, sig: 'weak',   noi: 'low',    trf: 'high',   out: 'poor',      outVal: 28.0 },
  { id: 22, sig: 'weak',   noi: 'medium', trf: 'low',    out: 'average',   outVal: 38.0 },
  { id: 23, sig: 'weak',   noi: 'medium', trf: 'medium', out: 'poor',      outVal: 25.0 },
  { id: 24, sig: 'weak',   noi: 'medium', trf: 'high',   out: 'poor',      outVal: 15.0 },
  { id: 25, sig: 'weak',   noi: 'high',   trf: 'low',    out: 'poor',      outVal: 22.0 },
  { id: 26, sig: 'weak',   noi: 'high',   trf: 'medium', out: 'poor',      outVal: 10.0 },
  { id: 27, sig: 'weak',   noi: 'high',   trf: 'high',   out: 'poor',      outVal: 5.0  },
]

// ─────────────────────────────────────────────
//  INFERENCE ENGINE
// ─────────────────────────────────────────────

/**
 * Main inference function.
 * @param {number} signal  — dBm in [-90, -30]
 * @param {number} noise   — dB  in [0, 60]
 * @param {number} traffic — %   in [0, 100]
 * @returns {{ score, category, activeRules, memberships }}
 */
export function computeReliability(signal, noise, traffic) {
  // 1. FUZZIFICATION
  const S = fuzzifySignal(signal)
  const N = fuzzifyNoise(noise)
  const T = fuzzifyTraffic(traffic)

  const memberships = { signal: S, noise: N, traffic: T }

  // 2. RULE EVALUATION  (Mamdani min AND)
  const activeRules = RULES.map(rule => {
    const strength = Math.min(S[rule.sig], N[rule.noi], T[rule.trf])
    return { ...rule, strength: +strength.toFixed(4) }
  }).filter(r => r.strength > 0.001)

  // 3. DEFUZZIFICATION  (weighted average / centre of gravity for singletons)
  let weightedSum = 0
  let totalWeight = 0

  for (const rule of activeRules) {
    weightedSum += rule.strength * rule.outVal
    totalWeight += rule.strength
  }

  // Fallback: if no rule fires significantly, use midpoint
  const rawScore = totalWeight < 0.001 ? 50 : weightedSum / totalWeight

  // 4. CLAMP to [0, 100]
  const score = Math.min(100, Math.max(0, rawScore))

  // 5. DETERMINE CATEGORY
  const category = scoreToCategory(score)

  return { score, category, activeRules, memberships }
}

/**
 * Map crisp score to reliability category
 */
export function scoreToCategory(score) {
  if (score <= 25)  return 'poor'
  if (score <= 50)  return 'average'
  if (score <= 75)  return 'good'
  return 'excellent'
}

// ─────────────────────────────────────────────
//  CATEGORY META
// ─────────────────────────────────────────────

export const CATEGORY_META = {
  poor:      { label: 'Poor',      color: '#f43f5e', hex: 'signal-poor',      range: '0–25%',   ring: 'rgba(244,63,94,0.3)' },
  average:   { label: 'Average',   color: '#fb923c', hex: 'signal-average',   range: '26–50%',  ring: 'rgba(251,146,60,0.3)' },
  good:      { label: 'Good',      color: '#38bdf8', hex: 'signal-good',      range: '51–75%',  ring: 'rgba(56,189,248,0.3)' },
  excellent: { label: 'Excellent', color: '#34d399', hex: 'signal-excellent', range: '76–100%', ring: 'rgba(52,211,153,0.3)' },
}

// ─────────────────────────────────────────────
//  QUICK SCENARIOS
// ─────────────────────────────────────────────

export const SCENARIOS = [
  { name: 'Urban Peak',    icon: '🏙️', signal: -75, noise: 45, traffic: 90, desc: 'Dense urban, heavy congestion' },
  { name: 'Remote Area',   icon: '🏔️', signal: -88, noise: 8,  traffic: 5,  desc: 'Weak signal, isolated location' },
  { name: 'Office Normal', icon: '🏢', signal: -55, noise: 22, traffic: 45, desc: 'Typical indoor environment' },
  { name: 'Ideal Link',    icon: '🌟', signal: -35, noise: 5,  traffic: 8,  desc: 'Near-perfect conditions' },
  { name: 'Noisy Channel', icon: '📡', signal: -50, noise: 55, traffic: 30, desc: 'Severe interference present' },
  { name: 'Peak Load',     icon: '⚡', signal: -45, noise: 20, traffic: 98, desc: 'Maximum traffic saturation' },
]
