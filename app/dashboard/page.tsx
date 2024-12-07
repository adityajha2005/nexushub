'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getAvatarUrl } from "@/lib/utils/avatar"

interface Session {
  _id: string
  mentor: {
    _id: string
    name: string
    avatar?: string
  }
  mentee: {
    _id: string
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

  const handleCancelSession = async (sessionId: string) => {
    console.log('Attempting to cancel session:', sessionId)
    
    // Optimistically update UI
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session._id === sessionId 
          ? { ...session, status: 'cancelled' }
          : session
      )
    )

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()
      console.log('Cancel response:', data)

      if (!response.ok) {
        // Revert on error
        setSessions(prevSessions => 
          prevSessions.map(session => 
            session._id === sessionId 
              ? { ...session, status: 'scheduled' }
              : session
          )
        )
        throw new Error(data.message || 'Failed to cancel session')
      }

      // Trigger notification refresh
      const event = new CustomEvent('notification-update')
      window.dispatchEvent(event)

      toast({
        title: "Success",
        description: "Session cancelled successfully",
        className: "slide-in-from-right",
      })
    } catch (error) {
      console.error('Cancel session error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel session",
        variant: "destructive",
        className: "shake-animation",
      })
    }
  }

  const getSessionCardClass = (status: string) => {
    return cn(
      "relative overflow-hidden transition-all",
      status === 'cancelled' && "opacity-75"
    )
  }

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted"></div>
            <div>
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-3 w-16 bg-muted rounded mt-2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Your Sessions</h2>
        {sessions.length === 0 ? (
          <EmptyState 
            title="No sessions yet"
            description="Book a session with a mentor to get started"
            action={
              <Button onClick={() => router.push('/find-a-mentor')}>
                Find a Mentor
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <motion.div
                key={session._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={getSessionCardClass(session.status)}
              >
                <Card>
                  {session.status === 'cancelled' && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10" />
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className={cn(
                        session.status === 'cancelled' && "line-through text-muted-foreground"
                      )}>
                        Session with {session.mentor.name}
                      </span>
                      <Badge variant={getStatusBadgeVariant(session.status)}>
                        {session.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {new Date(session.date).toLocaleDateString()} at {session.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage 
                        src={session.mentor.avatar || getAvatarUrl(session.mentor._id)} 
                        alt={session.mentor.name} 
                      />
                      <AvatarFallback>
                        {session.mentor.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.mentor.name}</p>
                      <p className="text-sm text-muted-foreground">Mentor</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive"
                          className="w-full"
                          disabled={session.status !== 'scheduled'}
                        >
                          Cancel Session
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. The session will be cancelled and both parties will be notified.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleCancelSession(session._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, cancel session
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 