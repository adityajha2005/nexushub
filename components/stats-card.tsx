import { CountUp } from './count-up'

interface StatsCardProps {
  label: string
  value: string | number
  description?: string
}

export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 transition-all hover:scale-105">
      <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
      <div className="text-3xl font-bold mb-2">
        {typeof value === 'number' ? <CountUp end={value} /> : value}
      </div>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  )
}

