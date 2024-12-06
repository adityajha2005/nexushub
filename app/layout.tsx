import "./globals.css"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { MainWrapper } from "@/components/main-wrapper"
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'NEXUSHUB - IT Mentoring Platform',
  description: 'Connect with expert IT mentors for personalized guidance and career growth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
          storageKey="nexushub-theme"
          themes={['light', 'dark', 'system']}
        >
          <Navbar />
          <MainWrapper>
            {children}
          </MainWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

