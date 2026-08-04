import type { Metadata } from 'next'
import { getApprovedReviews } from '@/lib/queries'
import { StarRating } from '@/components/star-rating'
import { ReviewForm } from '@/components/review-form'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Reviews — Oakmark & Co.',
  description:
    'Read what our customers say about their furniture and share your own experience.',
}

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews()
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Reviews
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-foreground">
          What our customers say
        </h1>
        {avg && (
          <div className="mt-4 flex items-center gap-3">
            <StarRating value={Math.round(Number(avg))} size={20} />
            <span className="text-sm text-muted-foreground">
              {avg} out of 5 &middot; {reviews.length} review
              {reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">
              No reviews yet — be the first to share your experience.
            </p>
          ) : (
            reviews.map((review) => (
              <figure
                key={review.id}
                className="rounded-lg border border-border bg-card p-6"
              >
                <StarRating value={review.rating} />
                <blockquote className="mt-3 text-pretty leading-relaxed text-foreground/90">
                  &ldquo;{review.body}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm font-medium text-foreground">
                  {review.authorName}
                  {review.location && (
                    <span className="font-normal text-muted-foreground">
                      {' '}&middot; {review.location}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))
          )}
        </div>

        <aside>
          <Card className="sticky top-20 p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground">
              Share your experience
            </h2>
            <p className="mt-1 mb-5 text-sm text-muted-foreground">
              Reviews are published after a quick check by our team.
            </p>
            <ReviewForm />
          </Card>
        </aside>
      </div>
    </div>
  )
}
