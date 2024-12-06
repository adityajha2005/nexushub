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
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Format username display - remove @ if it exists at the start
  const formatUsername = (username?: string) => {
    if (!username) return ''
    return username.startsWith('@') ? username : `@${username}`
  }

  // Safely get display text
  const displayName = user.name || formatUsername(user.username) || user.email
  const initial = user.name ? user.name[0].toUpperCase() : 
                 user.username ? user.username.replace('@', '')[0].toUpperCase() : 
                 'U'

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