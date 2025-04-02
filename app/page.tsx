
import Background from '@/components/Background';
import InteractionHub from '@/components/core/InteractionHub'; // Adjust path if needed


export default function Home() {
  // The Client Component aspects (state, hooks) are inside InteractionHub and RenderOverlays.

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen w-full">
      {/* Background goes behind everything */}
      <div className="absolute inset-0 -z-10">
        <Background />
      </div>
      
      <InteractionHub />      
    </div>
  );
}