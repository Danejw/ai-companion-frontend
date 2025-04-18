// components/core/InteractionHub.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation & useQueryClient
import { sendTextMessage } from '@/lib/api/orchestration'; // Adjust path as needed
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Ear, EarOff } from 'lucide-react'; // Added Loader2
import { toast } from 'sonner'; // For error feedback
import { useUIStore } from '@/store'; // Add this import
import AudioVisualizer from '../Visualizer';


// Simple Spinner component reused
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" />;

export default function InteractionHub() {
    const [inputText, setInputText] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    // --- Setup Mutation ---
    const queryClient = useQueryClient(); // Get query client if needed for invalidation later
    const mutation = useMutation({
        mutationFn: sendTextMessage, // The API function to call
        onSuccess: (data) => {
            // Handle NO_CREDITS error case
            if (typeof data === 'object' && data?.error?.message === 'NO_CREDITS') {
                useUIStore.getState().toggleCreditsOverlay();
                toast.error('Out of credits');
                return;
            }

            // Handle successful responses
            const responseText = typeof data === 'string' ? data : data?.response || '';
            setAiResponse(responseText); // Update the display state with processed text

            // Invalidate history query if sending a message should update history display
            queryClient.invalidateQueries({ queryKey: ['creditBalance'] });
            queryClient.invalidateQueries({ queryKey: ['conversationHistory'] });
        },
        onError: (error: Error) => {
            console.error("Mutation Error:", error);
            setAiResponse(''); // Clear response area on error
            toast.error('Failed to get AI response');
        },
    });

    // Add effect to scroll to bottom when content changes
    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    }, [aiResponse, mutation.isPending]);

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
            toast.error("Speech Recognition not supported");
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

            {/*AI Response Area */}
            <div className="w-full h-100% flex flex-col rounded-lg overflow-hidden">
                {/* Main content container with bottom alignment */}
                <div className="flex-1 flex flex-col justify-end items-center">
  
                    {/* Scrollable Content Area */}
                    <div className="w-full flex flex-col max-h-[600px] overflow-y-auto scrollbar-hide" ref={scrollViewportRef}>

                        {/* Audio Visualizer - always at bottom center */}
                        <div className="flex items-center justify-center p-2 w-full">
                            <AudioVisualizer />
                        </div>

                        <div className="flex items-center justify-center text-center text-gray-700 mb-4 px-4 break-words whitespace-pre-wrap">
                            {mutation.isPending ? (
                                <Spinner />
                            ) : (
                                <p className="animate-in fade-in duration-500 ease-out">
                                        {aiResponse || <span className="opacity-90">How are you today?</span>}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Input Area */}
            <div className={`flex w-full items-start gap-2 rounded-full border p-2 shadow-sm bg-background transition-opacity ${mutation.isPending ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}>
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
                        ref={textareaRef}
                        placeholder="Ask anything..."
                        className="w-full focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none resize-none min-h-[40px] max-h-[200px] text-md bg-transparent rounded-lg px-4 py-2 border-none scrollbar-hide overflow-y-scroll"
                        rows={1}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendText()
                            }
                        }}
                        disabled={mutation.isPending}
                    />
                    <button type="submit" disabled={mutation.isPending} className="hidden" />
                </form>

                {/* Send Button */}
                <Button
                    type="button"
                    size="icon"
                    className="rounded-full flex-shrink-0 self-center accent"
                    onClick={handleSendText}
                    title="Send Message"
                    // Disable if no text OR if loading
                    disabled={!inputText.trim() || mutation.isPending}
                >
                    {mutation.isPending ? <Spinner /> : <Send className="h-5 w-5" />}
                </Button>
            </div>

            {/* 4. New Disclaimer Area */}
            <div className="text-xs text-gray-600/60 text-center mt-1 px-4 max-w-md">
                <p>
                    Information provided is not professional advice. <br />
                    Use at your own discretion.
                </p>
            </div>
        </div>
    );
}