import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Signal, Volume2, Gauge, ArrowLeft, RefreshCcw, Shuffle, Activity, Layers, ListChecks, ChevronDown, ChevronUp } from 'lucide-react'
import { useFuzzy } from '../hooks/useFuzzy'
import { SCENARIOS, CATEGORY_META } from '../logic/FuzzyEngine'
import SliderControl from '../components/SliderControl'
import ReliabilityGauge from '../components/ReliabilityGauge'
import MembershipChart from '../components/MembershipChart'
import InputRadarChart from '../components/InputRadarChart'
import RuleDisplay from '../components/RuleDisplay'

const glass = { background: 'rgba(13,18,37,0.72)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, backdropFilter: 'blur(20px)' }
const sLabel = { fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#334155', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 14 }

function Panel({ title, icon: Icon, accent = '#5b79f0', children, collapsible = false }) {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ ...glass, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none', borderTop: `2px solid ${accent}60` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={13} color={accent} />}
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 11, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{title}</span>
        </div>
        {collapsible && (
          <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ padding: 18 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MiniMems({ label, values, keys, colors }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{label}</div>
      {keys.map((k, i) => (
        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: '#475569', width: 44, textTransform: 'capitalize', fontFamily: 'DM Sans, sans-serif' }}>{k}</span>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${values[k] * 100}%` }} transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 3, background: colors[i], boxShadow: `0 0 4px ${colors[i]}90` }} />
          </div>
          <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#475569', width: 28, textAlign: 'right' }}>
            {(values[k] * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard({ onBack }) {
  const { params, result, history, setSignal, setNoise, setTraffic, reset, randomize, applyScenario } = useFuzzy()
  const [tab, setTab] = useState('analytics')
  const meta = result ? CATEGORY_META[result.category] : CATEGORY_META.average

  return (
    <div style={{ minHeight: '100vh', background: '#04050f', color: 'white', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Grid bg */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(91,121,240,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(91,121,240,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70vw', height: '40vh', background: 'radial-gradient(ellipse at center top,rgba(91,121,240,0.08) 0%,transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(4,5,15,0.9)', backdropFilter: 'blur(24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
            <ArrowLeft size={13} /> Back
          </button>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(91,121,240,0.2)', border: '1px solid rgba(91,121,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={12} color="#818cf8" />
            </div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>FuzzyLink</span>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#334155' }}>/simulator</span>
          </div>
        </div>

        {/* Live score chip */}
        <motion.div key={result?.category} initial={{ scale: 0.9, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 12, background: `${meta.color}14`, border: `1px solid ${meta.color}40` }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, display: 'inline-block' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: meta.color }}>{result?.score?.toFixed(1)}%</span>
          <span style={{ fontSize: 11, color: '#475569' }}>· {meta.label}</span>
        </motion.div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[{ label: 'Random', Icon: Shuffle, action: randomize }, { label: 'Reset', Icon: RefreshCcw, action: reset }].map(({ label, Icon, action }) => (
            <button key={label} onClick={action}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
              <Icon size={12} />{label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1440, margin: '0 auto', padding: '20px 16px' }}>

        {/* Scenario pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SCENARIOS.map(s => (
            <motion.button key={s.name} onClick={() => applyScenario(s)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(13,18,37,0.7)', color: '#94a3b8', fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, backdropFilter: 'blur(12px)' }}
              title={s.desc}>
              {s.icon} {s.name}
            </motion.button>
          ))}
        </div>

        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16, alignItems: 'start' }}>

          {/* ── LEFT: Inputs ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Panel title="Input Parameters" icon={Signal} accent="#5b79f0">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <SliderControl label="Signal Strength" icon={Signal} value={params.signal} min={-90} max={-30} unit=" dBm" onChange={setSignal} accentColor="#818cf8"
                  tooltip="Received power in dBm. Near -30 = strong signal. Near -90 = edge of cell range." />
                <SliderControl label="Noise Level" icon={Volume2} value={params.noise} min={0} max={60} unit=" dB" onChange={setNoise} accentColor="#fb923c"
                  tooltip="Channel interference in decibels. 0-15 dB = clean. 45-60 dB = heavy interference." />
                <SliderControl label="Traffic Load" icon={Gauge} value={params.traffic} min={0} max={100} unit="%" onChange={setTraffic} accentColor="#22d3ee"
                  tooltip="Link utilisation 0-100%. Above 75% causes congestion and throughput degradation." />
              </div>
            </Panel>

            {result && (
              <Panel title="Fuzzy Memberships" icon={Layers} accent="#34d399" collapsible>
                <MiniMems label="Signal Strength" values={result.memberships.signal} keys={['weak', 'medium', 'strong']} colors={['#f43f5e', '#fb923c', '#34d399']} />
                <MiniMems label="Noise Level"     values={result.memberships.noise}  keys={['low', 'medium', 'high']}   colors={['#34d399', '#fb923c', '#f43f5e']} />
                <MiniMems label="Traffic Load"    values={result.memberships.traffic} keys={['low', 'medium', 'high']}  colors={['#34d399', '#fb923c', '#f43f5e']} />
              </Panel>
            )}
          </div>

          {/* ── CENTER: Gauge ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ ...glass, borderTop: `2px solid ${meta.color}55`, padding: '22px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 50%,${meta.color}08,transparent 70%)`, pointerEvents: 'none', transition: 'background 0.4s' }} />
              <div style={sLabel}>Reliability Score</div>
              {result && <ReliabilityGauge score={result.score} category={result.category} />}
            </div>

            {/* Category thresholds */}
            <div style={{ ...glass, padding: '18px 20px' }}>
              <div style={sLabel}>Output Categories</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(CATEGORY_META).map(([k, m]) => {
                  const active = result?.category === k
                  return (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, transition: 'all 0.3s', background: active ? `${m.color}10` : 'transparent', border: `1px solid ${active ? m.color + '40' : 'rgba(255,255,255,0.04)'}` }}>
                      <div style={{ width: 9, height: 9, borderRadius: '50%', background: m.color, flexShrink: 0, boxShadow: active ? `0 0 8px ${m.color}` : 'none', transition: 'box-shadow 0.3s' }} />
                      <span style={{ flex: 1, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 12, color: active ? m.color : '#334155', transition: 'color 0.3s' }}>{m.label}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#334155' }}>{m.range}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Rules fired stat */}
            {result && (
              <div style={{ ...glass, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(91,121,240,0.15)', border: '1px solid rgba(91,121,240,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ListChecks size={16} color="#818cf8" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: 'white' }}>
                    {result.activeRules.length}<span style={{ color: '#334155', fontSize: 14, fontWeight: 400 }}>/15</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#475569' }}>Rules Activated</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#334155' }}>Defuzz</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13, color: meta.color }}>{result.score.toFixed(2)}%</div>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Analytics ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ ...glass, overflow: 'hidden' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[{ id: 'analytics', label: 'Analytics' }, { id: 'rules', label: 'Rule Activations' }].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    style={{ flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 12, color: tab === t.id ? '#818cf8' : '#334155', background: tab === t.id ? 'rgba(91,121,240,0.06)' : 'transparent', borderBottom: tab === t.id ? '2px solid #5b79f0' : '2px solid transparent', transition: 'all 0.2s' }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: 18 }}>
                <AnimatePresence mode="wait">
                  {tab === 'analytics' && result ? (
                    <motion.div key="a" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                      <div style={sLabel}>Input Radar</div>
                      <InputRadarChart signal={params.signal} noise={params.noise} traffic={params.traffic} />
                      <div style={{ ...sLabel, marginTop: 20 }}>Membership Bar Chart</div>
                      <MembershipChart memberships={result.memberships} />
                    </motion.div>
                  ) : tab === 'rules' && result ? (
                    <motion.div key="r" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                      <div style={sLabel}>Rule Activation Strengths</div>
                      <RuleDisplay activeRules={result.activeRules} />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            {/* History sparkline */}
            {history.length > 2 && (
              <div style={{ ...glass, padding: '16px 18px' }}>
                <div style={sLabel}>Score History</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
                  {history.slice(-24).map((h, i) => {
                    const m = CATEGORY_META[h.category]
                    return <div key={h.ts} style={{ flex: 1, background: m.color, borderRadius: '2px 2px 0 0', minHeight: 2, height: `${h.score}%`, opacity: 0.4 + i / history.length * 0.6, transition: 'height 0.3s' }} title={`${h.score.toFixed(1)}% — ${m.label}`} />
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: '#334155', marginTop: 6 }}>
                  <span>older</span><span>recent</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
