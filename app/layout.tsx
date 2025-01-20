import './globals.css'
import Footer from '@/components/footer'
import Nav from '@/components/nav'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Switch 2 Mockup',
  description:
    'A sleek and easy-to-use tool for generating Switch 2 mockups. Made with 🤍 by Yiwei.',
  openGraph: {
    title: 'Switch 2 Mockup',
    description:
      'A sleek and easy-to-use tool for generating Switch 2 mockups. Made with 🤍 by Yiwei.',
    url: 'https://switch2-mockup.vercel.app',
    siteName: 'Switch 2 Mockup',
    images: [
      {
        url: 'https://switch2-mockup.vercel.app/assets/og.png',
        alt: 'Switch 2 Mockup',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@1weiho',
    creator: '@1weiho',
  },
  metadataBase: new URL('https://switch2-mockup.vercel.app'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-200 font-[family-name:var(--font-geist-mono)] min-h-screen flex flex-col`}
      >
        <TooltipProvider delayDuration={300}>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  )
}
