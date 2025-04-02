'use client'

import { useEffect } from 'react'
import Background from '@/components/Background'
import InteractionHub from '@/components/core/InteractionHub'

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
      <div className="absolute inset-0 -z-10">
        <Background />
      </div>

      {/* InteractionHub */}
      <div className="absolute bottom-48 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-xl px-4">
        <InteractionHub />
      </div>
    </div>
  )
}
