'use client'

import { UserAuthForm } from "@/components/user-auth-form"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter()

  const handleLogin = async () => {
    try {
      // ... your login logic ...
      
      if (loginSuccessful) {
        // Dispatch auth change event
        window.dispatchEvent(new Event('auth-change'))
        
        // Navigate to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      // ... error handling ...
    }
  }

  return (
    <div className="grid gap-6">
      <UserAuthForm type="login" />
    </div>
  )
} 