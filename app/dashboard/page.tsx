'use client'

import { useEffect } from 'react'

export default function DashboardPage() {
  useEffect(() => {
    console.log('Dashboard page mounted')
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>You have successfully logged in!</p>
    </div>
  )
} 