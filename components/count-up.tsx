'use client'

import { useEffect, useState, useRef } from 'react'

interface CountUpProps {
  end: number
  duration?: number
}

export function CountUp({ end, duration = 2000 }: CountUpProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  countRef.current = count

  useEffect(() => {
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      if (countRef.current < end) {
        setCount(prev => Math.min(prev + step, end))
      } else {
        clearInterval(timer)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration])

  return <span>{count.toLocaleString()}</span>
}

