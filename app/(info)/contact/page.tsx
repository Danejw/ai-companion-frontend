'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"; // Assuming sonner is used for notifications

// const metadata = {
//   title: "Knolia - Contact Us",
//   description: "Get in touch with the Knolia team.",
// };

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      // Success!
      toast.success("Message sent successfully!");
      setName('');
      setEmail('');
      setMessage('');

    } catch (err) {
      console.error("Contact form error:", err);
      setError('Failed to send message. Please try again later.');
      toast.error('Failed to send message.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Have questions, feedback, or just want to say hello? Fill out the form below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Your message..."
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            'Send Message'
          )}
        </Button>
      </form>
    </div>
  );
} 