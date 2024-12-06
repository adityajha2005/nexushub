'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Session {
  id: string
  mentor: {
    id: string
    name: string
    avatar?: string
  }
  mentee: {
    id: string
    name: string
    avatar?: string
  }
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/sessions')
        const data = await response.json()
        
        if (response.ok) {
          setSessions(data.sessions)
        } else {
          console.error('Failed to fetch sessions:', data.message)
        }
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'secondary'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'destructive'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <p>Loading sessions...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No sessions booked yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Session with {session.mentor.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.mentor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{session.mentor.name[0]}</AvatarFallback>
                    </Avatar>
                    <Badge variant={getStatusBadgeVariant(session.status)}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Date: {format(new Date(session.date), 'PPP')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Time: {session.time}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 