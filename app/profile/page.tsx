"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Pencil, User2, Mail, AtSign, BookOpen, Code2, ExternalLink } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { skillCategories, getSkillCategory } from "@/lib/data/skills"

interface User {
  name?: string
  email?: string
  username?: string
  bio?: string
  skills?: string[]
  avatar?: string
  role?: 'user' | 'mentor' | 'mentee' | 'admin'
  title?: string
  connections?: string[]
  sessionsCompleted?: number
  rating?: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) return <ProfileSkeleton />

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
              <AvatarFallback className="text-4xl">{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-3xl font-bold">{user?.name || "Anonymous User"}</h1>
              <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">@{user?.username || "username"}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant="secondary" className="px-3 py-1">
                <User2 className="h-3 w-3 mr-1" />
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "Member"}
              </Badge>
              {user?.title && (
                <Badge variant="outline" className="px-3 py-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {user.title}
                </Badge>
              )}
            </div>
          </div>

          <Button 
            onClick={() => router.push('/profile-setup')}
            variant="outline"
            className="absolute top-4 right-4"
            size="icon"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div 
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {user?.bio || "No bio provided yet. Tell others about yourself!"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Skills</CardTitle>
              <Code2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px] pr-4">
                {Object.entries(skillCategories).map(([key, category]) => {
                  const categorySkills = user?.skills?.filter(skill => 
                    category.skills.includes(skill)
                  ) || []
                  
                  if (categorySkills.length === 0) return null

                  return (
                    <div key={key} className="mb-6 last:mb-0">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        {category.label}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map(skill => (
                          <Badge 
                            key={skill} 
                            variant="secondary"
                            className="px-3 py-1 hover:bg-secondary/80 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {(!user?.skills || user.skills.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">
                    No skills added yet. Add your skills to help others find you!
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats & Quick Actions */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {user?.role === 'mentor' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold">{user.sessionsCompleted || 0}</p>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <p className="text-2xl font-bold">{user.connections?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Connections</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full mb-3"
                onClick={() => router.push('/profile-setup')}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/profile/${user?.username}`)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Public View
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center animate-pulse">
          <div className="h-32 w-32 rounded-full bg-muted" />
          <div className="space-y-4 flex-1">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-32" />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-40 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}