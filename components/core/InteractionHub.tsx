// components/core/InteractionHub.tsx
'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation & useQueryClient
import { sendTextMessage } from '@/lib/api/orchestration'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, Loader2 } from 'lucide-react'; // Added Loader2
import { toast } from 'sonner'; // For error feedback

// Simple Spinner component reused
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" />;

export default function InteractionHub() {
    const [inputText, setInputText] = useState('');
    const [aiResponse, setAiResponse] = useState(''); // State for the latest AI response text

    // --- Setup Mutation ---
    const queryClient = useQueryClient(); // Get query client if needed for invalidation later
    const mutation = useMutation({
        mutationFn: sendTextMessage, // The API function to call
        onSuccess: (data) => {
            // Data is the response from sendTextMessage (type SendMessageResponse = any)
            console.log("Mutation Success, Data:", data);

            // Process the response to get displayable text
            let responseText = '';
            if (typeof data === 'string') {
                responseText = data;
            } else if (data && typeof data === 'object') {
                // Try common properties, customize based on your actual backend response
                responseText = data.reply || data.message || data.text || JSON.stringify(data);
            } else {
                // Fallback for unexpected types
                responseText = String(data);
            }

            setAiResponse(responseText); // Update the display state with processed text

            // Optional: Invalidate history query if sending a message should update history display
            queryClient.invalidateQueries({ queryKey: ['creditBalance'] });
            queryClient.invalidateQueries({ queryKey: ['conversationHistory'] });
        },
        onError: (error: Error) => {
            console.error("Mutation Error:", error);
            setAiResponse(''); // Clear response area on error
            toast.error('Failed to get AI response', { description: error.message });
        },
        // Removed onSettled to clear input immediately in handleSendText
    });
    // --- ---

    // Handler for sending text via button click or Enter key
    const handleSendText = (e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (e && typeof (e as React.FormEvent<HTMLFormElement>).preventDefault === 'function') {
            (e as React.FormEvent<HTMLFormElement>).preventDefault(); // Prevent form submission page reload
        }

        const messageToSend = inputText.trim();
        // Prevent sending empty messages or sending while already loading
        if (!messageToSend || mutation.isPending) return;

        console.log('Calling mutation with message:', messageToSend);
        mutation.mutate({ message: messageToSend }); // Pass data in the { message: "..." } format

        // Clear input immediately for responsive UI
        setInputText('');
        // Indicate loading state in the response area
        setAiResponse(''); // Clear previous response immediately
    };

    // Placeholder for voice input
    const handleMicClick = () => {
        console.log('Mic button clicked - voice input not implemented yet.');
        // TODO: Implement SpeechRecognition API logic here
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-xl px-4"> {/* Added padding */}

            {/* 1. Audio Visualizer Placeholder */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-full flex items-center justify-center mb-4 transition-all"> {/* Adjusted size */}
                <span className="text-muted-foreground text-sm">Visualizer</span>
            </div>

            {/* 2. AI Response Area */}
            {/* Added min-height and better loading/display logic */}
            <div className="min-h-[40px] text-center text-muted-foreground flex items-center justify-center px-2">
                {mutation.isPending ? (
                    <Spinner /> // Show spinner while mutation is pending
                ) : (
                    <p className="animate-in fade-in duration-500 ease-out"> {/* Simple fade-in */}
                        {aiResponse || <span className="opacity-50">AI response appears here...</span>} {/* Show placeholder if no response */}
                    </p>
                )}
            </div>

            {/* 3. Input Area */}
            {/* Added transition-opacity for loading state */}
            <div className={`flex w-full items-start gap-2 rounded-lg border p-2 shadow-sm bg-background transition-opacity ${mutation.isPending ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex-shrink-0"
                    onClick={handleMicClick}
                    title="Use Voice"
                    disabled={mutation.isPending} // Disable mic while loading text response
                >
                    <Mic className="h-5 w-5" />
                </Button>

                {/* Text Input Area */}
                <form onSubmit={handleSendText} className="flex-1">
                    <Textarea
                        placeholder="Type your message..."
                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none resize-none min-h-[40px] text-md bg-transparent" // Ensure background is transparent
                        rows={1}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            // Submit on Enter unless Shift is pressed
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault(); // Prevent newline
                                handleSendText();
                            }
                        }}
                        disabled={mutation.isPending} // Disable textarea while loading
                    />
                    {/* Hidden submit button for accessibility / form submission */}
                    <button type="submit" disabled={mutation.isPending} className="hidden" />
                </form>

                {/* Send Button */}
                <Button
                    type="button" // Important: Ensure it doesn't re-submit the form
                    size="icon"
                    className="rounded-full flex-shrink-0"
                    onClick={handleSendText}
                    title="Send Message"
                    // Disable if no text OR if loading
                    disabled={!inputText.trim() || mutation.isPending}
                >
                    {/* Show spinner on button if loading, otherwise Send icon */}
                    {mutation.isPending ? <Spinner /> : <Send className="h-5 w-5" />}
                </Button>
            </div>
        </div>
    );
}