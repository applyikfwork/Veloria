import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Sparkles, MessageCircle, Globe, Image, Video, QrCode, Languages, Users, Music } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: "AI Wedding Story",
    description: "Generate beautiful narratives of how you met using our advanced AI copywriter.",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
  },
  {
    title: "WhatsApp RSVP",
    description: "Seamlessly track guest attendance and dietary preferences directly via WhatsApp.",
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
  },
  {
    title: "Wedding Website",
    description: "Build an exquisite, responsive website to share your journey and wedding details.",
    icon: <Globe className="w-8 h-8 text-primary" />,
  },
  {
    title: "Photo Gallery",
    description: "A private, high-resolution gallery to share pre-wedding and event memories.",
    icon: <Image className="w-8 h-8 text-primary" />,
  },
  {
    title: "Animated Videos",
    description: "Turn your invitations into cinematic video experiences with stunning transitions.",
    icon: <Video className="w-8 h-8 text-primary" />,
  },
  {
    title: "QR Invitations",
    description: "Elegant printed QR codes bridging your physical cards with the digital experience.",
    icon: <QrCode className="w-8 h-8 text-primary" />,
  },
  {
    title: "Multi-language",
    description: "Honor your heritage with invitations in Hindi, Tamil, Punjabi, and 15+ languages.",
    icon: <Languages className="w-8 h-8 text-primary" />,
  },
  {
    title: "Guest Management",
    description: "Organize families, plus-ones, and seating arrangements from a unified dashboard.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Cinematic Music",
    description: "Set the mood with high-quality background scores playing on your invitation.",
    icon: <Music className="w-8 h-8 text-primary" />,
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-64 w-[500px] h-[500px] bg-[#6B21A8]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
          >
            Everything Your <span className="text-primary italic">Love Story</span> Deserves
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 text-lg"
          >
            A suite of premium tools designed to make your wedding communication as flawless as the celebration itself.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <Card className="h-full bg-card/40 backdrop-blur-xl border border-primary/20 hover:border-primary/50 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-background/50 border border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-serif tracking-wide text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/70 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
