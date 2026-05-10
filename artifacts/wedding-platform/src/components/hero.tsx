import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import PhoneMockup from './phone-mockup';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-20 lg:pt-0 lg:pb-0" id="home">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E8720C]/10 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Subtle texture/noise overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 h-full min-h-[calc(100vh-80px)] mt-10 lg:mt-0">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium tracking-wide uppercase">The Future of Indian Weddings</span>
          </motion.div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.1] font-bold text-foreground mb-6 drop-shadow-lg">
            Create <span className="bg-gradient-to-r from-primary via-[#F7E7CE] to-primary bg-clip-text text-transparent">Cinematic</span><br />
            Wedding Invitations
          </h1>
          
          <p className="text-lg sm:text-xl text-foreground/80 mb-10 max-w-xl font-light leading-relaxed">
            Luxury digital wedding invitations, websites, videos & RSVP experiences made for modern Indian royalty. Where love meets timeless art.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/create">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-primary to-[#B59530] text-primary-foreground text-lg rounded-full font-semibold shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transition-all hover:scale-105"
                data-testid="button-hero-create"
              >
                Create Invitation
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto h-14 px-8 border-primary/30 text-primary hover:bg-primary/10 bg-background/20 backdrop-blur-sm text-lg rounded-full font-semibold transition-all hover:scale-105"
              data-testid="button-hero-demo"
            >
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Live Demo Preview / Phone Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex-1 w-full flex justify-center lg:justify-end relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          <PhoneMockup />
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-primary/60"
      >
        <span className="text-xs uppercase tracking-widest">Discover</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
