import type { Metadata } from 'next'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { getSettings } from '@/lib/queries'
import { ContactForm } from '@/components/contact-form'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Visit Us — Oakmark & Co.',
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
