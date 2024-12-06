'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"

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

  const checkAuth = async () => {
    try {
      console.log('🔵 Navbar auth check started')
      const hasCookie = document.cookie.includes('token')
      console.log('🍪 Token cookie present:', hasCookie)
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })

      if (!response.ok) {
        console.log('❌ Auth check failed with status:', response.status)
        setUser(null)
        return
      }

      const data = await response.json()
      console.log('👤 Auth check successful:', data.user ? 'Yes' : 'No')
      setUser(data.user)
    } catch (error) {
      console.error('🔴 Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div className="h-[64px] fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">NEXUSHUB</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Link
              href="/find-a-mentor"
              className="transition-colors hover:text-foreground/80"
            >
              Find a Mentor
            </Link>
            <Link
              href="/book-a-session"
              className="transition-colors hover:text-foreground/80"
            >
              Book a Session
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <UserNav user={user} />
            ) : (
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

