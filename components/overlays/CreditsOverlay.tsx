'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { fetchCreditBalance, createCheckoutSession } from '../../lib/api/stripe'; // Adjust path if needed
import { Button } from '@/components/ui/button';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import {Card, CardContent} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader2, Info, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define credit packages
const creditPackages = [
    { name: 'tier1', credits: 100, price: '$2', title: '$2 for 100 Credits'},
    { name: 'tier2', credits: 320, price: '$6', title: '$6 for 320 Credits' },
    { name: 'tier3', credits: 660, price: '$12', title: '$12 for 660 Credits', isDefault: true },
    { name: 'tier4', credits: 1400, price: '$24', title: '$24 for 1400 Credits' },
    { name: 'tier5', credits: 3000, price: '$48', title: '$48 for 3000 Credits' }
];


let stripePublishableKey: string;
if (process.env.NEXT_PUBLIC_ENV === 'development') {
    stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST ?? '';
    console.log('Using TEST stripe key in development mode');
} else {
    stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ?? '';
    console.log('Using LIVE stripe key in production mode');
}



// Stripe loading logic
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
    if (!stripePromise) {
        const stripeKey = stripePublishableKey;
        if (stripeKey) {
            stripePromise = loadStripe(stripeKey);
        } else {
            console.error("Stripe Publishable Key is not set in environment variables.");
            stripePromise = Promise.resolve(null);
        }
    }
    return stripePromise;
};

// Props Interface
interface CreditsOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Component Definition
export default function CreditsOverlay({ open, onOpenChange }: CreditsOverlayProps) {

    const [processingTier, setProcessingTier] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<string>('Tier 3'); // Default to Tier 3 package
NEXT_PUBLIC_ENV
    // Fetch credit balance query
    const {
        data: balanceData,
        isLoading: isLoadingBalance,
        error: balanceError,
    } = useQuery({
        queryKey: ['creditBalance'],
        queryFn: fetchCreditBalance,
        enabled: open,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
    });

    // Checkout mutation
    const checkoutMutation = useMutation({
        mutationFn: createCheckoutSession,
        onSuccess: async (data) => {
            const stripe = await getStripe();
            if (!stripe) {
                toast.error("Stripe configuration error.");
                setProcessingTier(null);
                return;
            }
            const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
            if (error) {
                console.error("Stripe redirect error:", error);
                toast.error("Checkout Failed");
                setProcessingTier(null);
            }
        },
        onError: (error: Error) => {
            console.error("Checkout session creation error:", error);
            toast.error("Checkout Failed");
            setProcessingTier(null);
        },
    });

    const handlePurchaseClick = (tier: string) => {
        if (processingTier) return;
        setProcessingTier(tier);
        checkoutMutation.mutate(tier);
    };

    // Get bolt icons based on package tier
    const getBoltIcons = (packageName: string) => {
        switch (packageName) {
            case 'Tier 1':
                return <Zap className="h-5 w-5" />;
            case 'Tier 2':
                return (
                    <>
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                    </>
                );
            case 'Tier 3':
                return (
                    <>
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                    </>
                );
            case 'Tier 4':
                return (
                    <>
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                    </>
                );
            case 'Tier 5':
                return (
                    <>
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                    </>
                );
            default:
                return <Zap className="h-5 w-5" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm sm:max-w-lg md:max-w-xl p-3 sm:p-4 overflow-y-auto w-[95vw] max-h-[90vh] sm:max-h-[85vh] !top-[10%] !translate-y-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg sm:text-xl">
                        Buy one-time credits
                    </DialogTitle>
                    <DialogDescription className="text-sm pt-1">
                        Buy credits instantly with a one-time purchase. Credits are added to your account immediately after payment and never expire.
                    </DialogDescription>
                </DialogHeader>

                {/* Compact Current Balance */}
                <div className="my-2 rounded-md border p-3">
                    <h3 className="text-sm font-medium">Current Balance</h3>
                    {isLoadingBalance && <Skeleton className="h-6 w-24" />}
                    {balanceError && <p className="text-sm text-destructive flex items-center"><Info className="mr-1 h-3 w-3" /> Could not load balance.</p>}
                    {!isLoadingBalance && !balanceError && balanceData && (
                        <p className="text-lg font-bold">
                            {balanceData.credits.toLocaleString()} Credits ✨
                        </p>
                    )}
                </div>

                {/* More compact Credit Packages */}
                <div className="space-y-2">
                    {creditPackages.map((pkg) => (
                        <Card 
                            key={pkg.name}
                            className={cn(
                                "cursor-pointer transition-all border",
                                selectedPackage === pkg.name 
                                    ? "border-2 border-accent bg-accent/30" 
                                    : "hover:border-accent/50 hover:bg-accent/10"
                            )}
                            onClick={() => setSelectedPackage(pkg.name)}
                        >
                            <CardContent className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex text-amber-500">
                                        {getBoltIcons(pkg.name)}
                                    </div>
                                    <div className="font-medium text-base">
                                        {pkg.credits.toLocaleString()} credits
                                    </div>
                                    <div className="flex text-red-500">
                                        {pkg.name === 'tier5' ? 'Best Value' : pkg.name === 'tier2' ? 'Most Popular' : ''}
                                    </div>
                                </div>
                                <div className="text-right font-bold text-base">
                                    {pkg.price}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pay now button */}
                <Button 
                    className="w-full py-2 mt-1"
                    onClick={() => handlePurchaseClick(selectedPackage)}
                    disabled={!!processingTier}
                >
                    {processingTier ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                        </>
                    ) : (
                        'Pay now →'
                    )}
                </Button>
            </DialogContent>
        </Dialog>
    );
}