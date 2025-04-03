'use client'

import { useEffect, useRef } from 'react'

const NUM_BLOBS = 4
const BASE_Y = 90
const colors = ['#f472b6', '#818cf8', '#facc15', '#a78bfa']
const baseX = [30, 70, 110, 150]

export default function AudioVisualizer() {
    const amplitude = 40      // vertical range of motion
    const speed = 0.03        // how fast the phase increases
    const easing = 0.3       // how smooth the motion is
    const delayBetweenBlobs = 700 // delay in ms before each blob starts

    const circlesRef = useRef<(SVGCircleElement | null)[]>([])
    const phase = useRef<number[]>(Array(NUM_BLOBS).fill(0))
    const isStarted = useRef<boolean[]>(Array(NUM_BLOBS).fill(false))

    useEffect(() => {
        const startTimers = () => {
            for (let i = 0; i < NUM_BLOBS; i++) {
                setTimeout(() => {
                    isStarted.current[i] = true
                }, i * delayBetweenBlobs)
            }
        }

        const animate = () => {
            for (let i = 0; i < NUM_BLOBS; i++) {
                if (!isStarted.current[i]) continue
                const circle = circlesRef.current[i]
                if (circle) {
                    phase.current[i] += speed
                    const targetY = BASE_Y + Math.sin(phase.current[i]) * amplitude
                    const current = parseFloat(circle.getAttribute('cy') || `${BASE_Y}`)
                    const easedY = current + (targetY - current) * easing
                    circle.setAttribute('cy', easedY.toString())
                }
            }
            requestAnimationFrame(animate)
        }

        startTimers()
        requestAnimationFrame(animate)
    }, [])

    return (
        <svg width="200" height="200" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
            {colors.map((color, i) => (
                <circle
                    key={i}
                    ref={(el) => void (circlesRef.current[i] = el)}
                    cx={baseX[i]}
                    cy={BASE_Y}
                    r={12}
                    fill={color}
                    opacity={0.7}
                />
            ))}
        </svg>
    )
}
