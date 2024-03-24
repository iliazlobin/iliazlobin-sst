import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/providers'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Toaster as NewYorkSonner } from '@/components/ui/sonner'
import {
  Toaster as DefaultToaster,
  Toaster as NewYorkToaster,
} from '@/components/ui/toaster'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

// import mystyle from "@/styles/mystyle.module.css"
import { GeistSans } from 'geist/font/sans'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI',
  ],
  authors: [
    {
      name: 'iliazlobin',
      url: 'https://iliazlobin.com',
    },
  ],
  creator: 'iliazlobin',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    // images: [new ImageResponse({
    //   element: 'meta',
    // })]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    // images: [siteConfig.ogImage],
    creator: '@shadcn',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            GeistSans.className,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div vaul-drawer-wrapper="">
              <div className="relative flex min-h-screen flex-col bg-background">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </div>
            <TailwindIndicator />
            <ThemeSwitcher />
            <NewYorkToaster />
            <DefaultToaster />
            <NewYorkSonner />
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
