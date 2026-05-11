import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CoupleDetailsStepProps {
  data: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const FloatingInput = ({ label, id, value, onChange, type = "text", textarea = false }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const Component = textarea ? Textarea : Input;

  return (
    <div className="relative mt-4 w-full">
      <Component
        id={id}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "bg-white/5 border-white/10 text-white pt-6 pb-2 px-4 h-auto min-h-[56px] transition-all focus:border-primary focus:ring-primary/20",
          textarea && "min-h-[100px]"
        )}
        data-testid={`input-${id}`}
      />
      <Label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all pointer-events-none text-white/50",
          (isFocused || value)
            ? "top-2 text-xs text-primary font-medium"
            : "top-1/2 -translate-y-1/2 text-sm"
        )}
      >
        {label}
      </Label>
    </div>
  );
};

const PhotoUpload = ({ label, id, photoUrl, onPhotoChange }: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <Label className="text-white/70 text-sm font-medium">{label}</Label>
      <label
        className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/10 transition-all group overflow-hidden relative"
        data-testid={`upload-${id}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        {loading ? (
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        ) : photoUrl ? (
          <>
            <img src={photoUrl} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <>
            <Camera className="h-8 w-8 text-white/30 group-hover:text-primary transition-colors mb-2" />
            <span className="text-xs text-white/40 group-hover:text-white/60">Upload Photo</span>
          </>
        )}
      </label>
    </div>
  );
};

const PersonFields = ({ type, data, updatePerson }: { type: "bride" | "groom"; data: any; updatePerson: (type: "bride" | "groom", field: string, value: any) => void }) => (
  <div className="space-y-2">
    <PhotoUpload
      label={`${type === "bride" ? "Bride's" : "Groom's"} Photo`}
      id={`${type}-photo`}
      photoUrl={data[type].photo}
      onPhotoChange={(dataUrl: string) => updatePerson(type, "photo", dataUrl)}
    />
    <FloatingInput label="Full Name" id={`${type}-name`} value={data[type].name} onChange={(v: string) => updatePerson(type, "name", v)} />
    <FloatingInput label="Nickname" id={`${type}-nickname`} value={data[type].nickname} onChange={(v: string) => updatePerson(type, "nickname", v)} />
    <FloatingInput label="Instagram Handle" id={`${type}-instagram`} value={data[type].instagram} onChange={(v: string) => updatePerson(type, "instagram", v)} />
    <FloatingInput label="Short Bio" id={`${type}-bio`} value={data[type].bio} onChange={(v: string) => updatePerson(type, "bio", v)} textarea />
  </div>
);

export default function CoupleDetailsStep({ data, onChange, onNext, onBack }: CoupleDetailsStepProps) {
  const { toast } = useToast();
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyGenerated, setStoryGenerated] = useState(false);

  const updatePerson = (type: "bride" | "groom", field: string, value: any) => {
    onChange({
      ...data,
      [type]: { ...data[type], [field]: value },
    });
  };

  const updateLoveStory = (field: string, value: any) => {
    onChange({
      ...data,
      loveStory: { ...data.loveStory, [field]: value },
    });
  };

  const generateAIStory = async () => {
    if (!data.bride?.name || !data.groom?.name) {
      toast({
        title: "Names required",
        description: "Please enter both bride and groom names first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingStory(true);
    try {
      const res = await fetch("/api/ai/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brideName: data.bride.name,
          groomName: data.groom.name,
          howTheyMet: data.loveStory?.howTheyMet || "",
          style: "romantic Bollywood",
        }),
      });
      const result = await res.json();
      if (result.story) {
        onChange({
          ...data,
          loveStory: {
            ...data.loveStory,
            howTheyMet: result.story,
          },
        });
        setStoryGenerated(true);
        toast({
          title: "Love story generated!",
          description: "AI has written a beautiful story for you. Feel free to edit it.",
        });
      }
    } catch (e) {
      toast({
        title: "Generation failed",
        description: "Could not generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-serif text-center mb-8 text-white">The Happy Couple</h2>

      {/* Desktop view: 2 columns */}
      <div className="hidden md:grid grid-cols-2 gap-12">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-4">The Bride</h3>
          <PersonFields type="bride" data={data} updatePerson={updatePerson} />
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-4">The Groom</h3>
          <PersonFields type="groom" data={data} updatePerson={updatePerson} />
        </motion.div>
      </div>

      {/* Mobile view: Tabs */}
      <div className="md:hidden">
        <Tabs defaultValue="bride" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-full p-1">
            <TabsTrigger value="bride" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Bride</TabsTrigger>
            <TabsTrigger value="groom" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Groom</TabsTrigger>
          </TabsList>
          <TabsContent value="bride">
            <PersonFields type="bride" data={data} updatePerson={updatePerson} />
          </TabsContent>
          <TabsContent value="groom">
            <PersonFields type="groom" data={data} updatePerson={updatePerson} />
          </TabsContent>
        </Tabs>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-serif text-primary">Your Love Story</h3>
          <Button
            variant="outline"
            className={cn(
              "border-primary/30 hover:bg-primary/10 rounded-full text-xs transition-all",
              storyGenerated ? "text-green-400 border-green-400/30" : "text-primary"
            )}
            onClick={generateAIStory}
            disabled={isGeneratingStory}
            data-testid="button-ai-generate"
          >
            {isGeneratingStory ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : storyGenerated ? (
              <>
                <CheckCircle2 className="mr-2 h-3 w-3" />
                Regenerate
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-3 w-3" />
                Generate with AI
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {storyGenerated && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-green-400/70 mb-4 italic"
            >
              ✨ AI has generated your love story. Feel free to personalize it below.
            </motion.p>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <FloatingInput
            label="How you met"
            id="how-they-met"
            value={data.loveStory.howTheyMet}
            onChange={(v: string) => updateLoveStory("howTheyMet", v)}
            textarea
          />
          <FloatingInput
            label="Special moments"
            id="special-moments"
            value={data.loveStory.specialMoments}
            onChange={(v: string) => updateLoveStory("specialMoments", v)}
            textarea
          />
          <FloatingInput
            label="The Proposal"
            id="proposal-story"
            value={data.loveStory.proposalStory}
            onChange={(v: string) => updateLoveStory("proposalStory", v)}
            textarea
          />
        </div>
      </motion.div>
    </div>
  );
}
