import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌟</span>
          <span className="font-bold text-xl">NEXUSHUB</span>
        </div>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
          Features
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#solutions">
          Solutions
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#resources">
          Resources
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
          Pricing
        </Link>
      </nav>
      <Button className="ml-4" variant="default">
        Join Now
      </Button>
    </header>
  )
}

