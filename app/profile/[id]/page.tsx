"use client";
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  Star,
  MessageSquare,
  Calendar,
  Linkedin,
  Github,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface User {
  _id: string
  name: string
  title?: string
  role: string
  verified?: boolean
  avatar?: string
  bio?: string
  skills?: string[]
  linkedin?: string
  github?: string
  website?: string
  sessionsCompleted?: number
  rating?: number
  connections?: string[]
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'reviews'>('overview')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        
        if (response.status === 401) {
          // Unauthorized - redirect to login
          router.push('/login')
          return
        }
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load profile')
        }
        
        if (!data.user) {
          throw new Error('User not found')
        }

        setUser(data.user)
      } catch (error) {
        console.error('Profile fetch error:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load profile",
          variant: "destructive",
        })
        if (error instanceof Error && error.message.includes('login')) {
          router.push('/login')
        } else {
          router.push('/discover')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [params.id, toast, router])

  if (loading) return <ProfileSkeleton />

  if (!user) return null

  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl">
              <AvatarImage 
                src={user?.avatar} 
                alt={user?.name || "User"}
                className="object-cover"
                onError={(e) => {
                  console.log('Avatar failed to load:', user?.avatar);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {user?.name?.split(' ').map(n => n[0]).join('') || "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground text-lg">{user.title}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant={user.role === 'mentor' ? 'default' : 'secondary'} className="text-sm">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
                {user.verified && (
                  <Badge variant="outline" className="text-sm">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {user.role === 'mentor' && (
              <div className="flex gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.sessionsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {user.rating?.toFixed(1) || 'N/A'}
                    {user.rating && <Star className="h-4 w-4 fill-primary text-primary" />}
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.connections?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Connections</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {user.role === 'mentor' && (
              <Button onClick={() => router.push(`/book-a-session?mentor=${user._id}`)}>
                <Calendar className="mr-2 h-4 w-4" />
                Book Session
              </Button>
            )}
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b">
        <nav className="flex gap-4">
          {['overview', 'sessions', 'reviews'].map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className={cn(
                "relative px-4",
                activeTab === tab && "text-primary font-medium before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-primary"
              )}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {activeTab === 'overview' && (
            <>
              {/* Left Column - About & Skills */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{user.bio || 'No bio provided'}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Contact & Social */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Social</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.linkedin && (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub Profile</span>
                    </a>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                      <span>Personal Website</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'sessions' && (
            <div className="md:col-span-3">
              <RecentSessions userId={user._id} role={user.role} />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="md:col-span-3">
              <UserReviews userId={user._id} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="container py-8 space-y-8">
      {/* Hero Section Skeleton */}
      <div className="relative rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar Skeleton */}
          <div className="h-40 w-40 rounded-full bg-muted animate-pulse" />

          {/* Info Skeleton */}
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="flex gap-2 justify-center md:justify-start">
                <div className="h-5 w-20 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-6 justify-center md:justify-start">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-4 w-14 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation Skeleton */}
      <div className="border-b">
        <nav className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 bg-muted rounded animate-pulse" />
          ))}
        </nav>
      </div>

      {/* Content Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-6 w-36 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-20 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-full bg-muted rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
// </```
// rewritten_file>