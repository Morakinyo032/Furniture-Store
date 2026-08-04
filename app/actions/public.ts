'use server'

import { db } from '@/lib/db'
import { reviews, inquiries } from '@/lib/db/schema'
import { revalidatePath } from 'next/cache'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitReview(input: {
  authorName: string
  location?: string
  rating: number
  body: string
}) {
  const authorName = input.authorName.trim()
  const body = input.body.trim()
  const rating = Math.min(5, Math.max(1, Math.round(input.rating)))

  if (!authorName) return { error: 'Please enter your name.' }
  if (body.length < 4) return { error: 'Please write a short review.' }

  // Reviews land unapproved and appear only after the owner approves them.
  await db.insert(reviews).values({
    authorName,
    location: input.location?.trim() || null,
    rating,
    body,
    approved: false,
  })
  return { success: true }
}

export async function submitInquiry(input: {
  name: string
  email: string
  phone?: string
  message: string
}) {
  const name = input.name.trim()
  const email = input.email.trim()
  const message = input.message.trim()

  if (!name) return { error: 'Please enter your name.' }
  if (!EMAIL_RE.test(email)) return { error: 'Please enter a valid email.' }
  if (message.length < 4) return { error: 'Please enter a message.' }

  await db.insert(inquiries).values({
    name,
    email,
    phone: input.phone?.trim() || null,
    message,
  })
  revalidatePath('/admin')
  return { success: true }
}
