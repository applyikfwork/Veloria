import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        onChange={(e) => onChange(e.target.value)}
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

const PhotoUpload = ({ label, id }: any) => (
  <div className="flex flex-col items-center gap-4 mt-6">
    <Label className="text-white/70 text-sm font-medium">{label}</Label>
    <div 
      className="w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/10 transition-all group"
      data-testid={`upload-${id}`}
    >
      <Camera className="h-8 w-8 text-white/30 group-hover:text-primary transition-colors mb-2" />
      <span className="text-xs text-white/40 group-hover:text-white/60">Upload Photo</span>
    </div>
  </div>
);

export default function CoupleDetailsStep({ data, onChange, onNext, onBack }: CoupleDetailsStepProps) {
  const updatePerson = (type: 'bride' | 'groom', field: string, value: any) => {
    onChange({
      [type]: { ...data[type], [field]: value }
    });
  };

  const updateLoveStory = (field: string, value: any) => {
    onChange({
      loveStory: { ...data.loveStory, [field]: value }
    });
  };

  const PersonFields = ({ type }: { type: 'bride' | 'groom' }) => (
    <div className="space-y-2">
      <PhotoUpload label={`${type === 'bride' ? "Bride's" : "Groom's"} Photo`} id={`${type}-photo`} />
      <FloatingInput 
        label="Full Name" 
        id={`${type}-name`} 
        value={data[type].name} 
        onChange={(v: string) => updatePerson(type, 'name', v)} 
      />
      <FloatingInput 
        label="Nickname" 
        id={`${type}-nickname`} 
        value={data[type].nickname} 
        onChange={(v: string) => updatePerson(type, 'nickname', v)} 
      />
      <FloatingInput 
        label="Instagram Handle" 
        id={`${type}-instagram`} 
        value={data[type].instagram} 
        onChange={(v: string) => updatePerson(type, 'instagram', v)} 
      />
      <FloatingInput 
        label="Short Bio" 
        id={`${type}-bio`} 
        value={data[type].bio} 
        onChange={(v: string) => updatePerson(type, 'bio', v)} 
        textarea 
      />
    </div>
  );

  return (
    <div className="w-full">
      <h2 className="text-3xl font-serif text-center mb-8 text-white">The Happy Couple</h2>
      
      {/* Desktop view: 2 columns */}
      <div className="hidden md:grid grid-cols-2 gap-12">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-4">The Bride</h3>
          <PersonFields type="bride" />
        </motion.div>
        
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-4">The Groom</h3>
          <PersonFields type="groom" />
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
            <PersonFields type="bride" />
          </TabsContent>
          <TabsContent value="groom">
            <PersonFields type="groom" />
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
          <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary/10 rounded-full text-xs" data-testid="button-ai-generate">
            <Sparkles className="mr-2 h-3 w-3" />
            Generate with AI
          </Button>
        </div>
        
        <div className="space-y-6">
          <FloatingInput 
            label="How you met" 
            id="how-they-met" 
            value={data.loveStory.howTheyMet} 
            onChange={(v: string) => updateLoveStory('howTheyMet', v)} 
            textarea 
          />
          <FloatingInput 
            label="Special moments" 
            id="special-moments" 
            value={data.loveStory.specialMoments} 
            onChange={(v: string) => updateLoveStory('specialMoments', v)} 
            textarea 
          />
          <FloatingInput 
            label="The Proposal" 
            id="proposal-story" 
            value={data.loveStory.proposalStory} 
            onChange={(v: string) => updateLoveStory('proposalStory', v)} 
            textarea 
          />
        </div>
      </motion.div>
    </div>
  );
}
