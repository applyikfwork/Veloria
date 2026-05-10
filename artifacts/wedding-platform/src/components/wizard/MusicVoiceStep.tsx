import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music, Mic, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MusicVoiceStepProps {
  data: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const MUSIC_TYPES = [
  { id: "romantic", name: "Romantic", icon: "❤️" },
  { id: "traditional", name: "Traditional Indian", icon: "🪕" },
  { id: "cinematic", name: "Cinematic Orchestral", icon: "🎻" },
  { id: "bollywood", name: "Bollywood", icon: "💃" },
];

const VOICE_STYLES = [
  { id: "male-luxury", name: "Male Luxury", preview: "A grand celebration awaits..." },
  { id: "female-emotional", name: "Female Emotional", preview: "Together forever, a journey of love..." },
  { id: "royal-announcer", name: "Royal Announcer", preview: "By royal decree, you are invited..." },
  { id: "family-style", name: "Family Style", preview: "Join our family in this joyous moment..." },
];

export default function MusicVoiceStep({ data, onChange, onNext, onBack }: MusicVoiceStepProps) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const toggleMusic = (enabled: boolean) => {
    onChange({ ...data, enabled });
  };

  const selectMusic = (musicId: string) => {
    onChange({ ...data, selectedMusic: musicId });
  };

  const selectVoice = (voiceId: string) => {
    onChange({ ...data, selectedVoice: voiceId });
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Set the Mood</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Choose the perfect soundtrack and voice narration for your cinematic invitation.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 max-w-xs mx-auto">
        <VolumeX className={cn("h-5 w-5", !data.enabled ? "text-primary" : "text-muted-foreground")} />
        <Switch 
          checked={data.enabled} 
          onCheckedChange={toggleMusic}
          data-testid="toggle-music-enable"
        />
        <Volume2 className={cn("h-5 w-5", data.enabled ? "text-primary" : "text-muted-foreground")} />
        <Label className="text-white font-medium">Enable Music & Voice</Label>
      </div>

      <div className={cn("space-y-10 transition-opacity duration-300", !data.enabled && "opacity-40 pointer-events-none")}>
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Music className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-serif text-white">Music Selection</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MUSIC_TYPES.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ y: -5 }}
                className={cn(
                  "relative group cursor-pointer p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl",
                  data.selectedMusic === type.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
                onClick={() => selectMusic(type.id)}
                data-testid={`card-music-${type.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl">{type.icon}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-primary hover:text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(isPlaying === type.id ? null : type.id);
                    }}
                  >
                    {isPlaying === type.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
                <h4 className="text-white font-medium">{type.name}</h4>
                
                {isPlaying === type.id && (
                  <div className="flex gap-1 mt-4 h-4 items-end">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{ height: ["20%", "100%", "20%"] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <Mic className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-serif text-white">AI Voice Narration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VOICE_STYLES.map((style) => (
              <motion.div
                key={style.id}
                whileHover={{ y: -5 }}
                className={cn(
                  "cursor-pointer p-6 rounded-2xl border transition-all duration-300 backdrop-blur-xl",
                  data.selectedVoice === style.id 
                    ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
                onClick={() => selectVoice(style.id)}
                data-testid={`card-voice-${style.id}`}
              >
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Mic className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-white font-medium mb-2">{style.name}</h4>
                <p className="text-xs text-muted-foreground italic">"${style.preview}"</p>
                {data.selectedVoice === style.id && (
                   <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center gap-2 text-primary text-xs font-medium"
                   >
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     Selected
                   </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
