import { cn } from "@/lib/utils"

interface MainWrapperProps {
  children: React.ReactNode
  className?: string
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </div>
    </main>
  )
} 