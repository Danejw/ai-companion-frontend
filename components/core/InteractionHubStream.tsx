// components/core/InteractionHub.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query'; // Import useMutation & useQueryClient
import { sendStreamedTextMessage, startVoiceOrchestration } from '@/lib/api/orchestration'; // Adjust path as needed
import { useUIStore } from '@/store'; // Import the store
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, Ear, EarOff, MessageSquarePlus , Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner'; // For error feedback
import AudioVisualizer from '@/components/Visualizer';
import { submitFeedback } from '@/lib/api/feedback'; // Import the feedback function
import ReactMarkdown from "react-markdown";

// Simple Spinner component reused
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" />;

export default function InteractionHub() {
    // Get settings from store
    const { 
        extractKnowledge, 
        summarizeFrequency,
        selectedVoice
    } = useUIStore();

    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);

    const [inputText, setInputText] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [isStreaming, setIsStreaming] = useState(false);
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const [isFeedbackMode, setIsFeedbackMode] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [teachAi, setTeachAi] = useState(false);
    const [voiceModeEnabled] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunks = useRef<BlobPart[]>([]);

    // --- Setup Mutation ---
    const queryClient = useQueryClient(); // Get query client if needed for invalidation later
    

    // Add effect to scroll to bottom when content changes
    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    }, [aiResponse]); // Make sure this triggers on every aiResponse change

    // Handler for sending text via button click or Enter key
    const handleSendText = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e && typeof (e as React.FormEvent<HTMLFormElement>).preventDefault === "function") {
            (e as React.FormEvent<HTMLFormElement>).preventDefault();
        }

        const messageToSend = inputText.trim();
        if (!messageToSend || isStreaming) return; // Prevent multiple streams

        try {
            setAiResponse('');
            setIsStreaming(true);

            // Create payload using settings from the store
            const payload = {
                message: messageToSend,
                extract: extractKnowledge,
                summarize: summarizeFrequency,
            };

            await sendStreamedTextMessage(
                payload,
                (chunk: string) => {
                    setAiResponse((prev) => prev + chunk);
                    if (chunk) {
                        setInputText('');
                    }
                },
                (toolCall) => {
                    // Display tool call notification with longer duration
                    toast.info(
                        <div>
                            <h3 className="font-medium">Using Tool</h3>
                            <p className="text-sm">Tool: {toolCall || "Unknown"}</p>
                        </div>,
                        {
                            duration: 4000, // 4 seconds
                        }
                    );
                },
                (toolCallOutput) => {
                    // Add a slight delay before showing the output toast
                    setTimeout(() => {
                        toast.success(
                            <div>
                                <h3 className="font-medium">Tool Result</h3>
                                <p className="text-sm truncate max-w-[300px]">
                                    {typeof toolCallOutput === 'string' 
                                        ? toolCallOutput 
                                        : JSON.stringify(toolCallOutput).substring(0, 100)}
                                </p>
                            </div>,
                            {
                                duration: 4000, // 4 seconds
                            }
                        );
                    }, 4000); // 4 second delay
                },
                (agentUpdated) => {
                    // Add a slight delay before showing the output toast
                    setTimeout(() => {
                        toast.success(
                            <div>
                                <h3 className="font-medium">Tool Result</h3>
                                <p className="text-sm truncate max-w-[300px]">
                                    {typeof agentUpdated === 'string'
                                        ? agentUpdated
                                        : JSON.stringify(agentUpdated).substring(0, 100)}
                                </p>
                            </div>,
                            {
                                duration: 4000, // 4 seconds
                            }
                        );
                    }, 4000); // 4 second delay
                },
                (error) => {
                    // Check if error is specifically NO_CREDITS
                    console.log("--- DEBUG: error", error);
                    if (error === 'NO_CREDITS') {
                        // Open credits overlay immediately
                        toggleCreditsOverlay(true);
                        
                        toast.info(
                            <div>
                                <h3 className="font-medium">Credits Required</h3>
                                <p className="text-sm">You&apos;ve run out of credits. Please purchase more to continue.</p>
                            </div>,
                            { duration: 4000 }
                        );
                    } else {
                        // Handle other errors as before
                        setTimeout(() => {
                            toast.info(
                                <div>
                                    <h3 className="font-medium">Error</h3>
                                    <p className="text-sm truncate max-w-[300px]">
                                        {typeof error === 'string'
                                            ? error
                                            : JSON.stringify(error).substring(0, 100)}
                                    </p>
                                </div>,
                                { duration: 4000 }
                            );
                        }, 4000);
                    }
                }
            );

            queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
            queryClient.invalidateQueries({ queryKey: ["conversationHistory"] });

        } catch (error) {
            console.error("Streaming error:", error);
            toast.error("Something went wrong while streaming the response.");
        } finally {
            setIsStreaming(false);
        }
    };


    const startListening = () => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            toast.error("Speech Recognition not supported");
            return;
        }

        // Prevent starting if already listening or sending text
        if (isListening || isStreaming) return;

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
                recognitionRef.current.stop(); // User manually stopped it
                setIsListening(false);
            }
        };


        const startRecording = async () => {        
            try {
                startListening();
                setIsListening(true);

                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediaRecorderRef.current = mediaRecorder;

                chunks.current = [];

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.current.push(e.data);
                };

                mediaRecorder.start();
                
                toast("Listening...");
            } catch (err) {
                console.error("Could not start recording", err);
                toast.error("Microphone access denied or not supported.");
            }
        };

        const stopRecording = async () => {
            stopListening();
            setIsListening(false);

            if (!mediaRecorderRef.current || !streamRef.current) return;
            
            mediaRecorderRef.current.stop();

            mediaRecorderRef.current.onstop = async () => {
                setIsStreaming(true);
                const blob = new Blob(chunks.current, { type: 'audio/webm' });


                try {
                    console.log("--- DEBUG: startVoiceOrchestration - Blob:", blob);
                    await startVoiceOrchestration(
                        blob,
                        selectedVoice,
                        summarizeFrequency,
                        extractKnowledge,
                        (transcript: string) => {
                            setAiResponse(transcript); // Show the transcript while audio plays
                        }
                    );
                } catch (err) {
                    toast.error("Failed to process voice input.");
                    console.error("Voice Error:", err);
                } finally {
                    setIsStreaming(false);
                    stopRecording();
                }
            };

            streamRef.current?.getTracks().forEach((track) => track.stop());
        };



        // handleMicClick toggles start/stop as before
        const handleMicClick = () => {
            if (voiceModeEnabled) {
                // handleVoiceModeRequest();
                startListening()
            } else {
                if (isListening) stopListening();
                else startListening();
            }
        };

        

        // Handler for toggling feedback mode
        const handleToggleFeedbackMode = () => {
            setIsFeedbackMode(true);
            setFeedbackText('');
        };

        // Handler for submitting feedback
        const handleSubmitFeedback = async (teachAi: boolean) => {
            if (!feedbackText.trim()) {
                toast.error("Please enter feedback before submitting.");
                return;
            }

            try {
                setIsSubmittingFeedback(true);
                await submitFeedback(feedbackText, teachAi);
                setIsFeedbackMode(false);
                setFeedbackText('');
                toast.success("Thank you for your feedback!");
            } catch (error) {
                console.error("Error submitting feedback:", error);
                toast.error("Failed to submit feedback. Please try again.");
            } finally {
                setIsSubmittingFeedback(false);
            }
        };

        // Handler for canceling feedback
        const handleCancelFeedback = () => {
            setIsFeedbackMode(false);
            setFeedbackText('');
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

                        {/* Text content with streaming effect */}
                        <div className="flex flex-col items-center justify-center text-center text-gray-700 mb-4 px-4 break-words whitespace-pre-wrap">
                            {isStreaming && !aiResponse ? (
                                <Spinner /> // Only show spinner at very beginning of streaming
                            ) : (
                                <>
                                        {aiResponse ? (
                                            <div className="prose prose-sm text-left w-full max-w-none animate-in fade-in duration-500 ease-out">
                                                <ReactMarkdown>
                                                    {aiResponse}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="opacity-90">How are you today?</p>
                                        )}
                                    
                                    {/* Feedback button */}
                                    {aiResponse && !isFeedbackMode && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="mt-4 text-xs flex items-center gap-1 text-gray-400 hover:text-gray-500"
                                            onClick={handleToggleFeedbackMode}
                                        >
                                            <MessageSquarePlus size={14} />
                                            Give feedback
                                        </Button>
                                    )}
                                    
                                    {/* Feedback form */}
                                    {isFeedbackMode && (
                                        <div className="w-full max-w-md mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            <Textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                placeholder="Tell us what you think about this response..."
                                                className="w-full min-h-[100px] p-3 mb-2 text-sm border-none"
                                                disabled={isSubmittingFeedback}
                                            />
                                                <div className="flex justify-end px-1 mb-2">
                                                    <label htmlFor="teachAi" className="relative inline-flex items-center cursor-pointer group">
                                                        <input
                                                            type="checkbox"
                                                            id="teachAi"
                                                            checked={teachAi}
                                                            onChange={(e) => setTeachAi(e.target.checked)}
                                                            disabled={isSubmittingFeedback}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-accent transition-all duration-300"></div>
                                                        <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md border border-gray-300 shadow">
                                                            Teach the AI with this feedback
                                                        </div>
                                                    </label>
                                                </div>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="hover:text-white"
                                                    size="sm"
                                                    onClick={handleCancelFeedback}
                                                    disabled={isSubmittingFeedback}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleSubmitFeedback(teachAi)}
                                                    disabled={isSubmittingFeedback}
                                                >
                                                    {isSubmittingFeedback ? <Spinner /> : 'Submit Feedback'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area - DO NOT CHANGE */}
            <div className={`flex w-full items-start gap-2 rounded-full border p-2 shadow-sm bg-background transition-opacity ${isStreaming ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex-shrink-0 self-center"
                    onClick={handleMicClick}
                    title="Use Voice"
                    disabled={isStreaming} // Disable mic while streaming response
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
                        disabled={isStreaming}
                    />
                    <button type="submit" disabled={isStreaming} className="hidden" />
                </form>

                {/* Send Button */}
                <Button
                    type="button"
                    size="icon"
                    className="rounded-full flex-shrink-0 self-center accent"
                    onClick={handleSendText}
                    title="Send Message"
                    // Disable if no text OR if streaming
                    disabled={!inputText.trim() || isStreaming}
                >
                    {isStreaming ? <Spinner /> : <Send className="h-5 w-5" />}
                </Button>
            </div>

            {/* Toggle for Voice Mode */}
            {/* <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Voice Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={voiceModeEnabled}
                        onChange={(e) => setVoiceModeEnabled(e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-accent transition-all duration-300"></div>
                    <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
                </label>
            </div> */}

            {/* Voice Mode Button */}
            <div className="flex items-center justify-center gap-2 mt-2 w-20 h-20">
                <Button
                    size="icon"
                    className={`rounded-full flex-shrink-0 self-center ${isListening ? 'bg-accent/10' : ''} w-full h-full ${isStreaming && 'animate-pulse'}`}
                    title="Hold to Speak"
                    disabled={isStreaming}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                >
                    {isStreaming ? 
                        <Spinner /> : 
                        (isListening ? 
                            <Mic className="w-3/4 h-3/4 text-white animate-pulse" /> : 
                            <MicOff className="w-3/4 h-3/4 text-white animate-pulse" />
                        )
                    }
                </Button>
            </div>

            {/* Disclaimer Area - DO NOT CHANGE */}
            <div className="text-xs text-gray-600/60 text-center px-4 max-w-md mb-2">
                <p>
                    Information provided is not professional advice. <br />
                    Use at your own discretion.
                </p>
            </div>
        </div>
    );
}
