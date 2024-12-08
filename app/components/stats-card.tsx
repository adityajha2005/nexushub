export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
      <div className="text-lg sm:text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</div>
    </div>
  )
} 