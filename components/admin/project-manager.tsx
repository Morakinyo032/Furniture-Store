'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Pencil, Plus, Trash2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ProjectFormDialog } from '@/components/admin/project-form-dialog'
import { deleteProject } from '@/app/actions/admin'
import type { Project } from '@/lib/queries'

export function ProjectManager({ projects }: { projects: Project[] }) {
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteProject(pendingDelete.id)
      toast.success('Project removed')
      setPendingDelete(null)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          These appear in the &ldquo;Our Projects&rdquo; section on your homepage.
        </p>
        <ProjectFormDialog
          trigger={
            <Button type="button" size="sm">
              <Plus className="h-4 w-4" />
              Add project
            </Button>
          }
        />
      </div>

      {projects.length === 0 ? (
        <p className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
          No projects added yet.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-md border border-border">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-3 p-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{project.title}</p>
                {project.clientName && (
                  <p className="truncate text-sm text-muted-foreground">{project.clientName}</p>
                )}
              </div>
              <ProjectFormDialog
                item={project}
                trigger={
                  <Button type="button" variant="ghost" size="icon" aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Delete"
                onClick={() => setPendingDelete(project)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove this project?</DialogTitle>
            <DialogDescription>
              &ldquo;{pendingDelete?.title}&rdquo; will no longer appear on your homepage.
              This can&rsquo;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Removing...' : 'Remove'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}