'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, PlayCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { FurnitureFormDialog } from '@/components/admin/furniture-form-dialog'
import { deleteFurniture, deleteBlob } from '@/app/actions/admin'
import type { Furniture } from '@/lib/queries'

export function FurnitureManager({ items }: { items: Furniture[] }) {
  const [pendingDelete, setPendingDelete] = useState<Furniture | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteFurniture(pendingDelete.id)
      // Clean up uploaded media from Blob storage (ignore local seed assets).
      if (pendingDelete.imageUrl) await deleteBlob(pendingDelete.imageUrl)
      if (pendingDelete.videoUrl) await deleteBlob(pendingDelete.videoUrl)
      toast.success('Piece removed')
      setPendingDelete(null)
    } catch {
      toast.error('Could not remove the piece.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Furniture ({items.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Add, edit, and remove the pieces shown in your collection.
          </p>
        </div>
        <FurnitureFormDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add piece
            </Button>
          }
        />
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          No pieces yet. Click &ldquo;Add piece&rdquo; to create your first one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="relative aspect-4/3 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl || '/furniture/hero-showroom.png'}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                {item.videoUrl && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-xs text-foreground">
                    <PlayCircle className="h-3 w-3 text-accent" /> Video
                  </span>
                )}
                {item.featured && (
                  <Badge className="absolute left-2 top-2 bg-accent text-accent-foreground hover:bg-accent">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {item.category}
                </span>
                <h3 className="font-medium text-foreground">{item.name}</h3>
                {item.price && (
                  <p className="text-sm text-accent">{item.price}</p>
                )}
                <div className="mt-4 flex gap-2 pt-2">
                  <FurnitureFormDialog
                    item={item}
                    trigger={
                      <Button variant="outline" size="sm" className="flex-1">
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </Button>
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(item)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove this piece?</DialogTitle>
            <DialogDescription>
              &ldquo;{pendingDelete?.name}&rdquo; will be permanently removed from your
              collection. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
