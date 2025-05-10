'use client';

import React from 'react';
import { X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NotificationContent } from '@/notifications/notification_types';


interface InfoNotificationOverlayProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    notification: NotificationContent;
}


export default function InfoNotificationOverlay({ 
    open, 
    onOpenChange, 
    notification 
}: InfoNotificationOverlayProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">
                        {notification.title}
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>
                <div className="mt-4">
                    <p className="text-muted-foreground">
                        {notification.description}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
} 