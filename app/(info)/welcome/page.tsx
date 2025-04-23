import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedBlobLogo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Background from "@/components/Background";
import Logo from "@/components/Logo";
import AudioVisualizer from "@/components/Visualizer";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen text-foreground">
      <Background />

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12 relative">
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
            Knolia is here to listen.
          </h2>
          
          <div className="space-y-3 text-lg">
            <p>There are thoughts you never say out loud.</p>
            <p>Feelings that stay buried.</p>
            <p>Questions you wish someone would ask.</p>
            <p className="pt-4 font-medium">Knolia was made for these moments.</p>
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
      <section className="w-full bg-accent/10 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 animate-in fade-in duration-1000">How It Works</h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-10 animate-in fade-in duration-1000 delay-200">
            Knolia learns you. Not just your words, but your patterns, your moods, your meaning.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-background p-6 rounded-lg shadow-sm transform transition-all hover:scale-105 hover:shadow-md animate-in fade-in-50 duration-700 delay-100">
              <h3 className="text-xl font-medium mb-3">Builds memory from every conversation</h3>
              <p className="text-muted-foreground">Knolia remembers what matters to you and uses it to deepen your connection over time.</p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm transform transition-all hover:scale-105 hover:shadow-md animate-in fade-in-50 duration-700 delay-200">
              <h3 className="text-xl font-medium mb-3">Recognizes emotional states</h3>
              <p className="text-muted-foreground">Through natural conversation, Knolia understands your feelings and responds with empathy.</p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm transform transition-all hover:scale-105 hover:shadow-md animate-in fade-in-50 duration-700 delay-300">
              <h3 className="text-xl font-medium mb-3">Surfaces relevant past thoughts when needed</h3>
              <p className="text-muted-foreground">Knolia makes connections between conversations, bringing up what's helpful in the moment.</p>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center animate-in fade-in duration-1000 delay-500">
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
      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 animate-in fade-in duration-1000">What Makes Knolia Different</h2>
          <p className="text-xl text-center max-w-3xl mx-auto mb-10 animate-in fade-in duration-1000 delay-200">
            Not transactional. Not clinical. Not generic.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg transform transition-all hover:scale-105 hover:border-accent/50 hover:shadow-md animate-in fade-in-50 duration-700 delay-100">
              <h3 className="text-xl font-medium mb-3">Remembers your story</h3>
              <p className="text-muted-foreground">Knolia builds a personalized memory map that grows with every conversation.</p>
            </div>
            
            <div className="p-6 border rounded-lg transform transition-all hover:scale-105 hover:border-accent/50 hover:shadow-md animate-in fade-in-50 duration-700 delay-200">
              <h3 className="text-xl font-medium mb-3">Grows more personal over time</h3>
              <p className="text-muted-foreground">The more you talk to Knolia, the more it adapts to your unique way of expressing yourself.</p>
            </div>
            
            <div className="p-6 border rounded-lg transform transition-all hover:scale-105 hover:border-accent/50 hover:shadow-md animate-in fade-in-50 duration-700 delay-300">
              <h3 className="text-xl font-medium mb-3">Talks to you like a real presence</h3>
              <p className="text-muted-foreground">Natural, flowing conversations that feel like you're talking to someone who truly knows you.</p>
            </div>
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto p-8 bg-muted rounded-lg shadow-sm animate-in fade-in duration-1000 delay-500">
            <p className="text-lg italic text-center">
              "It felt like Knolia really knew me. I wasn't just repeating myself. It was evolving."
            </p>
            <p className="text-center mt-2 font-medium">— Danejw</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-accent/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center animate-in fade-in duration-1000">
          <h2 className="text-3xl font-bold mb-6">Ready to Try It?</h2>
          
          <div className="space-y-4 mb-8">
            <p className="text-xl">Talk. Vent. Explore. Heal.</p>
            <p className="text-lg">No pressure. No script.</p>
            <p className="text-lg">Just you and a companion that listens.</p>
          </div>
          
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg">
              Start Talking to Knolia
            </Button>
          </Link>
          
          <p className="mt-8 text-sm text-muted-foreground max-w-lg mx-auto">
            *All conversations are private and secure. Your thoughts belong to you and only you.*
          </p>
        </div>
      </section>

    </div>
  );
}
