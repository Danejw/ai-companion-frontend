'use client'

import { useEffect, useRef } from 'react'

type BlobProps = {
    color: string
    size: number
    initialX: number
    initialY: number
    speed?: number // pixels per frame
}

const targets = new Map<number, { x: number, y: number }>()
let syncedInitialized = false

const setSyncedTargets = (ids: number[], range: number) => {
    ids.forEach((id) => {
        targets.set(id, {
            x: (Math.random() - 0.5) * range,
            y: (Math.random() - 0.5) * range,
        })
    })
}

let globalIdCounter = 0

function AnimatedCircle({ color, size, initialX, initialY, speed = 0.2 }: BlobProps) {
    const circleRef = useRef<SVGCircleElement | null>(null)
    const position = useRef({ x: initialX, y: initialY })
    const lastUpdate = useRef(performance.now())
    const id = useRef(globalIdCounter++)

    useEffect(() => {
        if (!syncedInitialized) {
            setSyncedTargets([0, 1, 2, 3], 60)
            syncedInitialized = true
            setInterval(() => setSyncedTargets([0, 1, 2, 3], 60), 4000)
        }

        const animate = (time: number) => {
            const dt = (time - lastUpdate.current) / 16.67
            lastUpdate.current = time

            const target = targets.get(id.current) || { x: 0, y: 0 }

            const dx = (initialX + target.x) - position.current.x
            const dy = (initialY + target.y) - position.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            const vx = (dx / distance) * speed
            const vy = (dy / distance) * speed

            position.current.x += vx * dt
            position.current.y += vy * dt

            if (circleRef.current) {
                circleRef.current.setAttribute('cx', position.current.x.toString())
                circleRef.current.setAttribute('cy', position.current.y.toString())
            }

            requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }, [initialX, initialY, speed])

    return <circle ref={circleRef} cx={initialX} cy={initialY} r={size} fill={color} opacity="0.6" />
}

export default function AnimatedBlobLogo() {
    return (
        <svg width="50" height="50" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <AnimatedCircle color="#f472b6" size={20} initialX={60} initialY={60} />
            <AnimatedCircle color="#818cf8" size={20} initialX={100} initialY={100} />
            <AnimatedCircle color="#facc15" size={20} initialX={140} initialY={60} />
            <AnimatedCircle color="#a78bfa" size={20} initialX={100} initialY={140} />
        </svg>
    )
}