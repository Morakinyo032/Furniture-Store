"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MediaUploader } from "@/components/admin/media-uploader"
import { saveStoreSettings } from "@/app/actions/admin"
import { toast } from "sonner"

type Settings = {
  storeName: string | null
  tagline: string | null
  about: string | null
  heroImageUrl: string | null
  heroVideoUrl: string | null
  address: string | null
  phone: string | null
  email: string | null
  hours: string | null
  mapEmbedUrl: string | null
  instagram: string | null
  facebook: string | null
}

export function SettingsManager({ settings }: { settings: Settings }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl ?? "")
  const [heroVideoUrl, setHeroVideoUrl] = useState(settings.heroVideoUrl ?? "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData(e.currentTarget)
    formData.set("heroImageUrl", heroImageUrl)
    formData.set("heroVideoUrl", heroVideoUrl)
    const result = await saveStoreSettings(formData)
    setSaving(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success("Store details saved")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Brand</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="storeName">Store name</Label>
              <Input id="storeName" name="storeName" defaultValue={settings.storeName ?? ""} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={settings.tagline ?? ""} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="about">About the store</Label>
            <Textarea id="about" name="about" rows={5} defaultValue={settings.about ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Homepage hero media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <MediaUploader label="Hero image" accept="image" value={heroImageUrl} onChange={setHeroImageUrl} />
          <MediaUploader label="Hero video (optional)" accept="video" value={heroVideoUrl} onChange={setHeroVideoUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Contact &amp; location</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={settings.phone ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={settings.email ?? ""} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={settings.address ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="hours">Opening hours</Label>
            <Input id="hours" name="hours" defaultValue={settings.hours ?? ""} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="mapEmbedUrl">Google Maps embed URL</Label>
            <Input
              id="mapEmbedUrl"
              name="mapEmbedUrl"
              placeholder="https://www.google.com/maps/embed?..."
              defaultValue={settings.mapEmbedUrl ?? ""}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input id="instagram" name="instagram" defaultValue={settings.instagram ?? ""} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input id="facebook" name="facebook" defaultValue={settings.facebook ?? ""} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save store details"}
        </Button>
      </div>
    </form>
  )
}
