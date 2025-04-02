'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { fetchCreditBalance, createCheckoutSession } from '../../lib/api/stripe'; // Adjust path if needed

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader2, Info, CreditCard, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define credit packages
const creditPackages = [
    { name: 'basic', credits: 2000, price: '$10', title: 'Starter Pack' },
    { name: 'standard', credits: 6000, price: '$30', title: 'Value Pack' },
    { name: 'premium', credits: 10000, price: '$50', title: 'Pro Pack' },
];

// Stripe loading logic
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
    // ... existing code ...
    if (!stripePromise) {
        const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
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
    const [selectedPackage, setSelectedPackage] = useState<string>('standard'); // Default to standard package

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
            // ... existing code ...
            const stripe = await getStripe();
            if (!stripe) {
                toast.error("Stripe configuration error.", { description: "Could not initialize Stripe." });
                setProcessingTier(null);
                return;
            }
            const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
            if (error) {
                console.error("Stripe redirect error:", error);
                toast.error("Checkout Failed", { description: error.message || "Could not redirect to Stripe." });
                setProcessingTier(null);
            }
        },
        onError: (error: Error) => {
            // ... existing code ...
            console.error("Checkout session creation error:", error);
            toast.error("Checkout Failed", { description: error.message || "Could not initiate purchase." });
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
            case 'basic':
                return <Zap className="h-5 w-5" />;
            case 'standard':
                return (
                    <>
                        <Zap className="h-5 w-5" />
                        <Zap className="h-5 w-5" />
                    </>
                );
            case 'premium':
                return (
                    <>
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
            <DialogContent className="max-w-sm sm:max-w-lg md:max-w-xl p-3 sm:p-4 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [&]:scrollbar-width-none">
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
                <div className="space-y-2 my-3">
                    {creditPackages.map((pkg) => (
                        <Card 
                            key={pkg.name}
                            className={cn(
                                "cursor-pointer transition-all border",
                                selectedPackage === pkg.name 
                                    ? "border-2 border-primary" 
                                    : "hover:border-primary/50"
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