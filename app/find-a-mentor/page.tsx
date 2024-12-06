"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const mentors = [
  {
    id: 1,
    name: "Alex Thompson",
    role: "Senior Software Engineer",
    company: "Google",
    skills: ["React", "Node.js", "Cloud Architecture"],
    image: "/mentors/alex.jpg",
    availability: "Available",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Tech Lead",
    company: "Microsoft",
    skills: ["Python", "Machine Learning", "System Design"],
    image: "/mentors/sarah.jpg",
    availability: "Available",
  },
  // Add more mentors as needed
]

export default function FindAMentor() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleScheduleSession = (mentorId: number) => {
    // Check if user is authenticated
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

    // Navigate to book-a-session page with mentor pre-selected
    router.push(`/book-a-session?mentor=${mentorId}`)
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Find a Mentor</h1>
      
      <div className="mb-8">
        <Input
          type="search"
          placeholder="Search by name or skill..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.image} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{mentor.name}</CardTitle>
                  <CardDescription>{mentor.role} at {mentor.company}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {mentor.availability}
              </Badge>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleScheduleSession(mentor.id)}
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