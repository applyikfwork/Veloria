import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Sparkles, MessageCircle, Globe, Image, Video, QrCode, Languages,
  Users, Music, Gift, Mic, BarChart2, Wallet, Store, Heart,
  Calendar, Layout, Zap
} from 'lucide-react';

const features = [
  {
    title: "AI Love Story Writer",
    description: "One click generates a beautiful, cinematic love story from your answers — poetic, personal, unforgettable.",
    icon: <Sparkles className="w-7 h-7 text-primary" />,
    badge: "AI Powered",
  },
  {
    title: "AI Vow & Speech Writer",
    description: "Write heartfelt wedding vows or toasts in seconds with AI. Choose your tone — romantic, funny, or traditional.",
    icon: <Mic className="w-7 h-7 text-primary" />,
    badge: "New",
  },
  {
    title: "WhatsApp RSVP",
    description: "Track attendance and food preferences via WhatsApp with personalized invite links for every guest.",
    icon: <MessageCircle className="w-7 h-7 text-primary" />,
    badge: null,
  },
  {
    title: "Live Gift Registry",
    description: "Share Amazon, Flipkart, or custom wishlists directly on your invitation page so guests can gift thoughtfully.",
    icon: <Gift className="w-7 h-7 text-primary" />,
    badge: "New",
  },
  {
    title: "Live Ceremony Streaming",
    description: "Add a YouTube, Zoom, or Meet link so your loved ones abroad can watch the ceremony in real time.",
    icon: <Video className="w-7 h-7 text-primary" />,
    badge: "New",
  },
  {
    title: "Budget Tracker",
    description: "Track every expense category, compare budget vs actuals, and never be caught off-guard on your wedding day.",
    icon: <Wallet className="w-7 h-7 text-primary" />,
    badge: "New",
  },
  {
    title: "Vendor Directory",
    description: "Manage all your vendors — photographers, caterers, decorators — with status tracking and WhatsApp quick-dial.",
    icon: <Store className="w-7 h-7 text-primary" />,
    badge: "New",
  },
  {
    title: "Invitation Analytics",
    description: "Real-time RSVP charts, meal preference breakdown, and attendance rates — all from your dashboard.",
    icon: <BarChart2 className="w-7 h-7 text-primary" />,
    badge: "New",
  },
  {
    title: "Multi-language Invitations",
    description: "Honor your heritage with AI-powered translation into Hindi, Tamil, Punjabi, Bengali, and 15+ languages.",
    icon: <Languages className="w-7 h-7 text-primary" />,
    badge: null,
  },
  {
    title: "Interactive Love Quiz",
    description: "Guests test how well they know you with AI-generated questions. Compete on the leaderboard!",
    icon: <Zap className="w-7 h-7 text-primary" />,
    badge: null,
  },
  {
    title: "Photo Memory Book",
    description: "A beautiful PDF memory book of wishes, RSVPs, and photos — auto-generated and shareable on WhatsApp.",
    icon: <Image className="w-7 h-7 text-primary" />,
    badge: null,
  },
  {
    title: "Cinematic Music",
    description: "Set the mood with romantic, Bollywood, or orchestral background music playing as guests open your invitation.",
    icon: <Music className="w-7 h-7 text-primary" />,
    badge: null,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--hero-orb-purple)' }} />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-medium"
          >
            Everything you need
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
          >
            A Complete Wedding <span className="text-primary italic">Experience</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 text-lg"
          >
            From your invitation to your memory book — Veloria handles every digital touchpoint of your big day.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative bg-card border border-border/25 rounded-2xl p-6 hover:border-primary/35 hover:bg-card/80 hover:shadow-[0_10px_40px_rgba(212,175,55,0.12)] transition-all duration-300 cursor-default shadow-sm"
            >
              {feature.badge && (
                <div className="absolute top-4 right-4">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${feature.badge === 'AI Powered' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30' : 'bg-primary/15 text-primary border border-primary/30'}`}>
                    {feature.badge}
                  </span>
                </div>
              )}
              <div className="mb-5 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-foreground font-serif font-bold text-base mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-foreground/50 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
