'use client';

import React, { useState } from 'react'; // Removed useEffect
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe, Stripe } from '@stripe/stripe-js';
// import { useUIStore } from '@/store';
import { fetchCreditBalance, createCheckoutSession } from '../../lib/api/stripe';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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


// Define credit packages - Using 'name' as the tier identifier
const creditPackages = [
    {
        name: 'basic',
        credits: 2000,
        price: '$10',
        title: 'Starter Pack', 
    },
    {
        name: 'standard',
        credits: 6000,
        price: '$30',
        title: 'Value Pack',
    },
    {
        name: 'premium',
        credits: 10000,
        price: '$50',
        title: 'Pro Pack',
    },
];

// Stripe loading logic remains the same
let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => {
    // ... (getStripe function remains unchanged) ...
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

// --- Define Props Interface ---
interface CreditsOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void; // Function to toggle state
}

// --- Use Props in Component Definition ---
export default function CreditsOverlay({ open, onOpenChange }: CreditsOverlayProps) {
    const queryClient = useQueryClient();

    // Local state for managing which purchase is processing (using tier name as ID)
    const [processingTier, setProcessingTier] = useState<string | null>(null);

    // Fetch credit balance using React Query
    const {
        data: balanceData,
        isLoading: isLoadingBalance,
        error: balanceError,
        // refetch: refetchBalance // Keep if needed elsewhere
    } = useQuery({
        queryKey: ['creditBalance'],
        queryFn: fetchCreditBalance,
        enabled: open, // Use the 'open' prop to enable/disable fetching
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
    });

    // Mutation for creating checkout session (expects tier string)
    const checkoutMutation = useMutation({
        mutationFn: createCheckoutSession, // Should expect tier: string
        onSuccess: async (data) => {
            // ... (onSuccess logic remains unchanged) ...
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
            // ... (onError logic remains unchanged) ...
            console.error("Checkout session creation error:", error);
            toast.error("Checkout Failed", { description: error.message || "Could not initiate purchase." });
            setProcessingTier(null);
        },
    });

    // --- Updated handlePurchaseClick to send tier name ---
    const handlePurchaseClick = (tier: string) => {
        if (processingTier) return; // Prevent multiple clicks if any is processing
        setProcessingTier(tier);   // Set loading state using the tier name
        checkoutMutation.mutate(tier); // Send the tier name to the mutation
    };

    // Add a console log to check received props
    console.log(`--- DEBUG: CreditsOverlay receiving props: open=${open} ---`);

    // --- Use Props for the Dialog ---
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md md:sm:max-w-lg lg:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" /> Buy Credits
                    </DialogTitle>
                    <DialogDescription>
                        Purchase credits to interact with your AI Companion. Your current balance is shown below.
                    </DialogDescription>
                </DialogHeader>

                {/* Display Current Balance (No changes here) */}
                <div className="my-4 rounded-md border p-4">
                    {/* ... balance display logic ... */}
                    <h3 className="mb-2 text-lg font-semibold">Current Balance</h3>
                    {isLoadingBalance && <Skeleton className="h-8 w-24" />}
                    {balanceError && <p className="text-sm text-destructive flex items-center"><Info className="mr-1 h-4 w-4" /> Could not load balance.</p>}
                    {!isLoadingBalance && !balanceError && balanceData && (
                        <p className="text-2xl font-bold">
                            {balanceData.credits.toLocaleString()} Credits ✨
                        </p>
                    )}
                </div>

                {/* Display Credit Packages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {creditPackages.map((pkg) => {
                        // Check processing state using tier name
                        const isProcessingThis = processingTier === pkg.name;
                        return (
                            // Use pkg.name as the key since it's unique and identifies the tier
                            <Card key={pkg.name} className="flex flex-col">
                                <CardHeader>
                                    {/* Use the added title for display */}
                                    <CardTitle>{pkg.title}</CardTitle>
                                    <CardDescription>
                                        Get {pkg.credits.toLocaleString()} credits
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-2xl font-semibold">{pkg.price}</p>
                                </CardContent>
                                <CardFooter>
                                    {/* Pass the tier name (pkg.name) to the handler */}
                                    <Button
                                        className="w-full"
                                        onClick={() => handlePurchaseClick(pkg.name)}
                                        // Disable all buttons if any tier is processing
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