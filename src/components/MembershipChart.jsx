import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(4,5,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 12px', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
      <div style={{ color: '#64748b', marginBottom: 2 }}>{payload[0]?.payload?.name}</div>
      <div style={{ color: payload[0]?.fill, fontWeight: 700 }}>{(payload[0]?.value * 100).toFixed(1)}%</div>
    </div>
  )
}

export default function MembershipChart({ memberships }) {
  if (!memberships) return null
  const { signal: S, noise: N, traffic: T } = memberships
  const data = [
    { name: 'Sig Weak',  value: S.weak,   fill: '#f43f5e' },
    { name: 'Sig Med',   value: S.medium, fill: '#fb923c' },
    { name: 'Sig Str',   value: S.strong, fill: '#34d399' },
    { name: 'Noi Low',   value: N.low,    fill: '#34d399' },
    { name: 'Noi Med',   value: N.medium, fill: '#fb923c' },
    { name: 'Noi Hi',    value: N.high,   fill: '#f43f5e' },
    { name: 'Trf Low',   value: T.low,    fill: '#34d399' },
    { name: 'Trf Med',   value: T.medium, fill: '#fb923c' },
    { name: 'Trf Hi',    value: T.high,   fill: '#f43f5e' },
  ]
  return (
    <ResponsiveContainer width="100%" height={170}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 32, left: -20 }} barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: 'rgba(148,163,184,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} angle={-40} textAnchor="end" interval={0} />
        <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fill: 'rgba(148,163,184,0.4)', fontSize: 9, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
