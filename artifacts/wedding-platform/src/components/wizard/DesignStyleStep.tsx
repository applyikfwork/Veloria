import { motion } from "framer-motion";
import { Check, Eye, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DesignStyleStepProps {
  data: string;
  onChange: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const THEMES = [
  { id: "royal-maharaja", name: "Royal Maharaja", tag: "Gold & Grandeur", bg: "bg-gradient-to-br from-[#D4AF37] to-[#8B732A]" },
  { id: "bollywood", name: "Bollywood Cinematic", tag: "Grand & Dramatic", bg: "bg-gradient-to-br from-[#9B111E] to-[#4A0E0E]" },
  { id: "floral", name: "Floral Luxury", tag: "Soft & Romantic", bg: "bg-gradient-to-br from-[#FFC0CB] to-[#B76E79]" },
  { id: "dark-luxury", name: "Dark Luxury", tag: "Sleek & Modern", bg: "bg-gradient-to-br from-[#1A1A1A] to-[#D4AF37]" },
  { id: "traditional", name: "Traditional Indian", tag: "Classic & Vibrant", bg: "bg-gradient-to-br from-[#FF9933] to-[#CC6600]" },
  { id: "modern-insta", name: "Modern Instagram", tag: "Trendy & Social", bg: "bg-gradient-to-br from-[#833AB4] to-[#FD1D1D]" },
  { id: "premium-minimal", name: "Premium Minimal", tag: "Clean & Elegant", bg: "bg-gradient-to-br from-[#FFFFFF] to-[#E5E7EB]" },
  { id: "destination", name: "Destination Wedding", tag: "Beach & Sunset", bg: "bg-gradient-to-br from-[#00CED1] to-[#20B2AA]" },
  { id: "fantasy-royal", name: "Fantasy Royal", tag: "Magical & Bold", bg: "bg-gradient-to-br from-[#4B0082] to-[#D4AF37]" },
  { id: "ai-generator", name: "AI Auto Generator", tag: "Infinite Possibilities", bg: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200" },
];

export default function DesignStyleStep({ data, onChange, onNext, onBack }: DesignStyleStepProps) {
  return (
    <div className="w-full">
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-10 text-white">
        Choose Your Invitation Style
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {THEMES.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ y: -8 }}
            onClick={() => onChange(theme.id)}
            className={cn(
              "group relative cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500",
              data === theme.id 
                ? "border-primary shadow-[0_20px_40px_rgba(212,175,55,0.2)]" 
                : "border-white/10 hover:border-primary/40 bg-white/5"
            )}
            data-testid={`card-theme-${theme.id}`}
          >
            {/* Full-bleed gradient preview area */}
            <div className={cn("h-40 w-full relative", theme.bg)}>
              {theme.id === "ai-generator" && (
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                  <Sparkles className="h-12 w-12 text-primary shadow-lg" />
                </div>
              )}
              {/* Theme Preview Button (Hover) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white border-2">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={cn(
                    "font-serif text-xl transition-colors",
                    data === theme.id ? "text-primary" : "text-white"
                  )}>
                    {theme.name}
                  </h3>
                  <p className="text-sm text-white/50">{theme.tag}</p>
                </div>
                {data === theme.id && (
                  <div className="bg-primary rounded-full p-1.5">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </div>

            {theme.id === "ai-generator" && data === theme.id && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-6 pb-6"
              >
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <input 
                    placeholder="Enter your mood..." 
                    className="w-full bg-white/10 border border-primary/30 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
