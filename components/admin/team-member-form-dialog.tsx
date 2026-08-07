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
import { createTeamMember, updateTeamMember } from '@/app/actions/admin'
import type { TeamMember } from '@/lib/queries'

export function TeamMemberFormDialog({
  trigger,
  item,
}: {
  trigger: React.ReactNode
  item?: TeamMember
}) {
  const editing = Boolean(item)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(item?.name ?? '')
  const [role, setRole] = useState(item?.role ?? '')
  const [bio, setBio] = useState(item?.bio ?? '')
  const [photoUrl, setPhotoUrl] = useState(item?.photoUrl ?? '')
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
      role,
      bio,
      photoUrl,
      sortOrder: Number(sortOrder) || 0,
    }
    try {
      if (editing && item) {
        await updateTeamMember(item.id, payload)
        toast.success('Profile updated')
      } else {
        await createTeamMember(payload)
        toast.success('Profile added')
      }
      setOpen(false)
      if (!editing) {
        setName('')
        setRole('')
        setBio('')
        setPhotoUrl('')
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
            {editing ? 'Edit profile' : 'Add a team member'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="t-name">Name</Label>
            <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="t-role">Role</Label>
            <Input
              id="t-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Master Carpenter, Lab Furniture Lead"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="t-bio">Short bio</Label>
            <Textarea
              id="t-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="A sentence or two about their background and specialty."
            />
          </div>

          <MediaUploader label="Photo" value={photoUrl} onChange={setPhotoUrl} accept="image" />

          <div className="flex flex-col gap-2">
            <Label htmlFor="t-order">Display order</Label>
            <Input
              id="t-order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first (e.g. the owner as 0).
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editing ? 'Save changes' : 'Add profile'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}