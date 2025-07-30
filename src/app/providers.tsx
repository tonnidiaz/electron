// app/providers.tsx
'use client'

import {HeroUIProvider, ToastProvider} from '@heroui/react'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider className='h-full w-full relative'>
        <ToastProvider></ToastProvider>
      {children}
    </HeroUIProvider>
  )
}