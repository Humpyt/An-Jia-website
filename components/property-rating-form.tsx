"use client"

import { useState } from 'react'
import { StarRating } from './star-rating'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useToast } from './ui/use-toast'

interface PropertyRatingFormProps {
  propertyId: string
  onRatingSubmitted?: () => void
}

export function PropertyRatingForm({ propertyId, onRatingSubmitted }: PropertyRatingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [ratings, setRatings] = useState({
    location: 0,
    condition: 0,
    value: 0,
    overall: 0
  })
  const [comment, setComment] = useState('')
  const [author, setAuthor] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!author.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      })
      return
    }

    if (Object.values(ratings).some(r => r === 0)) {
      toast({
        title: "Error",
        description: "Please provide all ratings",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/properties/${propertyId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location_rating: ratings.location,
          condition_rating: ratings.condition,
          value_rating: ratings.value,
          overall_rating: ratings.overall,
          comment,
          author
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit rating')
      }

      toast({
        title: "Success",
        description: "Your rating has been submitted successfully",
      })

      // Reset form
      setRatings({
        location: 0,
        condition: 0,
        value: 0,
        overall: 0
      })
      setComment('')
      setAuthor('')

      // Notify parent component
      onRatingSubmitted?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="author">Your Name</Label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Location Rating</Label>
          <StarRating
            rating={ratings.location}
            interactive
            onRatingChange={(value) => setRatings(prev => ({ ...prev, location: value }))}
          />
        </div>

        <div>
          <Label>Property Condition</Label>
          <StarRating
            rating={ratings.condition}
            interactive
            onRatingChange={(value) => setRatings(prev => ({ ...prev, condition: value }))}
          />
        </div>

        <div>
          <Label>Value for Money</Label>
          <StarRating
            rating={ratings.value}
            interactive
            onRatingChange={(value) => setRatings(prev => ({ ...prev, value: value }))}
          />
        </div>

        <div>
          <Label>Overall Rating</Label>
          <StarRating
            rating={ratings.overall}
            interactive
            onRatingChange={(value) => setRatings(prev => ({ ...prev, overall: value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience with this property"
          required
          className="h-24"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
