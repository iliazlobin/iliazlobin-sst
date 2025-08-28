'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Icons } from '@iliazlobin/web/components/icons'
import { Badge } from '@iliazlobin/web/components/ui/badge'
import { siteConfig } from '@iliazlobin/web/config/site'
import { cn } from '@iliazlobin/web/lib/utils'

import * as React from 'react'

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/blog" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/videos"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/blog' ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Videos
        </Link>
        <Link
          href="/blog"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/blog' ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          Blog
        </Link>
        {/* <Link
          href="/blog/tags"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/blog/tags'
              ? 'text-foreground'
              : 'text-foreground/60',
          )}
        >
          Tags
        </Link> */}
        <Link
          href="/about"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/blog' ? 'text-foreground' : 'text-foreground/60',
          )}
        >
          About
        </Link>
      </nav>
    </div>
  )
}
