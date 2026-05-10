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
  Download
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function SaveTheDatePage() {
  const [, params] = useRoute("/save-the-date/:slug");
  const slug = params?.slug;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);

  useEffect(() => {
    async function fetchInvitation() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (data) setInvitation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchInvitation();
  }, [slug]);

  const downloadICS = () => {
    if (!invitation?.events?.[0]) return;
    const event = invitation.events[0];
    const dateStr = event.date.replace(/-/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${dateStr}T090000Z
DTEND:${dateStr}T220000Z
SUMMARY:Wedding of ${invitation.bride_name} & ${invitation.groom_name}
LOCATION:${event.venue}
DESCRIPTION:Please join us for our special day!
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding-save-the-date.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Added to calendar!",
      description: "Calendar file (.ics) has been downloaded.",
    });
  };

  const shareWhatsApp = () => {
    const text = `Save the Date! ${invitation.bride_name} & ${invitation.groom_name} are getting married on ${invitation.events?.[0]?.date}. More details here: ${window.location.origin}/i/${slug}`;
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

  if (!invitation) return null;

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative background mandala-like SVG */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none scale-150">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-primary animate-spin-slow">
          <path d="M100,0 C110,30 140,30 150,0 C160,30 190,30 200,0 C170,10 170,40 200,50 C170,60 170,90 200,100 C170,110 170,140 200,150 C170,160 170,190 200,200 C190,170 160,170 150,200 C140,170 110,170 100,200 C90,170 60,170 50,200 C40,170 10,170 0,200 C30,190 30,160 0,150 C30,140 30,110 0,100 C30,90 30,60 0,50 C30,40 30,10 0,0 C10,30 40,30 50,0 C60,30 90,30 100,0 Z" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-12 text-center space-y-8 shadow-2xl"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
          <p className="text-primary font-serif italic text-2xl">Save the Date</p>
          <div className="h-[1px] w-12 bg-primary/30 mx-auto" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight">
            {invitation.bride_name} <br/>
            <span className="text-primary">&</span> <br/>
            {invitation.groom_name}
          </h1>
          <p className="text-white/60 text-lg uppercase tracking-[0.2em]">Are Getting Married</p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 space-y-2">
          <p className="text-3xl md:text-4xl font-serif text-primary">
            {invitation.events?.[0]?.date ? new Date(invitation.events[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBA'}
          </p>
          <p className="text-white/50 flex items-center justify-center gap-2">
            <MapPin size={16} className="text-primary/50" />
            {invitation.events?.[0]?.venue || 'Venue TBA'}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-white/40 italic">More details coming soon...</p>
          <div className="flex flex-col gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12" onClick={downloadICS} data-testid="button-add-to-calendar">
              <Download className="mr-2 h-4 w-4" /> Add to Calendar
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="border-white/10 text-white rounded-full" onClick={shareWhatsApp} data-testid="button-share-whatsapp">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
              <Link href={`/i/${slug}`}>
                <Button variant="outline" className="w-full border-white/10 text-white rounded-full group" data-testid="link-view-invitation">
                  View Full <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
