import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Share2, 
  Copy, 
  Smartphone, 
  Instagram, 
  FileText, 
  QrCode,
  Sparkles,
  ExternalLink,
  Edit2,
  Check,
  Eye,
  Download,
  Link2
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

export default function ExportShareStep({ formData, onNext, onBack, savedSlug, isSaving, onSaveSlug }: ExportShareStepProps) {
  const { toast } = useToast();
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [customSlug, setCustomSlug] = useState("");

  const defaultSlug = `${(formData.bride?.name || "priya").toLowerCase()}weds${(formData.groom?.name || "arjun").toLowerCase()}`.replace(/[^a-z0-9]/gi, '');
  const displaySlug = savedSlug || defaultSlug;
  
  const invitationUrl = savedSlug
    ? `${window.location.origin}/i/${savedSlug}`
    : `${window.location.origin}/i/${defaultSlug}`;

  useEffect(() => {
    setCustomSlug(savedSlug || defaultSlug);
  }, [savedSlug, defaultSlug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      toast({ title: "Link copied!", description: "Paste it anywhere to share." });
    } catch {
      toast({ title: "Copy failed", description: "Please copy the link manually.", variant: "destructive" });
    }
  };

  const shareWhatsApp = () => {
    const bride = formData.bride?.name || 'Priya';
    const groom = formData.groom?.name || 'Arjun';
    const text = `💍 You're invited to the wedding of *${bride} & ${groom}*!\n\nView their beautiful digital invitation:\n${invitationUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareInstagram = async () => {
    await copyToClipboard();
    toast({
      title: "Link copied!",
      description: "Open Instagram and paste the link in your bio or story.",
    });
    setTimeout(() => window.open('https://www.instagram.com/', '_blank'), 800);
  };

  const generateQR = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(invitationUrl)}&color=1E0C03&bgcolor=FAF5EA&margin=20`;
    window.open(qrUrl, '_blank');
  };

  const printPDF = () => {
    if (savedSlug) {
      const printWindow = window.open(`/i/${savedSlug}`, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } else {
      toast({ title: "Save first", description: "Please save your invitation before printing.", variant: "destructive" });
    }
  };

  const shareNative = async () => {
    const bride = formData.bride?.name || 'Priya';
    const groom = formData.groom?.name || 'Arjun';
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${bride} & ${groom}'s Wedding Invitation`,
          text: `You're invited to celebrate with ${bride} & ${groom}!`,
          url: invitationUrl,
        });
      } else {
        await copyToClipboard();
      }
    } catch {
      await copyToClipboard();
    }
  };

  const handleSaveSlug = () => {
    if (onSaveSlug && customSlug.length >= 3) {
      onSaveSlug(customSlug);
      setIsEditingSlug(false);
    }
  };

  const SHARE_OPTIONS = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <Smartphone className="h-5 w-5" />,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200 hover:bg-green-100",
      action: shareWhatsApp,
      actionLabel: "Share",
    },
    {
      id: "copy",
      label: "Copy Link",
      icon: <Copy className="h-5 w-5" />,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      action: copyToClipboard,
      actionLabel: "Copy",
    },
    {
      id: "native-share",
      label: "Share",
      icon: <Share2 className="h-5 w-5" />,
      color: "text-primary",
      bg: "bg-primary/8 border-primary/20 hover:bg-primary/15",
      action: shareNative,
      actionLabel: "Share",
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      color: "text-pink-600",
      bg: "bg-pink-50 border-pink-200 hover:bg-pink-100",
      action: shareInstagram,
      actionLabel: "Open",
    },
    {
      id: "qr",
      label: "QR Code",
      icon: <QrCode className="h-5 w-5" />,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200 hover:bg-amber-100",
      action: generateQR,
      actionLabel: "Generate",
    },
    {
      id: "pdf",
      label: "Print / PDF",
      icon: <FileText className="h-5 w-5" />,
      color: "text-purple-600",
      bg: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      action: printPDF,
      actionLabel: "Print",
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Success header */}
      <div className="text-center relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </motion.div>

        {/* Confetti */}
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 220,
              y: (Math.random() - 0.5) * 220,
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() * 0.8, repeatDelay: Math.random() * 2 }}
            className="absolute top-10 left-1/2 w-2 h-2 rounded-sm"
            style={{ backgroundColor: ['#D4AF37', '#FF6B9D', '#9B59B6', '#4CAF50', '#FF9933'][i % 5] }}
          />
        ))}

        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-3">Your Invitation is Ready!</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Congratulations! Your cinematic wedding invitation is live and ready to be shared with the world.
        </p>
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* URL Box */}
        <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              <span className="text-foreground text-sm font-medium">Your Invitation Link</span>
            </div>
            {!isEditingSlug && (
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80 h-7 gap-1 px-2 text-xs"
                onClick={() => setIsEditingSlug(true)}
              >
                <Edit2 className="h-3 w-3" />
                Custom URL
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-primary" />
              {isEditingSlug ? (
                <div className="flex items-center bg-muted/40 border border-primary/30 rounded-lg overflow-hidden">
                  <span className="pl-10 pr-1 text-foreground/40 text-sm whitespace-nowrap py-2.5">
                    {window.location.origin}/i/
                  </span>
                  <Input
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/gi, ''))}
                    className="bg-transparent border-none pl-0 text-primary font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                    autoFocus
                    placeholder="yourname"
                  />
                </div>
              ) : (
                <Input
                  readOnly
                  value={invitationUrl}
                  className="bg-muted/30 border-border/30 pl-10 text-primary font-medium text-sm focus:ring-0 cursor-text"
                />
              )}
            </div>

            {isEditingSlug ? (
              <Button
                onClick={handleSaveSlug}
                disabled={isSaving || customSlug.length < 3}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSaving ? '...' : <Check className="h-4 w-4" />}
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>

          {savedSlug && (
            <Link href={`/i/${savedSlug}`} target="_blank">
              <Button className="w-full mt-3 bg-muted/40 hover:bg-muted/60 border border-border/30 text-foreground gap-2 rounded-xl">
                <Eye className="h-4 w-4" />
                View Your Live Invitation
                <ExternalLink className="h-3 w-3 opacity-50" />
              </Button>
            </Link>
          )}
        </div>

        {/* Share Options */}
        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/40 mb-4">Share with your guests</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SHARE_OPTIONS.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={option.action}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all cursor-pointer group ${option.bg}`}
              >
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", option.color, "bg-foreground/[0.05]")}>
                  {option.icon}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">{option.label}</p>
                  <p className={cn("text-[10px] mt-0.5", option.color)}>{option.actionLabel} →</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Guest personalised link tip */}
        <div className="bg-muted/30 border border-border/25 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground text-sm font-medium mb-1">Personalise for each guest</p>
              <p className="text-foreground/50 text-xs leading-relaxed">
                Add <code className="text-primary bg-primary/10 px-1 rounded">?guest=GuestName</code> to the URL to greet each guest by name.
                {savedSlug && (
                  <span className="block mt-1 text-primary/60">
                    Example: <span className="text-primary">{window.location.origin}/i/{savedSlug}?guest=Anjali</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary/15 via-primary/8 to-transparent border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-foreground font-serif">Upgrade to Premium</h4>
              <p className="text-xs text-muted-foreground">4K video export, unlimited guests, custom domain, WhatsApp reminders</p>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 shrink-0">
            Upgrade Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
