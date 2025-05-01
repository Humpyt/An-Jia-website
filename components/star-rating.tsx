"use client"

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating?: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating = 0,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div 
      className={cn(
        "flex items-center gap-0.5",
        className
      )}
    >
      {[...Array(maxRating)].map((_, index) => {
        const value = index + 1
        const filled = interactive 
          ? value <= (hoverRating || rating)
          : value <= rating

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => interactive && setHoverRating(value)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-colors",
              interactive ? "cursor-pointer hover:text-amber-400" : "cursor-default",
              filled ? "text-amber-400" : "text-gray-300"
            )}
            disabled={!interactive}
          >
            <Star
              className={cn(
                "fill-current",
                sizes[size]
              )}
            />
            <span className="sr-only">{`${value} stars`}</span>
          </button>
        )
      })}
    </div>
  )
}
