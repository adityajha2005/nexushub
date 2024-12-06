"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { AtSign, Code2, Save, X } from "lucide-react"
import { skillCategories } from "@/lib/data/skills"
import { USER_ROLES, UserRole } from "@/models/User"

interface ProfileFormData {
  username: string
  bio: string
  skills: string[]
  title?: string
  role: UserRole
}

export default function ProfileSetupPage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    bio: "",
    skills: [],
    title: "",
    role: USER_ROLES.USER
  })
  const [loading, setLoading] = useState(false)
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        const data = await response.json()
        if (response.ok && data.user) {
          const skills = data.user.skills || []
          
          const formattedData = {
            username: data.user.username || "",
            bio: data.user.bio || "",
            skills: skills,
            title: data.user.title || "",
            role: data.user.role || USER_ROLES.USER
          }

          setFormData(formattedData)
          setInitialData(formattedData)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      }
    }
    fetchProfile()
  }, [])

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const dataToSend = {
        ...formData,
        skills: Array.isArray(formData.skills) ? formData.skills : []
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update profile')
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      router.push('/profile')
    } catch (error) {
      console.error('Profile update error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <AtSign className="h-4 w-4 text-muted-foreground" />
              Username
            </label>
            <Input
              placeholder="Your username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              placeholder="e.g. Senior Software Engineer"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              placeholder="Tell others about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              Skills
            </label>
            <ScrollArea className="h-[280px] pr-4">
              {Object.entries(skillCategories).map(([key, category]) => (
                <div key={key} className="mb-6 last:mb-0">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    {category.label}
                  </h4>
                  <div className="space-y-2">
                    {category.skills.map(skill => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <label
                          htmlFor={skill}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/profile')}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !hasChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

