import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getSettings } from '@/lib/queries'
import { ContactForm } from '@/components/contact-form'
import { Card } from '@/components/ui/card'

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.75.94-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.5.07-.77.36-.26.29-1 .98-1 2.4 0 1.41 1.03 2.77 1.17 2.97.14.19 2.03 3.1 4.93 4.34.69.3 1.22.48 1.64.61.69.22 1.32.19 1.81.11.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.5 22 22 17.52 22 12S17.5 2 12.02 2zm0 18.13c-1.66 0-3.2-.46-4.52-1.24l-.32-.19-3.01.79.8-2.93-.21-.3A8.11 8.11 0 0 1 3.87 12c0-4.5 3.66-8.13 8.15-8.13S20.17 7.5 20.17 12s-3.66 8.13-8.15 8.13z" />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Visit Us — Osbam Laboratories & Furniture Ltd.',
  description:
    'Find our showroom, opening hours, and get in touch. We would love to help you find the perfect piece.',
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Visit Us
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-foreground">
          Come see it in person
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Questions about a piece, a custom commission, or delivery? Send us a
          note or stop by the showroom.
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {settings.address && (
              <InfoItem icon={MapPin} label="Showroom">
                {settings.address}
              </InfoItem>
            )}
            {settings.hours && (
              <InfoItem icon={Clock} label="Hours">
                {settings.hours}
              </InfoItem>
            )}
            {settings.phone && (
              <InfoItem icon={Phone} label="Phone">
                <a href={`tel:${settings.phone}`} className="hover:text-foreground">
                  {settings.phone}
                </a>
              </InfoItem>
            )}
            {settings.whatsapp && (
              <InfoItem icon={WhatsAppIcon} label="WhatsApp">
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  Chat with us
                </a>
              </InfoItem>
            )}
            {settings.email && (
              <InfoItem icon={Mail} label="Email">
                <a href={`mailto:${settings.email}`} className="hover:text-foreground">
                  {settings.email}
                </a>
              </InfoItem>
            )}
          </div>

          {settings.mapEmbedUrl && (
            <div className="overflow-hidden rounded-lg border border-border">
              <iframe
                src={settings.mapEmbedUrl}
                title="Map to our showroom"
                className="h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        <Card className="p-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Send a message
          </h2>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            We typically reply within one business day.
          </p>
          <ContactForm />
        </Card>
      </div>
    </div>
  )
}

function InfoItem({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-accent">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{children}</p>
    </div>
  )
}
