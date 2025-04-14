// components/overlays/CaptureOverlay.tsx
'use client';

import { useEffect, useRef, useState } from "react";
import { ImageMessage } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Camera, Loader2 } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CaptureOverlay({ open, onOpenChange }: Props) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        if (open) {
            const startCamera = async () => {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setStream(mediaStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = mediaStream;
                    }
                } catch (err) {
                    console.error("Camera access denied", err);
                }
            };
            startCamera();
        }

        return () => {
            stream?.getTracks().forEach(track => track.stop());
            setStream(null);
        };
    }, [open]);

    const handleTakePhoto = async () => {
        if (!videoRef.current) return;
        setIsCapturing(true);

        try {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (!blob) return;

                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64Image = (reader.result as string).split(",")[1];
                        const image: ImageMessage = {
                            type: "image",
                            format: "jpeg",
                            data: base64Image,
                        };
                        onOpenChange(false);
                    };
                    reader.readAsDataURL(blob);
                }, "image/jpeg");
            }
        } catch (error) {
            console.error("Error capturing photo:", error);
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] h-[90vh] max-w-[90vw] max-h-[90vh] p-4 rounded-xl overflow-hidden fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-lg sm:text-xl flex items-center justify-center gap-2 pr-8 pt-2">
                        <Camera className="h-5 w-5" />
                        Take a Photo
                    </DialogTitle>
                    <DialogDescription className="text-sm pt-1">
                        Frame it up and click capture when ready.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col flex-1 h-[calc(90vh-160px)]">
                    <div className="relative flex-1 rounded-xl overflow-hidden shadow-lg bg-black">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex justify-center gap-3 py-4">
                        {/* Camera Button */}
                        <Button
                            onClick={handleTakePhoto}
                            disabled={isCapturing}
                            className="rounded-full w-16 h-16 flex items-center justify-center text-white shadow-lg transition"
                        >
                            {isCapturing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Capturing...
                                </>
                            ) : (
                                <>
                                    <Camera className="h-8 w-8" />
                                </>
                            )}
                        </Button>       
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
