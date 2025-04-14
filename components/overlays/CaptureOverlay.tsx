// components/overlays/CaptureOverlay.tsx
'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CaptureOverlay({ open, onOpenChange }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        
        if (open) {
            // Reset state when opening
            setCapturedImage(null);
            setCameraError(null);
            
            const startCamera = async () => {
                try {
                    toast.info("Accessing camera...");
                    
                    // First stop any existing streams
                    if (stream) {
                        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
                    }
                    
                    const constraints = { 
                        video: { 
                            facingMode: 'environment',
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        } 
                    };
                    
                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    
                    if (!mounted) return;
                    
                    setStream(mediaStream);
                    
                    // Make sure videoRef has been initialized
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                        
                        // Let's be extra certain the video loads
                        videoRef.current.onloadedmetadata = () => {
                            if (videoRef.current) {
                                videoRef.current.play().catch((err: Error) => {
                                    console.error("Error playing video:", err);
                                    setCameraError("Could not play video stream");
                                    toast.error("Camera error: Could not play video");
                                });
                            }
                        };
                        
                        toast.success("Camera ready");
                    } else {
                        throw new Error("Video element not found");
                    }
                } catch (err) {
                    if (!mounted) return;
                    
                    console.error("Camera access error:", err);
                    setCameraError(err instanceof Error ? err.message : "Unknown error");
                    toast.error(`Camera access error: ${err instanceof Error ? err.message : "Unknown error"}`);
                }
            };
            
            startCamera();
        }
        
        return () => {
            mounted = false;
            if (stream) {
                stream.getTracks().forEach((track: MediaStreamTrack) => {
                    track.stop();
                });
                setStream(null);
            }
            setCapturedImage(null);
        };
    }, [open]);

    const handleTakePhoto = async () => {
        if (!videoRef.current || !stream) {
            toast.error("Camera not ready");
            return;
        }
        
        setIsCapturing(true);
        toast.info("Capturing photo...");

        try {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            
            // Ensure we use the actual video dimensions
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            
            const ctx = canvas.getContext("2d");

            if (ctx) {
                // Draw the current video frame to the canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Set the captured image preview
                const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);
                setCapturedImage(imageDataUrl);
                
                canvas.toBlob((blob) => {
                    if (!blob) {
                        toast.error("Failed to create image");
                        return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        if (!reader.result) {
                            toast.error("Failed to process image");
                            return;
                        }
                        
                        // Get the base64 data (safely)
                        const base64String = reader.result.toString();
                        const parts = base64String.split(",");
                        const base64Image = parts.length > 1 ? parts[1] : "";
                        
                        if (!base64Image) {
                            toast.error("Invalid image data");
                            return;
                        }
                        
                        // Store the image data in sessionStorage
                        sessionStorage.setItem('capturedImage', base64Image);
                        
                        // Dispatch a custom event that InteractionHub can listen for
                        window.dispatchEvent(new CustomEvent('imageCaptured', {
                            detail: { imageId: Date.now().toString(), imageData: base64Image }
                        }));
                        
                        // Show success toast with image preview
                        toast.success(
                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                                    <img 
                                        src={imageDataUrl} 
                                        alt="Captured" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span>Photo captured!</span>
                            </div>,
                            { duration: 3000 }
                        );
                    };
                    
                    reader.onerror = () => {
                        toast.error("Failed to read image data");
                    };
                    
                    reader.readAsDataURL(blob);
                }, "image/jpeg", 0.95);
            } else {
                throw new Error("Could not get canvas context");
            }
        } catch (error) {
            console.error("Error capturing photo:", error);
            toast.error(`Failed to capture photo: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-transparent w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] p-4 rounded-xl overflow-hidden fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg sm:text-xl flex items-center justify-center gap-2 pr-8 pt-2">
                        <Camera className="h-5 w-5" />
                        Take a Photo
                    </DialogTitle>
                    <DialogDescription className="text-sm text-center text-white pt-1">
                        {cameraError ? 
                            `Camera error: ${cameraError}` : 
                            "Frame it up and click capture when ready."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col flex-1 h-[calc(90vh-160px)]">
                    <div className="relative flex-1 rounded-xl overflow-hidden shadow-lg bg-black flex items-center justify-center">
                        {capturedImage ? (
                            <img 
                                src={capturedImage} 
                                alt="Captured" 
                                className="w-full h-full object-contain"
                            />
                        ) : cameraError ? (
                            <div className="text-white text-center p-4">
                                <p className="mb-2">😕 Camera error</p>
                                <p className="text-sm opacity-80">{cameraError}</p>
                                <Button 
                                    variant="outline" 
                                    className="mt-4" 
                                    onClick={() => onOpenChange(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>

                    <div className="flex justify-center gap-3 py-4">
                        {cameraError ? (
                            <Button 
                                variant="destructive"
                                onClick={() => onOpenChange(false)}
                                className="rounded-full px-6"
                            >
                                Close
                            </Button>
                        ) : capturedImage ? (
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setCapturedImage(null)}
                                    className="rounded-full w-16 h-16 flex items-center justify-center bg-destructive hover:bg-destructive/90"
                                >
                                    <X className="h-8 w-8" />
                                </Button>
                                <Button
                                    onClick={() => onOpenChange(false)}
                                    className="rounded-full w-16 h-16 flex items-center justify-center bg-primary hover:bg-primary/90"
                                >
                                    <span className="text-xl">✓</span>
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={handleTakePhoto}
                                disabled={isCapturing || !stream}
                                className="rounded-full w-16 h-16 flex items-center justify-center text-white shadow-lg transition bg-accent hover:bg-accent/90"
                            >
                                {isCapturing ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                ) : (
                                    <Camera className="h-8 w-8" />
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
