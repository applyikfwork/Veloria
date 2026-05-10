import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor, Video, Edit3, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LivePreviewStepProps {
  data: any;
  formData: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const THEMES = [
  { id: "royal", name: "Royal", color: "bg-amber-500" },
  { id: "bollywood", name: "Bollywood", color: "bg-red-600" },
  { id: "floral", name: "Floral", color: "bg-rose-400" },
  { id: "dark", name: "Dark", color: "bg-zinc-900" },
  { id: "traditional", name: "Traditional", color: "bg-orange-500" },
];

export default function LivePreviewStep({ data, formData, onChange, onNext, onBack }: LivePreviewStepProps) {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop" | "video">("mobile");
  
  const coupleNames = (formData.bride?.name && formData.groom?.name) 
    ? `${formData.bride.name} & ${formData.groom.name}` 
    : "Priya & Arjun";

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Your Invitation, Live</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          See your masterpiece in action. Switch between views and refine your design.
        </p>
      </div>

      <div className="flex flex-col items-center gap-10">
        <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
          <Button
            variant={viewMode === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("mobile")}
            className="rounded-full px-6"
            data-testid="button-view-mobile"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </Button>
          <Button
            variant={viewMode === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("desktop")}
            className="rounded-full px-6"
            data-testid="button-view-desktop"
          >
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={viewMode === "video" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("video")}
            className="rounded-full px-6"
            data-testid="button-view-video"
          >
            <Video className="h-4 w-4 mr-2" />
            Video
          </Button>
        </div>

        <div className="relative w-full flex justify-center perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateX: -10 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "relative bg-black/90 rounded-[3rem] border-[8px] border-white/10 shadow-2xl overflow-hidden",
                viewMode === "mobile" ? "w-[300px] h-[600px]" : "w-full max-w-3xl h-[450px]"
              )}
            >
              {/* Inner screen content */}
              <div className="h-full w-full overflow-y-auto bg-[#0B0B0F] text-white custom-scrollbar">
                <div className="h-[200px] w-full bg-gradient-to-b from-primary/30 to-transparent flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')]" />
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center z-10"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-primary mb-2 block">
                      {formData.weddingType || "Hindu Wedding"}
                    </span>
                    <h3 className="text-2xl font-serif">{coupleNames}</h3>
                  </motion.div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Save the Date</p>
                    <p className="text-lg font-serif">December 12, 2025</p>
                    <div className="w-12 h-px bg-primary/50 mx-auto" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
                    </div>
                    <div className="aspect-square rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl text-center">
                    <p className="text-sm font-serif mb-2">Ceremony Venue</p>
                    <p className="text-xs text-muted-foreground">The Grand Palace, Rajasthan</p>
                  </div>
                </div>
              </div>

              {/* Edit overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <Button className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary shadow-xl">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Design
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-sm font-medium text-white/70 uppercase tracking-widest">Switch Theme</h4>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-white/50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-white/50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {THEMES.map((theme) => (
              <motion.div
                key={theme.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex-shrink-0 cursor-pointer group",
                  formData.designTheme === theme.id && "scale-105"
                )}
                onClick={() => onChange({ ...data, selectedTheme: theme.id })}
                data-testid={`theme-pill-${theme.id}`}
              >
                <div className={cn(
                  "w-14 h-14 rounded-full border-2 p-1 transition-all duration-300",
                  formData.designTheme === theme.id ? "border-primary" : "border-white/10 group-hover:border-white/30"
                )}>
                  <div className={cn("w-full h-full rounded-full shadow-inner", theme.color)} />
                </div>
                <p className="text-[10px] text-center mt-2 text-white/60 font-medium">{theme.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
