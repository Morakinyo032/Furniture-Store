import type { Metadata } from 'next'
import { getSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Our Story — Oakmark & Co.',
  description:
    'Learn about our family-run furniture studio, our commitment to craftsmanship, and the people behind every piece.',
}

const DEFAULT_ABOUT =
  'We are a family-run furniture studio dedicated to timeless design and honest craftsmanship. Every piece in our showroom is built from responsibly sourced solid hardwoods and finished by hand in our workshop.'

export default async function AboutPage() {
  const settings = await getSettings()
  const paragraphs = (settings.about || DEFAULT_ABOUT)
    .split(/\n\n+/)
    .filter(Boolean)
  const heroImage = settings.heroImageUrl || '/furniture/hero-showroom.png'

  return (
    <div>
      <div className="relative h-[38svh] min-h-[260px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage || "/placeholder.svg"}
          alt="Our workshop"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-4xl px-4 pb-8 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-background/80">
              Our Story
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-background sm:text-5xl">
              {settings.storeName}
            </h1>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-5 text-lg leading-relaxed text-foreground/90">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-pretty">
              {p}
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}
