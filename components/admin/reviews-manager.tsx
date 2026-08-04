"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { setReviewApproval, deleteReview } from "@/app/actions/admin"
import { toast } from "sonner"

type Review = {
  id: number
  authorName: string
  location: string | null
  rating: number
  body: string
  approved: boolean
}

export function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter()
  const [pending, setPending] = useState<number | null>(null)

  async function toggle(id: number, approved: boolean) {
    setPending(id)
    await setReviewApproval(id, approved)
    setPending(null)
    toast.success(approved ? "Review published" : "Review hidden")
    router.refresh()
  }

  async function remove(id: number) {
    setPending(id)
    await deleteReview(id)
    setPending(null)
    toast.success("Review deleted")
    router.refresh()
  }

  if (reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews submitted yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="flex flex-col gap-3 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-medium">{review.authorName}</span>
                {review.location ? (
                  <span className="text-sm text-muted-foreground">{review.location}</span>
                ) : null}
              </div>
              <Badge variant={review.approved ? "default" : "secondary"}>
                {review.approved ? "Published" : "Pending"}
              </Badge>
            </div>
            <StarRating rating={review.rating} />
            <p className="text-sm leading-relaxed text-muted-foreground">{review.body}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={review.approved ? "outline" : "default"}
                disabled={pending === review.id}
                onClick={() => toggle(review.id, !review.approved)}
              >
                {review.approved ? "Hide" : "Publish"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={pending === review.id}
                onClick={() => remove(review.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
