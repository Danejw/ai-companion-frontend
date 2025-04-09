'use client'

import { useEffect } from 'react'
import Background from '@/components/Background'
import InteractionHubStream from '@/components/core/InteractionHubStream'

export default function Home() {
  // Disable scroll when this page is mounted
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [])

  return (
    <div className="relative h-screen w-full">

      {/* Background */}
      <div className="absolute inset-0">
        <Background />
      </div>

      {/* InteractionHub */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-0 w-full max-w-xl px-4">
        <InteractionHubStream />
      </div>
    </div>
  )
}
