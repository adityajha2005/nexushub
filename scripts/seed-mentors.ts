import './load-env'
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import mongoose from 'mongoose'
import { USER_ROLES } from "@/models/User"

async function seedMentors() {
  try {
    await connectDB()
    console.log('Connected to database')

    const mentors = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Dr. Emily Chen",
        email: "emily.chen@example.com",
        role: USER_ROLES.MENTOR,
        skills: ["Machine Learning", "Data Science", "Python"],
        title: "Senior Data Scientist",
        sessionsCompleted: 10,
        rating: 4.9,
        avatar: "/placeholder.svg",
        password: "$2a$10$XHGRZg6tBuF1Yh7sDqxK8O.eL1jB5fGvw8CDn.zGaG1Uy.AOXgEfm"
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "John Smith",
        email: "john.smith@example.com",
        role: USER_ROLES.MENTOR,
        skills: ["Web Development", "React", "Node.js"],
        title: "Senior Web Developer",
        sessionsCompleted: 8,
        rating: 4.7,
        avatar: "/placeholder.svg",
        password: "$2a$10$XHGRZg6tBuF1Yh7sDqxK8O.eL1jB5fGvw8CDn.zGaG1Uy.AOXgEfm"
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        role: USER_ROLES.MENTOR,
        skills: ["UX Design", "UI Design", "Figma"],
        title: "Senior UX/UI Designer",
        sessionsCompleted: 12,
        rating: 4.8,
        avatar: "/placeholder.svg",
        password: "$2a$10$XHGRZg6tBuF1Yh7sDqxK8O.eL1jB5fGvw8CDn.zGaG1Uy.AOXgEfm"
      }
    ]

    // Clear existing mentors
    console.log('Clearing existing mentors...')
    await User.deleteMany({ role: 'mentor' })

    // Insert new mentors
    console.log('Inserting new mentors...')
    const insertedMentors = await User.insertMany(mentors)

    // Log the created mentor IDs for reference
    console.log('Created mentors with IDs:')
    insertedMentors.forEach(mentor => {
      console.log(`${mentor.name}: ${mentor._id}`)
    })

    console.log('Mentors seeded successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding mentors:', error)
    process.exit(1)
  }
}

seedMentors() 