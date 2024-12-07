"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  _id: string
  message: string
  read: boolean
  createdAt: string
  from: {
    name: string
    avatar?: string
  }
}

export function NotificationsMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/notifications', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })
      
      if (response.status === 404) {
        setNotifications([])
        setUnreadCount(0)
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      
      const data = await response.json()
      if (Array.isArray(data.notifications)) {
        setNotifications(data.notifications)
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
      } else {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      setError('Failed to load notifications')
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000)
    
    // Listen for notification updates
    const handleNotificationUpdate = () => {
      fetchNotifications()
    }
    
    window.addEventListener('notification-update', handleNotificationUpdate)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('notification-update', handleNotificationUpdate)
    }
  }, [])

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ notificationIds: [notificationId] }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }
      
      await fetchNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-destructive">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              className={`flex items-center gap-4 p-4 ${
                !notification.read ? 'bg-muted/50' : ''
              }`}
              onClick={() => markAsRead(notification._id)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={notification.from.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {notification.from.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 