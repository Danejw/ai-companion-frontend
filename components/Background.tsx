import FloatingBlob from './FloatingBlob'
import clsx from 'clsx'

interface BackgroundProps {
    className?: string;
}

export default function Background({ className }: BackgroundProps) {
    return (
        <div className={clsx("absolute inset-0 -z-10", className)}>
            <div className="w-full h-full animate-gradientShift" />

            <FloatingBlob size={800} color="#f472b6" initialTop="10%" initialLeft="5%" />
            <FloatingBlob size={900} color="#818cf8" initialTop="60%" initialLeft="20%" />
            <FloatingBlob size={700} color="#facc15" initialTop="30%" initialLeft="75%" />
            <FloatingBlob size={800} color="#a78bfa" initialTop="70%" initialLeft="60%" />

        </div>
    )
}
