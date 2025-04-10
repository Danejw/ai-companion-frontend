import { useRef, useState } from 'react';
import { getSession } from 'next-auth/react'; // Or your preferred way to get token

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ai-companion-backend-opuh.onrender.com";

export default function VoiceInteraction() {
    const ws = useRef<WebSocket | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [userTranscript, setUserTranscript] = useState('');
    const [aiTranscript, setAiTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [connected, setConnected] = useState(false);

    const connectWebSocket = async () => {

        const session = await getSession();
        const accessToken = session?.user?.accessToken; // Adjust path if necessary
        ws.current = new WebSocket(`ws://localhost:8000/ws/voice-orchestration?token=${accessToken}`); // TODO: switch to wss for production

        console.log("--- DEBUG: VoiceInteraction - URL:", ws.current.url);
        console.log("--- DEBUG: VoiceInteraction - Access Token:", accessToken);
        console.log("--- DEBUG: VoiceInteraction - WebSocket connected to:", ws.current);

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
            setConnected(true);
        };

        ws.current.onmessage = async (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'user_transcript') {
                setUserTranscript(data.text);
            }

            if (data.type === 'ai_transcript') {
                setAiTranscript(data.text);
            }

            if (data.type === 'audio_response') {
                const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
            setConnected(false);
        };

        ws.current.onerror = (err) => {
            console.error('WebSocket error:', err);
        };
    };

    const disconnectWebSocket = () => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
            setConnected(false);
        }
    };

    const toggleConnection = () => {
        if (connected) {
            disconnectWebSocket();
        } else {
            connectWebSocket();
        }
    };

    const toggleRecording = async () => {
        if (!connected) {
            alert('Connect to WebSocket first!');
            return;
        }

        if (!isRecording) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorder.current.ondataavailable = (event) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Audio = reader.result?.toString().split(',')[1];
                    ws.current?.send(JSON.stringify({ type: 'audio', audio: base64Audio }));
                };
                reader.readAsDataURL(event.data);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } else {
            mediaRecorder.current?.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="p-4">
            <button
                className={`px-4 py-2 rounded-full text-white ${connected ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                onClick={toggleConnection}
            >
                {connected ? 'Disconnect' : 'Connect'}
            </button>

            <button
                className={`ml-4 px-4 py-2 rounded-full text-white ${isRecording ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                onClick={toggleRecording}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            <div className="mt-4">
                <p><strong>You:</strong> {userTranscript}</p>
                <p><strong>AI:</strong> {aiTranscript}</p>
            </div>
        </div>
    );
}

function base64ToBlob(base64: string, type: string): Blob {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes], { type });
}
