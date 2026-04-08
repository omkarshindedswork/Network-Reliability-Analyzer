import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(4,5,15,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
      <div style={{ color: '#64748b', marginBottom: 2 }}>{payload[0]?.payload?.subject}</div>
      <div style={{ color: '#818cf8', fontWeight: 700 }}>{payload[0]?.value?.toFixed(1)}%</div>
    </div>
  )
}

export default function InputRadarChart({ signal, noise, traffic }) {
  const data = [
    { subject: 'Signal',  value: ((signal + 90) / 60) * 100 },
    { subject: 'Noise',   value: (noise / 60) * 100 },
    { subject: 'Traffic', value: traffic },
  ]
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <defs>
          <radialGradient id="rfill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#5b79f0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5b79f0" stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <PolarGrid stroke="rgba(255,255,255,0.07)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11, fontFamily: 'DM Sans, sans-serif' }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} tickLine={false} />
        <Radar dataKey="value" stroke="#5b79f0" strokeWidth={2} fill="url(#rfill)" dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
