"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteInquiry } from "@/app/actions/admin"
import { toast } from "sonner"

type Inquiry = {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  createdAt: Date
}

export function InquiriesList({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter()
  const [pending, setPending] = useState<number | null>(null)

  async function remove(id: number) {
    setPending(id)
    await deleteInquiry(id)
    setPending(null)
    toast.success("Inquiry removed")
    router.refresh()
  }

  if (inquiries.length === 0) {
    return <p className="text-muted-foreground">No customer inquiries yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id}>
          <CardContent className="flex flex-col gap-2 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{inquiry.name}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
              <a href={`mailto:${inquiry.email}`} className="hover:text-accent">
                {inquiry.email}
              </a>
              {inquiry.phone ? <span>{inquiry.phone}</span> : null}
            </div>
            <p className="text-sm leading-relaxed">{inquiry.message}</p>
            <div>
              <Button size="sm" variant="ghost" disabled={pending === inquiry.id} onClick={() => remove(inquiry.id)}>
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
