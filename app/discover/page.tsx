"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  id: string
  name: string
  username: string
  skills: string[]
  avatar: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    username: "alice_j",
    skills: ["React", "Node.js", "TypeScript"],
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Bob Smith",
    username: "bob_smith",
    skills: ["Python", "Machine Learning", "Data Science"],
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Carol Williams",
    username: "carol_w",
    skills: ["Java", "Spring Boot", "Microservices"],
    avatar: "/placeholder.svg",
  },
]

export default function DiscoverPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>(mockUsers)

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    // In a real application, you would fetch users from an API here
    const filteredUsers = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    setUsers(filteredUsers)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Discover Mentors and Mentees</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name, username, or skill"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">Skills:</p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

