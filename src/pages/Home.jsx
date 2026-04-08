import { motion } from 'framer-motion'
import { ArrowRight, Activity, Cpu, Network, BarChart3 } from 'lucide-react'

const S = {
  page: { minHeight: '100vh', background: '#04050f', color: 'white', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden', position: 'relative' },
  grid: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(91,121,240,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(91,121,240,0.07) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' },
  glow1: { position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '50vh', background: 'radial-gradient(ellipse at center top,rgba(91,121,240,0.18) 0%,transparent 60%)', pointerEvents: 'none' },
  orb1: { position: 'absolute', top: '30%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,#5b79f0,transparent)', opacity: 0.12, filter: 'blur(60px)', pointerEvents: 'none' },
  orb2: { position: 'absolute', top: '50%', right: '-10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,#22d3ee,transparent)', opacity: 0.1, filter: 'blur(60px)', pointerEvents: 'none' },
}

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } })

const FEATURES = [
  { icon: Cpu,       title: 'Fuzzy Inference Engine',     desc: '15 Mamdani IF-THEN rules with triangular and trapezoidal membership functions evaluate signal, noise, and traffic simultaneously.', accent: '#5b79f0' },
  { icon: Network,   title: 'Network Parameter Analysis', desc: 'Three crisp inputs—signal strength (dBm), interference noise (dB), and link utilization (%)—are fuzzified into linguistic variables.', accent: '#22d3ee' },
  { icon: BarChart3, title: 'Real-Time Reliability Score', desc: 'Centre-of-gravity defuzzification produces a crisp 0–100% score mapped to Poor / Average / Good / Excellent quality tiers.', accent: '#34d399' },
]

export default function Home({ onStart }) {
  return (
    <div style={S.page}>
      <div style={S.grid} />
      <div style={S.glow1} />
      <div style={S.orb1} />
      <div style={S.orb2} />

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(91,121,240,0.25)', border: '1px solid rgba(91,121,240,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={13} color="#818cf8" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>FuzzyLink</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
          System Online
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 24px 60px' }}>
        <motion.div {...fadeUp(0.05)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, border: '1px solid rgba(91,121,240,0.3)', background: 'rgba(91,121,240,0.08)', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#818cf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>AI-Inspired · Academic Research Project</span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(44px,8vw,88px)', lineHeight: 0.95, letterSpacing: '-0.03em', margin: 0 }}>
          <span style={{ color: 'white' }}>Fuzzy Logic</span><br />
          <span style={{ background: 'linear-gradient(135deg,#818cf8 0%,#5b79f0 30%,#22d3ee 70%,#34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Link Simulator
          </span>
        </motion.h1>

        <motion.p {...fadeUp(0.18)} style={{ marginTop: 24, fontSize: 'clamp(14px,2vw,17px)', color: '#64748b', maxWidth: 500, lineHeight: 1.65 }}>
          Estimate communication link reliability in real time using a complete fuzzy inference system with 15 rules and centre-of-gravity defuzzification.
        </motion.p>

        <motion.div {...fadeUp(0.26)} style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
          <motion.button onClick={onStart} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'white', background: 'linear-gradient(135deg,#3d5ce8,#5b79f0)', boxShadow: '0 0 40px rgba(91,121,240,0.35), 0 8px 24px rgba(0,0,0,0.3)' }}>
            Launch Simulator <ArrowRight size={16} />
          </motion.button>
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#334155' }}>No setup · Runs in browser</span>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto 60px', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {[{ val: '15', lbl: 'Fuzzy Rules' }, { val: '3', lbl: 'Input Vars' }, { val: '4', lbl: 'Output Sets' }, { val: '∞', lbl: 'Real-Time' }].map(({ val, lbl }) => (
            <div key={lbl} style={{ background: 'rgba(13,18,37,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 16px', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'white' }}>{val}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Feature cards */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#334155', letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 24 }}>How It Works</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
          {FEATURES.map(({ icon: Icon, title, desc, accent }) => (
            <div key={title} style={{ background: 'rgba(13,18,37,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent}60,transparent)` }} />
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={17} color={accent} />
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#e2e8f0', marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </motion.section>

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingBottom: 32, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#1e293b' }}>
        Academic Research Project · Fuzzy Logic Systems · Communication Engineering
      </div>
    </div>
  )
}
