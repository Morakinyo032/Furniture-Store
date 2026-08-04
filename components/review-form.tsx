'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { submitReview } from '@/app/actions/public'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/star-rating'

export function ReviewForm() {
  const [authorName, setAuthorName] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await submitReview({ authorName, location, rating, body })
    setLoading(false)

    if (res?.error) {
      toast.error(res.error)
      return
    }
    toast.success('Thank you! Your review will appear once approved.')
    setAuthorName('')
    setLocation('')
    setRating(5)
    setBody('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-name">Your name</Label>
          <Input
            id="review-name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="review-location">Location (optional)</Label>
          <Input
            id="review-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Your rating</Label>
        <StarRating value={rating} onChange={setRating} size={26} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="review-body">Your review</Label>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
          placeholder="Tell us about your experience..."
        />
      </div>

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? 'Submitting...' : 'Submit review'}
      </Button>
    </form>
  )
}
