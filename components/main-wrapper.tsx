import { cn } from "@/lib/utils"

interface MainWrapperProps {
  children: React.ReactNode
  className?: string
}

export function MainWrapper({ children, className }: MainWrapperProps) {
  return (
    <main className={cn("pt-[64px] min-h-screen", className)}>
      {children}
    </main>
  )
} 