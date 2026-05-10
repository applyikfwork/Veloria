import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const templates = [
  {
    id: 1,
    name: "Royal Palace",
    style: "Hindu",
    gradient: "from-[#2A0808] via-[#4A0E0E] to-[#1A0505]",
    border: "border-primary/40",
  },
  {
    id: 2,
    name: "Garden Floral",
    style: "Muslim",
    gradient: "from-[#0A1A14] via-[#1B4332] to-[#0A1A14]",
    border: "border-[#F7E7CE]/40",
  },
  {
    id: 3,
    name: "Golden Sikh",
    style: "Sikh",
    gradient: "from-[#3B2F0B] via-[#78590C] to-[#1F1805]",
    border: "border-primary/50",
  },
  {
    id: 4,
    name: "Christian Chapel",
    style: "Christian",
    gradient: "from-[#0F172A] via-[#1E293B] to-[#0F172A]",
    border: "border-white/20",
  },
  {
    id: 5,
    name: "Modern Cinematic",
    style: "Contemporary",
    gradient: "from-[#0B0B0F] via-[#1A1A24] to-[#0B0B0F]",
    border: "border-primary/30",
  },
  {
    id: 6,
    name: "Pastel Romance",
    style: "Fusion",
    gradient: "from-[#2D1B2E] via-[#4A2B4D] to-[#1A101C]",
    border: "border-[#B76E79]/50",
  }
];

export default function Templates() {
  return (
    <section id="templates" className="py-24 bg-[#08080C] relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
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
              From grand palaces to intimate gardens, discover templates crafted by master designers.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent rounded-full px-6">
              View All Designs <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Mobile Horizontal Scroll / Desktop Grid */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="min-w-[280px] w-full snap-center group cursor-pointer"
            >
              <div className={`relative h-[400px] rounded-2xl overflow-hidden border ${template.border} bg-gradient-to-br ${template.gradient} shadow-lg transition-transform duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)]`}>
                
                {/* Decorative Pattern overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxIiBmaWxsPSIjRjdFN0NFIi8+PC9zdmc+')] mix-blend-overlay"></div>
                
                {/* Inner Border */}
                <div className="absolute inset-4 border border-white/10 rounded-xl z-10 pointer-events-none"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
                  <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <span className="inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs uppercase tracking-widest text-[#F7E7CE] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {template.style}
                    </span>
                    <h3 className="text-3xl font-serif italic text-white font-bold mb-2">{template.name}</h3>
                    <div className="w-12 h-[1px] bg-primary mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
                    <Button variant="link" className="text-primary hover:text-[#F7E7CE] p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                      Preview Template
                    </Button>
                  </div>
                </div>

                {/* Hover overlay gradient */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
