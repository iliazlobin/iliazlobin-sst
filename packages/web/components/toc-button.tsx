'use client'

import { Button } from '@/components/ui/button'

export default function TocButton() {
  return (
    <Button
      variant="link"
      className="mt-3 uppercase underline underline-offset-4"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      On this page
    </Button>
  )
}
