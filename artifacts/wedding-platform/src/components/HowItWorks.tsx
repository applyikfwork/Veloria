import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Palette, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: "01",
    icon: <Edit3 className="w-7 h-7 text-primary" />,
    title: "Create",
    description: "Fill in your wedding details — couple names, events, family, and your love story — through our beautiful step-by-step wizard.",
    gradient: "from-primary/20 to-primary/5",
    border: "border-primary/30",
  },
  {
    number: "02",
    icon: <Palette className="w-7 h-7 text-primary" />,
    title: "Customize",
    description: "Choose from stunning themes, upload photos, set background music, and let AI write your love story with one click.",
    gradient: "from-[#B59530]/20 to-[#B59530]/5",
    border: "border-[#B59530]/30",
  },
  {
    number: "03",
    icon: <Share2 className="w-7 h-7 text-primary" />,
    title: "Share",
    description: "Send your invitation link via WhatsApp, Instagram, or email. Track RSVPs, wishes, and check-ins all from your dashboard.",
    gradient: "from-accent/20 to-accent/5",
    border: "border-accent/30",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--section-bg)' }}>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm uppercase tracking-[0.3em] mb-4 font-medium"
          >
            Simple as 1 — 2 — 3
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
          >
            Your Dream Invitation in{" "}
            <span className="text-primary italic">Minutes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/60 text-lg"
          >
            No design skills needed. Our wizard guides you through every step to create a cinematic invitation that will leave your guests speechless.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-[55%] h-[2px] bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} border ${step.border} flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(212,175,55,0.15)]`}>
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[9px] font-bold text-primary-foreground">{step.number}</span>
                  </div>
                </div>

                <div className={`bg-gradient-to-br ${step.gradient} border ${step.border} rounded-3xl p-8 w-full hover:shadow-[0_10px_40px_rgba(212,175,55,0.1)] transition-all duration-300 group`}>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <ArrowRight className="md:hidden mt-6 h-6 w-6 text-primary/40 rotate-90" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link href="/templates">
            <Button
              size="lg"
              className="h-14 px-10 bg-gradient-to-r from-primary to-[#B59530] text-primary-foreground text-lg rounded-full font-semibold shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-105 transition-all"
            >
              Start Creating Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
