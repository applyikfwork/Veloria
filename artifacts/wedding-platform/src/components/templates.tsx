import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Flame, Star, Crown } from 'lucide-react';
import { Link } from 'wouter';
import { TEMPLATES } from '@/lib/templates';

const FEATURED = TEMPLATES.slice(0, 6);

export default function Templates() {
  return (
    <section id="templates" className="py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--section-bg)' }}>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary text-xs uppercase tracking-[0.3em] mb-3 font-medium"
            >
              {TEMPLATES.length}+ Templates
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
            >
              Find Your <span className="text-primary italic">Perfect Style</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/70 text-lg"
            >
              Wedding, Engagement, Sangeet, Mehndi — browse by ceremony, region, and mood.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/templates">
              <Button className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent rounded-full px-6 border">
                Browse All Templates <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {FEATURED.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative rounded-2xl overflow-hidden border cursor-pointer"
              style={{ borderColor: template.accentColor + '33' }}
            >
              <Link href={`/templates`}>
                <div
                  className={`relative h-[260px] md:h-[320px] flex flex-col items-center justify-center bg-gradient-to-br ${template.cardGradient}`}
                >
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxLjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+')] mix-blend-overlay" />

                  {/* Inner border */}
                  <div className="absolute inset-4 border border-white/10 rounded-xl z-10 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-20">
                    {template.isPremium && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/90 text-black flex items-center gap-1">
                        <Crown className="h-2.5 w-2.5" /> Premium
                      </span>
                    )}
                    {template.isNew && !template.isPremium && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/90 text-black">
                        New
                      </span>
                    )}
                    {template.isTrending && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/90 text-white flex items-center gap-1">
                        <Flame className="h-2.5 w-2.5" /> Hot
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-20 flex flex-col items-center text-center px-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                    <span className="text-4xl mb-3 drop-shadow-lg">{template.heroEmoji}</span>
                    <span className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs uppercase tracking-widest text-white/60 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      {template.ceremony} • {template.style}
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif italic text-white font-bold mb-1.5">{template.name}</h3>
                    <p className="text-xs text-white/40 hidden group-hover:block transition-all">{template.tagline}</p>
                    <div className="w-10 h-[1px] mx-auto mt-3 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" style={{ backgroundColor: template.accentColor }} />

                    <div className="flex gap-1.5 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                      {template.swatches.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border border-black/30" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10" />
                </div>

                <div className="p-4" style={{ backgroundColor: 'var(--section-bg-card)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{template.name}</p>
                      <p className="text-white/30 text-xs capitalize">{template.region.replace('-', ' ')}</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Star className="h-3 w-3" />
                      <span>{(template.usedByCount / 1000).toFixed(1)}k</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/templates">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-6 h-auto text-base font-semibold shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:shadow-[0_0_50px_rgba(212,175,55,0.35)] transition-all hover:scale-105"
            >
              Browse All {TEMPLATES.length} Templates <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-white/30 text-sm mt-4">Select a template → Fill your details → Go live in minutes</p>
        </motion.div>
      </div>
    </section>
  );
}
