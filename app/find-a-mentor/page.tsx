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
  experience: number
  rating: number
  avatar: string
  connectionStatus: 'none' | 'pending' | 'connected'
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
        throw new Error(data.message || 'Failed to send connection request')
      }

      setMentors(prevMentors => 
        prevMentors.map(mentor => 
          mentor._id === mentorId 
            ? { ...mentor, connectionStatus: 'pending' }
            : mentor
        )
      )

      toast({
        title: "Connection Request Sent",
        description: "You can view the status in your notifications",
        duration: 5000,
        className: "slide-in-from-right",
      })
    } catch (error) {
      console.error('Connection error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send connection request",
        variant: "destructive",
        className: "shake-animation",
      })
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 pt-20">Loading mentors...</div>
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Find a Mentor</h1>
        <Input
          type="search"
          placeholder="Search mentors by name or expertise..."
          className="mb-8 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="transform transition-all"
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{mentor.name}</CardTitle>
                    <CardDescription>
                      {mentor.experience} years experience
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
                    {mentor.expertise.map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="transition-all hover:scale-105"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </motion.div>
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 transition-colors duration-300"
                  >
                    Available
                  </Badge>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    className="flex-1 transition-transform duration-200 hover:scale-105"
                    onClick={() => handleScheduleSession(mentor._id)}
                  >
                    Schedule Session
                  </Button>
                  <Button 
                    className="flex-1 transition-all duration-200 hover:scale-105"
                    variant="outline"
                    onClick={() => handleConnect(mentor._id)}
                    disabled={mentor.connectionStatus !== 'none'}
                  >
                    <motion.span
                      initial={false}
                      animate={{ scale: mentor.connectionStatus === 'pending' ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {mentor.connectionStatus === 'connected' ? 'Connected' :
                       mentor.connectionStatus === 'pending' ? 'Request Sent' :
                       'Connect'}
                    </motion.span>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 