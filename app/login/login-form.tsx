'use client'

import { UserAuthForm } from "@/components/user-auth-form"
import { toast } from "@/components/ui/use-toast"

export function LoginForm() {
  return (
    <div className="grid gap-6">
      <UserAuthForm type="login" />
    </div>
  )
} 