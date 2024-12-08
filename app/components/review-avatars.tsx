'use client'

import React from 'react'
import { motion } from 'framer-motion'

const AVATARS = [
  'https://api.dicebear.com/7.x/micah/svg?seed=mentor1&backgroundColor=2563eb&baseColor=f472b6',
  'https://api.dicebear.com/7.x/micah/svg?seed=mentor2&backgroundColor=7c3aed&baseColor=60a5fa',
  'https://api.dicebear.com/7.x/micah/svg?seed=mentor3&backgroundColor=db2777&baseColor=34d399'
]

export function ReviewAvatars() {
  return (
    <div className="flex items-center group">
      <div className="flex -space-x-2 sm:-space-x-3">
        {AVATARS.map((avatar, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            className="relative"
          >
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-2 border-background overflow-hidden shadow-lg">
              <motion.img
                className="h-full w-full object-cover"
                src={avatar}
                alt={`Reviewer ${index + 1}`}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
      <motion.span 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="ml-2 sm:ml-4 text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors"
      >
        +280 reviews
      </motion.span>
    </div>
  )
} 