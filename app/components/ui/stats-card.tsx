'use client'

import { motion } from 'framer-motion'

interface StatsCardProps {
  label: string
  value: string
  description: string
}

export function StatsCard({ label, value, description }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ 
        duration: 0.3,
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 15
        }
      }}
      className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/20 hover:bg-white/10 
        transition-colors relative group overflow-hidden"
    >
      {/* Background gradient effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
        animate={{ rotate: [0, 15] }}
        transition={{ duration: 0.7 }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xs sm:text-sm text-muted-foreground"
      >
        {label}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg sm:text-2xl font-bold mt-1 text-primary group-hover:text-primary/90 transition-colors"
      >
        {value}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs sm:text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80 transition-colors"
      >
        {description}
      </motion.div>

      {/* Shine effect on hover */}
      <motion.div 
        className="absolute inset-0 w-[200%] translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000"
        initial={false}
      />
    </motion.div>
  )
} 