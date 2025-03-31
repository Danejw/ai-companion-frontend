
import InteractionHub from '@/components/core/InteractionHub'; // Adjust path if needed

export default function Home() {
  // Note: This page component itself might be a Server Component by default.
  // The Client Component aspects (state, hooks) are inside InteractionHub and RenderOverlays.

  return (
    // Use Flexbox to center the InteractionHub vertically and horizontally
    // We assume the RootLayout's body/main structure allows this to fill the height.
    // The 'min-h-screen' ensures it takes at least the full viewport height.
    // 'pt-14' assumes a fixed header height from RootLayout is pushing content down. Adjust if needed.
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen w-full p-4 pt-14">
      {/*
         Optional minimal background can go here.
         e.g., 'bg-gradient-to-br from-background to-slate-50 dark:to-slate-900'
       */}
      <InteractionHub />
    </div>
  );
}