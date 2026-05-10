import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const WEDDING_TYPES = [
  { id: "hindu", name: "Hindu Wedding", emoji: "🪔" },
  { id: "muslim", name: "Muslim Wedding", emoji: "🌙" },
  { id: "sikh", name: "Sikh Wedding", emoji: "🕯️" },
  { id: "christian", name: "Christian Wedding", emoji: "⛪" },
  { id: "south-indian", name: "South Indian Wedding", emoji: "🥥" },
  { id: "destination", name: "Destination Wedding", emoji: "✈️" },
  { id: "modern-luxury", name: "Modern Luxury Wedding", emoji: "💎" },
  { id: "royal-palace", name: "Royal Palace Wedding", emoji: "🏰" },
  { id: "traditional", name: "Traditional Wedding", emoji: "🎭" },
  { id: "engagement", name: "Engagement Ceremony", emoji: "💍" },
  { id: "reception", name: "Reception Party", emoji: "🥂" },
  { id: "mehndi", name: "Mehndi Ceremony", emoji: "🌿" },
  { id: "haldi", name: "Haldi Ceremony", emoji: "✨" },
  { id: "sangeet", name: "Sangeet Night", emoji: "💃" },
];

interface WeddingTypeStepProps {
  data: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

export default function WeddingTypeStep({ data, onChange, onNext }: WeddingTypeStepProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-8 text-white">
        What kind of celebration is this?
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full"
      >
        {WEDDING_TYPES.map((type) => (
          <motion.div
            key={type.id}
            variants={item}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(type.id)}
            className={cn(
              "relative cursor-pointer group p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-3",
              "bg-white/5 backdrop-blur-xl",
              data === type.id 
                ? "border-primary shadow-[0_0_20px_rgba(212,175,55,0.2)] ring-1 ring-primary" 
                : "border-white/10 hover:border-primary/50"
            )}
            data-testid={`card-wedding-type-${type.id}`}
          >
            <span className="text-4xl mb-1">{type.emoji}</span>
            <span className={cn(
              "font-medium transition-colors",
              data === type.id ? "text-primary" : "text-white/80 group-hover:text-white"
            )}>
              {type.name}
            </span>
            
            {data === type.id && (
              <motion.div 
                layoutId="check"
                className="absolute top-3 right-3 bg-primary rounded-full p-1 shadow-lg"
              >
                <Check className="h-3 w-3 text-primary-foreground" />
              </motion.div>
            )}

            {/* Gradient border effect on selection */}
            {data === type.id && (
              <div className="absolute inset-0 rounded-2xl border border-primary/50 pointer-events-none animate-pulse" />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
