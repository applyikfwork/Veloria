import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, X, Image as ImageIcon, PlayCircle, Sparkles, Loader2, Plus } from "lucide-react";
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

function PhotoSlot({
  photo,
  onUpload,
  onRemove,
  onCaption,
  label,
  id,
  isVideo = false,
}: {
  photo: string | null;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
  onCaption?: () => void;
  label: string;
  id: string;
  isVideo?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-1">
      <Label className="text-white/50 text-[10px] uppercase tracking-widest">{label}</Label>
      <div
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all group overflow-hidden",
          isVideo ? "aspect-video" : "aspect-square",
          photo
            ? "border-primary/50 bg-black"
            : "border-primary/20 bg-white/5 hover:bg-white/10 hover:border-primary/40 cursor-pointer"
        )}
        onClick={() => !photo && inputRef.current?.click()}
        data-testid={`upload-slot-${id}`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={isVideo ? "video/*" : "image/*"}
          onChange={handleFileChange}
        />

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : photo ? (
          <>
            {isVideo ? (
              <video src={photo} className="w-full h-full object-cover" />
            ) : (
              <img src={photo} alt={label} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white rounded-full"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                <Camera className="h-4 w-4" />
              </Button>
              {onCaption && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-primary/20 hover:bg-primary/30 text-primary rounded-full"
                  onClick={(e) => { e.stopPropagation(); onCaption(); }}
                  title="AI Caption"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full"
                onClick={(e) => { e.stopPropagation(); onRemove(); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isVideo ? (
                <Video className="h-5 w-5 text-primary" />
              ) : (
                <Camera className="h-5 w-5 text-primary" />
              )}
            </div>
            <span className="text-xs text-muted-foreground">Upload</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PhotoGalleryStep({ data, onChange, onNext, onBack }: PhotoGalleryStepProps) {
  const [generatingCaption, setGeneratingCaption] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Record<string, string>>(data.captions || {});

  const updatePhoto = (type: "couple" | "preWedding", index: number, dataUrl: string) => {
    const arr = [...(data[type] || [])];
    arr[index] = dataUrl;
    onChange({ ...data, [type]: arr, captions });
  };

  const removePhoto = (type: "couple" | "preWedding", index: number) => {
    const arr = [...(data[type] || [])];
    arr[index] = null;
    onChange({ ...data, [type]: arr, captions });
  };

  const updateVideo = (dataUrl: string) => {
    onChange({ ...data, video: dataUrl, captions });
  };

  const removeVideo = () => {
    onChange({ ...data, video: null, captions });
  };

  const generateCaption = async (type: string, index: number) => {
    const key = `${type}-${index}`;
    setGeneratingCaption(key);
    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoType: type, index }),
      });
      const result = await res.json();
      if (result.caption) {
        const newCaptions = { ...captions, [key]: result.caption };
        setCaptions(newCaptions);
        onChange({ ...data, captions: newCaptions });
      }
    } catch (e) {
      console.error("Caption generation failed", e);
    } finally {
      setGeneratingCaption(null);
    }
  };

  const couplePhotos: (string | null)[] = Array.from({ length: 6 }, (_, i) => data.couple?.[i] || null);
  const preWeddingPhotos: (string | null)[] = Array.from({ length: 4 }, (_, i) => data.preWedding?.[i] || null);

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
        {/* Couple Photos */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-serif text-white">Couple Photos</h3>
            <span className="text-xs text-white/30 ml-2">
              {couplePhotos.filter(Boolean).length}/6 uploaded
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {couplePhotos.map((photo, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }}>
                <PhotoSlot
                  photo={photo}
                  onUpload={(url) => updatePhoto("couple", i, url)}
                  onRemove={() => removePhoto("couple", i)}
                  onCaption={() => generateCaption("couple", i)}
                  label={`Photo ${i + 1}`}
                  id={`couple-${i}`}
                />
                {captions[`couple-${i}`] && (
                  <p className="text-[10px] text-primary/60 mt-1 italic truncate">
                    {captions[`couple-${i}`]}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Pre-Wedding Shoot */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-serif text-white">Pre-Wedding Shoot</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {preWeddingPhotos.map((photo, i) => (
                <PhotoSlot
                  key={i}
                  photo={photo}
                  onUpload={(url) => updatePhoto("preWedding", i, url)}
                  onRemove={() => removePhoto("preWedding", i)}
                  onCaption={() => generateCaption("preWedding", i)}
                  label={`Shoot ${i + 1}`}
                  id={`pre-${i}`}
                />
              ))}
            </div>
          </section>

          {/* Video Invitation */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Video className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-serif text-white">Video Invitation</h3>
            </div>
            <PhotoSlot
              photo={data.video || null}
              onUpload={updateVideo}
              onRemove={removeVideo}
              label="Your Video"
              id="video"
              isVideo
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">Max size: 50MB • MP4, MOV</p>
          </section>
        </div>

        {/* AI Captions Info */}
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4 max-w-md mx-auto">
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs text-white/70">
            Hover over any uploaded photo and tap the{" "}
            <span className="text-primary font-bold">✦ sparkle</span> icon to generate an AI caption for it.
          </p>
        </div>
      </div>
    </div>
  );
}
