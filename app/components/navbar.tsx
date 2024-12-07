import { NotificationsDropdown } from "@/components/notifications"

// ... other imports ...

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* ... other navbar items ... */}
        
        <div className="flex items-center gap-4">
          <NotificationsDropdown />
          {/* ... other navbar items ... */}
        </div>
      </div>
    </header>
  )
} 