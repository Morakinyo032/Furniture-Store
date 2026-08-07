import { betterAuth } from 'better-auth'
import { APIError } from 'better-auth/api'
import { pool } from '@/lib/db'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

export const auth = betterAuth({
  database: pool,
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.V0_RUNTIME_URL),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
   user: {
   changeEmail: {
     enabled: true,
     // No transactional email service is set up for this single-owner
     // store, so we skip the verification-email step. This only works
     // while the account's email is still unverified (true here, since
     // sign-up never sends a verification email) — don't reuse this
     // pattern for a multi-user app with real customer accounts.
     updateEmailWithoutVerification: true,
   },
 },
  // This store has a single owner account. Once that account exists, block
  // any further account creation so a stranger can never sign up and get
  // admin access. Enforced at the database layer so it applies no matter
  // which endpoint (email/password, social, etc.) is used.
  databaseHooks: {
    user: {
      create: {
        before: async () => {
          const existing = await db.select({ id: user.id }).from(user).limit(1)
          if (existing.length > 0) {
            throw new APIError('BAD_REQUEST', {
              message: 'Sign-ups are closed for this store.',
            })
          }
          return { data: {} }
        },
      },
    },
  },
  trustedOrigins: [
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
