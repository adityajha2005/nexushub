export function Container({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      "max-w-7xl",
      className
    )}>
      {children}
    </div>
  )
} 