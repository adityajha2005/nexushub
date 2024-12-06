"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface User {
  name?: string
  email?: string
  username?: string
  bio?: string
  skills?: string[]
  avatar?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        const data = await response.json()

        if (response.ok && data.user) {
          setUser(data.user)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.[0] || user.email?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name || "Anonymous User"}</CardTitle>
            <p className="text-sm text-muted-foreground">@{user.username || "username"}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Bio</h3>
            <p className="text-muted-foreground">{user.bio || "No bio provided"}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              )) || "No skills listed"}
            </div>
          </div>

          <Button 
            className="w-full mt-4"
            onClick={() => router.push('/profile-setup')}
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}