'use client'

import { Style } from '@iliazlobin/web/components/styles'
import { useConfig } from '@iliazlobin/web/hooks/use-config'

import * as React from 'react'

interface StyleWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  styleName?: Style['name']
}

export function StyleWrapper({ styleName, children }: StyleWrapperProps) {
  const [config] = useConfig()

  if (!styleName || config.style === styleName) {
    return <>{children}</>
  }

  return null
}
