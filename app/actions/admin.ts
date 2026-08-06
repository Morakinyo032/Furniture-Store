'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { furniture, reviews, storeSettings, inquiries } from '@/lib/db/schema'
import { del } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * The store has a single owner. Any authenticated session is the owner.
 * Every write action MUST pass through this guard — public visitors are never
 * allowed to mutate store content.
 */
async function requireOwner() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

function revalidateStore() {
  revalidatePath('/')
  revalidatePath('/catalog')
  revalidatePath('/reviews')
  revalidatePath('/about')
  revalidatePath('/contact')
  revalidatePath('/admin')
}

// --- Furniture -------------------------------------------------------------

export async function createFurniture(input: {
  name: string
  category: string
  description?: string
  price?: string
  imageUrl?: string
  videoUrl?: string
  featured?: boolean
  sortOrder?: number
}) {
  const owner = await requireOwner()
  const name = input.name.trim()
  if (!name) throw new Error('Name is required')

  await db.insert(furniture).values({
    name,
    category: input.category.trim() || 'General',
    description: input.description?.trim() || null,
    price: input.price?.trim() || null,
    imageUrl: input.imageUrl || null,
    videoUrl: input.videoUrl || null,
    featured: input.featured ?? false,
    sortOrder: input.sortOrder ?? 0,
    createdBy: owner.id,
  })
  revalidateStore()
}

export async function updateFurniture(
  id: number,
  input: {
    name: string
    category: string
    description?: string
    price?: string
    imageUrl?: string
    videoUrl?: string
    featured?: boolean
    sortOrder?: number
  },
) {
  await requireOwner()
  await db
    .update(furniture)
    .set({
      name: input.name.trim(),
      category: input.category.trim() || 'General',
      description: input.description?.trim() || null,
      price: input.price?.trim() || null,
      imageUrl: input.imageUrl || null,
      videoUrl: input.videoUrl || null,
      featured: input.featured ?? false,
      sortOrder: input.sortOrder ?? 0,
    })
    .where(eq(furniture.id, id))
  revalidateStore()
}

export async function deleteFurniture(id: number) {
  await requireOwner()
  await db.delete(furniture).where(eq(furniture.id, id))
  revalidateStore()
}

// --- Store settings --------------------------------------------------------

function str(formData: FormData, key: string) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function saveStoreSettings(formData: FormData) {
  try {
    await requireOwner()
  } catch {
    return { error: 'Unauthorized' }
  }

  const storeName = str(formData, 'storeName')
  if (!storeName) return { error: 'Store name is required' }

  const values = {
    id: 1,
    storeName,
    tagline: str(formData, 'tagline') || null,
    about: str(formData, 'about') || null,
    mission: str(formData, 'mission') || null,
    vision: str(formData, 'vision') || null,
    coreValues: str(formData, 'coreValues') || null,
    logoUrl: str(formData, 'logoUrl') || null,
    heroImageUrl: str(formData, 'heroImageUrl') || null,
    heroVideoUrl: str(formData, 'heroVideoUrl') || null,
    address: str(formData, 'address') || null,
    phone: str(formData, 'phone') || null,
    whatsapp: str(formData, 'whatsapp') || null,
    email: str(formData, 'email') || null,
    hours: str(formData, 'hours') || null,
    mapEmbedUrl: str(formData, 'mapEmbedUrl') || null,
    instagram: str(formData, 'instagram') || null,
    facebook: str(formData, 'facebook') || null,
  }
  await db
    .insert(storeSettings)
    .values(values)
    .onConflictDoUpdate({ target: storeSettings.id, set: values })
  revalidateStore()
  return { success: true }
}

// --- Reviews moderation ----------------------------------------------------

export async function setReviewApproval(id: number, approved: boolean) {
  await requireOwner()
  await db.update(reviews).set({ approved }).where(eq(reviews.id, id))
  revalidateStore()
}

export async function deleteReview(id: number) {
  await requireOwner()
  await db.delete(reviews).where(eq(reviews.id, id))
  revalidateStore()
}

// --- Inquiries ---------------------------------------------------------

export async function deleteInquiry(id: number) {
  await requireOwner()
  await db.delete(inquiries).where(eq(inquiries.id, id))
  revalidateStore()
}

// --- Media cleanup ---------------------------------------------------------

export async function deleteBlob(url: string) {
  await requireOwner()
  if (url && url.startsWith('http')) {
    try {
      await del(url)
    } catch {
      // Ignore — the blob may already be gone.
    }
  }
}
