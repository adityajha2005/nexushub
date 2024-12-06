"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
]

export default function BookASession() {
  const searchParams = useSearchParams()
  const preselectedMentorId = searchParams.get('mentor')
  const router = useRouter()
  
  const [selectedMentor, setSelectedMentor] = useState<string>(preselectedMentorId || "")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [mentors, setMentors] = useState<any[]>([])

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors')
        const data = await response.json()
        if (response.ok) {
          setMentors(data.mentors)
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
      }
    }

    fetchMentors()
  }, [])

  useEffect(() => {
    if (preselectedMentorId) {
      setSelectedMentor(preselectedMentorId)
    }
  }, [preselectedMentorId])

  const handleBooking = async () => {
    if (!selectedMentor || !date || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a mentor, date, and time",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor,
          date: date.toISOString(),
          time: selectedTime,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book session')
      }

      toast({
        title: "Success",
        description: "Session booked successfully",
      })
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book session",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 pt-20">
      <h1 className="text-3xl font-bold mb-8">Book a Session</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Select Mentor</CardTitle>
            <CardDescription>Choose your preferred mentor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedMentor} value={selectedMentor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((mentor) => (
                  <SelectItem key={mentor._id} value={mentor._id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{mentor.name}</span>
                      <span className="text-muted-foreground ml-auto">
                        {mentor.expertise[0]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose your preferred date for the session</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => 
                date < new Date() || 
                date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
            <CardDescription>Choose your preferred time slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              className="w-full" 
              onClick={handleBooking}
              disabled={!selectedMentor || !date || !selectedTime || isLoading}
            >
              {isLoading ? (
                "Booking..."
              ) : (
                `Book Session with ${selectedMentor ? mentors.find(m => m._id === selectedMentor)?.name : 'Mentor'}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 