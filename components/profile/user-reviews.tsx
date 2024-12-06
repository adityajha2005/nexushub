"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { format } from "date-fns"

interface Review {
  _id: string
  from: {
    _id: string
    name: string
    avatar?: string
  }
  rating: number
  comment: string
  createdAt: string
}

export function UserReviews({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/reviews`)
        const data = await response.json()
        setReviews(data.reviews)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [userId])

  if (loading) {
    return <ReviewsSkeleton />
  }

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No reviews yet
          </CardContent>
        </Card>
      ) : (
        reviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={review.from.avatar} alt={review.from.name} />
                      <AvatarFallback>{review.from.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{review.from.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-medium">{review.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="animate-pulse bg-muted h-16" />
          <CardContent className="animate-pulse bg-muted h-24 mt-4" />
        </Card>
      ))}
    </div>
  )
} 