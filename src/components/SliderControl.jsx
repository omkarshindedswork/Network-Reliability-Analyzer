import { useState } from 'react'
import { Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SliderControl({ label, icon: Icon, value, min, max, step = 1, unit, onChange, tooltip, accentColor = '#818cf8', formatValue }) {
  const [showTip, setShowTip] = useState(false)
  const pct = ((value - min) / (max - min)) * 100
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`

  return (
    <motion.div whileHover={{ scale: 1.005 }} style={{ background: 'rgba(13,18,37,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '18px 20px', position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
          {Icon && (
            <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${accentColor}20`, border: `1px solid ${accentColor}44` }}>
              <Icon size={14} color={accentColor} />
            </div>
          )}
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13, color: '#e2e8f0' }}>{label}</span>
          <button onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, display: 'flex' }}>
            <Info size={12} color="#475569" />
          </button>
          <AnimatePresence>
            {showTip && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 99, width: 220, padding: '10px 12px', borderRadius: 12, fontSize: 11, color: '#94a3b8', lineHeight: 1.6, background: 'rgba(4,5,15,0.97)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: 4 }}>{label}</div>
                {tooltip}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 13, padding: '3px 10px', borderRadius: 8, background: `${accentColor}18`, border: `1px solid ${accentColor}40`, color: accentColor }}>
          {displayValue}
        </div>
      </div>

      {/* Slider track */}
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', height: 4, borderRadius: 2, width: `${pct}%`, background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`, boxShadow: `0 0 8px ${accentColor}66`, transition: 'width 0.08s' }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)}
          style={{ position: 'absolute', width: '100%', opacity: 0, cursor: 'pointer', height: 20, zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `calc(${pct}% - 9px)`, width: 18, height: 18, borderRadius: '50%', background: 'white', border: `2px solid ${accentColor}`, boxShadow: `0 0 14px ${accentColor}AA`, pointerEvents: 'none', transition: 'left 0.08s' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </motion.div>
  )
}
