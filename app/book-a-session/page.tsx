"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, CalendarDays, User2 } from "lucide-react"

interface Mentor {
  _id: string
  name: string
  expertise: string[]
  avatar?: string
  rating?: number
  sessionsCompleted?: number
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
]

export default function BookASession() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [selectedMentor, setSelectedMentor] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const preselectedMentor = searchParams.get("mentor")
    if (preselectedMentor) {
      setSelectedMentor(preselectedMentor)
    }
    fetchMentors()
  }, [searchParams])

  const fetchMentors = async () => {
    try {
      const response = await fetch("/api/mentors")
      const data = await response.json()
      setMentors(data.mentors)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load mentors",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBookSession = async () => {
    if (!selectedMentor || !selectedDate || !selectedTime) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a mentor, date, and time",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: selectedMentor,
          date: selectedDate,
          time: selectedTime,
        }),
      })

      if (!response.ok) throw new Error("Failed to book session")

      toast({
        title: "Success!",
        description: "Your session has been booked successfully",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book session. Please try again.",
        variant: "destructive",
      })
    }
  }

  const selectedMentorData = mentors.find(m => m._id === selectedMentor)

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
        <p className="text-muted-foreground">Schedule a mentoring session with your preferred mentor</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Mentor Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="h-5 w-5" />
                Select Mentor
              </CardTitle>
              <CardDescription>Choose your preferred mentor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select onValueChange={setSelectedMentor} value={selectedMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor._id} value={mentor._id}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={mentor.avatar} alt={mentor.name} />
                          <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{mentor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {mentor.expertise.slice(0, 2).join(", ")}
                            {mentor.expertise.length > 2 && "..."}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedMentorData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-muted rounded-lg space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedMentorData.avatar} />
                      <AvatarFallback>{selectedMentorData.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedMentorData.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {selectedMentorData.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center p-3 bg-background rounded-md">
                      <div className="text-xl font-bold">
                        {selectedMentorData.rating?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-background rounded-md">
                      <div className="text-xl font-bold">
                        {selectedMentorData.sessionsCompleted || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Sessions</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Date and Time Selection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Schedule
              </CardTitle>
              <CardDescription>Select your preferred date and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => 
                  date < new Date() || date.getDay() === 0 || date.getDay() === 6
                }
              />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-end gap-4"
      >
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleBookSession}
          disabled={!selectedMentor || !selectedDate || !selectedTime}
        >
          Book Session
        </Button>
      </motion.div>
    </div>
  )
} 