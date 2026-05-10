import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, MapPin, Calendar, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LivePreviewPanelProps {
  formData: any;
  isOpen: boolean;
  onClose: () => void;
}

const THEME_MAP: Record<string, { gradient: string; accent: string; name: string }> = {
  "royal-maharaja": {
    gradient: "from-[#D4AF37] to-[#8B732A]",
    accent: "text-[#D4AF37]",
    name: "Royal Maharaja"
  },
  "bollywood": {
    gradient: "from-[#9B111E] to-[#4A0E0E]",
    accent: "text-[#9B111E]",
    name: "Bollywood Cinematic"
  },
  "floral": {
    gradient: "from-[#FFC0CB] to-[#B76E79]",
    accent: "text-[#FFC0CB]",
    name: "Floral Luxury"
  },
  "dark-luxury": {
    gradient: "from-[#1A1A1A] to-[#D4AF37]",
    accent: "text-[#D4AF37]",
    name: "Dark Luxury"
  },
  "traditional": {
    gradient: "from-[#FF9933] to-[#CC6600]",
    accent: "text-[#FF9933]",
    name: "Traditional Indian"
  },
  "modern-insta": {
    gradient: "from-[#833AB4] to-[#FD1D1D]",
    accent: "text-[#833AB4]",
    name: "Modern Instagram"
  },
  "premium-minimal": {
    gradient: "from-[#FFFFFF] to-[#E5E7EB]",
    accent: "text-gray-400",
    name: "Premium Minimal"
  },
  "destination": {
    gradient: "from-[#00CED1] to-[#20B2AA]",
    accent: "text-[#00CED1]",
    name: "Destination Wedding"
  },
  "fantasy-royal": {
    gradient: "from-[#4B0082] to-[#D4AF37]",
    accent: "text-[#4B0082]",
    name: "Fantasy Royal"
  },
  "ai-generator": {
    gradient: "from-yellow-200 via-emerald-200 to-yellow-200",
    accent: "text-yellow-600",
    name: "AI Auto Generator"
  }
};

export default function LivePreviewPanel({ formData, isOpen, onClose }: LivePreviewPanelProps) {
  const theme = THEME_MAP[formData.designTheme] || THEME_MAP["premium-minimal"];
  const firstEvent = formData.events?.[0];

  const PreviewContent = () => (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl overflow-hidden rounded-3xl border border-white/10 shadow-2xl relative">
      {/* Hero Section */}
      <div className={cn("relative h-[250px] w-full bg-gradient-to-br p-6 flex flex-col items-center justify-center text-center", theme.gradient)}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={formData.designTheme}
          className="absolute inset-0 opacity-20 pointer-events-none"
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full mb-4 inline-block"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-white font-medium">
              {formData.weddingType ? formData.weddingType.replace("-", " ") : "Your Wedding"}
            </span>
          </motion.div>
          
          <h2 className="text-3xl font-serif text-white mb-2">
            {formData.bride?.name || "Bride"} 
            <Heart className="inline-block mx-2 h-5 w-5 fill-white" />
            {formData.groom?.name || "Groom"}
          </h2>
          
          <p className="text-white/80 text-sm font-medium italic">
            Save the Date
          </p>
        </div>

        {/* Theme Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-[8px] text-white uppercase tracking-tighter">
            {theme.name}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0B0B0F]">
        {/* Photos Preview */}
        {(formData.bride?.photo || formData.groom?.photo) && (
          <div className="flex justify-center -mt-12 mb-8 relative z-20 gap-4">
            {formData.bride?.photo && (
              <motion.div 
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-20 h-20 rounded-full border-4 border-[#0B0B0F] overflow-hidden shadow-xl"
              >
                <img src={formData.bride.photo} alt="Bride" className="w-full h-full object-cover" />
              </motion.div>
            )}
            {formData.groom?.photo && (
              <motion.div 
                initial={{ scale: 0, rotate: 10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-20 h-20 rounded-full border-4 border-[#0B0B0F] overflow-hidden shadow-xl"
              >
                <img src={formData.groom.photo} alt="Groom" className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>
        )}

        {/* First Event Preview */}
        {firstEvent && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4"
          >
            <h3 className={cn("text-xs uppercase tracking-widest mb-3 font-semibold", theme.accent)}>Primary Event</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/70">
                <Calendar className="h-4 w-4 text-white/40" />
                <span className="text-sm">{firstEvent.date || "Date to be announced"}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin className="h-4 w-4 text-white/40" />
                <span className="text-sm truncate">{firstEvent.location || "Venue to be announced"}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Love Story Snippet */}
        {formData.loveStory?.howTheyMet && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-2"
          >
            <h3 className={cn("text-xs uppercase tracking-widest font-semibold", theme.accent)}>Our Story</h3>
            <p className="text-sm text-white/60 italic leading-relaxed">
              "{formData.loveStory.howTheyMet.substring(0, 100)}..."
            </p>
          </motion.div>
        )}

        {/* Placeholder if empty */}
        {!firstEvent && !formData.loveStory?.howTheyMet && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-white/20">
            <Heart className="h-12 w-12 mb-4 opacity-10" />
            <p className="text-sm italic">Fill in your details to see the magic happen here...</p>
          </div>
        )}

        <div className="pt-4">
          <Button className={cn("w-full rounded-full border-none text-white", theme.gradient)}>
            RSVP Now
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Panel */}
      <aside className="hidden md:block fixed right-0 top-0 bottom-0 w-[340px] bg-black/60 backdrop-blur-xl border-l border-white/10 z-20 overflow-hidden p-6">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm uppercase tracking-widest text-primary font-bold">Live Preview</h3>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-[280px] h-[580px] border-[8px] border-[#1A1A1A] rounded-[3rem] shadow-2xl relative overflow-hidden">
                <PreviewContent />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 h-[85vh] bg-[#0B0B0F] rounded-t-[2.5rem] border-t border-white/10 flex flex-col"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-4" />
              <div className="flex items-center justify-between px-6 mb-4">
                <h3 className="text-lg font-serif text-white">Live Preview</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 px-4 pb-8 overflow-hidden">
                <PreviewContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
