// This should be the server component (page.tsx)
export const metadata = {
  title: "Login | NEXUSHUB",
  description: "Login to your account",
}

// Import your client component
import { LoginForm } from './login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in
          </p>
        </div>
        <LoginForm />
        
        {/* Sign Up Link */}
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
        
        {/* Warning Banner */}
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800/50 rounded-lg">
          <div className="flex items-center justify-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              This is a demo application. Please do not use real credentials.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

