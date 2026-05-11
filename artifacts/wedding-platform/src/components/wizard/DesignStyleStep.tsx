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

const THEME_GROUPS = [
  {
    label: "Luxury & Classic",
    themes: [
      { id: "royal-maharaja", name: "Royal Maharaja", tag: "Gold & Grandeur", bg: "bg-gradient-to-br from-[#D4AF37] to-[#8B732A]" },
      { id: "dark-luxury", name: "Dark Luxury", tag: "Sleek & Modern", bg: "bg-gradient-to-br from-[#1A1A1A] to-[#D4AF37]" },
      { id: "premium-minimal", name: "Premium Minimal", tag: "Clean & Elegant", bg: "bg-gradient-to-br from-[#FFFFFF] to-[#E5E7EB]" },
    ],
  },
  {
    label: "Bollywood & Festive",
    themes: [
      { id: "bollywood", name: "Bollywood Cinematic", tag: "Grand & Dramatic", bg: "bg-gradient-to-br from-[#9B111E] to-[#4A0E0E]" },
      { id: "traditional", name: "Traditional Indian", tag: "Classic & Vibrant", bg: "bg-gradient-to-br from-[#FF9933] to-[#CC6600]" },
      { id: "fantasy-royal", name: "Fantasy Royal", tag: "Magical & Bold", bg: "bg-gradient-to-br from-[#4B0082] to-[#D4AF37]" },
    ],
  },
  {
    label: "Regional Cultural",
    themes: [
      { id: "rajasthani", name: "Rajasthani Royale", tag: "Marwar Heritage", bg: "bg-gradient-to-br from-[#8B1A1A] via-[#D4AF37] to-[#4A1515]" },
      { id: "south-indian", name: "South Indian Temple", tag: "Dravidian Elegance", bg: "bg-gradient-to-br from-[#2E7D32] via-[#FFD700] to-[#1B5E20]" },
      { id: "bengali", name: "Bengali Shaadi", tag: "Red & White Grace", bg: "bg-gradient-to-br from-[#B71C1C] via-[#FFFFFF] to-[#880E4F]" },
      { id: "punjabi", name: "Punjabi Celebration", tag: "Vibrant & Joyful", bg: "bg-gradient-to-br from-[#E65100] via-[#FF9800] to-[#BF360C]" },
      { id: "kashmiri", name: "Kashmiri Dreams", tag: "Mountain Romance", bg: "bg-gradient-to-br from-[#0D47A1] via-[#90CAF9] to-[#1565C0]" },
    ],
  },
  {
    label: "Seasonal & Modern",
    themes: [
      { id: "monsoon", name: "Monsoon Romance", tag: "Rain & Petrichor", bg: "bg-gradient-to-br from-[#1565C0] via-[#4FC3F7] to-[#0D47A1]" },
      { id: "winter-wonderland", name: "Winter Wonderland", tag: "Frosty & Ethereal", bg: "bg-gradient-to-br from-[#B0BEC5] via-[#ECEFF1] to-[#90A4AE]" },
      { id: "spring-blossom", name: "Spring Blossom", tag: "Floral & Fresh", bg: "bg-gradient-to-br from-[#F48FB1] via-[#CE93D8] to-[#F06292]" },
      { id: "destination", name: "Destination Wedding", tag: "Beach & Sunset", bg: "bg-gradient-to-br from-[#00CED1] to-[#20B2AA]" },
    ],
  },
  {
    label: "Trendy & Special",
    themes: [
      { id: "floral", name: "Floral Luxury", tag: "Soft & Romantic", bg: "bg-gradient-to-br from-[#FFC0CB] to-[#B76E79]" },
      { id: "modern-insta", name: "Modern Instagram", tag: "Trendy & Social", bg: "bg-gradient-to-br from-[#833AB4] to-[#FD1D1D]" },
      { id: "ai-generator", name: "AI Auto Generator", tag: "Infinite Possibilities", bg: "bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-yellow-200 via-emerald-200 to-yellow-200" },
    ],
  },
];

export default function DesignStyleStep({ data, onChange, onNext, onBack }: DesignStyleStepProps) {
  return (
    <div className="w-full">
      <h2 className="text-3xl md:text-4xl font-serif text-center mb-4 text-white">
        Choose Your Invitation Style
      </h2>
      <p className="text-center text-muted-foreground mb-10">
        {THEME_GROUPS.reduce((acc, g) => acc + g.themes.length, 0)} stunning themes — including regional, seasonal, and AI-powered designs
      </p>

      <div className="space-y-10 mb-16">
        {THEME_GROUPS.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm uppercase tracking-widest text-primary/60 font-medium mb-4 pl-1">{group.label}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {group.themes.map((theme) => (
                <motion.div
                  key={theme.id}
                  whileHover={{ y: -6 }}
                  onClick={() => onChange(theme.id)}
                  className={cn(
                    "group relative cursor-pointer rounded-3xl overflow-hidden border transition-all duration-500",
                    data === theme.id
                      ? "border-primary shadow-[0_20px_40px_rgba(212,175,55,0.2)]"
                      : "border-white/10 hover:border-primary/40 bg-white/5"
                  )}
                  data-testid={`card-theme-${theme.id}`}
                >
                  {/* Gradient preview */}
                  <div className={cn("h-32 w-full relative", theme.bg)}>
                    {theme.id === "ai-generator" && (
                      <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                        <Sparkles className="h-10 w-10 text-primary shadow-lg" />
                      </div>
                    )}
                    {/* Selected overlay */}
                    {data === theme.id && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-primary rounded-full p-2">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    {/* Hover preview button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white border-2 text-xs h-8">
                        <Eye className="mr-1.5 h-3 w-3" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className={cn(
                      "font-serif text-base transition-colors leading-tight",
                      data === theme.id ? "text-primary" : "text-white"
                    )}>
                      {theme.name}
                    </h3>
                    <p className="text-xs text-white/40 mt-0.5">{theme.tag}</p>
                  </div>

                  {theme.id === "ai-generator" && data === theme.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 pb-4"
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
        ))}
      </div>

      {data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-primary/60"
        >
          ✓ You selected: <span className="text-primary font-medium">
            {THEME_GROUPS.flatMap(g => g.themes).find(t => t.id === data)?.name}
          </span>
        </motion.div>
      )}
    </div>
  );
}
