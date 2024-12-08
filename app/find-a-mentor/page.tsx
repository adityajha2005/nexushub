"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

type Mentor = {
  _id: string
  name: string
  expertise: string[]
  experience?: number
  rating: number
  avatar: string
  connectionStatus: 'none' | 'pending' | 'connected'
  isConnecting?: boolean
}

const containerVariants = {
  hidden: { opacity:0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  },
  hover: { 
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  },
  tap: { 
    scale: 0.98 
  }
}

export default function FindAMentor() {
  const [searchQuery, setSearchQuery] = useState("")
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/mentors')
        const text = await response.text() // First get the raw text
        
        console.log('Raw response:', text) // Log the raw response
        
        try {
          const data = JSON.parse(text) // Then try to parse it
          if (response.ok) {
            if (Array.isArray(data.mentors)) {
              setMentors(data.mentors)
            } else {
              console.error('Mentors data is not an array:', data)
              toast({
                title: "Error",
                description: "Invalid data format received from server",
                variant: "destructive",
              })
            }
          } else {
            throw new Error(data.message || 'Failed to fetch mentors')
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError)
          console.error('Response text:', text)
          toast({
            title: "Error",
            description: "Invalid response format from server",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Fetch error:', error)
        toast({
          title: "Error",
          description: "Failed to load mentors. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMentors()
  }, [toast])

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleScheduleSession = (mentorId: string) => {
    router.push(`/book-a-session?mentor=${mentorId}`)
  }

  const handleConnect = async (mentorId: string) => {
    try {
      setMentors(prevMentors => 
        prevMentors.map(mentor => 
          mentor._id === mentorId 
            ? { ...mentor, isConnecting: true }
            : mentor
        )
      )

      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ mentorId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMentors(prevMentors => 
          prevMentors.map(mentor => 
            mentor._id === mentorId 
              ? { ...mentor, isConnecting: false }
              : mentor
          )
        )
        throw new Error(data.message || 'Failed to send connection request')
      }

      setMentors(prevMentors => 
        prevMentors.map(mentor => 
          mentor._id === mentorId 
            ? { ...mentor, connectionStatus: 'pending', isConnecting: false }
            : mentor
        )
      )

      toast({
        title: "Connection Request Sent",
        description: "The mentor will be notified of your request",
        duration: 5000,
      })
    } catch (error) {
      console.error('Connection error:', error)
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to send connection request. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 pt-20">Loading mentors...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container pt-24 pb-8">
        <motion.div 
         className="container py-8"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold mb-8">Find a Mentor</h1>
            <Input
              type="search"
              placeholder="Search mentors by name or expertise..."
              className="mb-8 max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredMentors.map((mentor) => (
                <motion.div
                  key={mentor._id}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  layout
                  layoutId={mentor._id}
                >
                  <Card className="h-full">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={mentor.avatar} 
                            alt={mentor.name}
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                          <AvatarFallback className="bg-primary/10">
                            {mentor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div>
                        <CardTitle>{mentor.name}</CardTitle>
                        <CardDescription>
                          {mentor.experience ? `${mentor.experience} years experience` : 'Experience not specified'}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <motion.div 
                        className="flex flex-wrap gap-2 mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {mentor.expertise.map((skill, index) => (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Badge 
                              variant="secondary"
                              className="transition-all hover:scale-105"
                            >
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge 
                          variant="outline" 
                          className="bg-green-50 text-green-700"
                        >
                          Available
                        </Badge>
                      </motion.div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <motion.div 
                        className="flex-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="w-full"
                          onClick={() => handleScheduleSession(mentor._id)}
                        >
                          Schedule Session
                        </Button>
                      </motion.div>
                      <motion.div 
                        className="flex-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => handleConnect(mentor._id)}
                          disabled={mentor.connectionStatus !== 'none' || mentor.isConnecting}
                        >
                          <motion.span
                            initial={false}
                            animate={{ 
                              scale: mentor.connectionStatus === 'pending' ? [1, 1.1, 1] : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {mentor.isConnecting ? 'Connecting...' :
                             mentor.connectionStatus === 'connected' ? 'Connected' :
                             mentor.connectionStatus === 'pending' ? 'Request Sent' :
                             'Connect'}
                          </motion.span>
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 