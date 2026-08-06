import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getSettings } from '@/lib/queries'
import { MobileNav } from '@/components/mobile-nav'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Collection' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Visit Us' },
]

export async function SiteHeader() {
  const [session, settings] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getSettings(),
  ])
  const isOwner = Boolean(session?.user)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 leading-none">
          {settings.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logoUrl || "/placeholder.svg"}
              alt={settings.storeName}
              className="h-9 w-9 rounded-md object-cover"
            />
          ) : null}
          <span className="flex flex-col">
            <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
              {settings.storeName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Furniture Studio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          {isOwner && (
            <Link
              href="/admin"
              className="text-sm font-medium text-accent transition-colors hover:text-accent/80"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Contact
          </Link>
          <MobileNav items={NAV} isOwner={isOwner} />
        </div>
      </div>
    </header>
  )
}
