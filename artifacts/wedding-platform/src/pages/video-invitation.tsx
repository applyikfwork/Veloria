import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MessageCircle, 
  Copy, 
  ChevronRight,
  Calendar,
  MapPin,
  Heart,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SCENES = [
  { id: 0, duration: 3000 }, // Veloria Presents
  { id: 1, duration: 3000 }, // Couple Names
  { id: 2, duration: 3000 }, // Are Getting Married
  { id: 3, duration: 3000 }, // Date and Venue
  { id: 4, duration: 3000 }, // Events Reveal (dynamic duration handled in component)
  { id: 5, duration: 3000 }, // You Are Lovingly Invited
  { id: 6, duration: 0 },    // Final Frame (static)
];

export default function VideoInvitationPage() {
  const [, params] = useRoute("/i/:slug/video");
  const slug = params?.slug;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function fetchInvitation() {
      if (!slug) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error || !data) {
          console.error("Error fetching invitation:", error);
        } else {
          setInvitation(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvitation();
  }, [slug]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !loading && invitation && currentScene < SCENES.length - 1) {
      const sceneDuration = SCENES[currentScene].duration;
      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const sceneProgress = Math.min((elapsed / sceneDuration) * 100, 100);
        
        // Overall progress calculation
        const overallProgress = ((currentScene * 100) + sceneProgress) / (SCENES.length - 1);
        setProgress(overallProgress);

        if (elapsed >= sceneDuration) {
          setCurrentScene(prev => prev + 1);
          clearInterval(interval);
        }
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentScene, loading, invitation]);

  const copyLink = () => {
    const url = window.location.origin + `/i/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Invitation link has been copied to clipboard.",
    });
  };

  const shareWhatsApp = () => {
    const text = `You're invited to the wedding of ${invitation.bride_name} & ${invitation.groom_name}! View the cinematic invitation here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReplay = () => {
    setCurrentScene(0);
    setProgress(0);
    setIsPlaying(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif text-white mb-4">Invitation Not Found</h1>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden select-none">
      {/* Golden Particles Background (CSS Animation) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 10,
              opacity: Math.random()
            }}
            animate={{ 
              y: -10,
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentScene === 0 && (
          <motion.div
            key="scene-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center flex-col gap-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <Sparkles className="h-12 w-12 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-serif tracking-[0.3em] text-primary/80 uppercase">Veloria Presents</h2>
          </motion.div>
        )}

        {currentScene === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center flex-col md:flex-row gap-8 md:gap-16 px-6"
          >
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-serif text-white text-center"
            >
              {invitation.bride_name}
            </motion.h1>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
            >
              <Heart className="h-12 w-12 text-primary fill-primary" />
            </motion.div>
            <motion.h1
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-serif text-white text-center"
            >
              {invitation.groom_name}
            </motion.h1>
          </motion.div>
        )}

        {currentScene === 2 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="text-4xl md:text-6xl font-serif italic text-primary"
            >
              Are Getting Married
            </motion.p>
          </motion.div>
        )}

        {currentScene === 3 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-4 text-3xl md:text-5xl"
            >
              <Calendar className="h-8 w-8 md:h-12 md:w-12 text-primary" />
              <span className="font-serif">{invitation.events?.[0]?.date || "The Special Day"}</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="flex items-center gap-4 text-xl md:text-3xl text-white/70"
            >
              <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary/70" />
              <span className="font-serif">{invitation.events?.[0]?.venue || "The Venue"}</span>
            </motion.div>
          </motion.div>
        )}

        {currentScene === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 overflow-hidden"
          >
            <h3 className="text-xl text-primary/60 uppercase tracking-widest mb-12">The Celebration</h3>
            <div className="space-y-8 w-full max-w-lg">
              {invitation.events?.map((event: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.4 }}
                  className="flex justify-between items-center border-b border-primary/20 pb-4"
                >
                  <div className="text-left">
                    <p className="text-primary text-sm uppercase tracking-tighter">{event.type}</p>
                    <p className="text-xl md:text-2xl font-serif">{event.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">{event.date}</p>
                    <p className="text-white/40 text-xs">{event.venue}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {currentScene === 5 && (
          <motion.div
            key="scene-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center px-6 text-center"
          >
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2 }}
              className="text-4xl md:text-7xl font-serif text-white leading-tight"
            >
              You Are <br/>
              <span className="text-primary italic">Lovingly Invited</span>
            </motion.h2>
          </motion.div>
        )}

        {currentScene === 6 && (
          <motion.div
            key="scene-6"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-12 px-6 text-center bg-gradient-to-b from-black via-primary/5 to-black"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-serif text-white">
                {invitation.bride_name} & {invitation.groom_name}
              </h1>
              <p className="text-xl md:text-2xl text-primary font-serif italic">Wedding Celebration</p>
              <p className="text-white/60">{invitation.events?.[0]?.date}</p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Link href={`/i/${slug}`}>
                <Button size="lg" className="w-full bg-primary text-primary-foreground rounded-full hover:bg-primary/90 group" data-testid="button-view-invitation">
                  RSVP Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="border-white/20 text-white rounded-full" onClick={shareWhatsApp} data-testid="button-share-whatsapp">
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                </Button>
                <Button variant="outline" className="border-white/20 text-white rounded-full" onClick={copyLink} data-testid="button-copy-link">
                  <Copy className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
              <Button variant="ghost" className="text-primary/60 hover:text-primary" onClick={handleReplay} data-testid="button-replay">
                <RotateCcw className="mr-2 h-4 w-4" /> Replay
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
          data-testid="button-play-pause"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
