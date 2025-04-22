'use client'

import { useEffect, useRef, useState } from "react";
import { Ear, EarOff, Loader2, MessageSquarePlus, Mic, Power, Send, X, Camera, Volume2, ThumbsUp, ThumbsDown } from "lucide-react"; // Added ThumbsUp and ThumbsDown icons
import { AudioMessage, FeedbackMessage, GPSMessage, ImageMessage, OrchestrateMessage, RawMessage, TextMessage, TimeMessage } from "@/types/messages";
import { getSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitFeedback } from "@/lib/api/feedback";
import { textToSpeech } from "@/lib/api/voice"; // Import textToSpeech function
import AudioVisualizer from "../Visualizer";
import { Button } from "../ui/button";
import { useUIStore } from '@/store'; // Import the store
import { MarkdownRenderer } from "../MarkdownRenderer";
import { submitFinetuneFeedback } from "@/lib/api/finetune_feedback"; // Import the new function
import { FinetuneFeedbackPayload } from "@/lib/api/finetune_feedback";


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Simple Spinner component reused
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" />;

declare global {
    interface Window {
        currentWebSocket?: WebSocket;
    }
}


export default function InteractionHubVoice() {
    const {
        extractKnowledge,
        summarizeFrequency,
        selectedVoice,
        isRawMode,
    } = useUIStore();
    
    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);
    const toggleAuthOverlay = useUIStore((state) => state.toggleAuthOverlay);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);
    const toggleHistoryOverlay = useUIStore((state) => state.toggleHistoryOverlay);
    const toggleKnowledgeOverlay = useUIStore((state) => state.toggleKnowledgeOverlay);
    const toggleInfoOverlay = useUIStore((state) => state.toggleInfoOverlay);
    const toggleNotificationsOverlay = useUIStore((state) => state.toggleNotificationsOverlay);
    const toggleCaptureOverlay = useUIStore((state) => state.toggleCaptureOverlay);


    // States
    const [connected, setConnected] = useState(false);
    const [recording, setRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceModeEnabled] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

    // Refs
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null);



    const [messages, setMessages] = useState<string[]>([]);


    // Text Input
    const [inputText, setInputText] = useState("");
    const [lastUserInput, setLastUserInput] = useState(""); // Cache the last user input for feedback

    // Text Output
    const [aiResponse, setAiResponse] = useState('');
    const [lastAiResponse, setLastAiResponse] = useState('');
    const [feedbackSubmittedResponses, setFeedbackSubmittedResponses] = useState<Set<string>>(new Set());

    const [userTranscript, setUserTranscript] = useState('');
    const [aiTranscript, setAiTranscript] = useState('');
    const [toolcalls, setToolcalls] = useState('');
    const [toolresults, setToolresults] = useState('');
    const [agentUpdated, setAgentUpdated] = useState('');
    
    // Add state for captured images
    const [capturedImages, setCapturedImages] = useState<{id: string, data: string}[]>([]);

    // Feedback
    const [isFeedbackMode, setIsFeedbackMode] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [teachAi, setTeachAi] = useState(false);
    const [showFeedbackButtons, setShowFeedbackButtons] = useState(true);
    const [isSubmittingFinetuneFeedback, setIsSubmittingFinetuneFeedback] = useState(false);


    console.log(recording, messages, setUserTranscript, aiTranscript, setAiTranscript, toolcalls, toolresults, agentUpdated, lastAiResponse);


    // Add effect to scroll to bottom when content changes
    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    }, [aiResponse]); // Make sure this triggers on every aiResponse change

    // Effect to handle captured images from sessionStorage
    useEffect(() => {
        // Listen for custom event from CaptureOverlay
        const handleImageCaptured = (event: CustomEvent) => {
            const { imageId, imageData } = event.detail;
            setCapturedImages(prev => [...prev, {
                id: imageId,
                data: imageData
            }]);
            
            // Clear the storage immediately to prevent double adding
            sessionStorage.removeItem('capturedImage');
        };
        
        window.addEventListener('imageCaptured', handleImageCaptured as EventListener);
        
        // We no longer need the interval check or focus/storage events
        // since we're using custom events for direct communication
        
        return () => {
            window.removeEventListener('imageCaptured', handleImageCaptured as EventListener);
        };
    }, []);

    // NEW: Effect to send raw mode status when it changes and connection is active
    useEffect(() => {
        if (connected) { sendRawMode(); }
    }, [isRawMode, connected]);

    // Function to remove an image when clicked
    const removeImage = (id: string) => {
        setCapturedImages(prev => prev.filter(img => img.id !== id));
    };

    // Handler for sending text via button click or Enter key
    const handleSendText = async (e?: React.FormEvent | React.MouseEvent) => {
        if (e && typeof (e as React.FormEvent<HTMLFormElement>).preventDefault === "function") {
            (e as React.FormEvent<HTMLFormElement>).preventDefault();
        }

        const messageToSend = inputText.trim();
        if (!messageToSend && capturedImages.length === 0) return; // Prevent empty messages
    
        try {
            if (messageToSend) {
                // Cache the user input before sending
                setLastUserInput(messageToSend);
                
                const textMessage: TextMessage = { type: "text", text: messageToSend };
                ws.current?.send(JSON.stringify(textMessage));

                if (capturedImages.length > 0) {    
                    // Send all captured images
                    const imageMessage: ImageMessage = { type: "image", format: "jpeg", data: capturedImages.map(img => img.data), input: messageToSend };
                    ws.current?.send(JSON.stringify(imageMessage));
                }

                const orchestrationMessage: OrchestrateMessage = { type: "orchestrate", user_input: messageToSend, extract: extractKnowledge, summarize: summarizeFrequency };
                ws.current?.send(JSON.stringify(orchestrationMessage));
            }

            // Clear images after sending
            // setCapturedImages([]);
            setIsWaitingForResponse(true);
            setInputText('');
            setShowFeedbackButtons(false); // Hide feedback buttons while waiting for new response

        } catch (error) {
            console.error("Streaming error:", error);
            toast.error("Something went wrong while streaming the response.");
        }
    };

    const handleSendAudio = async (base64Audio: string) => {
        // If there's user transcript from voice, cache it
        if (userTranscript) {
            setLastUserInput(userTranscript);
        }
        
        const audioMsg: AudioMessage = { type: "audio", audio: base64Audio, voice: selectedVoice };
        ws.current?.send(JSON.stringify(audioMsg));

        if (capturedImages.length > 0) {
            // Send all captured images
            const imageMessage: ImageMessage = { type: "image", format: "jpeg", data: capturedImages.map(img => img.data) };
            ws.current?.send(JSON.stringify(imageMessage));
        }

        const orchestrationMessage: OrchestrateMessage = { type: "orchestrate", user_input: userTranscript, extract: extractKnowledge, summarize: summarizeFrequency }
        ws.current?.send(JSON.stringify(orchestrationMessage));
        
        setShowFeedbackButtons(false); // Hide feedback buttons while waiting for new response
    }


    // Voice Recognition
    const startListening = () => {
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognitionAPI) {
                toast.error("Speech Recognition not supported");
                return;
            }

            // Prevent starting if already listening or sending text
            if (isListening) return;

            setInputText(''); // Clear any existing input text at the start
            setIsListening(true);

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
                setConnected(false);
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

    // Handle finetune feedback submission
    const handleFinetuneFeedback = async (isPositive: boolean) => {
        
        console.log(lastUserInput, userTranscript, aiResponse);
        
        // Use the cached user input instead of the current inputText
        if (!lastUserInput && !userTranscript) {
            toast.error("No user input to provide feedback on");
            return;
        }

        if (!aiResponse) {
            toast.error("No AI response to provide feedback on");
            return;
        }

        // Check if feedback has already been submitted for this response
        if (feedbackSubmittedResponses.has(aiResponse)) {
            toast.info("Feedback already submitted for this response");
            return;
        }

        console.log(isPositive);

        try {
            setIsSubmittingFinetuneFeedback(true);

            const payload: FinetuneFeedbackPayload = {
                message_input: lastUserInput || userTranscript,
                message_output: aiResponse,
                feedback_type: isPositive
            };

            await submitFinetuneFeedback(payload);
            
            // Mark this response as having received feedback
            setFeedbackSubmittedResponses(prev => {
                const newSet = new Set(prev);
                newSet.add(aiResponse);
                return newSet;
            });

            const feedbackMessage: FeedbackMessage = { type: "feedback", feedback_type: isPositive };
            ws.current?.send(JSON.stringify(feedbackMessage));
            
            setShowFeedbackButtons(false);
            toast.success(isPositive ? "Thanks for the positive feedback!" : "Thanks for helping us improve!");
        } catch (error) {
            console.error("Error submitting finetune feedback:", error);
            toast.error("Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmittingFinetuneFeedback(false);
        }
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    // WebSocket Stuff
    const connectSocket = async () => {
        try {
            setIsConnecting(true);
            toast.info("Connecting...");
            
            // Reset states when starting a new connection
            setLastUserInput('');
            setAiResponse('');
            setFeedbackSubmittedResponses(new Set()); // Reset the feedback tracking

            const session = await getSession();
            const accessToken = session?.user?.accessToken;

            if (!accessToken) {
                toast.error("Authentication required");
                setIsConnecting(false);
                return;
            }

        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
                ws.current = new WebSocket(`${BACKEND_URL.replace("https", "wss")}/ws/main?token=${accessToken}`);

                // Set a connection timeout
                const connectionTimeout = setTimeout(() => {
                    if (ws.current?.readyState !== WebSocket.OPEN) {
                        ws.current?.close();
                        toast.error("Connection timed out. Please try again.");
                        setIsConnecting(false);
                    }
                }, 10000); // 10 second timeout

            ws.current.onopen = () => {
                    clearTimeout(connectionTimeout);
                console.log("WebSocket connected");

                setConnected(true);
                setIsConnecting(false);
                toast.success("Connected successfully!");
                sendGPS();
                sendTime();
                setShowFeedbackButtons(true);

                // Make the WebSocket available globally
                window.currentWebSocket = ws.current as WebSocket;
            };

            ws.current.onclose = () => {
                console.log("WebSocket disconnected");
                setConnected(false);
                setIsConnecting(false);
                setIsListening(false);
                setIsWaitingForResponse(false);
                setLastUserInput(''); // Clear cached input when disconnected
                setFeedbackSubmittedResponses(new Set()); // Reset the feedback tracking
                toast.info("Disconnected...");
            };

                ws.current.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    toast.error("Connection error. Please try again.");
                    setIsConnecting(false);
            };

            ws.current.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                
                    // Responses
                if (msg.type === "user_transcript") {
                    setMessages((prev) => [...prev, `🧍 You said: ${msg.text}`]);
                    setUserTranscript(msg.text);
                    setLastUserInput(msg.text); // Cache the user transcript for feedback
                }

                    else if (msg.type === "ai_transcript" || msg.type === "ai_response" || msg.type === "message_output_item") {                        
                        // Only consider it a new response that needs feedback if text has changed
                        if (msg.text !== aiResponse) {
                            setAiResponse(msg.text);
                            setLastAiResponse(msg.text);
                            setIsWaitingForResponse(false);
                            setInputText('');
                            setShowFeedbackButtons(true);
                        }
                    }

                    else if (msg.type === "audio_response") {
                        (async () => {
                            try {
                                // Convert base64 to blob
                                const byteCharacters = atob(msg.audio);
                                const byteNumbers = new Array(byteCharacters.length);
                                
                                for (let i = 0; i < byteCharacters.length; i++) {
                                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                
                                const byteArray = new Uint8Array(byteNumbers);
                                const audioBlob = new Blob([byteArray], { type: 'audio/wav' }); // or 'audio/mp3' depending on your format
                                
                                // Create and play audio
                                const audioUrl = URL.createObjectURL(audioBlob);
                                const audio = new Audio(audioUrl);
                                
                                audio.onended = () => {
                                    URL.revokeObjectURL(audioUrl); // Clean up the URL after playing
                                };

                                setIsWaitingForResponse(false);
                                setInputText('');
                                
                                await audio.play();
                            } catch (err) {
                                console.error("Audio playback error:", err);
                                toast.error("Failed to play audio response");
                            }
                        })();
                    }

                    else if (msg.type === "image_analysis") {
                        // Do something here
                    }

                    else if (msg.type === "info") {
                        toast.info(msg.text);
                    }

                    // Info Events
                    else if (msg.type === "tool_call_item") {
                    setToolcalls(msg.text);
                        toast.info(msg.text);
                    }

                    else if (msg.type === "tool_call_output_item") {
                        setToolresults(msg.text);
                        toast.info(truncateText(msg.text));
                    }

                    else if (msg.type === "agent_updated") {
                        setAgentUpdated(msg.text);
                        toast.info(msg.text);
                    }

                    else if (msg.type === "orchestration") {
                        toast.info("Status " + msg.status);
                    }
                    
                    // Actions
                    else if (msg.type === "gps_action") {
                        // toast.info("GPS Action: " + msg.status);
                    }

                    else if (msg.type === "time_action") {
                        // toast.info("Time Action: " + msg.status);
                    }

                    else if (msg.type === "text_action") {
                        toast.info("Text recieved " + msg.status);
                    }

                    else if (msg.type === "audio_action") {
                        toast.info("Audio recieved " + msg.status);
                    }

                    else if (msg.type === "ui_action") {
                        console.log("ui action:", msg.action);

                        if (msg.action === 'toggle_credits') {
                            toggleCreditsOverlay(true);
                            console.log("Credits Overlay Opened");
                        }

                        else if (msg.action === 'toggle_auth') {
                            toggleAuthOverlay(true);
                            console.log("Auth Overlay Opened");
                        }

                        else if (msg.action === 'toggle_settings') {
                            toggleSettingsOverlay(true);
                            console.log("Settings Overlay Opened");
                        }
                        
                        else if (msg.action === 'toggle_conversation_history') {
                            toggleHistoryOverlay(true);
                            console.log("Conversation History Overlay Opened");
                        }

                        else if (msg.action === 'toggle_knowledge_base') {
                            toggleKnowledgeOverlay(true);
                            console.log("Knowledge Overlay Opened");
                        }

                        else if (msg.action === 'toggle_inoformation') {
                            toggleInfoOverlay(true);
                            console.log("Information Overlay Opened");
                        }

                        else if (msg.action === 'toggle_capture') {
                            toggleCaptureOverlay(true);
                            console.log("Capture Overlay Opened");
                        }
                        else if (msg.action === 'toggle_notifications') {
                            toggleNotificationsOverlay(true);
                            console.log("Notifications Overlay Opened");
                        }

                        toast.info(msg.action);
                    }

                    else if (msg.type === "error") {

                        if (msg.text === 'NO_CREDITS') {
                            // Open credits overlay immediately
                            toggleCreditsOverlay(true);

                            toast.info(
                                <div>
                                    <h3 className="font-medium">Credits Required</h3>
                                    <p className="text-sm">You&apos;ve run out of credits. Please purchase more to continue.</p>
                                </div>,
                                { duration: 4000 }
                            );
                        }
                        else if (msg.text === 'UNAUTHENTICATED') {
                            toggleAuthOverlay(true);
                            toast.error("Please login again");
                        }
                        else 
                        {
                            console.error("Error:", msg.text);
                            toast.error("Error: " + msg.text);
                        }
                    }

                    else {
                        console.log("Unhandled message type:", msg);
                    }

                };
            }
        } catch (error) {
            console.error("Connection error:", error);
            toast.error("Failed to connect. Please try again.");
            setIsConnecting(false);
            setIsWaitingForResponse(false);
        }
    };

    const startRecording = async () => {
        setRecording(true);
        startListening();
        setIsListening(true);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
        mediaRecorder.current = recorder;
        audioChunks.current = [];

        recorder.ondataavailable = (e) => {
            audioChunks.current.push(e.data);
        };

        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
            const reader = new FileReader();
            
            // Set waiting state when sending audio
            setIsWaitingForResponse(true);
            
            reader.onloadend = () => {
                const base64Audio = (reader.result as string).split(",")[1];
                handleSendAudio(base64Audio);
            };
            reader.readAsDataURL(audioBlob);

        };

        recorder.start();
    };

    const stopRecording = () => {
        setRecording(false);
        stopListening();
        setIsListening(false);
        mediaRecorder.current?.stop();
    };

    const disconnectSocket = () => {
        ws.current?.close();
        setConnected(false);
        setIsListening(false);
        setLastUserInput(''); // Clear cached input when manually disconnected
        setFeedbackSubmittedResponses(new Set()); // Reset the feedback tracking
    };


    // Send GPS
    const sendGPS = () => {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            return;
        }


        navigator.geolocation.getCurrentPosition((position) => {
            const gpsMsg: GPSMessage = {
                type: "gps",
                coords: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                },
                timestamp: position.timestamp,
            };
            ws.current?.send(JSON.stringify(gpsMsg));
        });
    };

    // Send Time
    const sendTime = () => {
        const now = new Date();
        const timeMsg: TimeMessage = {
            type: "time",
            timestamp: now.toLocaleString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        ws.current?.send(JSON.stringify(timeMsg));
    };

    // Add this function inside your component
    const handleSpeakResponse = async () => {
        if (!aiResponse) return;
        
        try {
            toast.info("Speaking response with " + selectedVoice + "...");
            await textToSpeech(aiResponse, selectedVoice);
        } catch (error) {
            console.error("Failed to speak response:", error);
            toast.error("Failed to speak response");
        }
    };

    // Send raw mode message
    const sendRawMode = () => {
        const rawModeMsg: RawMessage = { type: "raw_mode", is_raw: isRawMode };
        //console.log("Sending raw mode message:", JSON.stringify(rawModeMsg));
        ws.current?.send(JSON.stringify(rawModeMsg));
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
                            {!aiResponse ? (
                                <p className="opacity-90">How are you today?</p>
                            ) : (
                                <>
                                    <div className="prose prose-sm text-left w-full max-w-none animate-in fade-in duration-500 ease-out relative">
                                        <MarkdownRenderer>{aiResponse}</MarkdownRenderer>

                                        {/* Combined feedback and speak button row */}
                                        <div className="relative w-full mt-4 flex justify-between items-center">
                                            {/* Thumbs up/down on the left */}
                                            {showFeedbackButtons && aiResponse && !feedbackSubmittedResponses.has(aiResponse) && (
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-1 h-6 w-6 flex items-center justify-center"
                                                        onClick={() => handleFinetuneFeedback(true)}
                                                        disabled={isSubmittingFinetuneFeedback}
                                                        title="Helpful"
                                                    >
                                                        {isSubmittingFinetuneFeedback ? <Spinner /> : <ThumbsUp size={10} />}                  
                                                    </Button>
                                                    <span className="text-gray-400">/</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-1 h-6 w-6 flex items-center justify-center"
                                                        onClick={() => handleFinetuneFeedback(false)}
                                                        disabled={isSubmittingFinetuneFeedback}
                                                        title="Not Helpful"
                                                    >
                                                        {isSubmittingFinetuneFeedback ? <Spinner /> : <ThumbsDown size={10} />}
                                                    </Button>
                                                </div>
                                            )}
                                            
                                            {/* Text-to-Speech Button on the right */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="px-2 py-0 text-xs flex items-center gap-1 text-gray-400"
                                                onClick={handleSpeakResponse}
                                                title="Speak this response"
                                            >
                                                <Volume2 size={16} />
                                            </Button>
                                        </div>
                                    </div>

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
            {connected && (
                <>
                    <div className={`flex w-full items-start gap-2 rounded-4xl border p-2 shadow-sm bg-background transition-opacity ${isListening ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full flex-shrink-0 self-center"
                            onClick={handleMicClick}
                            title="Use Voice"
                            // disabled={isListening}
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
                                disabled={isListening}
                />
                            <button type="submit" disabled={isListening} className="hidden" />
            </form>

                        {/* Send Button */}
                        <Button
                            type="button"
                            size="icon"
                            className="rounded-full flex-shrink-0 self-center accent"
                            onClick={handleSendText}
                            title={isWaitingForResponse ? "Waiting for response..." : "Send Message"}
                            disabled={(!inputText.trim() && capturedImages.length === 0) || isListening || isWaitingForResponse}
                        >
                            {isWaitingForResponse ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isListening ? (
                                <Spinner />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </Button>
                    </div>


                    {/* Captured images row - positioned below the buttons */}
                    {connected && capturedImages.length > 0 && (
                        <div className="flex justify-start items-center gap-2">
                            {capturedImages.map(img => (
                                <div
                                    key={img.id}
                                    className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer group"
                                    onClick={() => removeImage(img.id)}
                                    title="Click to remove"
                                >
                                    <img
                                        src={`data:image/jpeg;base64,${img.data}`}
                                        alt="Captured"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Red overlay with X icon on hover */}
                                    <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/60 transition-all duration-200 flex items-center justify-center">
                                        <X className="text-white opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}


            {/* Voice Mode Button */}
            <div className="flex items-center justify-center gap-4 mt-2 relative w-full">
                {/* Camera Button - Left Side */}
                {connected && (
                    <Button
                        onClick={() => toggleCaptureOverlay(true)}
                        disabled={isConnecting || isWaitingForResponse}
                        className="rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg transition bg-accent/80 hover:bg-accent/90"
                    >
                        <Camera className="h-8 w-8" />
                    </Button>
                )}
                
                {/* Mic Button - Center */}
                <Button
                    size="icon"
                    className={`w-15 h-15 rounded-full flex-shrink-0 transition-colors
                        ${!connected
                            ? 'bg-accent-foreground/60 hover:bg-accent-foreground'
                            : isListening
                                ? 'bg-accent-foreground'
                                : 'bg-accent hover:bg-accent/80'
                        }
                        ${isListening && 'animate-pulse'}`}
                    title={
                        isConnecting 
                            ? "Connecting..." 
                            : isWaitingForResponse 
                                ? "Waiting for response..." 
                                : connected 
                                    ? (isListening ? "Release to Stop" : "Hold to Speak") 
                                    : "Connect"
                    }
                    onClick={!connected ? connectSocket : undefined}
                    onMouseDown={connected && !isWaitingForResponse ? startRecording : undefined}
                    onMouseUp={connected && !isWaitingForResponse ? stopRecording : undefined}
                    onTouchStart={connected && !isWaitingForResponse ? startRecording : undefined}
                    onTouchEnd={connected && !isWaitingForResponse ? stopRecording : undefined}
                    disabled={isConnecting || isWaitingForResponse}
                >
                    {isConnecting || isWaitingForResponse ? (
                        <Loader2 className="w-3/4 h-3/4 text-white animate-spin" />
                    ) : !connected ? (
                        <Power className="w-3/4 h-3/4 text-white" />
                    ) : isListening ? (
                        <Ear className="w-3/4 h-3/4 text-white" />
                    ) : (
                        <Mic className="w-3/4 h-3/4 text-white" />
                    )}
                </Button>

                {/* TODO: Video Button - Left Side */}
                {/* {connected && (
                    <Button
                        onClick={() => toggleCaptureOverlay(true)}
                        disabled={true}//isConnecting || isWaitingForResponse}
                        className="rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg transition bg-accent/80 hover:bg-accent/90"
                    >
                        <Video className="h-8 w-8" />
                    </Button>
                )} */}

                {/* Disconnect button - Right Side */}
                {connected && (
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={disconnectSocket}
                        className="rounded-full w-8 h-8 bg-accent-foreground/60 hover:bg-accent-foreground transition-colors"
                    >
                        <X className="h-4 w-4 text-white" />
                    </Button>
                )}


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
