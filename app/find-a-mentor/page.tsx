"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type Mentor = {
  _id: string
  name: string
  expertise: string[]
  experience: number
  rating: number
  avatar: string
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
        const response = await fetch('/api/mentors')
        const data = await response.json()
        if (response.ok) {
          setMentors(data.mentors)
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
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
    const token = document.cookie.includes('token')
    
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to schedule a session",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    router.push(`/book-a-session?mentor=${mentorId}`)
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 pt-20">Loading mentors...</div>
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Find a Mentor</h1>
      
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search by name or expertise..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor._id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{mentor.name}</CardTitle>
                  <CardDescription>{mentor.experience} years experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Available
              </Badge>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleScheduleSession(mentor._id)}
              >
                Schedule Session
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
} 