import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    quote: "Our guests were completely blown away. The digital invitation felt so luxurious, and managing RSVPs through WhatsApp saved us countless hours of stress.",
    names: "Neha & Rohan",
    city: "Mumbai",
    rating: 5
  },
  {
    id: 2,
    quote: "Vivah perfectly captured the royal aesthetic we wanted. The background music, the smooth animations... it literally brought tears to my mother's eyes.",
    names: "Ayesha & Kabir",
    city: "Delhi",
    rating: 5
  },
  {
    id: 3,
    quote: "We had guests flying in from 12 countries. The multi-language support and digital itineraries made logistics a breeze. Worth every single penny.",
    names: "Simran & Vikram",
    city: "London",
    rating: 5
  },
  {
    id: 4,
    quote: "The photo gallery feature is stunning. We shared our pre-wedding shoot there and the feedback was incredible. Such a premium experience.",
    names: "Pooja & Arjun",
    city: "Bangalore",
    rating: 5
  },
  {
    id: 5,
    quote: "I never thought a digital invite could feel this grand. It set the perfect tone for our Udaipur destination wedding.",
    names: "Ananya & Sid",
    city: "Dubai",
    rating: 5
  },
  {
    id: 6,
    quote: "Flawless execution. The website builder was intuitive, and the final result looked like it was coded by a high-end agency.",
    names: "Meera & Dev",
    city: "New York",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#08080C] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
          >
            Stories That Made Us <span className="text-primary italic">Cry</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 text-lg uppercase tracking-widest text-sm"
          >
            (Happy Tears Only)
          </motion.p>
        </div>

        {/* Scrolling Track */}
        <div className="relative w-full flex overflow-hidden">
          {/* Left Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#08080C] to-transparent z-10"></div>
          
          <motion.div 
            className="flex gap-6 py-4 px-4"
            animate={{ x: [0, -1920] }} // Adjust based on total width
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {/* Double the array for seamless infinite scroll */}
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <Card key={`${testimonial.id}-${i}`} className="w-[300px] sm:w-[400px] shrink-0 bg-card/60 backdrop-blur-md border-primary/20 shadow-xl relative">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-lg font-serif italic leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-auto">
                    <p className="font-bold text-foreground">{testimonial.names}</p>
                    <p className="text-sm text-foreground/50 tracking-wider uppercase">{testimonial.city}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Right Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#08080C] to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
}
