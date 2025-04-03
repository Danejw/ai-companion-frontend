import FloatingBlob from './FloatingBlob'

export default function Background() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-br from-[#fdf6f9] via-[#f5f7ff] to-[#fdfaf3] bg-size-200 animate-gradientShift" />

            <FloatingBlob size={800} color="#f472b6" initialTop="10%" initialLeft="5%" />
            <FloatingBlob size={900} color="#818cf8" initialTop="60%" initialLeft="20%" />
            <FloatingBlob size={700} color="#facc15" initialTop="30%" initialLeft="75%" />
            <FloatingBlob size={800} color="#a78bfa" initialTop="70%" initialLeft="60%" />

        </div>
    )
}
