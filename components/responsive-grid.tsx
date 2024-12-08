interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  columns?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}

export function ResponsiveGrid({
  children,
  className,
  columns = {
    default: 1,
    sm: 2,
    lg: 3,
    xl: 4
  }
}: ResponsiveGridProps) {
  const gridCols = `grid-cols-${columns.default} sm:grid-cols-${columns.sm} lg:grid-cols-${columns.lg} xl:grid-cols-${columns.xl}`
  
  return (
    <div className={cn(
      "grid gap-4 sm:gap-6 lg:gap-8",
      gridCols,
      className
    )}>
      {children}
    </div>
  )
} 