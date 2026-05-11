import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronDown, X, ExternalLink, Play } from 'lucide-react';
import PhoneMockup from './phone-mockup';

function DemoDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl z-50 bg-[#0B0B0F] border-l border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="text-xl font-serif text-white">Live Demo Invitation</h3>
                <p className="text-sm text-white/40">Priya & Arjun's Wedding — Royal Maharaja Theme</p>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <iframe
                src="/i/demo-veloria-invitation"
                className="w-full h-full border-0"
                title="Demo Invitation"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>

            <div className="p-6 border-t border-white/10 flex gap-3">
              <Link href="/templates" className="flex-1">
                <Button className="w-full bg-primary text-primary-foreground rounded-full">
                  Create Your Own
                </Button>
              </Link>
              <Link href="/i/demo-veloria-invitation">
                <Button variant="outline" size="icon" className="border-white/10 rounded-full">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-20 lg:pt-0 lg:pb-0" id="home">
        {/* Cinematic animated background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Deep background */}
          <div className="absolute inset-0 bg-[#050508]" />

          {/* Rotating large orbs */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.15, 1] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[#6B21A8]/10 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E8720C]/6 rounded-full blur-[130px]"
          />

          {/* Gold dust particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/60"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -(Math.random() * 200 + 100)],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050508_100%)]" />
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
              <Link href="/templates">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-primary to-[#B59530] text-primary-foreground text-lg rounded-full font-semibold shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] transition-all hover:scale-105"
                  data-testid="button-hero-create"
                >
                  Create Invitation Free
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setDemoOpen(true)}
                className="w-full sm:w-auto h-14 px-8 border-primary/30 text-primary hover:bg-primary/10 bg-background/20 backdrop-blur-sm text-lg rounded-full font-semibold transition-all hover:scale-105 gap-2"
                data-testid="button-hero-demo"
              >
                <Play className="h-5 w-5 fill-primary" />
                See It Live
              </Button>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 mt-10 flex-wrap justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2 text-sm text-foreground/40">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>2,847+ couples already using Veloria</span>
              </div>
              <div className="text-sm text-foreground/30">
                ★★★★★ <span className="text-foreground/40">4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone Mockup */}
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

        {/* Scroll indicator */}
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

      <DemoDrawer open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
