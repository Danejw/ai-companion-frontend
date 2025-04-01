// components/core/InteractionHub.tsx
'use client';

import React, { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation & useQueryClient
import { sendTextMessage } from '@/lib/api/orchestration'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Ear, EarOff } from 'lucide-react'; // Added Loader2
import { toast } from 'sonner'; // For error feedback

// Simple Spinner component reused
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" />;

export default function InteractionHub() {
    const [inputText, setInputText] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

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
                responseText = JSON.stringify(data);
            } else {
                // Fallback for unexpected types
                responseText = String(data);
            }

            setAiResponse(responseText); // Update the display state with processed text

            // Invalidate history query if sending a message should update history display
            queryClient.invalidateQueries({ queryKey: ['creditBalance'] });
            queryClient.invalidateQueries({ queryKey: ['conversationHistory'] });
        },
        onError: (error: Error) => {
            console.error("Mutation Error:", error);
            setAiResponse(''); // Clear response area on error
            toast.error('Failed to get AI response', { description: error.message });
        },
    });

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


    const startListening = () => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            toast.error("Speech Recognition not supported", { description: "Your browser doesn't support voice input." });
            return;
        }

        // Prevent starting if already listening or sending text
        if (isListening || mutation.isPending) return;

        setIsListening(true);
        setAiResponse(''); // Clear previous AI response
        setInputText(''); // Clear any existing input text at the start

        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;

        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.start();

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            setInputText(() => {
                    let fullText = '';
                    for (let i = 0; i < event.results.length; ++i) { // Loop all results so far in this session
                        fullText += event.results[i][0].transcript;
                    }
                    return fullText;
                });
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error("Speech recognition error:", event.error);
                // Make sure to clean up state and ref even with continuous
                if (recognitionRef.current) { recognitionRef.current = null; }
                setIsListening(false);
            };

            recognition.onend = () => {
                console.log("Recognition ended (likely via stop() or error).");
                // Ensure state is false if we reach here
                if (recognitionRef.current) { recognitionRef.current = null; }
                setIsListening(false);
            };
        };

        const stopListening = () => {
            if (recognitionRef.current) {
                console.log("Manually stopping recognition via stopListening().");
                recognitionRef.current.stop(); // User manually stopped it
            }
        };

        // handleMicClick toggles start/stop as before
        const handleMicClick = () => {
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        };


    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-xl px-4">

            {/* 1. Audio Visualizer Placeholder */}
            <div className="w-32 h-32 md:w-40 md:h-40 bg-muted rounded-full flex items-center justify-center mb-4 transition-all p-2 gap-2"> {/* Adjusted size */}
                <span className="text-muted-foreground text-sm">Visualizer</span>
            </div>

            {/* 2. AI Response Area */}
            <div className="min-h-[40px] text-center text-muted-foreground flex items-center justify-center px-2">
                {mutation.isPending ? (
                    <Spinner /> // Show spinner while mutation is pending
                ) : (
                    <p className="animate-in fade-in duration-500 ease-out"> {/* Simple fade-in */}
                        {aiResponse || <span className="opacity-90">How are you today?</span>} {/* Show placeholder if no response */}
                    </p>
                )}
            </div>

            {/* 3. Input Area */}
            <div className={`flex w-full items-center gap-2 rounded-full border p-2 shadow-sm bg-background transition-opacity ${mutation.isPending ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex-shrink-0 self-center"
                    onClick={handleMicClick}
                    title="Use Voice"
                    disabled={mutation.isPending} // Disable mic while loading text response
                >
                    {isListening ? <Ear className="h-5 w-5" /> : <EarOff className="h-5 w-5" />}
                </Button>

                {/* Text Input Area */}
                <form onSubmit={handleSendText} className="flex-1 flex">
                    <Textarea
                        placeholder="Ask anything..."
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none resize-none min-h-[40px] text-md bg-transparent rounded-lg px-4 py-2 overflow-hidden border-none" 
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
                    <button type="submit" disabled={mutation.isPending} className="hidden" />
                </form>

                {/* Send Button */}
                <Button
                    type="button"
                    size="icon"
                    className="rounded-full flex-shrink-0 self-center"
                    onClick={handleSendText}
                    title="Send Message"
                    // Disable if no text OR if loading
                    disabled={!inputText.trim() || mutation.isPending}
                >
                    {mutation.isPending ? <Spinner /> : <Send className="h-5 w-5" />}
                </Button>
            </div>
        </div>
    );
}