import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import {
  getFurniture,
  getAllReviews,
  getInquiries,
  getSettings,
  getTeamMembers,
} from '@/lib/queries'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FurnitureManager } from '@/components/admin/furniture-manager'
import { ReviewsManager } from '@/components/admin/reviews-manager'
import { InquiriesList } from '@/components/admin/inquiries-list'
import { SettingsManager } from '@/components/admin/settings-manager'
import { TeamManager } from '@/components/admin/team-manager'
import { AccountManager } from '@/components/admin/account-manager'
import { SignOutButton } from '@/components/admin/sign-out-button'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const [items, reviews, inquiries, settings, team] = await Promise.all([
    getFurniture(),
    getAllReviews(),
    getInquiries(),
    getSettings(),
    getTeamMembers(),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your catalog, reviews, inquiries, and store settings.
          </p>
        </div>
        <SignOutButton />
      </div>

      <Tabs defaultValue="furniture">
        <TabsList>
          <TabsTrigger value="furniture">
            Furniture ({items.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviews.filter((r) => !r.approved).length} pending)
          </TabsTrigger>
          <TabsTrigger value="inquiries">
            Inquiries ({inquiries.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="furniture" className="mt-6">
          <FurnitureManager items={items} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsManager reviews={reviews} />
        </TabsContent>

        <TabsContent value="inquiries" className="mt-6">
          <InquiriesList inquiries={inquiries} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6 flex flex-col gap-6">
          <AccountManager
            currentName={session.user.name ?? ''}
            currentEmail={session.user.email ?? ''}
          />
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Meet Our Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamManager members={team} />
            </CardContent>
          </Card>
          <SettingsManager settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
