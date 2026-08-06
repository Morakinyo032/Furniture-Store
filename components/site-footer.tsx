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

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.75.94-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.5.07-.77.36-.26.29-1 .98-1 2.4 0 1.41 1.03 2.77 1.17 2.97.14.19 2.03 3.1 4.93 4.34.69.3 1.22.48 1.64.61.69.22 1.32.19 1.81.11.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.5 22 22 17.52 22 12S17.5 2 12.02 2zm0 18.13c-1.66 0-3.2-.46-4.52-1.24l-.32-.19-3.01.79.8-2.93-.21-.3A8.11 8.11 0 0 1 3.87 12c0-4.5 3.66-8.13 8.15-8.13S20.17 7.5 20.17 12s-3.66 8.13-8.15 8.13z" />
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
            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <WhatsAppIcon className="h-5 w-5" />
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
            {settings.whatsapp && (
              <li className="flex gap-2">
                <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  Chat on WhatsApp
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
