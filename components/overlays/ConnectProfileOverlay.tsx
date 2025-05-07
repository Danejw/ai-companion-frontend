// components/overlays/ConnectProfileOverlay.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useUIStore } from '@/store';
import { generateUserConnectProfile, submitUserConnectProfile, UserConnectProfile } from '@/lib/api/connect';

interface ConnectProfileOverlayProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ConnectProfileOverlay({ open, onOpenChange }: ConnectProfileOverlayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  const { userConnectProfile: storeProfile, setUserConnectProfile } = useUIStore();
  
  const [profile, setProfile] = useState<UserConnectProfile>({
    name: '',
    age: 0,
    bio: '',
    relationship_goals: '',
    personality_tags: [],
    sexual_preferences: {
      orientation: '',
      looking_for: '',
    },
    location: '',
  });

  useEffect(() => {
    if (open) {
      if (storeProfile) {
        setProfile(storeProfile);
      } else {
        loadProfile();
      }
    }
  }, [open, storeProfile]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const data = await generateUserConnectProfile();
      console.log('Generated profile:', data);
      setProfile(data);
      setUserConnectProfile(data);
    } catch (error) {
      toast.error('Failed to generate profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitUserConnectProfile(profile);
      setUserConnectProfile(profile);
      toast.success('Profile submitted successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to submit profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !profile.personality_tags.includes(newTag.trim())) {
      setProfile({
        ...profile,
        personality_tags: [...profile.personality_tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setProfile({
      ...profile,
      personality_tags: profile.personality_tags.filter(t => t !== tag)
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md flex flex-col overflow-y-auto p-6">
        <SheetHeader className="border-b pb-6 pt-2">
          <SheetTitle className="flex items-center text-xl">
            Your Connect Profile
          </SheetTitle>
          <SheetDescription className="mt-2">
            Review and edit your profile before connecting with others
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Generating your profile...</span>
          </div>
        ) : (
        <div className="flex-1 py-8 space-y-6 overflow-y-auto scrollbar-hide">

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                id="name"
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your name"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                id="age"
                value={profile.age || ''}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                placeholder="Your age"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell others about yourself"
                className="resize-none"
                rows={4}
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship-goals">Relationship Goals</Label>
              <Textarea
                id="relationship-goals"
                value={profile.relationship_goals}
                onChange={(e) => setProfile({ ...profile, relationship_goals: e.target.value })}
                placeholder="What are you looking for?"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientation">Sexual Orientation</Label>
              <Input
                id="orientation"
                value={profile?.sexual_preferences?.orientation || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  sexual_preferences: { 
                    ...profile.sexual_preferences, 
                    orientation: e.target.value 
                  }
                })}
                placeholder="Your sexual orientation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="looking-for">Looking For</Label>
              <Input
                id="looking-for"
                value={profile?.sexual_preferences?.looking_for || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  sexual_preferences: { 
                    ...profile.sexual_preferences, 
                    looking_for: e.target.value 
                  }
                })}
                placeholder="What are you looking for"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Where are you located?"
              />
            </div>
          </div>
        )}

        <div className="border-t pt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Profile"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}