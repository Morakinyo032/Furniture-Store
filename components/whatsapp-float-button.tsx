import { getSettings } from '@/lib/queries'

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.47 14.38c-.29-.15-1.72-.85-1.99-.95-.27-.1-.46-.15-.66.15-.19.29-.75.94-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.5.07-.77.36-.26.29-1 .98-1 2.4 0 1.41 1.03 2.77 1.17 2.97.14.19 2.03 3.1 4.93 4.34.69.3 1.22.48 1.64.61.69.22 1.32.19 1.81.11.55-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.5 22 22 17.52 22 12S17.5 2 12.02 2zm0 18.13c-1.66 0-3.2-.46-4.52-1.24l-.32-.19-3.01.79.8-2.93-.21-.3A8.11 8.11 0 0 1 3.87 12c0-4.5 3.66-8.13 8.15-8.13S20.17 7.5 20.17 12s-3.66 8.13-8.15 8.13z" />
    </svg>
  )
}

export async function WhatsAppFloatButton() {
  const settings = await getSettings()
  if (!settings.whatsapp) return null

  const message = encodeURIComponent(
    `Hi ${settings.storeName}, I'd like to ask about your furniture.`,
  )

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
