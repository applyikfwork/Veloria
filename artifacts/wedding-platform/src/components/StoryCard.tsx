import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Sparkles, Heart, MapPin } from "lucide-react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StoryCardProps {
  brideName: string;
  groomName: string;
  date: string;
  venue: string;
  themeGradient?: string;
}

export default function StoryCard({ brideName, groomName, date, venue, themeGradient }: StoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `wedding-story-${brideName}-${groomName}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Story Card Saved!",
        description: "Your invitation story card has been downloaded.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to generate story card.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    // Try Web Share API if available
    if (navigator.share) {
      try {
        const canvas = await html2canvas(cardRef.current, { scale: 2 });
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], "wedding-story.png", { type: "image/png" });
            await navigator.share({
              files: [file],
              title: "Wedding Invitation",
              text: `You are invited to the wedding of ${brideName} & ${groomName}!`
            });
          }
        });
        return;
      } catch (err) {
        console.log("Web Share failed, falling back to clipboard");
      }
    }

    // Fallback: Copy link
    navigator.clipboard.writeText(window.location.origin + window.location.pathname);
    toast({
      title: "Link Copied!",
      description: "Invitation link copied for sharing.",
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 9:16 Aspect Ratio Card */}
      <div 
        ref={cardRef}
        className={`relative w-[375px] h-[667px] overflow-hidden rounded-[2rem] shadow-2xl flex flex-col items-center justify-between p-12 text-center bg-gradient-to-br ${themeGradient || 'from-[#0B0B0F] via-[#1A1A1F] to-[#0B0B0F]'}`}
      >
        {/* Background Mandala SVG */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[120%] h-[120%] fill-primary">
            <path d="M100,0 C110,30 140,30 150,0 C160,30 190,30 200,0 C170,10 170,40 200,50 C170,60 170,90 200,100 C170,110 170,140 200,150 C170,160 170,190 200,200 C190,170 160,170 150,200 C140,170 110,170 100,200 C90,170 60,170 50,200 C40,170 10,170 0,200 C30,190 30,160 0,150 C30,140 30,110 0,100 C30,90 30,60 0,50 C30,40 30,10 0,0 C10,30 40,30 50,0 C60,30 90,30 100,0 Z" />
          </svg>
        </div>

        <div className="relative z-10 space-y-2">
          <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-primary font-serif italic text-lg uppercase tracking-widest">Save the Date</p>
          <div className="h-[1px] w-8 bg-primary/30 mx-auto" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-serif text-white">{brideName}</h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 bg-primary/30" />
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <div className="h-[1px] w-8 bg-primary/30" />
            </div>
            <h1 className="text-5xl font-serif text-white">{groomName}</h1>
          </div>
          <p className="text-white/60 text-sm uppercase tracking-[0.3em]">Are Getting Married</p>
        </div>

        <div className="relative z-10 space-y-6 w-full">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-1">
            <p className="text-2xl font-serif text-primary">{date}</p>
            <p className="text-white/40 text-xs flex items-center justify-center gap-1">
              <MapPin size={12} />
              {venue}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] text-white/40 uppercase tracking-[0.4em]">Veloria Cinematic</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-sm">
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="flex-1 bg-primary text-primary-foreground rounded-full"
          data-testid="button-download-story"
        >
          {downloading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Download className="h-4 w-4" />
            </motion.div>
          ) : (
            <><Download className="mr-2 h-4 w-4" /> Download PNG</>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleShare}
          className="flex-1 border-white/10 text-white rounded-full"
          data-testid="button-share-story"
        >
          <Share2 className="mr-2 h-4 w-4" /> Share Story
        </Button>
      </div>
    </div>
  );
}
