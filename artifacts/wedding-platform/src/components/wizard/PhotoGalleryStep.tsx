import { motion } from "framer-motion";
import { Camera, Video, Plus, X, Image as ImageIcon, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PhotoGalleryStepProps {
  data: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PhotoGalleryStep({ data, onChange, onNext, onBack }: PhotoGalleryStepProps) {
  const renderUploadSlot = (label: string, icon: any, type: string, id: string) => {
    return (
      <div className="space-y-2">
        <Label className="text-white/70 text-xs uppercase tracking-widest">{label}</Label>
        <div 
          className="aspect-square rounded-2xl border-2 border-dashed border-primary/30 bg-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all group"
          data-testid={`upload-slot-${id}`}
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-xs text-muted-foreground">Upload</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Your Beautiful Memories</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Upload your photos and videos to be featured in your personalized invitation.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 max-w-xs mx-auto">
        <ImageIcon className="h-5 w-5 text-muted-foreground" />
        <Switch 
          checked={data.createSlideshow} 
          onCheckedChange={(val) => onChange({ ...data, createSlideshow: val })}
          data-testid="toggle-slideshow"
        />
        <PlayCircle className="h-5 w-5 text-primary" />
        <Label className="text-white font-medium">Create Slideshow</Label>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-serif text-white">Couple Photos</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }}>
                {renderUploadSlot("Photo " + (i + 1), <Camera className="h-5 w-5 text-primary" />, "photo", `couple-${i}`)}
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <section>
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-serif text-white">Pre-wedding Shoot</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {renderUploadSlot("Shoot 1", <Camera className="h-5 w-5 text-primary" />, "photo", "pre-1")}
               {renderUploadSlot("Shoot 2", <Camera className="h-5 w-5 text-primary" />, "photo", "pre-2")}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Video className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-serif text-white">Video Invitation</h3>
            </div>
            <div className="aspect-video rounded-2xl border-2 border-dashed border-primary/30 bg-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 hover:border-primary/50 transition-all group">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-white">Upload Video</p>
                <p className="text-xs text-muted-foreground">Max size: 50MB</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
