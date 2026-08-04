'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MediaUploader } from '@/components/admin/media-uploader'
import { createFurniture, updateFurniture } from '@/app/actions/admin'
import type { Furniture } from '@/lib/queries'

export function FurnitureFormDialog({
  trigger,
  item,
}: {
  trigger: React.ReactNode
  item?: Furniture
}) {
  const editing = Boolean(item)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState(item?.category ?? '')
  const [price, setPrice] = useState(item?.price ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? '')
  const [videoUrl, setVideoUrl] = useState(item?.videoUrl ?? '')
  const [featured, setFeatured] = useState(item?.featured ?? false)
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0))
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a name.')
      return
    }
    setLoading(true)
    const payload = {
      name,
      category: category || 'General',
      description,
      price,
      imageUrl,
      videoUrl,
      featured,
      sortOrder: Number(sortOrder) || 0,
    }
    try {
      if (editing && item) {
        await updateFurniture(item.id, payload)
        toast.success('Piece updated')
      } else {
        await createFurniture(payload)
        toast.success('Piece added')
      }
      setOpen(false)
      if (!editing) {
        setName('')
        setCategory('')
        setPrice('')
        setDescription('')
        setImageUrl('')
        setVideoUrl('')
        setFeatured(false)
        setSortOrder('0')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {editing ? 'Edit piece' : 'Add a new piece'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="f-name">Name</Label>
            <Input id="f-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="f-category">Category</Label>
              <Input
                id="f-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Living Room"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="f-price">Price label</Label>
              <Input
                id="f-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. From $1,200"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="f-desc">Description</Label>
            <Textarea
              id="f-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <MediaUploader label="Photo" value={imageUrl} onChange={setImageUrl} accept="image" />
          <MediaUploader label="Video (optional)" value={videoUrl} onChange={setVideoUrl} accept="video" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="f-order">Sort order</Label>
              <Input
                id="f-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-3 self-end rounded-md border border-border px-3 py-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              <span className="text-sm text-foreground">Feature on homepage</span>
            </label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Save changes' : 'Add piece'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
