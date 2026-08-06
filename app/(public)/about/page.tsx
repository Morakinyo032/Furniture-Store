import type { Metadata } from 'next'
import { Target, Eye, Heart } from 'lucide-react'
import { getSettings } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Our Story — Osbam Laboratories & Furniture Ltd.',
  description:
    'Learn about our family-run furniture studio, our commitment to craftsmanship, and the people behind every piece.',
}

const DEFAULT_ABOUT =
  'We are a family-run furniture studio dedicated to timeless design and honest craftsmanship. Every piece in our showroom is built from responsibly sourced solid hardwoods and finished by hand in our workshop.\n\nBeyond home and office furniture, we also design and build furniture for school science laboratories — physics and chemistry lab benches, stools, storage, and fittings built to withstand daily classroom use while meeting the practical needs of teachers and students.'

export default async function AboutPage() {
  const settings = await getSettings()
  const paragraphs = (settings.about || DEFAULT_ABOUT)
    .split(/\n\n+/)
    .filter(Boolean)
  const heroImage = settings.heroImageUrl || '/furniture/hero-showroom.png'
  const coreValues = (settings.coreValues || '')
    .split(/\n+/)
    .map((v) => v.trim())
    .filter(Boolean)
  const hasMissionVisionValues =
    settings.mission || settings.vision || coreValues.length > 0

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
            <p key={i} className="whitespace-pre-line text-pretty">
              {p}
            </p>
          ))}
        </div>
      </article>

      {hasMissionVisionValues && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              {settings.mission && (
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/12 text-accent">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Our Mission
                  </h3>
                  <p className="whitespace-pre-line text-pretty text-sm leading-relaxed text-muted-foreground">
                    {settings.mission}
                  </p>
                </div>
              )}
              {settings.vision && (
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/12 text-accent">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Our Vision
                  </h3>
                  <p className="whitespace-pre-line text-pretty text-sm leading-relaxed text-muted-foreground">
                    {settings.vision}
                  </p>
                </div>
              )}
              {coreValues.length > 0 && (
                <div className="flex flex-col items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-accent/12 text-accent">
                    <Heart className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    Core Values
                  </h3>
                  <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-muted-foreground">
                    {coreValues.map((value, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-accent">&bull;</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
