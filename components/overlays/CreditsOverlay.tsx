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
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Loader2, Info, CreditCard } from 'lucide-react';

// Define credit packages
const creditPackages = [
    { name: 'basic', credits: 2000, price: '$10', title: 'Starter Pack' },
    { name: 'standard', credits: 6000, price: '$30', title: 'Value Pack' },
    { name: 'premium', credits: 10000, price: '$50', title: 'Pro Pack' },
];

// Stripe loading logic
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
    // ... (stripe loading logic remains the same)
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
            // ... (onSuccess logic remains the same)
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
            // ... (onError logic remains the same)
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/*
               *** FIX: Added scrollbar hiding classes ***
               - `[&::-webkit-scrollbar]:hidden`: Hides scrollbar in Chrome, Safari, Edge, Opera
               - `[&]:scrollbar-width-none`: Hides scrollbar in Firefox (standard property)
            */}
            <DialogContent className="max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-4 sm:p-6 max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [&]:scrollbar-width-none">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-xl sm:text-2xl">
                        <CreditCard className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Buy Credits
                    </DialogTitle>
                    <DialogDescription>
                        Purchase credits to interact with your AI Companion. Your current balance is shown below.
                    </DialogDescription>
                </DialogHeader>

                {/* Display Current Balance */}
                <div className="my-4 rounded-md border p-4 mb-6">
                    <h3 className="mb-2 text-base sm:text-lg font-semibold">Current Balance</h3>
                    {isLoadingBalance && <Skeleton className="h-8 w-24" />}
                    {balanceError && <p className="text-sm text-destructive flex items-center"><Info className="mr-1 h-4 w-4" /> Could not load balance.</p>}
                    {!isLoadingBalance && !balanceError && balanceData && (
                        <p className="text-xl sm:text-2xl font-bold">
                            {balanceData.credits.toLocaleString()} Credits ✨
                        </p>
                    )}
                </div>

                {/* Display Credit Packages using a responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {creditPackages.map((pkg) => {
                        const isProcessingThis = processingTier === pkg.name;
                        return (
                            <Card key={pkg.name} className="flex flex-col overflow-hidden">
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg sm:text-xl">{pkg.title}</CardTitle>
                                    <CardDescription>
                                        Get {pkg.credits.toLocaleString()} credits
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow p-4">
                                    <p className="text-xl sm:text-2xl font-semibold">{pkg.price}</p>
                                </CardContent>
                                <CardFooter className="p-4">
                                    <Button
                                        className="w-full"
                                        onClick={() => handlePurchaseClick(pkg.name)}
                                        disabled={!!processingTier}
                                    >
                                        {isProcessingThis ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            'Purchase'
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}