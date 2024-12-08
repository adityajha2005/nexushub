'use client'

import { useRef, useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ReviewAvatars } from "./components/review-avatars"
import { ArrowRight, ArrowDown, Users, BookOpen, Award } from 'lucide-react'
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { StatsCard } from "@/components/stats-card"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const featuresRef = useRef(null)
  const [isFeaturesSectionVisible, setIsFeaturesSectionVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsFeaturesSectionVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1
      }
    )

    if (featuresRef.current) {
      observer.observe(featuresRef.current)
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current)
      }
    }
  }, [])

  const features = [
    {
      icon: Users,
      title: "Expert Mentors",
      description: "Connect with industry professionals who have years of experience in IT."
    },
    {
      icon: BookOpen,
      title: "Tailored Learning",
      description: "Personalized mentoring sessions designed to meet your specific career goals."
    },
    {
      icon: Award,
      title: "Career Growth",
      description: "Accelerate your professional development and unlock new opportunities."
    }
  ]

  const handleConnectClick = () => {
    const token = document.cookie.includes('token=')
    if (!token) {
      router.push('/login')
      return
    }
    router.push('/discover')
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20"
    >
      <Navbar />
      <main className="container mx-auto px-4 pt-16 sm:pt-24">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center py-8 sm:py-12"
        >
          <div className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                BOOST YOUR CAREER
              </Badge>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {['YOUR', 'PERSONAL', 'IT MENTORING', 'IS HERE'].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                >
                  {text}
                </motion.div>
              ))}
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-muted-foreground max-w-lg text-sm sm:text-base"
            >
              Our platform offers expert IT coaching consultations to help you gain valuable insight and guidance from industry professionals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="relative"
            >
              <Button 
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 rounded-full text-base sm:text-lg relative overflow-hidden w-full sm:w-auto"
                onClick={handleConnectClick}
              >
                <motion.div
                  className="relative z-10 flex items-center gap-2"
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Let's Connect
                  <ArrowRight className="inline-block transition-transform duration-300 group-hover:translate-x-1" />
                </motion.div>
                
                {/* Button effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:left-[100%] transition-all duration-1000 ease-out" />
              </Button>
              
              {/* Optional floating dots decoration */}
              <motion.div
                className="absolute -right-4 -top-4 w-20 h-20 pointer-events-none"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-0 grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-2 h-2 bg-primary/30 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-4 sm:space-y-6 bg-card/50 backdrop-blur-sm p-4 sm:p-8 rounded-3xl border border-white/10 shadow-xl"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">NEXUSHUB IN NUMBERS</h2>

            <div className="space-y-3 sm:space-y-4">
              <StatsCard
                label="Session Duration"
                value="30-60 min"
                description="Approximate duration of one session"
              />

              <StatsCard
                label="Monthly Subscription"
                value="$199"
                description="The cost of a subscription with 2 sessions"
              />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs sm:text-sm font-medium">OVER 280+ REVIEWS</span>
                  <div className="mt-1">
                    <ReviewAvatars />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          ref={featuresRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-24 py-8 sm:py-12 relative"
        >
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/90 to-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose NEXUSHUB?
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="group relative p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-white/10 hover:border-primary/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-2xl -z-10 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <motion.div 
                  className="h-16 w-16 text-primary mb-6 relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <feature.icon className="h-full w-full" />
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                </motion.div>

                <motion.h3 
                  className="text-2xl font-semibold mb-4 text-primary/90"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p 
                  className="text-muted-foreground/90 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background pointer-events-none" />
        </motion.section>

        {/* Scroll Indicator */}
        {/* <div className="flex justify-center py-12">
          <Button variant="ghost" size="icon" className="animate-bounce">
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div> */}
      </main>
    </motion.div>
  )
}

