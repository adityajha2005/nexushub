import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  username?: string;
  avatar?: string;
}

export function UserNav({ user }: { user: User }) {
  const router = useRouter()

  // Safety check
  if (!user) {
    return null
  }

  const handleLogout = async () => {
    try {
      // Clear the token cookie
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      
      // Force reload to clear all state
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Safely get display text
  const displayName = user.name || user.username || user.email
  const initial = displayName ? displayName[0].toUpperCase() : 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar>
          <AvatarImage 
            src={user.avatar || "/placeholder.svg"} 
            alt={displayName}
          />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard')}>
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 