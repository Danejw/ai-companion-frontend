'use client'

import { useEffect } from 'react'
import Background from '@/components/Background'
import InteractionHubEnhanced from '@/components/core/InteractionHubEnhanced'
import { useUIStore } from '@/store'
import { Button } from '@/components/ui/button'


export default function Home() {
  // Disable scroll when this page is mounted
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = original
    }
  }, [])

  const togglePhq4Overlay = useUIStore((state) => state.togglePhq4Overlay)

  return (
    <div className="relative h-screen w-full">

      {/* Background */}
      <div className="absolute inset-0">
        <Background />
      </div>

      {/* InteractionHub */}
      <div className="absolute bottom-18 w-full left-1/2 transform -translate-x-1/2 z-0 max-w-xl px-4">
        <InteractionHubEnhanced />
      </div>

      {/* PHQ-4 Overlay */}
      {/* button to toggle the phq4 overlay */}
      <Button 
        variant="default"
        className="absolute top-4 right-4 px-4 py-2 rounded-md"
        onClick={() => togglePhq4Overlay(true)}
      >
        Open PHQ-4
      </Button>
    </div>
  )
}
