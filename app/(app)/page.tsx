'use client'

import { useEffect } from 'react'
import Background from '@/components/Background'
import InteractionHubEnhanced from '@/components/core/InteractionHubEnhanced'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store'
import { ListTree } from 'lucide-react'


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
      <div className="absolute bottom-18 w-full left-1/2 transform -translate-x-1/2 z-0 max-w-xl px-4">
        <InteractionHubEnhanced />
      </div>

      <FlowSelectButton />
    </div>
  )
}

function FlowSelectButton() {
  const toggleFlowSelectOverlay = useUIStore((state) => state.toggleFlowSelectOverlay);
  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-4 right-4 z-10 rounded-full shadow-lg"
      onClick={() => toggleFlowSelectOverlay(true)}
    >
      <ListTree className="h-6 w-6" />
      <span className="sr-only">Start a flow</span>
    </Button>
  );
}
