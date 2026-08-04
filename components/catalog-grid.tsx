'use client'

import { useMemo, useState } from 'react'
import { FurnitureCard } from '@/components/furniture-card'
import { cn } from '@/lib/utils'
import type { Furniture } from '@/lib/queries'

export function CatalogGrid({ items }: { items: Furniture[] }) {
  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category))
    return ['All', ...Array.from(set).sort()]
  }, [items])

  const [active, setActive] = useState('All')

  const filtered =
    active === 'All' ? items : items.filter((i) => i.category === active)

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">
          Our collection is being updated. Please check back soon.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              active === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <FurnitureCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
