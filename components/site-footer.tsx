import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'
import { getSettings } from '@/lib/queries'

// lucide-react no longer ships brand/logo icons, so these are inlined.
function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

export async function SiteFooter() {
  const settings = await getSettings()

  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            {settings.storeName}
          </h3>
          {settings.tagline && (
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {settings.tagline}
            </p>
          )}
          <div className="mt-4 flex gap-3">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Explore
          </h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            <li><Link href="/catalog" className="text-foreground/80 hover:text-foreground">Collection</Link></li>
            <li><Link href="/about" className="text-foreground/80 hover:text-foreground">Our Story</Link></li>
            <li><Link href="/reviews" className="text-foreground/80 hover:text-foreground">Reviews</Link></li>
            <li><Link href="/contact" className="text-foreground/80 hover:text-foreground">Visit the Showroom</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Visit &amp; Contact
          </h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-foreground/80">
            {settings.address && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`tel:${settings.phone}`} className="hover:text-foreground">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${settings.email}`} className="hover:text-foreground">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
