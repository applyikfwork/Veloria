import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  MessageCircle, 
  Copy,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function InvitationPage() {
  const [, params] = useRoute("/i/:slug");
  const slug = params?.slug;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState(false);

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
          setError(true);
        } else {
          setInvitation(data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchInvitation();
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Invitation link has been copied to clipboard.",
    });
  };

  const shareWhatsApp = () => {
    const text = `You're invited to the wedding of ${invitation.bride_name} & ${invitation.groom_name}! Check out the invitation here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif text-white mb-4">Invitation Not Found</h1>
        <p className="text-muted-foreground mb-8">The invitation you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground">Back to Home</Button>
        </Link>
      </div>
    );
  }

  // Map design themes to gradients
  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'royal-gold': return 'from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A]';
      case 'bollywood-glam': return 'from-[#4A0E0E] via-[#800020] to-[#4A0E0E]';
      case 'floral-bliss': return 'from-[#FFF5F5] via-[#FFE4E1] to-[#FFF5F5]';
      case 'dark-luxury': return 'from-[#0B0B0F] via-[#1A1A1F] to-[#0B0B0F]';
      default: return 'from-[#0B0B0F] via-[#1A1A1F] to-[#0B0B0F]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-foreground font-sans selection:bg-primary/30">
      {/* Hero Section */}
      <section className={`relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-gradient-to-b ${getThemeGradient(invitation.design_theme)}`}>
        {/* Animated Background Ornaments */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 space-y-6"
        >
          <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1 uppercase tracking-widest text-xs bg-primary/5">
            {invitation.wedding_type?.replace('-', ' ')}
          </Badge>
          
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-serif text-white">
              {invitation.bride_name}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-primary/50" />
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <div className="h-[1px] w-12 bg-primary/50" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white">
              {invitation.groom_name}
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-primary/80 font-serif italic">
            Are getting married
          </p>

          {invitation.events?.[0] && (
            <div className="pt-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{invitation.events[0].date}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>{invitation.events[0].venue}</span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-primary/50">
            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to Discover</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* Couple Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Bride */}
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center md:text-left"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-primary/20 mx-auto md:mx-0">
                <img 
                  src={invitation.bride_photo_url || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200"} 
                  alt={invitation.bride_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-white">{invitation.bride_name}</h3>
              <p className="text-primary/60 italic">The Bride</p>
              <p className="text-muted-foreground leading-relaxed">{invitation.bride_bio}</p>
            </div>
          </motion.div>

          {/* Groom */}
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            className="space-y-6 text-center md:text-right"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-primary/20 mx-auto md:ml-auto md:mr-0">
                <img 
                  src={invitation.groom_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} 
                  alt={invitation.groom_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-white">{invitation.groom_name}</h3>
              <p className="text-primary/60 italic">The Groom</p>
              <p className="text-muted-foreground leading-relaxed">{invitation.groom_bio}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Love Story Section */}
      {invitation.love_story?.howTheyMet && (
        <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Sparkles className="h-8 w-8 text-primary mx-auto opacity-50" />
            <h2 className="text-4xl font-serif text-white">Our Love Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed italic">
              "{invitation.love_story.howTheyMet}"
            </p>
          </div>
        </section>
      )}

      {/* Events Timeline */}
      {invitation.events && invitation.events.length > 0 && (
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-white mb-16">The Celebration</h2>
          <div className="space-y-8">
            {invitation.events.map((event: any, index: number) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <Badge className="bg-primary/20 text-primary border-primary/20">{event.type}</Badge>
                    <h3 className="text-2xl font-serif text-white group-hover:text-primary transition-colors">{event.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/10 hover:border-primary/50 text-white">
                    View on Maps
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP Section */}
      {invitation.rsvp_settings?.enabled && (
        <section className="py-24 px-6 bg-gradient-to-t from-primary/10 to-transparent">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-serif text-white">Will You Join Us?</h2>
            <p className="text-muted-foreground">Please let us know if you'll be attending by {invitation.rsvp_settings.deadline || 'the end of this month'}.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12">
                RSVP Now
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareWhatsApp}
          className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={copyLink}
          className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          <Share2 className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-serif text-white text-xl">Vivah</span>
        </div>
        <p className="text-xs text-muted-foreground">Created with love using Vivah Cinematic Invitations</p>
      </footer>
    </div>
  );
}
