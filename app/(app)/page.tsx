import InteractionHub from '@/components/core/InteractionHub'; // Adjust path if needed

export default function InteractionPage() {
    return (
        // Use Flexbox to center the InteractionHub vertically and horizontally
        // Takes full height minus header (assuming header is fixed h-14, adjust if needed)
        // The parent layout might need `flex-1` on the main element for this to work perfectly.
        <div className="flex flex-1 flex-col items-center justify-center h-full w-full p-4">
            {/*
         Consider adding a subtle background here if desired,
         e.g., bg-gradient-to-br from-background to-slate-50 dark:to-slate-900
         Keep it minimal.
       */}
            <InteractionHub />
        </div>
    );
}