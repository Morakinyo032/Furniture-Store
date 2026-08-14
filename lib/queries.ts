import 'server-only'
import { db } from '@/lib/db'
import { furniture, reviews, storeSettings, inquiries, teamMembers, projects } from '@/lib/db/schema'
import { asc, desc, eq } from 'drizzle-orm'

const DEFAULT_SETTINGS = {
  id: 1,
  storeName: 'Oakmark & Co.',
  tagline: 'Handcrafted furniture for a life well lived.',
  about: null,
  mission: null,
  vision: null,
  coreValues: null,
  logoUrl: null,
  heroImageUrl: null,
  heroVideoUrl: null,
  address: null,
  phone: null,
  whatsapp: null,
  email: null,
  hours: null,
  mapEmbedUrl: null,
  instagram: null,
  facebook: null,
  createdAt: new Date(),
}

export type StoreSettings = typeof DEFAULT_SETTINGS
export type Furniture = typeof furniture.$inferSelect
export type Review = typeof reviews.$inferSelect
export type Inquiry = typeof inquiries.$inferSelect
export type TeamMember = typeof teamMembers.$inferSelect
export type Project = typeof projects.$inferSelect

export async function getSettings(): Promise<StoreSettings> {
  const rows = await db
    .select()
    .from(storeSettings)
    .where(eq(storeSettings.id, 1))
    .limit(1)
  return (rows[0] as StoreSettings) ?? DEFAULT_SETTINGS
}

export async function getFurniture(): Promise<Furniture[]> {
  return db
    .select()
    .from(furniture)
    .orderBy(asc(furniture.sortOrder), desc(furniture.createdAt))
}

export async function getFeaturedFurniture(): Promise<Furniture[]> {
  return db
    .select()
    .from(furniture)
    .where(eq(furniture.featured, true))
    .orderBy(asc(furniture.sortOrder))
}

export async function getApprovedReviews(): Promise<Review[]> {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.approved, true))
    .orderBy(desc(reviews.createdAt))
}

export async function getAllReviews(): Promise<Review[]> {
  return db.select().from(reviews).orderBy(desc(reviews.createdAt))
}

export async function getInquiries(): Promise<Inquiry[]> {
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt))
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), desc(teamMembers.createdAt))
}

export async function getProjects(): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
}