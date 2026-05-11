import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import PhoneMockup from './phone-mockup';

export default function Hero() {
  return (
    <section
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 lg:pt-0 lg:pb-0"
      id="home"
    >
      {/* Cinematic animated background — adapts to light/dark via CSS vars */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Base background */}
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--hero-bg)' }} />

        {/* Gold orb */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ backgroundColor: 'var(--hero-orb-gold)' }}
        />
        {/* Purple / rose orb */}
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.15, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] rounded-full blur-[150px]"
          style={{ backgroundColor: 'var(--hero-orb-purple)' }}
        />
        {/* Saffron orb */}
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ backgroundColor: 'var(--hero-orb-saffron)' }}
        />

        {/* Gold dust particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/50"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -(Math.random() * 200 + 100)],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--hero-grid) 1px, transparent 1px), linear-gradient(90deg, var(--hero-grid) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, var(--hero-vignette) 100%)`,
          }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 h-full min-h-[calc(100vh-80px)] lg:mt-0">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/12 border border-primary/25 text-primary mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium tracking-wide uppercase">The Future of Indian Weddings</span>
          </motion.div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.1] font-bold text-foreground mb-6 drop-shadow-sm">
            Create <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent">Cinematic</span><br />
            Wedding Invitations
          </h1>

          <p className="text-lg sm:text-xl text-foreground/70 mb-10 max-w-xl font-light leading-relaxed">
            Luxury digital wedding invitations, websites, videos & RSVP experiences made for modern Indian royalty. Where love meets timeless art.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/templates">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-primary to-amber-500 text-primary-foreground text-lg rounded-full font-semibold shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.45)] transition-all hover:scale-105"
                data-testid="button-hero-create"
              >
                Create Invitation Free
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 border-primary/35 text-primary hover:bg-primary/10 bg-background/30 backdrop-blur-sm text-lg rounded-full font-semibold transition-all hover:scale-105"
                data-testid="button-hero-browse"
              >
                Browse Templates
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-6 mt-10 flex-wrap justify-center lg:justify-start"
          >
            <div className="flex items-center gap-2 text-sm text-foreground/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>2,847+ couples already using Veloria</span>
            </div>
            <div className="text-sm text-foreground/40">
              ★★★★★ <span className="text-foreground/50">4.9/5 rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="flex-1 w-full flex justify-center lg:justify-end relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/15 blur-[100px] rounded-full pointer-events-none" />
          <PhoneMockup />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-primary/50"
      >
        <span className="text-xs uppercase tracking-widest">Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
