// components/overlays/CaptureOverlay.tsx
'use client';

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Camera, Loader2, Check } from "lucide-react";
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
    const [capturedImagesCount, setCapturedImagesCount] = useState(0);
    const [cameraError, setCameraError] = useState<string | null>(null);
    
    // Add state to track if camera is ready
    const [isCameraReady, setIsCameraReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        let mediaStream: MediaStream | null = null;
        
        if (open) {
            // Only reset the captured image when opening
            setCapturedImage(null);
            setCameraError(null);
            
            const startCamera = async () => {
                try {
                    // Don't reinitialize if we already have a stream
                    if (stream && stream.active) {
                        console.log("Camera already active");
                        setIsCameraReady(true);
                        return;
                    }
                    
                    toast.info("Accessing camera...");
                    
                    // Stop any existing tracks
                    if (stream) {
                        stream.getTracks().forEach(track => track.stop());
                    }
                    
                    const constraints = { 
                        video: { 
                            facingMode: 'environment',
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        } 
                    };
                    
                    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                    
                    if (!mounted) {
                        if (mediaStream) {
                            mediaStream.getTracks().forEach(track => track.stop());
                        }
                        return;
                    }
                    
                    setStream(mediaStream);
                    
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                        
                        videoRef.current.onloadedmetadata = () => {
                            if (videoRef.current) {
                                videoRef.current.play()
                                    .then(() => {
                                        setIsCameraReady(true);
                                        toast.success("Camera ready");
                                    })
                                    .catch(err => {
                                        console.error("Error playing video:", err);
                                        setCameraError("Could not play video stream");
                                        toast.error("Camera error: Could not play video");
                                    });
                            }
                        };
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
            
            // Only stop camera when closing the overlay completely
            if (!open) {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                    setStream(null);
                }
                setIsCameraReady(false);
            }
        };
    }, [open, stream]);

    const handleTakePhoto = async () => {
        if (!videoRef.current || !stream || !stream.active) {
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
                        
                        // Store the image data in sessionStorage - we'll keep it ready
                        sessionStorage.setItem('capturedImage', base64Image);
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

    // Function to accept the current image and continue
    const handleAcceptImage = () => {
        const base64Image = sessionStorage.getItem('capturedImage');
        if (!base64Image) {
            toast.error("No image data found");
            setCapturedImage(null);
            return;
        }

        // Dispatch a custom event that InteractionHub can listen for
        window.dispatchEvent(new CustomEvent('imageCaptured', {
            detail: { imageId: Date.now().toString(), imageData: base64Image }
        }));
        
        // Show success toast with image preview
        toast.success(
            <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                    <img 
                        src={`data:image/jpeg;base64,${base64Image}`} 
                        alt="Captured" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <span>Photo added!</span>
            </div>,
            { duration: 2000 }
        );
        
        // Important: Clear the captured image first, then ensure video element is ok
        setCapturedImage(null);
        
        // Increment the counter of captured images
        setCapturedImagesCount(prev => prev + 1);
        
        // Clear the storage
        sessionStorage.removeItem('capturedImage');
    };
    
    // Function to reset the camera view (cancel the current capture)
    const handleResetCamera = () => {
        setCapturedImage(null);
        
        // No need to call play() here as the video element should still be playing
        // Just switch back to the video view
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-transparent w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] p-4 rounded-xl overflow-hidden fixed top-[47%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg sm:text-xl flex items-center justify-center gap-2 pt-2">
                        <Camera className="h-5 w-5 text-primary-foreground" />
                        Take Photos
                        {capturedImagesCount > 0 && (
                            <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {capturedImagesCount}
                            </span>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-sm pt-1 text-white">
                        {cameraError 
                            ? `Camera error: ${cameraError}` 
                            : capturedImagesCount > 0
                                ? "Keep taking photos or close to finish"
                                : "Frame it up and click capture when ready"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col flex-1 h-[calc(90vh-160px)]">
                    <div className="relative flex-1 rounded-xl overflow-hidden shadow-lg bg-black flex items-center justify-center">
                        {/* Video element is ALWAYS in the DOM but hidden/shown with CSS */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-contain ${capturedImage ? 'hidden' : 'block'}`}
                        />
                        
                        {capturedImage && (
                            <img 
                                src={capturedImage} 
                                alt="Captured" 
                                className="w-full h-full object-contain"
                            />
                        )}
                        
                        {cameraError && (
                            <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                                <div>
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
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center gap-3 py-4">
                        {capturedImage ? (
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleResetCamera}
                                    className="rounded-full w-16 h-16 flex items-center justify-center bg-accent-foreground hover:bg-accent-foreground/90"
                                >
                                    <X className="h-8 w-8" />
                                </Button>
                                <Button
                                    onClick={handleAcceptImage}
                                    className="rounded-full w-16 h-16 flex items-center justify-center bg-primary hover:bg-primary/90"
                                >
                                    <Check className="h-8 w-8" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                {capturedImagesCount > 0 && (
                                    <Button
                                        onClick={() => onOpenChange(false)}
                                        className="rounded-full w-16 h-16 flex items-center justify-center bg-primary hover:bg-primary/90"
                                    >
                                        <span className="text-xl">✓</span>
                                    </Button>
                                )}
                                <Button
                                    onClick={handleTakePhoto}
                                    disabled={isCapturing || !isCameraReady || !stream || !stream.active}
                                    className="rounded-full w-16 h-16 flex items-center justify-center text-white shadow-lg transition bg-accent hover:bg-accent/90"
                                >
                                    {isCapturing ? (
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    ) : (
                                        <Camera className="h-8 w-8" />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
