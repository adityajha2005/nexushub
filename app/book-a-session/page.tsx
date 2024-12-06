"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mentors = [
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

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
]

export default function BookASession() {
  const [selectedMentor, setSelectedMentor] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")

  const handleBooking = () => {
    if (!selectedMentor || !date || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a mentor, date, and time",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Success",
      description: "Your session has been booked successfully!",
    })
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
                  <SelectItem key={mentor.id} value={mentor.id}>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
            <CardDescription>Choose an available time slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
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
              disabled={!selectedMentor || !date || !selectedTime}
            >
              Book Session with {selectedMentor ? mentors.find(m => m.id === selectedMentor)?.name : 'Mentor'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 