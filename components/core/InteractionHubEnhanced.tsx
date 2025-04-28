'use client'

import { useEffect, useRef, useState } from "react";
import { Ear, EarOff, Loader2, Mic, Power, Send, X, Camera, Volume2, ThumbsUp, ThumbsDown, Pause } from "lucide-react"; 
import { AudioMessage, FeedbackMessage, GPSMessage, ImageMessage, LocalLingoMessage, OrchestrateMessage, PersonalityMessage, TextMessage, TimeMessage } from "@/types/messages";
import { getSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitFeedback } from "@/lib/api/feedback";
import { textToSpeech } from "@/lib/api/voice"; // Import the refactored textToSpeech function
import AudioVisualizer from "@/components/Visualizer";
import { Button } from "@/components/ui/button";
import { useUIStore } from '@/store'; // Import the store
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { submitFinetuneFeedback, FinetuneFeedbackPayload } from "@/lib/api/finetune_feedback"; // Import the new function


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Simple Spinner component reused
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" />;

// Define a type for conversation messages
interface ConversationMessage {
    type: 'user' | 'ai';
    content: string;
}

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
        useLocalLingo,
        empathy,
        directness,
        warmth,
        challenge,
    } = useUIStore();
    
    const toggleCreditsOverlay = useUIStore((state) => state.toggleCreditsOverlay);
    const toggleAuthOverlay = useUIStore((state) => state.toggleAuthOverlay);
    const toggleSettingsOverlay = useUIStore((state) => state.toggleSettingsOverlay);
    const toggleHistoryOverlay = useUIStore((state) => state.toggleHistoryOverlay);
    const toggleKnowledgeOverlay = useUIStore((state) => state.toggleKnowledgeOverlay);
    // const toggleInfoOverlay = useUIStore((state) => state.toggleInfoOverlay);
    const toggleNotificationsOverlay = useUIStore((state) => state.toggleNotificationsOverlay);
    const toggleCaptureOverlay = useUIStore((state) => state.toggleCaptureOverlay);


    // States
    const [connected, setConnected] = useState(false);
    const [recording, setRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceModeEnabled] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]); // <-- New state for history

    // New states for audio playback control
    const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

    // Refs
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null);


    // Text Input
    const [inputText, setInputText] = useState("");
    const [lastUserInput, setLastUserInput] = useState(""); // Cache the last user input for feedback

    // Text Output
    const [thinkResponse, setThinkResponse] = useState('');
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


    console.log(recording, setUserTranscript, aiTranscript, setAiTranscript, toolcalls, toolresults, agentUpdated, lastAiResponse, showFeedbackButtons, isFeedbackMode, isSubmittingFeedback, isSubmittingFinetuneFeedback, teachAi, setTeachAi);


    // Add effect to scroll to bottom when content changes
    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
        }
    }, [conversationHistory, thinkResponse]);

    // Effect to clean up audio when component unmounts or WS disconnects
    useEffect(() => {
        // Stop audio if connection closes or component unmounts
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                setCurrentAudio(null);
                setCurrentlyPlayingIndex(null);
            }
        };
    }, [currentAudio]); // Depend on currentAudio

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

        return () => {
            window.removeEventListener('imageCaptured', handleImageCaptured as EventListener);
        };
    }, []);

    // NEW: Effect to send personality status when it changes and connection is active
    useEffect(() => {
        if (connected) {
            sendPersonality();
        }
    }, [empathy, directness, warmth, challenge, connected]);

    // NEW: Effect to send local lingo status when it changes and connection is active
    useEffect(() => {
        if (connected) { sendLocalLingoMessage(); }
    }, [useLocalLingo, connected]);

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
            setThinkResponse(''); // Clear the current AI response area immediately
            if (messageToSend) {
                // Add user message to history
                setConversationHistory(prev => [...prev, { type: 'user', content: messageToSend }]);
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

        setThinkResponse('');
        
        const audioMsg: AudioMessage = { type: "audio", audio: base64Audio, voice: selectedVoice };
        ws.current?.send(JSON.stringify(audioMsg));

        if (capturedImages.length > 0) {
            // Send all captured images
            const imageMessage: ImageMessage = { type: "image", format: "jpeg", data: capturedImages.map(img => img.data) };
            ws.current?.send(JSON.stringify(imageMessage));
        }

        const orchestrationMessage: OrchestrateMessage = { type: "orchestrate", user_input: userTranscript, extract: extractKnowledge, summarize: summarizeFrequency }
        ws.current?.send(JSON.stringify(orchestrationMessage));
        
        setShowFeedbackButtons(false);
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
        
        // Make sure we have a valid user message and AI response
        if (!lastUserInput && !userTranscript) {
            toast.error("No user input to provide feedback on");
            return;
        }

        if (!lastAiResponse) {
            toast.error("No AI response to provide feedback on");
            return;
        }

        // Check if feedback has already been submitted for this response
        if (feedbackSubmittedResponses.has(lastAiResponse)) {
            toast.info("Feedback already submitted for this response");
            return;
        }

        try {
            setIsSubmittingFinetuneFeedback(true);

            // Create the feedback payload with the correct message context
            const payload: FinetuneFeedbackPayload = {
                message_input: lastUserInput || userTranscript,
                message_output: lastAiResponse,
                feedback_type: isPositive
            };

            console.log("Submitting feedback:", payload); // Add this for debugging

            await submitFinetuneFeedback(payload);
            
            // Mark this response as having received feedback
            setFeedbackSubmittedResponses(prev => {
                const newSet = new Set(prev);
                newSet.add(lastAiResponse);
                return newSet;
            });

            const feedbackMessage: FeedbackMessage = { 
                type: "feedback", 
                feedback_type: isPositive 
            };
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

    const truncateText = (text: string | null | undefined, maxLength: number = 20) => {
        if (!text) return ""; // Return empty string for null/undefined
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    // WebSocket Stuff
    const connectSocket = async () => {
        try {
            setIsConnecting(true);
            toast.info("Connecting...");
            
            // Reset states when starting a new connection
            setConversationHistory([]);
            setLastUserInput('');
            setThinkResponse('');
            setLastAiResponse('');
            setFeedbackSubmittedResponses(new Set()); // Reset the feedback tracking
            sendPersonality();
            
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
                setShowFeedbackButtons(false); // Initially hide feedback buttons on new connection
                sendLocalLingoMessage();

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
                setConversationHistory([]); 
                setThinkResponse(''); 
                setLastAiResponse('');
                toast.info("Disconnected...");
                stopCurrentAudio();
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

                    setUserTranscript(msg.text);
                    setLastUserInput(msg.text); 
                    setConversationHistory(prev => [...prev, { type: 'user', content: msg.text }]);
                }

                    else if (msg.type === "ai_transcript" || msg.type === "ai_response" || msg.type === "message_output_item") {
                        const isFinalChunk = msg.type === "ai_response";

                        if (isFinalChunk) {
                            setConversationHistory(prev => {
                                const lastMessage = prev[prev.length - 1];
                        
                                if (lastMessage && lastMessage.type === 'ai') {
                                    if (lastMessage.content !== msg.text) {
                                        return [...prev.slice(0, -1), { type: 'ai', content: msg.text }];
                                    }
                                    return prev;
                                } else {
                                    // Add a new AI message to history
                                    return [...prev, { type: 'ai', content: msg.text }];
                                }
                            });
                            setLastAiResponse(msg.text);
                            setIsWaitingForResponse(false);
                            setShowFeedbackButtons(true); // Show feedback buttons when AI response is complete
                        } else {
                            setIsWaitingForResponse(false);
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
                    setThinkResponse(msg.text);
                    }

                    else if (msg.type === "info") {
                        //toast.info(msg.text);
                        setThinkResponse(msg.text);
                    }

                    // Info Events
                    else if (msg.type === "tool_call_item") {
                        setToolcalls(msg.text);
                        //toast.info(msg.text);
                        setThinkResponse(msg.text);
                    }

                    else if (msg.type === "tool_call_output_item") {
                        setToolresults(msg.text);
                        //toast.info(truncateText(msg.text));
                        setThinkResponse(msg.text);
                    }

                    else if (msg.type === "agent_updated") {
                        setAgentUpdated(msg.text);
                        //toast.info(msg.text);
                        setThinkResponse(msg.text);
                    }

                    else if (msg.type === "orchestration") {
                        //toast.info("Status " + msg.status);
                        setThinkResponse(msg.text);
                    }
                    
                    // Actions
                    else if (msg.type === "gps_action") {
                        // toast.info("GPS Action: " + msg.status);
                    }

                    else if (msg.type === "time_action") {
                        // toast.info("Time Action: " + msg.status);
                    }

                    else if (msg.type === "text_action") {
                        //toast.info("Text recieved " + msg.status);
                    }

                    else if (msg.type === "audio_action") {
                        //toast.info("Audio recieved " + msg.status);
                    }

                    else if (msg.type === "ui_action") {
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
                            // toggleInfoOverlay(true);
                            //console.log("Information Overlay Opened");
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

                    else if (msg.type === "feedback_action") {
                        setThinkResponse(msg.status);
                    }
                        
                    else if (msg.type === "local_lingo_action") {
                        setThinkResponse(msg.status);
                    }

                    else if (msg.type === "raw_action") {
                        setThinkResponse(msg.status);
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
        stopCurrentAudio(); // Stop audio before closing
        ws.current?.close();
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

    // Function to stop currently playing audio
    const stopCurrentAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // Reset playback position
             // Clean up event listener to prevent memory leaks
            currentAudio.onended = null;
            // Revoke the object URL when stopping or changing audio
            URL.revokeObjectURL(currentAudio.src); 
            setCurrentAudio(null);
        }
        setCurrentlyPlayingIndex(null);
    };

    // Function to handle playing/fetching audio for a message
    const handleSpeakResponse = async (textToSpeak: string, index: number) => {
        if (!textToSpeak) return;

        // If clicking the button for the currently playing audio, stop it.
        if (currentlyPlayingIndex === index && currentAudio) {
            stopCurrentAudio();
            return;
        }

        // Stop any currently playing audio before starting new
        stopCurrentAudio();

        let audioUrl: string | null = null; // Keep track of the URL for cleanup

        try {
            toast.info("Generating audio...");
            setCurrentlyPlayingIndex(index); // Indicate loading state for this index

            // Use the imported textToSpeech function to get the audio URL
            audioUrl = await textToSpeech(textToSpeak, selectedVoice);

            if (!audioUrl) {
                throw new Error("Failed to get audio URL from textToSpeech function");
            }

            const newAudio = new Audio(audioUrl);
            setCurrentAudio(newAudio); // Store the new audio object

            newAudio.onended = () => {
                console.log("Audio ended naturally.");
                stopCurrentAudio(); // Reset state and revoke URL
            };

            newAudio.onerror = (e) => {
                console.error("Audio playback error:", e);
                toast.error("Failed to play audio");
                stopCurrentAudio(); // Reset state and revoke URL
            }

            // Use a promise to wait for the audio to be ready to play
            await new Promise<void>((resolve, reject) => {
                newAudio.oncanplaythrough = () => resolve();
                newAudio.onerror = (e) => { // Also reject on error during loading
                     console.error("Audio loading error:", e);
                     reject(new Error("Failed to load audio"));
                }
            });
            
            await newAudio.play();
            toast.dismiss(); // Dismiss "Generating audio..." toast
            toast.success("Speaking...");

        } catch (error) {
            console.error("Failed to speak response:", error);
            toast.error("Failed to generate or play audio");
            stopCurrentAudio(); // Reset state on fetch/setup error
             // Ensure URL is revoked even if audio object wasn't fully set up
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        }
    };

    const sendPersonality = () => {
        const personalityMsg: PersonalityMessage = {
            type: "personality",
            empathy,
            directness,
            warmth,
            challenge
        };
        ws.current?.send(JSON.stringify(personalityMsg));
    };

    const sendLocalLingoMessage = () => {
        const localLingoMsg: LocalLingoMessage = { type: "local_lingo", local_lingo: useLocalLingo };
        ws.current?.send(JSON.stringify(localLingoMsg))
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-xl px-4">
           
            {/*AI Response Area */}
            <div className="w-full h-100% flex flex-col rounded-lg overflow-hidden text-gray-700">
                {/* Main content container with bottom alignment */}
                <div className="flex-1 flex flex-col justify-end items-center">

                    {/* Scrollable Content Area */}
                    <div className="w-full flex flex-col max-h-[600px] overflow-y-auto scrollbar-hide pb-4" ref={scrollViewportRef}>

                        {/* Audio Visualizer */}
                        <div className="flex items-center justify-center p-2 w-full">
                            <AudioVisualizer />
                        </div>

                        {/* Conversation History */}
                        <div className="w-full px-4 space-y-3 mb-4">
                            {conversationHistory.map((message, index) => (
                                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start mb-10 '}` }>
                                    <div className={`relative group rounded-lg p-2 px-3 max-w-[85%] text-sm shadow-md 
                                        ${message.type === 'user' ? 'bg-accent/20 text-accent-foreground hover:bg-secondary/50' 
                                            : 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/50'} 
                                        transition-all duration-300 hover:shadow-xl hover:scale-[1.05] cursor-pointer scale-in animate-in fade-in slide-in-from-bottom-4 text-gray-700 filter-blur-lg`}>
                                        <MarkdownRenderer>{message.content}</MarkdownRenderer>
                                        
                                        {/* Speak/Stop button for AI messages */}
                                        {message.type === 'ai' && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -bottom-7 right-1 h-5 w-5 transition-transform hover:scale-110"
                                                onClick={() => currentlyPlayingIndex === index ? stopCurrentAudio() : handleSpeakResponse(message.content, index)}
                                                title={currentlyPlayingIndex === index ? "Stop Speaking" : "Speak this response"}
                                            >
                                                {currentlyPlayingIndex === index ? (
                                                    currentAudio ? <Pause size={12} className="text-accent" /> : <Loader2 size={12} className="animate-spin" />
                                                ) : (
                                                    <Volume2 size={12} className="opacity-70 group-hover:opacity-100" />
                                                )}
                                            </Button>
                                        )}

                                        {/* Feedback buttons for AI messages - always visible - DO NOT CHANGE */}
                                        {message.type === 'ai' && index === conversationHistory.length - 1 && lastAiResponse && !feedbackSubmittedResponses.has(lastAiResponse) && (
                                            <div className="absolute -bottom-7 gap-2 left-3 flex items-center text-gray-400">
                                                <Button
                                                    variant="ghost"
                                                    className="p-1 h-3 w-3 flex items-center justify-center rounded-full"
                                                    onClick={() => handleFinetuneFeedback(true)}
                                                    disabled={isSubmittingFinetuneFeedback}
                                                    title="Helpful"
                                                >
                                                    {isSubmittingFinetuneFeedback ? <Spinner /> : <ThumbsUp size={3} />}
                                                </Button>
                                                /
                                                <Button
                                                    variant="ghost"
                                                    className="p-1 h-3 w-3 flex items-center justify-center rounded-full"
                                                    onClick={() => handleFinetuneFeedback(false)}
                                                    disabled={isSubmittingFinetuneFeedback}
                                                    title="Not Helpful"
                                                >
                                                    {isSubmittingFinetuneFeedback ? <Spinner /> : <ThumbsDown size={3}/>}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Thinking text */}
                        <div className="flex flex-col items-center justify-center text-center text-gray-700 mb-4 px-4 break-words whitespace-pre-wrap min-h-[20px]"> {/* Adjusted min-height */}
                             {isWaitingForResponse && ( // Show "Thinking..." if waiting and no thinkResponse yet
                                <div className="flex items-center justify-center text-gray-500 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    <span>Thinking... {truncateText(thinkResponse)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback button */}
             {/* Only show general feedback if an AI response exists and we are not in feedback mode */}
             {/* {lastAiResponse && !isFeedbackMode && (
                 <Button
                     variant="ghost"
                     size="sm"
                     className="text-xs flex items-center text-gray-400 hover:text-gray-500"
                     onClick={handleToggleFeedbackMode}
                 >
                     <MessageSquarePlus size={14} />
                     Give feedback
                 </Button>
             )} */}

            {/* Feedback form */}
            {/* {isFeedbackMode && (
                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Tell us what you think about this response..."
                        className="w-full min-h-[100px] p-3 mb-2 text-sm border-none"
                        disabled={isSubmittingFeedback}
                    />
                    <div className="flex justify-end px-1">
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
            )} */}


            {/* Input Area - DO NOT CHANGE */}
            {connected && (
                <>
                    <div className={`flex w-full items-start gap-2 rounded-4xl border p-2 shadow-lg bg-background transition-opacity ${isListening ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}>
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
