import Link from 'next/link';
import AnimatedBlobLogo from '@/components/Logo'; // Reuse the logo if desired
import { Button } from './ui/button';

export default function InfoFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 border-t bg-background"> {/* Add bg-background or similar */}
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo and Copyright */}
                    <div className="flex items-center gap-2">
                        <div className="scale-75 transform-gpu"> {/* Adjust scale if needed */}
                            <AnimatedBlobLogo />
                        </div>
                        <span className="text-sm text-muted-foreground font-bold">
                            &copy; {currentYear} <span className="text-accent">Knolia</span>. All rights reserved.
                        </span>
                    </div>

                    {/* Footer Links */}
                    <div className="flex text-sm">
                        <Button asChild variant="ghost" size="sm" className="justify-start">
                            <Link href="/about">About</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="justify-start">
                            <Link href="/privacy">Privacy</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="justify-start">
                            <Link href="/terms">Terms</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="justify-start">
                            <Link href="/contact">Contact</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
} 