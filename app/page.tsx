'use client'

import { useRef, useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ReviewAvatars } from "./components/review-avatars"
import { StatsCard } from "@/components/stats-card"
import { ArrowRight, ArrowDown, Users, BookOpen, Award } from 'lucide-react'
import { motion } from "framer-motion"

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const featuresRef = useRef(null)
  const [isFeaturesSectionVisible, setIsFeaturesSectionVisible] = useState(false)

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

  useEffect(() => {
    const animateValue = (obj: HTMLElement, start: number, end: number, duration: number) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    const totalSessionsElement = document.querySelector('[data-target="5000"]')as HTMLElement;
    const totalHoursElement = document.querySelector('[data-target="20000"]')as HTMLElement;

    if (totalSessionsElement && totalHoursElement) {
      animateValue(totalSessionsElement, 0, 5000, 2000);
      animateValue(totalHoursElement, 0, 20000, 2000);
    }
  }, []);

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

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20"
    >
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center py-12"
        >
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                BOOST YOUR CAREER
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {['/YOUR', 'PERSONAL', 'IT MENTORING', 'IS HERE'].map((text, i) => (
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
              className="text-muted-foreground max-w-lg"
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
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-full text-lg relative overflow-hidden"
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
            className="space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4">NEXUSHUB IN NUMBERS</h2>

            <div className="space-y-4">
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

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">OVER 280+ REVIEWS</span>
                  <div className="mt-1">
                    <ReviewAvatars />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Stats Section with improved animations */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-24 relative"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                The First Step Towards
                <br />
                Achieving Your Career Dreams!
              </h2>
              <p className="text-white/80">
                Invest in your future and get the competitive edge you need to succeed in the fast-paced world of tech with our
                professional IT coaching consultations.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white animate-count-up" data-target="5000">0</div>
                  <div className="text-sm text-white/80">Total sessions</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white animate-count-up" data-target="20000">0</div>
                  <div className="text-sm text-white/80">Total hours</div>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-96">
              {/* Glass cards */}
              <div className="relative w-full h-full perspective-1000">
                {/* Main card */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl transform hover:rotate-2 transition-transform duration-500">
                  {/* Inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-3xl"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative group">
                      {/* Lightning icon with glow */}
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg flex items-center justify-center transform transition-all duration-500 group-hover:scale-110">
                        <svg 
                          className="w-12 h-12 text-white transform transition-all duration-500" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      
                      {/* Subtle glow effect */}
                      <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Background accent card */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl -rotate-3 -z-10 transform transition-transform duration-500"></div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 backdrop-blur-sm"></div>
        </motion.section>

        {/* Features Section with staggered animations */}
        <motion.section 
          ref={featuresRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 py-12"
        >
          <h2 className="text-3xl font-bold text-center mb-12 opacity-0 transition-opacity duration-1000 ease-out"
            style={{ opacity: isFeaturesSectionVisible ? 1 : 0 }}>
            Why Choose NEXUSHUB?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg transition-all duration-500 ease-out opacity-0 translate-y-10"
                style={{
                  opacity: isFeaturesSectionVisible ? 1 : 0,
                  transform: isFeaturesSectionVisible ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
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

