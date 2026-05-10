import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  Copy, 
  Smartphone, 
  Instagram, 
  FileText, 
  Video, 
  QrCode,
  Sparkles,
  ExternalLink,
  Edit2,
  Check,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface ExportShareStepProps {
  formData: any;
  onNext: () => void;
  onBack: () => void;
  savedSlug?: string;
  isSaving?: boolean;
  onSaveSlug?: (slug: string) => void;
}

const EXPORT_OPTIONS = [
  { id: "video", label: "Download Video", icon: <Video className="h-5 w-5" />, premium: true, color: "text-purple-400" },
  { id: "pdf", label: "Download PDF", icon: <FileText className="h-5 w-5" />, premium: false, color: "text-blue-400" },
  { id: "whatsapp", label: "Share to WhatsApp", icon: <Smartphone className="h-5 w-5" />, premium: false, color: "text-green-400" },
  { id: "instagram", label: "Share to Instagram", icon: <Instagram className="h-5 w-5" />, premium: false, color: "text-pink-400" },
  { id: "qr", label: "Generate QR Code", icon: <QrCode className="h-5 w-5" />, premium: false, color: "text-amber-400" },
  { id: "copy", label: "Copy Link", icon: <Copy className="h-5 w-5" />, premium: false, color: "text-zinc-400" },
];

export default function ExportShareStep({ formData, onNext, onBack, savedSlug, isSaving, onSaveSlug }: ExportShareStepProps) {
  const { toast } = useToast();
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [customSlug, setCustomSlug] = useState("");

  const defaultSlug = `${(formData.bride?.name || "priya").toLowerCase()}weds${(formData.groom?.name || "arjun").toLowerCase()}`.replace(/[^a-z0-9]/gi, '');
  const displaySlug = savedSlug || defaultSlug;
  const url = `vivah.in/i/${displaySlug}`;

  useEffect(() => {
    if (savedSlug) {
      setCustomSlug(savedSlug);
    } else {
      setCustomSlug(defaultSlug);
    }
  }, [savedSlug, defaultSlug]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Invitation link copied to clipboard.",
    });
  };

  const handleSaveSlug = () => {
    if (onSaveSlug) {
      onSaveSlug(customSlug);
      setIsEditingSlug(false);
    }
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </motion.div>
        
        {/* Confetti particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
              rotate: Math.random() * 360
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 0.5 }}
            className="absolute top-10 left-1/2 w-2 h-2 bg-primary rounded-sm"
          />
        ))}

        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Your Invitation is Ready!</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Congratulations! Your cinematic wedding invitation is live and ready to be shared with the world.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-white block">Your Wedding Website URL</Label>
            {!isEditingSlug && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary hover:text-primary/80 h-8 gap-1 px-2"
                onClick={() => setIsEditingSlug(true)}
                data-testid="button-edit-slug"
              >
                <Edit2 className="h-3 w-3" />
                Edit URL
              </Button>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-primary" />
                {isEditingSlug ? (
                  <div className="flex items-center bg-black/40 border border-white/10 rounded-md overflow-hidden">
                    <span className="pl-10 pr-0 text-white/40 text-sm whitespace-nowrap">vivah.in/i/</span>
                    <Input
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/gi, ''))}
                      className="bg-transparent border-none pl-1 text-primary font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                      autoFocus
                    />
                  </div>
                ) : (
                  <Input
                    readOnly
                    value={url}
                    className="bg-black/40 border-white/10 pl-10 text-primary font-medium focus:ring-0"
                  />
                )}
              </div>
              
              {isEditingSlug ? (
                <Button 
                  onClick={handleSaveSlug} 
                  disabled={isSaving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-testid="button-save-custom-url"
                >
                  <Check className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="secondary" 
                  className="bg-primary/20 text-primary hover:bg-primary/30" 
                  onClick={copyToClipboard}
                  data-testid="button-copy-link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>

            {savedSlug && (
              <Link href={`/i/${savedSlug}`} target="_blank">
                <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white gap-2" data-testid="button-view-invitation">
                  <Eye className="h-4 w-4" />
                  View Your Invitation
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {EXPORT_OPTIONS.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:bg-white/10 transition-all cursor-pointer group"
              data-testid={`card-export-${option.id}`}
            >
              <div className={cn("h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", option.color)}>
                {option.icon}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-white">{option.label}</p>
                {option.premium && (
                  <Badge variant="outline" className="text-[8px] h-4 bg-primary/10 text-primary border-primary/20">PREMIUM</Badge>
                )}
              </div>
              <Button size="sm" variant="ghost" className="w-full h-8 text-[10px] mt-2 border border-white/5">
                {option.id === "copy" ? "Copy" : "Download"}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-white font-serif">Upgrade to Premium</h4>
              <p className="text-xs text-muted-foreground">Get 4K video export, unlimited guest tracking, and custom domain.</p>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
            Upgrade Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

function Label({ children, className, ...props }: any) {
  return (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
      {children}
    </label>
  );
}
