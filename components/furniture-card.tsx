'use client'

import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { Furniture } from '@/lib/queries'

export function FurnitureCard({ item }: { item: Furniture }) {
  const [open, setOpen] = useState(false)
  const hasVideo = Boolean(item.videoUrl)
  const image = item.imageUrl || '/furniture/hero-showroom.png'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-shadow hover:shadow-md"
      >
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || "/placeholder.svg"}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {hasVideo && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
              <PlayCircle className="h-3.5 w-3.5 text-accent" /> Video
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {item.category}
            </span>
            {item.featured && (
              <Badge className="bg-accent text-accent-foreground hover:bg-accent">
                Featured
              </Badge>
            )}
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            {item.name}
          </h3>
          {item.price && (
            <p className="mt-auto pt-2 text-sm font-medium text-accent">
              {item.price}
            </p>
          )}
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          <div className="relative aspect-video w-full bg-muted">
            {hasVideo ? (
              <video
                src={item.videoUrl!}
                controls
                playsInline
                poster={image}
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image || "/placeholder.svg"}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="p-6">
            <DialogHeader>
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {item.category}
              </span>
              <DialogTitle className="font-serif text-2xl">{item.name}</DialogTitle>
              {item.description && (
                <DialogDescription className="pt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </DialogDescription>
              )}
            </DialogHeader>
            {item.price && (
              <p className="mt-4 text-lg font-semibold text-accent">{item.price}</p>
            )}
            <a
              href="/contact"
              className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Inquire about this piece
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
