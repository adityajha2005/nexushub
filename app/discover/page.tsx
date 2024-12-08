"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { skillCategories, getAllSkills } from "@/lib/data/skills"
import { ChevronDown, X } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface User {
  id: string
  name: string
  username?: string
  bio?: string
  skills?: string[]
  avatar?: string
  role: string
}

const commonSkills = getAllSkills()

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
  }
}

export default function DiscoverPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (role) params.append('role', role)
      if (selectedSkills.length) params.append('skills', selectedSkills.join(','))

      const response = await fetch(`/api/users?${params}`)
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, role, selectedSkills])

  const handleConnect = async (userId: string) => {
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ mentorId: userId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send connection request')
      }

      toast({
        title: "Success",
        description: "Connection request sent successfully",
      })
    } catch (error) {
      console.error('Connection error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send connection request",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container pt-24 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold mb-8">Discover</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by name or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="mentor">Mentors</SelectItem>
                <SelectItem value="mentee">Mentees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills filter */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Filter by Skills</h2>
            <NestedSkillsFilter
              selectedSkills={selectedSkills}
              onSkillToggle={(skill) => {
                setSelectedSkills(prev =>
                  prev.includes(skill)
                    ? prev.filter(s => s !== skill)
                    : [...prev, skill]
                )
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {users.map((user, index) => (
                <motion.div
                  key={user._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  whileHover="hover"
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/profile/${user._id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="relative">
                        <div className="absolute top-4 right-4">
                          <Badge variant={user.role === 'mentor' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Avatar className="h-12 w-12 ring-2 ring-background">
                              <AvatarImage 
                                src={user.avatar} 
                                alt={user.name}
                                className="object-cover"
                                onError={(e) => {
                                  console.log('Avatar failed to load:', user.avatar);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>
                          <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>{user.title || 'Member'}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <motion.div 
                          className="flex flex-wrap gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {user.skills?.map((skill, index) => (
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
                        <motion.div 
                          className="mt-4 text-sm text-muted-foreground"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          View Profile →
                        </motion.div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-5 w-16 bg-muted rounded" />
              ))}
            </div>
            <div className="h-12 w-full bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const NestedSkillsFilter = ({ selectedSkills, onSkillToggle }: {
  selectedSkills: string[]
  onSkillToggle: (skill: string) => void
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {Object.entries(skillCategories).map(([key, category]) => (
          <div key={key} className="relative">
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between",
                openCategory === key && "border-primary",
                Object.values(category.skills).some(skill => 
                  selectedSkills.includes(skill)
                ) && "bg-primary/10"
              )}
              onClick={() => setOpenCategory(openCategory === key ? null : key)}
            >
              <span className="truncate">{category.label}</span>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform ml-2",
                  openCategory === key && "rotate-180"
                )}
              />
            </Button>
            {openCategory === key && (
              <Card className="absolute top-[calc(100%+4px)] left-0 z-50 w-[200px] p-2 shadow-lg">
                <ScrollArea className="h-[200px]">
                  <div className="space-y-1">
                    {category.skills.map((skill) => (
                      <div
                        key={skill}
                        className={cn(
                          "flex items-center space-x-2 rounded-md px-2 py-1 cursor-pointer hover:bg-muted",
                          selectedSkills.includes(skill) && "bg-primary/10"
                        )}
                        onClick={() => onSkillToggle(skill)}
                      >
                        <Checkbox
                          checked={selectedSkills.includes(skill)}
                          className="pointer-events-none"
                        />
                        <span className="text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </div>
        ))}
      </div>
      {selectedSkills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Skills:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onSkillToggle(skill)}
              >
                {skill}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

