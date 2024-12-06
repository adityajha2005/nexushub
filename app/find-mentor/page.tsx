'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Mentor = {
  id: string
  name: string
  expertise: string[]
  experience: number
  rating: number
  avatar: string
}

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    expertise: ["Machine Learning", "Data Science", "Python"],
    experience: 10,
    rating: 4.9,
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "John Smith",
    expertise: ["Web Development", "React", "Node.js"],
    experience: 8,
    rating: 4.7,
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    expertise: ["UX Design", "UI Design", "Figma"],
    experience: 12,
    rating: 4.8,
    avatar: "/placeholder.svg",
  },
]

export default function FindMentorPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [mentors, setMentors] = useState<Mentor[]>(mockMentors)

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    // In a real application, you would fetch mentors from an API here
    const filteredMentors = mockMentors.filter(
      (mentor) =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    setMentors(filteredMentors)
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Find a Mentor</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name or expertise"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mentors.map((mentor) => (
          <Card key={mentor.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={mentor.avatar} alt={mentor.name} />
                <AvatarFallback>{mentor.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{mentor.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {mentor.experience} years experience
                </p>
                <p className="text-sm font-medium">
                  Rating: {mentor.rating} / 5
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">Expertise:</p>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <Button className="w-full mt-4">Book a Session</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

