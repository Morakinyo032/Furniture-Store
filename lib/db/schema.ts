import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Store content is GLOBAL (managed by the owner, viewed by everyone), so these
// tables are not scoped per visitor. Writes are gated behind an authenticated
// owner session in the server actions.

export const furniture = pgTable('furniture', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().default('General'),
  description: text('description'),
  price: text('price'),
  imageUrl: text('imageUrl'),
  videoUrl: text('videoUrl'),
  featured: boolean('featured').notNull().default(false),
  sortOrder: integer('sortOrder').notNull().default(0),
  createdBy: text('createdBy'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  authorName: text('authorName').notNull(),
  location: text('location'),
  rating: integer('rating').notNull().default(5),
  body: text('body').notNull(),
  approved: boolean('approved').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const storeSettings = pgTable('store_settings', {
  id: integer('id').primaryKey().default(1),
  storeName: text('storeName').notNull().default('Oakmark & Co.'),
  tagline: text('tagline'),
  about: text('about'),
  mission: text('mission'),
  vision: text('vision'),
  coreValues: text('coreValues'),
  logoUrl: text('logoUrl'),
  heroImageUrl: text('heroImageUrl'),
  heroVideoUrl: text('heroVideoUrl'),
  address: text('address'),
  phone: text('phone'),
  whatsapp: text('whatsapp'),
  email: text('email'),
  hours: text('hours'),
  mapEmbedUrl: text('mapEmbedUrl'),
  instagram: text('instagram'),
  facebook: text('facebook'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
