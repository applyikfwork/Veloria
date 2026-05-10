import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  Shirt,
  Navigation
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function EventInvitationPage() {
  const [, params] = useRoute("/i/:slug/event/:eventName");
  const slug = params?.slug;
  const eventName = params?.eventName ? decodeURIComponent(params.eventName) : "";
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    async function fetchInvitation() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (data) {
          setInvitation(data);
          const foundEvent = data.events?.find((e: any) => e.name === eventName);
          setEvent(foundEvent);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvitation();
  }, [slug, eventName]);

  const getEventTheme = (type: string) => {
    const t = type?.toLowerCase() || "";
    if (t.includes('mehndi')) return { color: 'from-[#1a2e1a] to-[#2d4d2d]', accent: '#4ade80' };
    if (t.includes('sangeet')) return { color: 'from-[#2e1a3e] to-[#4d2d6d]', accent: '#a855f7' };
    if (t.includes('wedding') || t.includes('marriage')) return { color: 'from-[#2e261a] to-[#4d402d]', accent: '#fbbf24' };
    if (t.includes('reception')) return { color: 'from-[#1a213e] to-[#2d366d]', accent: '#60a5fa' };
    if (t.includes('haldi')) return { color: 'from-[#3e341a] to-[#6d5b2d]', accent: '#facc15' };
    return { color: 'from-[#1a1a1f] to-[#2d2d36]', accent: '#d4af37' };
  };

  const shareWhatsApp = () => {
    const text = `You're invited to the ${eventName} of ${invitation.bride_name} & ${invitation.groom_name}! See details here: ${window.location.href}`;
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

  if (!invitation || !event) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif text-white mb-4">Event Not Found</h1>
        <Link href={`/i/${slug}`}>
          <Button className="bg-primary text-primary-foreground">View Main Invitation</Button>
        </Link>
      </div>
    );
  }

  const theme = getEventTheme(event.type);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.color} text-white font-sans p-6 flex flex-col items-center justify-center`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
        
        <div className="text-center space-y-4">
          <p className="text-primary font-serif italic text-xl">The Wedding of</p>
          <h2 className="text-3xl md:text-5xl font-serif">{invitation.bride_name} & {invitation.groom_name}</h2>
          <div className="h-[1px] w-12 bg-primary/30 mx-auto" />
        </div>

        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block px-6 py-2 bg-primary/20 rounded-full border border-primary/30 text-primary font-medium tracking-widest uppercase text-sm mb-4"
          >
            {event.type}
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif text-white">{event.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-white/10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Date</p>
                <p className="text-lg font-medium">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Time</p>
                <p className="text-lg font-medium">{event.time}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">Venue</p>
                <p className="text-lg font-medium leading-tight">{event.venue}</p>
              </div>
            </div>
            {event.dressCode && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shirt className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider">Dress Code</p>
                  <p className="text-lg font-medium">{event.dressCode}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Embed */}
        <div className="rounded-2xl overflow-hidden h-48 border border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(event.venue + ' ' + (event.address || ''))}&output=embed`}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href={`/i/${slug}/rsvp`} className="flex-1">
            <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-14" data-testid="button-rsvp">
              RSVP For This Event
            </Button>
          </Link>
          <div className="flex gap-4">
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-white/10 text-white" onClick={shareWhatsApp} data-testid="button-share-whatsapp">
              <MessageCircle size={24} />
            </Button>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-white/10 text-white" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ' ' + (event.address || ''))}`, '_blank')} data-testid="button-directions">
              <Navigation size={24} />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <Link href={`/i/${slug}`}>
            <Button variant="ghost" className="text-white/40 hover:text-white" data-testid="link-back-main">
              View All Wedding Events <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
