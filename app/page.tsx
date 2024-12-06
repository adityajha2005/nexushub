'use client'

import { useRef, useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { ReviewAvatars } from "@/components/review-avatars"
import { StatsCard } from "@/components/stats-card"
import { ArrowRight, ArrowDown, Users, BookOpen, Award } from 'lucide-react'

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

    const totalSessionsElement = document.querySelector('[data-target="5000"]');
    const totalHoursElement = document.querySelector('[data-target="20000"]');

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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center py-12">
          <div className="space-y-8">
            <Badge className={`transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>BOOST YOUR CAREER</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
              /YOUR
              <br />
              PERSONAL
              <br />
              IT MENTORING
              <br />
              IS HERE
            </h1>
            <p className="text-muted-foreground max-w-lg animate-fade-in">
              Our platform offers expert IT coaching consultations to help you gain valuable insight and guidance from industry
              professionals.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-4 sm:py-6 rounded-full text-base sm:text-lg group animate-scale-in">
              Let's Connect
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="space-y-6 bg-card p-6 sm:p-8 rounded-3xl animate-fade-in">
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
                  <ReviewAvatars />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mt-24 bg-gradient-to-r from-primary to-secondary rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden relative">
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
              <div className="absolute inset-0 bg-white/10 rounded-3xl transform rotate-6 transition-transform hover:rotate-12"></div>
              <div className="absolute inset-0 bg-white/20 rounded-3xl transform -rotate-6 transition-transform hover:-rotate-12"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 backdrop-blur-sm"></div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="mt-24 py-12">
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
        </section>

        {/* Scroll Indicator */}
        {/* <div className="flex justify-center py-12">
          <Button variant="ghost" size="icon" className="animate-bounce">
            <ArrowDown className="h-6 w-6" />
          </Button>
        </div> */}
      </main>
    </div>
  )
}

