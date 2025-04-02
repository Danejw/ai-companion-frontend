'use client'

import { useEffect, useRef } from 'react'

type Props = {
    size: number
    color: string
    initialTop: string
    initialLeft: string
    speed?: number // pixels per frame
}

export default function FloatingBlob({
    size,
    color,
    initialTop,
    initialLeft,
    speed = 0.2, // constant speed (adjust as needed)
}: Props) {
    const blobRef = useRef<HTMLDivElement>(null)
    const position = useRef({ x: 0, y: 0 })
    const target = useRef({ x: 0, y: 0 })

    // velocity vector (unit direction * speed)
    const velocity = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const pickNewTarget = () => {
            const x = (Math.random() - 0.5) * 1000
            const y = (Math.random() - 0.5) * 1000

            const dx = x - position.current.x
            const dy = y - position.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            // create unit vector and multiply by speed
            velocity.current = {
                x: (dx / distance) * speed,
                y: (dy / distance) * speed,
            }

            target.current = { x, y }
        }

        const animate = () => {
            const dx = target.current.x - position.current.x
            const dy = target.current.y - position.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 1) {
                // Close enough, choose new direction and keep gliding
                pickNewTarget()
            }

            position.current.x += velocity.current.x
            position.current.y += velocity.current.y

            if (blobRef.current) {
                blobRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
            }

            requestAnimationFrame(animate)
        }


        pickNewTarget()
        requestAnimationFrame(animate)
    }, [speed])

    return (
        <div
            ref={blobRef}
            className="absolute rounded-full filter blur-[200px] opacity-30"
            style={{
                top: initialTop,
                left: initialLeft,
                width: size,
                height: size,
                backgroundColor: color,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    )
}
