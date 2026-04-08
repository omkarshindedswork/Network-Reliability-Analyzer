import { useEffect, useRef, useState } from 'react'
import { CATEGORY_META } from '../logic/FuzzyEngine'

function AnimNum({ value }) {
  const [disp, setDisp] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef()
  useEffect(() => {
    const from = fromRef.current, to = value, dur = 550, t0 = performance.now()
    const tick = now => {
      const t = Math.min((now - t0) / dur, 1)
      const e = t < .5 ? 2*t*t : -1+(4-2*t)*t
      setDisp(+(from + (to - from) * e).toFixed(1))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])
  return <>{disp}</>
}

export default function ReliabilityGauge({ score, category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.average
  const CX = 115, CY = 110, R = 88
  const START = -220, SWEEP = 260
  const toRad = d => d * Math.PI / 180
  const pt = (a, r = R) => ({ x: CX + r * Math.cos(toRad(a)), y: CY + r * Math.sin(toRad(a)) })
  const arcD = (a0, a1, r = R) => {
    const s = pt(a0, r), e = pt(a1, r), large = (a1 - a0) > 180 ? 1 : 0
    return `M${s.x.toFixed(2)} ${s.y.toFixed(2)} A${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
  }

  const scoreAngle = START + (score / 100) * SWEEP
  const needle = pt(scoreAngle, R - 22)
  const ticks = [0, 25, 50, 75, 100].map(v => START + (v / 100) * SWEEP)
  const segs = [
    [START, START + SWEEP / 4, '#f43f5e'],
    [START + SWEEP / 4, START + SWEEP / 2, '#fb923c'],
    [START + SWEEP / 2, START + 3 * SWEEP / 4, '#38bdf8'],
    [START + 3 * SWEEP / 4, START + SWEEP, '#34d399'],
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 240, height: 200 }}>
        <svg viewBox="0 0 230 185" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="gn"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="ga"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <path d={arcD(START, START + SWEEP)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" strokeLinecap="round" />
          {segs.map(([a, b, c], i) => <path key={i} d={arcD(a, b)} fill="none" stroke={c} strokeWidth="5" opacity="0.18" />)}
          <path d={arcD(START, scoreAngle)} fill="none" stroke={meta.color} strokeWidth="10" strokeLinecap="round" filter="url(#ga)"
            style={{ transition: 'stroke 0.4s' }} />
          {ticks.map((a, i) => { const o = pt(a, R + 8), inn = pt(a, R - 2); return <line key={i} x1={o.x} y1={o.y} x2={inn.x} y2={inn.y} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" /> })}
          {[0, 25, 50, 75, 100].map(v => { const a = START + (v / 100) * SWEEP, p = pt(a, R + 20); return <text key={v} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fill="rgba(148,163,184,0.4)" fontSize="8" fontFamily="JetBrains Mono">{v}</text> })}
          <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke="white" strokeWidth="2.5" strokeLinecap="round" filter="url(#gn)"
            style={{ transition: 'x2 0.6s cubic-bezier(0.34,1.56,0.64,1), y2 0.6s cubic-bezier(0.34,1.56,0.64,1)' }} />
          <circle cx={CX} cy={CY} r="5" fill={meta.color} style={{ filter: `drop-shadow(0 0 6px ${meta.color})`, transition: 'fill 0.4s' }} />
          <circle cx={CX} cy={CY} r="2.5" fill="white" />
        </svg>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', pointerEvents: 'none' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 40, lineHeight: 1, color: meta.color, textShadow: `0 0 24px ${meta.color}60`, transition: 'color 0.4s' }}>
            <AnimNum value={+score.toFixed(1)} /><span style={{ fontSize: 18, marginLeft: 2 }}>%</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 4, padding: '7px 24px', borderRadius: 20, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, letterSpacing: '0.03em', background: `${meta.color}18`, border: `1.5px solid ${meta.color}50`, color: meta.color, boxShadow: `0 0 20px ${meta.color}28`, transition: 'all 0.4s' }}>
        {meta.label}
      </div>
      <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>{meta.range}</div>
    </div>
  )
}
