"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

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

export function RecentSessions({ userId, role }: { userId: string, role: string }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/sessions`)
        const data = await response.json()
        setSessions(data.sessions)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load sessions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [userId])

  if (loading) {
    return <SessionsSkeleton />
  }

  return (
    <div className="space-y-6">
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No sessions yet
          </CardContent>
        </Card>
      ) : (
        sessions.map((session, index) => (
          <motion.div
            key={session._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    Session with {role === 'mentor' ? session.mentee.name : session.mentor.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(session.date), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.time}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    session.status === 'completed' ? 'default' :
                    session.status === 'scheduled' ? 'secondary' :
                    'destructive'
                  }
                >
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage 
                      src={role === 'mentor' ? session.mentee.avatar : session.mentor.avatar} 
                      alt={role === 'mentor' ? session.mentee.name : session.mentor.name}
                    />
                    <AvatarFallback>
                      {(role === 'mentor' ? session.mentee.name : session.mentor.name)[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {role === 'mentor' ? session.mentee.name : session.mentor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {role === 'mentor' ? 'Mentee' : 'Mentor'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}

function SessionsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="animate-pulse bg-muted h-16" />
          <CardContent className="animate-pulse bg-muted h-20 mt-4" />
        </Card>
      ))}
    </div>
  )
} 