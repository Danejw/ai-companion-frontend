'use client'

import { useEffect, useRef, useState } from "react";
import { Ear, EarOff, Loader2, MessageSquarePlus, Mic, MicOff, Power, Send, X } from "lucide-react";
import { AudioMessage, GPSMessage, OrchestrateMessage, TextMessage, TimeMessage, WebSocketMessage } from "@/types/messages";
import { getSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitFeedback } from "@/lib/api/feedback";
import AudioVisualizer from "../Visualizer";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import { JSX } from "react/jsx-runtime";
import { useUIStore } from '@/store'; // Import the store


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Simple Spinner component reused
const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" />;


export default function InteractionHubVoice() {
    const {
        extractKnowledge,
        summarizeFrequency,
        selectedVoice
    } = useUIStore();
    
    
    // States
    const [connected, setConnected] = useState(false);
    const [recording, setRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceModeEnabled] = useState(false);

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

    // Text Output
    const [aiResponse, setAiResponse] = useState('');

    const [userTranscript, setUserTranscript] = useState('');
    const [aiTranscript, setAiTranscript] = useState('');
    const [toolcalls, setToolcalls] = useState('');
    const [toolresults, setToolresults] = useState('');
    const [agentUpdated, setAgentUpdated] = useState('');

    // Feedback
    const [isFeedbackMode, setIsFeedbackMode] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [teachAi, setTeachAi] = useState(false);




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
        if (!messageToSend) return; // Prevent multiple streams
    
        try {
            setAiResponse('');

            const textMessage: TextMessage = { type: "text", text: messageToSend, extract: extractKnowledge, summarize: summarizeFrequency };

            ws.current?.send(JSON.stringify(textMessage));

            const orchestrationMessage: OrchestrateMessage = { type: "orchestrate", user_input: messageToSend }
            ws.current?.send(JSON.stringify(orchestrationMessage));

        } catch (error) {
            console.error("Streaming error:", error);
            toast.error("Something went wrong while streaming the response.");
        }
    };




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




    // WebSocket Stuff
    const connectSocket = async () => {

        const session = await getSession();
        const accessToken = session?.user?.accessToken; // Adjust path if necessary


        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
            ws.current = new WebSocket(`${BACKEND_URL.replace("http", "ws")}/ws/main?token=${accessToken}`);

            ws.current.onopen = () => {
                console.log("WebSocket connected");
                setConnected(true);
                sendGPS();
                sendTime();
            };

            ws.current.onclose = () => {
                console.log("WebSocket disconnected");
                setConnected(false);
                setIsListening(false);
            };

            ws.current.onmessage = (event) => {
                const msg = JSON.parse(event.data);

                // Responses
                if (msg.type === "user_transcript") {
                    setMessages((prev) => [...prev, `🧍 You said: ${msg.text}`]);
                }

                else if (msg.type === "ai_transcript" || msg.type === "ai_response" || msg.type === "message_output_item") {
                    setAiResponse(msg.text)
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
                            
                            await audio.play();
                        } catch (err) {
                            console.error("Audio playback error:", err);
                            toast.error("Failed to play audio response");
                        }
                    })();
                }

                // Info Events
                else if (msg.type === "tool_call_item") {
                    setToolcalls(msg.text);
                    toast.info(msg.text);
                }

                else if (msg.type === "tool_call_output_item") {
                    setToolresults(msg.text);
                    toast.info(msg.text);
                }

                else if (msg.type === "agent_updated") {
                    setAgentUpdated(msg.text);
                    toast.info(msg.text);
                }

                else if (msg.type === "orchestration") {
                    toast.info(msg.status);
                }
                
                // Actions
                else if (msg.type === "gps_action") {
                    toast.info(msg.status);
                }

                else if (msg.type === "time_action") {
                    toast.info(msg.status);
                }

                else if (msg.type === "error") {
                    console.error("Error:", msg.text);
                    toast.error(msg.text);
                }

                else {
                    console.log("Unhandled message type:", msg);
                }

            };
        }
    };

    const startRecording = async () => {
        connectSocket();
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
            reader.onloadend = () => {
                const base64Audio = (reader.result as string).split(",")[1];
                
                const audioMsg: AudioMessage = { type: "audio", audio: base64Audio, voice: selectedVoice, extract: extractKnowledge, summarize: summarizeFrequency };
                ws.current?.send(JSON.stringify(audioMsg));


                const orchestrationMessage: OrchestrateMessage = { type: "orchestrate", user_input: userTranscript }
                ws.current?.send(JSON.stringify(orchestrationMessage));
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
            {connected && (
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
                        title="Send Message"
                        disabled={!inputText.trim() || isListening}
                    >
                        {isListening ? <Spinner /> : <Send className="h-5 w-5" />}
                    </Button>
                </div>
            )}


            {/* Voice Mode Button */}
            <div className="flex flex-col items-center justify-center gap-2 mt-2">
                <Button
                    size="icon"
                    className={`w-20 h-20 rounded-full flex-shrink-0 self-center transition-colors
                        ${!connected
                            ? 'bg-accent-foreground/60 hover:bg-accent-foreground'
                            : isListening
                                ? 'bg-accent-foreground'
                                : 'bg-accent hover:bg-accent/80'
                        }
                        ${isListening && 'animate-pulse'}`}
                    title={connected ? (isListening ? "Release to Stop" : "Hold to Speak") : "Connect"}
                    onClick={!connected ? connectSocket : undefined}
                    onMouseDown={connected ? startRecording : undefined}
                    onMouseUp={connected ? stopRecording : undefined}
                    onTouchStart={connected ? startRecording : undefined}
                    onTouchEnd={connected ? stopRecording : undefined}
                >
                    {!connected ? (
                        <Power className="w-3/4 h-3/4 text-white" />
                    ) : isListening ? (
                        <Ear className="w-3/4 h-3/4 text-white" />
                    ) : (
                        <Mic className="w-3/4 h-3/4 text-white" />
                    )}
                </Button>

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