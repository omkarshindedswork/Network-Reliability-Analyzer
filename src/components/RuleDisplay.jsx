import { motion } from 'framer-motion'
import { RULES, CATEGORY_META } from '../logic/FuzzyEngine'

export default function RuleDisplay({ activeRules }) {
  const rMap = Object.fromEntries((activeRules || []).map(r => [r.id, r]))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {RULES.map(rule => {
        const active = rMap[rule.id]
        const str = active?.strength ?? 0
        const meta = CATEGORY_META[rule.out]
        return (
          <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 10, fontSize: 11, transition: 'all 0.3s',
            background: str > 0.01 ? `${meta.color}0c` : 'transparent',
            border: `1px solid ${str > 0.01 ? meta.color + '30' : 'rgba(255,255,255,0.05)'}`,
            opacity: str > 0.01 ? 1 : 0.3 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#334155', minWidth: 20, fontSize: 10 }}>R{rule.id}</span>
            <span style={{ color: '#64748b', flex: 1, fontFamily: 'DM Sans, sans-serif', fontSize: 11 }}>{rule.sig} + {rule.noi} + {rule.trf}</span>
            <span style={{ color: meta.color, fontWeight: 700, minWidth: 52, fontFamily: 'DM Sans, sans-serif', fontSize: 11 }}>{meta.label}</span>
            <div style={{ width: 50, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${str * 100}%` }} transition={{ duration: 0.3 }}
                style={{ height: '100%', background: 'linear-gradient(90deg,#5b79f0,#22d3ee)' }} />
            </div>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569', minWidth: 28, textAlign: 'right', fontSize: 10 }}>
              {str > 0.001 ? (str * 100).toFixed(0) + '%' : '—'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
