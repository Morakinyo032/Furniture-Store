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
import { createProject, updateProject } from '@/app/actions/admin'
import type { Project } from '@/lib/queries'

export function ProjectFormDialog({
  trigger,
  item,
}: {
  trigger: React.ReactNode
  item?: Project
}) {
  const editing = Boolean(item)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(item?.title ?? '')
  const [clientName, setClientName] = useState(item?.clientName ?? '')
  const [location, setLocation] = useState(item?.location ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? '')
  const [completedDate, setCompletedDate] = useState(item?.completedDate ?? '')
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0))
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a project title.')
      return
    }
    setLoading(true)
    const payload = {
      title,
      clientName,
      location,
      description,
      imageUrl,
      completedDate,
      sortOrder: Number(sortOrder) || 0,
    }
    try {
      if (editing && item) {
        await updateProject(item.id, payload)
        toast.success('Project updated')
      } else {
        await createProject(payload)
        toast.success('Project added')
      }
      setOpen(false)
      if (!editing) {
        setTitle('')
        setClientName('')
        setLocation('')
        setDescription('')
        setImageUrl('')
        setCompletedDate('')
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
            {editing ? 'Edit project' : 'Add a project'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="p-title">Project title</Label>
            <Input
              id="p-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics & Chemistry Lab Setup"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-client">Client name</Label>
              <Input
                id="p-client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Bright Future Academy"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-location">Location</Label>
              <Input
                id="p-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ikorodu, Lagos"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
              id="p-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What was built, and any details worth mentioning."
            />
          </div>

          <MediaUploader label="Project photo" value={imageUrl} onChange={setImageUrl} accept="image" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-date">Completed (optional)</Label>
              <Input
                id="p-date"
                value={completedDate}
                onChange={(e) => setCompletedDate(e.target.value)}
                placeholder="e.g. March 2025"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-order">Display order</Label>
              <Input
                id="p-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Save changes' : 'Add project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}