'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { NotificationsMenu } from "@/components/notifications"
import { Menu, X } from "lucide-react"

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  username?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })

      if (!response.ok) {
        setUser(null)
        return
      }

      const data = await response.json()
      
      if (data.user) {
        // Clean up the username by removing extra @ symbols if present
        if (data.user.username) {
          data.user.username = data.user.username.replace(/^@+/, '@')
        }
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Add event listener for auth changes
  useEffect(() => {
    checkAuth()

    // Listen for auth changes
    window.addEventListener('auth-change', checkAuth)
    
    return () => {
      window.removeEventListener('auth-change', checkAuth)
    }
  }, [])

  return (
    <div className="h-[64px] fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center">
        <div className="mr-4 flex items-center justify-between flex-1 md:flex-none">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">NEXUSHUB</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className={`${
          isMenuOpen 
            ? 'absolute top-[64px] left-0 right-0 border-b bg-background p-4 md:p-0 md:border-none' 
            : 'hidden'
          } md:flex flex-1 flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 space-x-0 md:space-x-2 md:justify-end`}>
          <nav className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 space-x-0 md:space-x-6 w-full md:w-auto">
            <Link
              href="/discover"
              className="transition-colors hover:text-foreground/80 w-full md:w-auto"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            <Link
              href="/find-a-mentor"
              className="transition-colors hover:text-foreground/80 w-full md:w-auto"
              onClick={() => setIsMenuOpen(false)}
            >
              Find a Mentor
            </Link>
            <Link
              href="/book-a-session"
              className="transition-colors hover:text-foreground/80 w-full md:w-auto"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Session
            </Link>
          </nav>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <>
                <NotificationsMenu />
                <UserNav user={user} />
              </>
            ) : (
              <Link href="/login" className="w-full md:w-auto" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full md:w-auto">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

