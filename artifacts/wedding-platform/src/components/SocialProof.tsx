import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, Users, Sparkles, Star } from 'lucide-react';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

const stats = [
  {
    icon: <Heart className="w-6 h-6 text-primary fill-primary/30" />,
    value: 2847,
    suffix: "+",
    label: "Couples Celebrated",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    value: 142000,
    suffix: "+",
    label: "Guests Invited",
  },
  {
    icon: <Star className="w-6 h-6 text-primary fill-primary/30" />,
    value: 4.9,
    suffix: "★",
    label: "Average Rating",
    isDecimal: true,
  },
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    value: 50,
    suffix: "+",
    label: "Design Themes",
  },
];

export default function SocialProof() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
                {stat.isDecimal ? (
                  <span>{stat.value}{stat.suffix}</span>
                ) : (
                  <>
                    <AnimatedCounter target={stat.value} />
                    <span className="text-primary">{stat.suffix}</span>
                  </>
                )}
              </div>
              <p className="text-foreground/50 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Before / After comparison */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              From Plain Card to <span className="text-primary italic">Cinematic Experience</span>
            </h2>
            <p className="text-foreground/60">See the difference Veloria makes</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 bg-foreground/20 text-foreground/60 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-foreground/10">
                Before
              </div>
              <div className="rounded-2xl border border-foreground/10 bg-card/30 backdrop-blur p-8 h-64 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                <div className="w-16 h-16 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-foreground/30" />
                </div>
                <h3 className="text-lg font-serif text-foreground/60">Priya weds Arjun</h3>
                <p className="text-sm text-foreground/30">Date: December 12, 2025</p>
                <p className="text-sm text-foreground/30">Venue: Taj Palace, Mumbai</p>
                <p className="text-xs text-foreground/20 mt-2">Plain paper card — easily lost</p>
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                After — Veloria
              </div>
              <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 to-card p-8 h-64 flex flex-col items-center justify-center text-center space-y-3 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  <Heart className="w-6 h-6 text-primary fill-primary/40" />
                </div>
                <h3 className="text-xl font-serif text-foreground">Priya <span className="text-primary">♥</span> Arjun</h3>
                <div className="flex gap-2 flex-wrap justify-center">
                  <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">Live Countdown</span>
                  <span className="text-xs bg-foreground/6 text-foreground/60 border border-foreground/12 px-2 py-0.5 rounded-full">Music ♪</span>
                  <span className="text-xs bg-foreground/6 text-foreground/60 border border-foreground/12 px-2 py-0.5 rounded-full">RSVP</span>
                </div>
                <p className="text-xs text-primary/60 italic">Cinematic. Interactive. Unforgettable.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex items-center justify-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-sm text-foreground/50">
            <span className="text-primary font-semibold">23 couples</span> created their invitations today
          </p>
        </motion.div>
      </div>
    </section>
  );
}
