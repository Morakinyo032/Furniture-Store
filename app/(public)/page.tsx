import Link from 'next/link'
import { ArrowRight, Hammer, Leaf, Truck } from 'lucide-react'
import {
  getSettings,
  getFeaturedFurniture,
  getApprovedReviews,
} from '@/lib/queries'
import { FurnitureCard } from '@/components/furniture-card'
import { StarRating } from '@/components/star-rating'

export default async function HomePage() {
  const [settings, featured, reviews] = await Promise.all([
    getSettings(),
    getFeaturedFurniture(),
    getApprovedReviews(),
  ])

  const heroImage = settings.heroImageUrl || '/furniture/hero-showroom.png'
  const heroVideo = settings.heroVideoUrl

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[68svh] min-h-[440px] w-full overflow-hidden">
          {heroVideo ? (
            <video
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
              poster={heroImage}
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage || "/placeholder.svg"}
              alt="Furniture showroom"
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/25 to-foreground/10" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
              <div className="max-w-xl">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-background/80">
                  {settings.storeName}
                </p>
                <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-tight text-background sm:text-5xl md:text-6xl">
                  {settings.tagline || 'Handcrafted furniture, built to last generations.'}
                </h1>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
                  >
                    Browse the collection <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-md border border-background/40 px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-background/10"
                  >
                    Visit the showroom
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Hammer, title: 'Made by hand', text: 'Every piece is built and finished by our craftspeople in-house.' },
            { icon: Leaf, title: 'Residential & institutional', text: 'From bespoke home furniture to physics and chemistry lab furniture for schools.' },
            { icon: Truck, title: 'Delivery & installation', text: 'Careful delivery and setup, whether it\'s your home or your school lab.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent/12 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Featured</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground">
              This season&apos;s highlights
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden shrink-0 items-center gap-1 text-sm font-medium text-foreground hover:text-accent sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <FurnitureCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-muted-foreground">
            Featured pieces will appear here soon.
          </p>
        )}
      </section>

      {/* Reviews teaser */}
      {reviews.length > 0 && (
        <section className="border-y border-border bg-sidebar">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Loved by our customers
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-foreground">
                Kind words
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {reviews.slice(0, 3).map((review) => (
                <figure
                  key={review.id}
                  className="flex flex-col rounded-lg border border-border bg-card p-6"
                >
                  <StarRating value={review.rating} />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
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
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
              >
                Read more reviews <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground">
          <h2 className="text-balance font-serif text-3xl font-semibold sm:text-4xl">
            Come sit with the difference craftsmanship makes.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty text-primary-foreground/80">
            Stop by our showroom or reach out and we&apos;ll help you find the perfect piece for your home.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
          >
            Plan your visit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
