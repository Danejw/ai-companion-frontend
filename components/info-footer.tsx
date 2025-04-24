import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function InfoFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo and Copyright */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground font-bold">
                            &copy; {currentYear} <span className="text-accent">Knolia</span>. All rights reserved.
                        </span>
                    </div>

                    {/* Footer Links */}
                    <div className="flex text-sm">
                        <Button asChild variant="ghost" size="sm" className="justify-start">
                            <Link href="/welcome">Home</Link>
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