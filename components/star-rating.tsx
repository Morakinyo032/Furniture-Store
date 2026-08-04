'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StarRating({
  value,
  onChange,
  size = 16,
  className,
}: {
  value: number
  onChange?: (value: number) => void
  size?: number
  className?: string
}) {
  const interactive = typeof onChange === 'function'
  return (
    <div className={cn('flex items-center gap-0.5', className)} role={interactive ? 'radiogroup' : undefined}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value
        const StarIcon = (
          <Star
            width={size}
            height={size}
            className={cn(
              filled ? 'fill-accent text-accent' : 'fill-transparent text-muted-foreground/40',
            )}
          />
        )
        if (!interactive) {
          return <span key={star}>{StarIcon}</span>
        }
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            {StarIcon}
          </button>
        )
      })}
    </div>
  )
}
