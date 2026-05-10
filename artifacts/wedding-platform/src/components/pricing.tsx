import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
          >
            Choose Your <span className="text-primary italic">Forever</span> Plan
          </motion.h2>
          
          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-4"
          >
            <span className={`text-sm ${!isAnnual ? 'text-foreground font-semibold' : 'text-foreground/60'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-secondary/50 border border-primary/30 flex items-center px-1 transition-colors"
              data-testid="button-pricing-toggle"
            >
              <motion.div 
                className="w-6 h-6 rounded-full bg-primary"
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground font-semibold' : 'text-foreground/60'}`}>
              Annually <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </span>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-[90%]"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Essential</h3>
              <p className="text-foreground/60 text-sm">Perfect for intimate gatherings.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">Free</span>
                <span className="text-foreground/60">forever</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                { text: "Standard Templates", included: true },
                { text: "Up to 50 Guests", included: true },
                { text: "Basic RSVP Tracking", included: true },
                { text: "Vivah Watermark", included: true },
                { text: "Custom Domain", included: false },
                { text: "WhatsApp Integration", included: false },
                { text: "Cinematic Music", included: false },
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-foreground/80 shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-foreground/30 shrink-0" />
                  )}
                  <span className={feature.included ? "text-foreground/80" : "text-foreground/40"}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full border-white/20 hover:bg-white/5 rounded-full h-12" data-testid="button-plan-free">
              Get Started Free
            </Button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-[#1A1A24] to-card rounded-3xl p-1 relative overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.15)] transform md:-translate-y-4"
          >
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-primary opacity-50 pointer-events-none"></div>
            
            <div className="bg-card rounded-[1.4rem] p-8 relative h-full">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">Royal Experience</h3>
                <p className="text-foreground/60 text-sm">The complete luxury wedding suite.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-foreground">
                    {isAnnual ? '₹9,999' : '₹999'}
                  </span>
                  <span className="text-foreground/60">/{isAnnual ? 'year' : 'month'}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  { text: "All Premium Templates", included: true },
                  { text: "Unlimited Guests", included: true },
                  { text: "WhatsApp RSVP Automation", included: true },
                  { text: "No Watermark", included: true },
                  { text: "Custom Domain Connection", included: true },
                  { text: "Cinematic Background Music", included: true },
                  { text: "Multi-language Support", included: true },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
                    <span className="text-foreground font-medium">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-gradient-to-r from-primary to-[#B59530] text-primary-foreground rounded-full h-14 text-lg font-semibold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all hover:scale-[1.02]" data-testid="button-plan-premium">
                Upgrade to Royal
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
