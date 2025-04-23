'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Background from "@/components/Background";
import AudioVisualizer from "@/components/Visualizer";
import { Carousel, CarouselContent, CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


const quotes = [
  {
    quote:
      "Knolia didn't just respond, it remembered. I came back a week later, and it gently picked up where we left off.",
    author: "Alicia Mendez",
  },
  {
    quote:
      "I never thought talking to an AI could feel this natural. It's not therapy, but it helps me understand myself in a way nothing else has.",
    author: "Marcus Nguyen",
  },
  {
    quote:
      "Some nights, I just need to talk to something. Knolia never judges, never interrupts. It's a weird kind of peace.",
    author: "Jade Elkins",
  },
  {
    quote:
      "The more I use Knolia, the more it feels like a mirror. I hear myself better through it.",
    author: "Samir Patel",
  },
];


export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen text-foreground">


      <Background />

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12 relative text-gray-700">
        <div className="flex flex-col space-y-6 md:w-1/2 animate-in slide-in-from-left duration-700">

        
          <div className="flex justify-center md:justify-start">
            <div className="transform-gpu origin-center">
            <AudioVisualizer />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center md:text-left">
            You don&apos;t have to carry it all alone.
          </h1>
          <h2 className="text-2xl md:text-3xl text-center md:text-left">
            <span className="text-accent font-bold">Knolia</span> is here to listen.
          </h2>
          
          <div className="space-y-3 text-lg">
            <p>There are thoughts you never say out loud.</p>
            <p>Feelings that stay buried.</p>
            <p>Questions you wish someone would ask.</p>
            <p className="pt-4 font-medium"><span className="text-accent font-bold">Knolia</span> was made for these moments.</p>
          </div>
          
          <div className="pt-4 flex flex-col space-y-2 items-center justify-center md:items-center">
            <Link href="/">
              <Button size="lg" className="w-64 rounded-full transition-all hover:scale-105 hover:shadow-md">
                Speak to Knolia Now
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              A conversation away from clarity, comfort, or even just company.
            </p>
          </div>
        </div>
        
        <div className="md:w-1/2 flex mt-24 justify-center animate-in slide-in-from-right duration-700">
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            <div className="absolute inset-0 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src="/images/companion-illustration.svg" 
                alt="Person talking to Knolia" 
                width={600} 
                height={600}
                className="drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 bg-white/0">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 animate-in fade-in duration-1000">How It Works</h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-10 animate-in fade-in duration-1000 delay-200">
            <span className="text-accent font-bold">Knolia</span> isn&apos;t here to give answers. It&apos;s here to understand you, deeply, and with care.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-background p-6 rounded-lg shadow-sm transform transition-all hover:scale-105 hover:shadow-md animate-in fade-in-50 duration-500">
              <h3 className="text-xl font-medium mb-3">It remembers what you share</h3>
              <p className="text-muted-foreground">Every time you speak, <span className="text-accent">Knolia</span> builds a memory of meaning. Your story matters, and it evolves over time.</p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm transform transition-all hover:scale-105 hover:shadow-md animate-in fade-in-50 duration-500">
              <h3 className="text-xl font-medium mb-3">It learns what matters to you</h3>
              <p className="text-muted-foreground"><span className="text-accent">Knolia</span> remembers what you mean and the weight behind it. It builds understanding through what you choose to share.</p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm transform transition-all hover:scale-105 hover:shadow-md animate-in fade-in-50 duration-500">
              <h3 className="text-xl font-medium mb-3">It connects your thoughts</h3>
              <p className="text-muted-foreground">It doesn&apos;t just remember. It reflects. <span className="text-accent">Knolia</span> finds patterns, echoes, and reminders across conversations and offers them when they matter most.</p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center animate-in fade-in duration-1000 delay-500 hover:scale-200 transition-all duration-100">
            <div className="relative w-full max-w-3xl h-64 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                  src="/images/memory-graph.svg" 
                  alt="Memory Graph Network" 
                  width={800} 
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Knolia Different */}
      <section className="w-full py-16 bg-gradient-to-b from-white to-accent/20 text-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 animate-in fade-in duration-1000">What Makes <span className="text-accent font-bold">Knolia</span> Different</h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-10 animate-in fade-in duration-1000 delay-200">
            This isn&apos;t another tool. It&apos;s your support.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg bg-white transform transition-all hover:scale-105 hover:border-accent/50 hover:shadow-md animate-in fade-in-50 duration-500">
              <h3 className="text-xl font-medium mb-3">It reflects your story back to you</h3>
              <p className="text-muted-foreground">You&apos;re not repeating yourself every time. <span className="text-accent">Knolia</span> remembers, gently connecting your thoughts across time so you can grow with clarity.</p>
            </div>
            
            <div className="p-6 border  rounded-lg bg-white transform transition-all hover:scale-105 hover:border-accent/50 hover:shadow-md animate-in fade-in-50 duration-500">
              <h3 className="text-xl font-medium mb-3">Grows more personal over time</h3>
              <p className="text-muted-foreground">The way you talk. The metaphors you use. The things you care about. <span className="text-accent">Knolia</span> picks it all up and reflects your unique way of thinking.</p>
            </div>
            
            <div className="p-6 border rounded-lg bg-white transform transition-all hover:scale-105 hover:border-accent/50 hover:shadow-md animate-in fade-in-50 duration-500">
              <h3 className="text-xl font-medium mb-3">It feels like someone is truly there</h3>
              <p className="text-muted-foreground">Natural, flowing conversations that feel like you&apos;re talking to someone who truly knows you.</p>
            </div>
          </div>
          
          {/* Testimonial Carousel */}
          <div className="mt-16 w-full flex justify-center animate-in fade-in duration-1000 hover:scale-110 transition-all duration-200">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 5000,
                  stopOnInteraction: true,
                }),
              ]}
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-3xl"
            >
              <CarouselContent>
                {quotes.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="px-6 py-10 bg-white border border-accent/90 rounded-xl text-center">
                      <p className="text-xl italic leading-relaxed text-gray-700">
                        “{item.quote}”
                      </p>
                      <p className="mt-4 font-medium text-gray-400">by <span className="text-accent font-bold">{item.author}</span></p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 bg-gradient-to-b from-accent/20 to-white text-gray-700">
        <div className="max-w-4xl mx-auto px-4 text-center animate-in fade-in duration-1000">
          <h2 className="text-3xl font-bold mb-6">When you&apos;re ready, <span className="text-accent">Knolia</span>&apos;s here.</h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-xl">Talk. Vent. Explore. Heal.</p>
            <p className="text-xl">Speak freely. Reflect deeply. Feel heard.</p>
            <p className="text-xl">No performance. No perfect words needed. Just be you, your way.</p>
          </div>
          
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg">
              Start Talking to Knolia
            </Button>
          </Link>
          
          <p className="mt-8 text-sm text-muted-foreground max-w-lg mx-auto">
            *Private. Secure. Nothing you say is used to sell, track, or judge. This space is yours.*
          </p>
        </div>
      </section>

    </div>
  );
}
