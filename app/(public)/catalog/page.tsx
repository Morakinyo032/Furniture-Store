import type { Metadata } from 'next'
import { getFurniture } from '@/lib/queries'
import { CatalogGrid } from '@/components/catalog-grid'

export const metadata: Metadata = {
  title: 'Collection — Osbam Laboratories & Furniture Ltd.',
  description:
    'Browse our full collection of handcrafted sofas, dining tables, beds, and more. Filter by room and explore photos and videos of each piece.',
}

export default async function CatalogPage() {
  const items = await getFurniture()

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          The Collection
        </p>
        <h1 className="mt-2 text-balance font-serif text-4xl font-semibold text-foreground">
          Furniture made to be lived with
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Every piece is built by hand from solid hardwoods. Tap any item to see
          more photos, watch a video, and learn about the materials.
        </p>
      </header>

      <CatalogGrid items={items} />
    </div>
  )
}
