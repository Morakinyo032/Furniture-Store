'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function AccountManager({
  currentName,
  currentEmail,
}: {
  currentName: string
  currentEmail: string
}) {
  const router = useRouter()

  const [name, setName] = useState(currentName)
  const [savingProfile, setSavingProfile] = useState(false)

  const [email, setEmail] = useState(currentEmail)
  const [savingEmail, setSavingEmail] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name can\u2019t be empty.')
      return
    }
    setSavingProfile(true)
    try {
      const { error } = await authClient.updateUser({ name: name.trim() })
      if (error) throw new Error(error.message)
      toast.success('Name updated')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update name.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    setSavingEmail(true)
    try {
      const { error } = await authClient.changeEmail({ newEmail: email.trim() })
      if (error) throw new Error(error.message)
      toast.success('Email updated')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update email.')
    } finally {
      setSavingEmail(false)
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords don\u2019t match.')
      return
    }
    setSavingPassword(true)
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })
      if (error) throw new Error(error.message)
      toast.success('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Your account</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3">
          <Label htmlFor="acc-name">Name</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="acc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sm:max-w-sm"
            />
            <Button type="submit" disabled={savingProfile} className="sm:w-fit">
              {savingProfile ? 'Saving...' : 'Save name'}
            </Button>
          </div>
        </form>

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3 border-t border-border pt-6">
          <Label htmlFor="acc-email">Email (used to sign in)</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="acc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sm:max-w-sm"
            />
            <Button type="submit" disabled={savingEmail} className="sm:w-fit">
              {savingEmail ? 'Saving...' : 'Save email'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use this new email the next time you sign in.
          </p>
        </form>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 border-t border-border pt-6">
          <Label>Change password</Label>
          <div className="grid gap-3 sm:max-w-sm">
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={savingPassword} className="sm:w-fit">
            {savingPassword ? 'Saving...' : 'Update password'}
          </Button>
          <p className="text-xs text-muted-foreground">
            This will sign you out of any other devices currently logged in.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}