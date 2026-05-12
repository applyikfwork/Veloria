import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Calendar, MapPin, Clock, MessageCircle, Copy, Share2, Globe, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const GOLD = "#D4AF37";
const GARNET = "#5E0B15";
const ONYX = "#0F0F0F";

function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number; opacityDir: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.opacity})`;
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.opacityDir * 0.004;
        if (p.opacity >= 0.65 || p.opacity <= 0.05) p.opacityDir *= -1;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

function MughalArch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 180" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 180 L10 100 Q10 10 100 10 Q190 10 190 100 L190 180"
        stroke={GOLD} strokeWidth="1.5" strokeOpacity="0.4" fill="none"
      />
      <path
        d="M30 180 L30 108 Q30 35 100 35 Q170 35 170 108 L170 180"
        stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.2" fill="none"
      />
      <circle cx="100" cy="10" r="4" fill={GOLD} fillOpacity="0.4" />
      <circle cx="10" cy="180" r="3" fill={GOLD} fillOpacity="0.3" />
      <circle cx="190" cy="180" r="3" fill={GOLD} fillOpacity="0.3" />
      <line x1="10" y1="160" x2="190" y2="160" stroke={GOLD} strokeWidth="0.5" strokeOpacity="0.15" />
      <path d="M55 180 L55 140 Q55 115 100 115 Q145 115 145 140 L145 180" stroke={GOLD} strokeWidth="0.6" strokeOpacity="0.15" fill="none" />
    </svg>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
      </div>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
    </div>
  );
}

function CurtainReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function WaxSealButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  const [stamped, setStamped] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setStamped(true);
    setTimeout(() => { setStamped(false); onClick(); }, 800);
  };

  return (
    <div className="relative inline-block">
      <AnimatePresence>
        {stamped && (
          <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute -inset-4 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-xl" style={{ borderColor: GARNET, backgroundColor: `${GARNET}cc`, color: "#F5F5F5" }}>
              ⚜️
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        disabled={disabled}
        className="relative px-10 py-4 rounded-none font-medium tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={{
          background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}44)`,
          border: `1px solid ${GOLD}60`,
          color: GOLD,
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "0.25em",
        }}
      >
        {children}
      </motion.button>
    </div>
  );
}

interface RoyalNoorProps {
  invitation: any;
}

export default function RoyalNoorInvitation({ invitation }: RoyalNoorProps) {
  const { toast } = useToast();
  const [wishForm, setWishForm] = useState({ name: "", relation: "", message: "" });
  const [wishes, setWishes] = useState<any[]>([]);
  const [submittingWish, setSubmittingWish] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: "", attending: "", meal: "", message: "" });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0);
  const [showEntrance, setShowEntrance] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const photos: string[] = [];
  const gallery = invitation?.gallery_photos;
  if (gallery?.couple?.length) photos.push(...gallery.couple.filter(Boolean));
  if (gallery?.preWedding?.length) photos.push(...gallery.preWedding.filter(Boolean));
  if (gallery?.family?.length) photos.push(...gallery.family.filter(Boolean));
  if (invitation?.bride_photo_url) photos.push(invitation.bride_photo_url);
  if (invitation?.groom_photo_url) photos.push(invitation.groom_photo_url);
  if (photos.length === 0) {
    photos.push(
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1400",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1400"
    );
  }

  useEffect(() => {
    const t = setTimeout(() => setShowEntrance(false), 3200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setHeroPhotoIndex(p => (p + 1) % photos.length), 5000);
    return () => clearInterval(iv);
  }, [photos.length]);

  useEffect(() => {
    if (!invitation?.id) return;
    supabase.from("wishes").select("*").eq("invitation_id", invitation.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setWishes(data);
    });
  }, [invitation?.id]);

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;
    setSubmittingWish(true);
    try {
      const { data, error } = await supabase.from("wishes").insert({
        invitation_id: invitation.id,
        guest_name: wishForm.name,
        relation: wishForm.relation,
        message: wishForm.message,
      }).select().single();
      if (data) {
        setWishes(prev => [data, ...prev]);
        setWishForm({ name: "", relation: "", message: "" });
        toast({ title: "Blessing received", description: "Your words are now part of this love story." });
      }
    } catch {
      toast({ title: "Error", description: "Could not save your blessing.", variant: "destructive" });
    } finally {
      setSubmittingWish(false);
    }
  };

  const handleRsvp = async () => {
    if (!rsvpForm.name || !rsvpForm.attending) return;
    try {
      await supabase.from("rsvps").insert({
        invitation_id: invitation.id,
        guest_name: rsvpForm.name,
        attending: rsvpForm.attending === "yes",
        meal_preference: rsvpForm.meal,
        message: rsvpForm.message,
      });
      setRsvpSubmitted(true);
      toast({ title: "RSVP sealed ⚜️", description: "Your presence honours us." });
    } catch {
      toast({ title: "Error", description: "Could not submit RSVP.", variant: "destructive" });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Share this royal invitation." });
  };

  const shareWhatsApp = () => {
    const text = `You are cordially invited to the Royal Wedding of ${invitation.bride_name} & ${invitation.groom_name} ✨\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const brideName = invitation.bride_name || "The Bride";
  const groomName = invitation.groom_name || "The Groom";
  const mainEvent = invitation.events?.[0];

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{ backgroundColor: ONYX, fontFamily: "'Montserrat', sans-serif", fontWeight: 300 }}
    >
      <GoldParticles />

      <AnimatePresence>
        {showEntrance && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ backgroundColor: ONYX }}
            onClick={() => setShowEntrance(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center px-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-8 select-none"
              >
                ⚜️
              </motion.div>
              <p className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: `${GOLD}80`, fontFamily: "'Montserrat', sans-serif" }}>
                Veloria Presents
              </p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-3"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}
              >
                {brideName}
              </motion.h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center justify-center gap-4 my-4"
              >
                <div className="h-px w-20" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
                <span style={{ color: GOLD }}>♥</span>
                <div className="h-px w-20" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}
              >
                {groomName}
              </motion.h1>
              {mainEvent?.date && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-xs tracking-[0.3em] uppercase"
                  style={{ color: `${GOLD}60` }}
                >
                  {format(new Date(mainEvent.date), "MMMM d, yyyy")}
                </motion.p>
              )}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
                transition={{ delay: 1.8, duration: 2, repeat: Infinity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase"
                style={{ color: `${GOLD}40` }}
              >
                Tap to enter
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroPhotoIndex}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1.18, opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, ease: "linear" }}
            className="absolute inset-0 z-0"
          >
            <img src={photos[heroPhotoIndex]} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${ONYX}99 0%, ${ONYX}33 40%, ${ONYX}99 100%)` }} />
          </motion.div>
        </AnimatePresence>

        <MughalArch className="absolute top-0 left-1/2 -translate-x-1/2 w-64 md:w-96 opacity-30 pointer-events-none" />

        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-xs uppercase mb-8"
            style={{ color: `${GOLD}80`, fontFamily: "'Montserrat', sans-serif" }}
          >
            The Royal Noor · Veloria Signature
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl mb-2 leading-none"
            style={{ fontFamily: "'Pinyon Script', cursive", color: "#F5F5F5", textShadow: `0 0 60px ${GOLD}30` }}
          >
            {brideName}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center justify-center gap-6 my-4"
          >
            <div className="h-px w-16 md:w-32" style={{ background: `linear-gradient(to right, transparent, ${GOLD}80)` }} />
            <Heart className="w-5 h-5" style={{ color: GOLD, fill: GOLD }} />
            <div className="h-px w-16 md:w-32" style={{ background: `linear-gradient(to left, transparent, ${GOLD}80)` }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-9xl mb-8 leading-none"
            style={{ fontFamily: "'Pinyon Script', cursive", color: "#F5F5F5", textShadow: `0 0 60px ${GOLD}30` }}
          >
            {groomName}
          </motion.h1>

          {mainEvent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-px w-24 mx-auto mb-4" style={{ backgroundColor: `${GOLD}40` }} />
              <div className="flex items-center gap-2 text-sm" style={{ color: `${GOLD}80`, fontFamily: "'Montserrat', sans-serif" }}>
                <Calendar className="w-4 h-4" style={{ color: GOLD }} />
                <span className="tracking-widest">{format(new Date(mainEvent.date), "EEEE, MMMM d, yyyy")}</span>
              </div>
              {mainEvent.venue && (
                <div className="flex items-center gap-2 text-xs" style={{ color: "#F5F5F580" }}>
                  <MapPin className="w-3 h-3" style={{ color: GOLD }} />
                  <span className="tracking-wider">{mainEvent.venue}</span>
                </div>
              )}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 flex flex-col items-center gap-2"
          style={{ color: `${GOLD}40` }}
        >
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll to Discover</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── LOVE STORY ── */}
      {invitation.love_story && (invitation.love_story.howTheyMet || invitation.love_story.specialMoments || invitation.love_story.proposalStory) && (
        <section className="py-28 px-6" style={{ background: `linear-gradient(180deg, ${ONYX} 0%, #0A0800 50%, ${ONYX} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <CurtainReveal>
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${GOLD}60` }}>Chapter One</p>
                <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>
                  Our Love Story
                </h2>
                <GoldDivider />
              </div>
            </CurtainReveal>

            <div className="space-y-16">
              {invitation.love_story.howTheyMet && (
                <CurtainReveal delay={0.1}>
                  <div className="flex gap-8 items-start">
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>I</div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${GOLD}60` }}>How We Met</p>
                      <p className="text-lg md:text-xl leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5CC" }}>
                        "{invitation.love_story.howTheyMet}"
                      </p>
                    </div>
                  </div>
                </CurtainReveal>
              )}

              {invitation.love_story.specialMoments && (
                <CurtainReveal delay={0.1}>
                  <div className="flex gap-8 items-start">
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>II</div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${GOLD}60` }}>Special Moments</p>
                      <p className="text-lg md:text-xl leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5CC" }}>
                        "{invitation.love_story.specialMoments}"
                      </p>
                    </div>
                  </div>
                </CurtainReveal>
              )}

              {invitation.love_story.proposalStory && (
                <CurtainReveal delay={0.1}>
                  <div className="flex gap-8 items-start">
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>III</div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.3em]" style={{ color: `${GOLD}60` }}>The Proposal</p>
                      <p className="text-lg md:text-xl leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5CC" }}>
                        "{invitation.love_story.proposalStory}"
                      </p>
                    </div>
                  </div>
                </CurtainReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── FORMAL INVITATION CARD ── */}
      <section className="py-28 px-6 relative" style={{ background: `linear-gradient(180deg, ${ONYX} 0%, #0D0A02 100%)` }}>
        <div className="max-w-2xl mx-auto">
          <CurtainReveal>
            <div
              className="relative p-12 md:p-16 text-center"
              style={{
                background: `linear-gradient(135deg, #14100200 0%, #1C160A 50%, #14100200 100%)`,
                border: `1px solid ${GOLD}30`,
              }}
            >
              <MughalArch className="absolute top-0 left-1/2 -translate-x-1/2 w-48 opacity-20 pointer-events-none" />

              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: `${GOLD}60`, fontFamily: "'Montserrat', sans-serif" }}>
                    Together with their families
                  </p>
                  <h2
                    className="text-4xl md:text-6xl mb-2"
                    style={{ fontFamily: "'Pinyon Script', cursive", color: "#F5F5F5" }}
                  >
                    {brideName}
                  </h2>
                  <div className="flex items-center justify-center gap-4 my-3">
                    <div className="h-px w-12" style={{ backgroundColor: `${GOLD}50` }} />
                    <span style={{ color: GOLD, fontSize: "0.75rem" }}>⚜️</span>
                    <div className="h-px w-12" style={{ backgroundColor: `${GOLD}50` }} />
                  </div>
                  <h2
                    className="text-4xl md:text-6xl"
                    style={{ fontFamily: "'Pinyon Script', cursive", color: "#F5F5F5" }}
                  >
                    {groomName}
                  </h2>
                </div>

                <div className="space-y-3" style={{ borderTop: `1px solid ${GOLD}20`, paddingTop: "2rem" }}>
                  <p className="text-xs uppercase tracking-[0.4em]" style={{ color: `${GOLD}60` }}>
                    Request the honour of your presence
                  </p>
                  {invitation.events?.map((event: any, i: number) => (
                    <div key={i} className="py-3" style={{ borderTop: i > 0 ? `1px solid ${GOLD}15` : "none" }}>
                      <p className="text-sm font-medium mb-1" style={{ color: GOLD, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                        {event.name}
                      </p>
                      <p className="text-xs tracking-widest" style={{ color: "#F5F5F580" }}>
                        {event.date} {event.time && `· ${event.time}`}
                      </p>
                      {event.venue && (
                        <p className="text-xs mt-0.5" style={{ color: "#F5F5F550" }}>{event.venue}</p>
                      )}
                    </div>
                  ))}
                </div>

                {invitation.family_details?.blessingQuote && (
                  <blockquote
                    className="text-sm italic leading-relaxed"
                    style={{ color: "#F5F5F560", fontFamily: "'Cormorant Garamond', serif", borderLeft: `2px solid ${GOLD}30`, paddingLeft: "1rem", textAlign: "left" }}
                  >
                    "{invitation.family_details.blessingQuote}"
                  </blockquote>
                )}

                <div className="pt-2">
                  <div className="h-px w-full mb-4" style={{ backgroundColor: `${GOLD}20` }} />
                  <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${GOLD}40` }}>
                    The Royal Noor · Veloria
                  </p>
                </div>
              </div>
            </div>
          </CurtainReveal>
        </div>
      </section>

      {/* ── PHOTO GALLERY ── */}
      {photos.length > 0 && (
        <section className="py-20 overflow-hidden relative" style={{ backgroundColor: "#050503" }}>
          <CurtainReveal>
            <div className="text-center mb-12 px-6">
              <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: `${GOLD}60` }}>Captured Moments</p>
              <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>
                Our Story in Frames
              </h2>
            </div>
          </CurtainReveal>

          <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-none">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="shrink-0 snap-center rounded-none overflow-hidden relative group"
                style={{ width: 260, height: 380, border: `1px solid ${GOLD}20` }}
              >
                <img src={photo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${ONYX}80 0%, transparent 60%)` }} />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="h-px w-8 mb-2" style={{ backgroundColor: GOLD }} />
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: `${GOLD}80` }}>
                    {brideName} & {groomName}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── EVENTS / ITINERARY ── */}
      {invitation.events && invitation.events.length > 0 && (
        <section className="py-28 px-6" style={{ background: `linear-gradient(180deg, ${ONYX} 0%, #0A0800 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <CurtainReveal>
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${GOLD}60` }}>Chapter Two</p>
                <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>
                  The Itinerary
                </h2>
                <GoldDivider />
              </div>
            </CurtainReveal>

            <div className="space-y-6">
              {invitation.events.map((event: any, i: number) => {
                const eventEmojis: Record<string, string> = { mehndi: "🌿", sangeet: "💃", haldi: "☀️", wedding: "💍", reception: "🥂", engagement: "💜" };
                const emoji = eventEmojis[event.type?.toLowerCase()] || "✨";
                return (
                  <CurtainReveal key={i} delay={i * 0.08}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="relative overflow-hidden"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        backdropFilter: "blur(20px)",
                        border: `1px solid ${GOLD}25`,
                        padding: "2rem",
                      }}
                    >
                      <div className="absolute top-0 left-0 w-1 h-full" style={{ background: `linear-gradient(to bottom, ${GOLD}, ${GARNET})` }} />
                      <div className="absolute top-4 right-4 text-2xl opacity-30">{emoji}</div>

                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="shrink-0 text-center md:w-20">
                          <div className="text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}>
                            {event.date ? format(new Date(event.date), "d") : "—"}
                          </div>
                          <div className="text-xs uppercase tracking-wider" style={{ color: `${GOLD}60` }}>
                            {event.date ? format(new Date(event.date), "MMM") : ""}
                          </div>
                        </div>

                        <div className="flex-1 space-y-3 pl-0 md:pl-4" style={{ borderLeft: `1px solid ${GOLD}20` }}>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] mb-1" style={{ color: `${GOLD}60` }}>{event.type}</p>
                            <h3 className="text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>
                              {event.name}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs" style={{ color: "#F5F5F560" }}>
                            {event.time && (
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3" style={{ color: GOLD }} />
                                <span className="tracking-wider">{event.time}</span>
                              </div>
                            )}
                            {event.venue && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" style={{ color: GOLD }} />
                                <span>{event.venue}</span>
                              </div>
                            )}
                          </div>
                          {event.address && (
                            <p className="text-xs" style={{ color: "#F5F5F540" }}>{event.address}</p>
                          )}
                          {event.venue && (
                            <a
                              href={`https://www.google.com/maps/search/${encodeURIComponent(event.venue)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs transition-all hover:opacity-80"
                              style={{ color: GOLD, textDecoration: "underline", textUnderlineOffset: "3px" }}
                            >
                              <MapPin className="w-3 h-3" />
                              View on Map
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </CurtainReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAMILY BLESSINGS ── */}
      {invitation.family_details && (invitation.family_details.brideParents?.[0] || invitation.family_details.groomParents?.[0]) && (
        <section className="py-28 px-6" style={{ backgroundColor: "#050503" }}>
          <div className="max-w-3xl mx-auto">
            <CurtainReveal>
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${GOLD}60` }}>With the Blessings of</p>
                <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>
                  Our Families
                </h2>
                <GoldDivider />
              </div>
            </CurtainReveal>

            {invitation.family_details.blessingQuote && (
              <CurtainReveal>
                <blockquote
                  className="text-center text-xl md:text-2xl italic mb-16 leading-relaxed"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: `${GOLD}80` }}
                >
                  "{invitation.family_details.blessingQuote}"
                </blockquote>
              </CurtainReveal>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {(invitation.family_details.brideParents?.[0] || invitation.family_details.brideParents?.[1]) && (
                <CurtainReveal>
                  <div className="p-8 space-y-4" style={{ border: `1px solid ${GOLD}20` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1" style={{ backgroundColor: `${GOLD}20` }} />
                      <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${GOLD}60` }}>Bride's Family</p>
                      <div className="h-px flex-1" style={{ backgroundColor: `${GOLD}20` }} />
                    </div>
                    {invitation.family_details.brideParents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-center text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5CC" }}>{name}</p>
                    ))}
                    {invitation.family_details.brideGrandparents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-center text-sm italic" style={{ color: "#F5F5F540" }}>{name}</p>
                    ))}
                  </div>
                </CurtainReveal>
              )}
              {(invitation.family_details.groomParents?.[0] || invitation.family_details.groomParents?.[1]) && (
                <CurtainReveal>
                  <div className="p-8 space-y-4" style={{ border: `1px solid ${GOLD}20` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1" style={{ backgroundColor: `${GOLD}20` }} />
                      <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${GOLD}60` }}>Groom's Family</p>
                      <div className="h-px flex-1" style={{ backgroundColor: `${GOLD}20` }} />
                    </div>
                    {invitation.family_details.groomParents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-center text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5CC" }}>{name}</p>
                    ))}
                    {invitation.family_details.groomGrandparents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-center text-sm italic" style={{ color: "#F5F5F540" }}>{name}</p>
                    ))}
                  </div>
                </CurtainReveal>
              )}
            </div>

            {invitation.family_details.familyMessage && (
              <CurtainReveal>
                <p className="text-center mt-12 leading-relaxed" style={{ color: "#F5F5F560", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem" }}>
                  {invitation.family_details.familyMessage}
                </p>
              </CurtainReveal>
            )}
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      {invitation.rsvp?.enabled !== false && (
        <section className="py-28 px-6" style={{ background: `linear-gradient(180deg, ${ONYX} 0%, #0A0800 100%)` }}>
          <div className="max-w-xl mx-auto">
            <CurtainReveal>
              <div className="text-center mb-16">
                <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${GOLD}60` }}>The Honour of a Reply</p>
                <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>
                  RSVP
                </h2>
                <GoldDivider />
              </div>
            </CurtainReveal>

            {rsvpSubmitted ? (
              <CurtainReveal>
                <div className="text-center py-12 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-5xl"
                  >
                    ⚜️
                  </motion.div>
                  <h3 className="text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>Your Presence is Sealed</h3>
                  <p className="text-sm" style={{ color: `${GOLD}70` }}>We look forward to celebrating with you.</p>
                </div>
              </CurtainReveal>
            ) : (
              <CurtainReveal>
                <div className="space-y-6">
                  {[
                    { label: "Your Full Name", key: "name", type: "text", placeholder: "Enter your name" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: `${GOLD}60` }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={rsvpForm[f.key as keyof typeof rsvpForm]}
                        onChange={e => setRsvpForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full bg-transparent px-4 py-3 text-sm outline-none focus:border-b-opacity-100 transition-all"
                        style={{ borderBottom: `1px solid ${GOLD}40`, color: "#F5F5F5", caretColor: GOLD }}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.4em] mb-3" style={{ color: `${GOLD}60` }}>Will you attend?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["yes", "no"].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setRsvpForm(p => ({ ...p, attending: opt }))}
                          className="py-3 text-xs uppercase tracking-widest transition-all"
                          style={{
                            border: `1px solid ${rsvpForm.attending === opt ? GOLD : `${GOLD}25`}`,
                            background: rsvpForm.attending === opt ? `${GOLD}15` : "transparent",
                            color: rsvpForm.attending === opt ? GOLD : "#F5F5F540",
                          }}
                        >
                          {opt === "yes" ? "Joyfully Accepts" : "Regretfully Declines"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: `${GOLD}60` }}>Meal Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Vegetarian", "Non-Veg", "Vegan"].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setRsvpForm(p => ({ ...p, meal: opt }))}
                          className="py-2 text-[10px] uppercase tracking-widest transition-all"
                          style={{
                            border: `1px solid ${rsvpForm.meal === opt ? GOLD : `${GOLD}20`}`,
                            background: rsvpForm.meal === opt ? `${GOLD}10` : "transparent",
                            color: rsvpForm.meal === opt ? GOLD : "#F5F5F530",
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: `${GOLD}60` }}>A Message (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Your blessing or note..."
                      value={rsvpForm.message}
                      onChange={e => setRsvpForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full bg-transparent px-0 py-3 text-sm outline-none resize-none"
                      style={{ borderBottom: `1px solid ${GOLD}30`, color: "#F5F5F5CC", caretColor: GOLD, fontFamily: "'Cormorant Garamond', serif" }}
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <WaxSealButton onClick={handleRsvp} disabled={!rsvpForm.name || !rsvpForm.attending}>
                      Seal My RSVP ⚜️
                    </WaxSealButton>
                  </div>
                </div>
              </CurtainReveal>
            )}
          </div>
        </section>
      )}

      {/* ── WISHES WALL ── */}
      <section className="py-28 px-6" style={{ backgroundColor: "#050503" }}>
        <div className="max-w-3xl mx-auto">
          <CurtainReveal>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${GOLD}60` }}>The Royal Court Speaks</p>
              <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5" }}>
                Blessings Wall
              </h2>
              <GoldDivider />
            </div>
          </CurtainReveal>

          <CurtainReveal>
            <form onSubmit={handleWishSubmit} className="space-y-5 mb-16">
              {[
                { key: "name", label: "Your Name", placeholder: "Enter your name" },
                { key: "relation", label: "Your Relation", placeholder: "Friend, Family, Colleague..." },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: `${GOLD}60` }}>{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={wishForm[f.key as keyof typeof wishForm]}
                    onChange={e => setWishForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-transparent py-2 text-sm outline-none"
                    style={{ borderBottom: `1px solid ${GOLD}30`, color: "#F5F5F5", caretColor: GOLD }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: `${GOLD}60` }}>Your Blessing</label>
                <textarea
                  rows={3}
                  placeholder="Share your heartfelt wishes..."
                  value={wishForm.message}
                  onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full bg-transparent py-2 text-sm outline-none resize-none"
                  style={{ borderBottom: `1px solid ${GOLD}30`, color: "#F5F5F5CC", caretColor: GOLD, fontFamily: "'Cormorant Garamond', serif" }}
                />
              </div>
              <div className="flex justify-center pt-2">
                <WaxSealButton onClick={() => {}} disabled={submittingWish || !wishForm.name || !wishForm.message}>
                  {submittingWish ? "Sealing..." : "Leave a Blessing"}
                </WaxSealButton>
              </div>
            </form>
          </CurtainReveal>

          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.map((wish, i) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6"
                  style={{ border: `1px solid ${GOLD}15` }}
                >
                  <p className="mb-3 leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#F5F5F5CC", fontSize: "1.05rem" }}>
                    "{wish.message}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1" style={{ backgroundColor: `${GOLD}15` }} />
                    <p className="text-[10px] uppercase tracking-widest" style={{ color: `${GOLD}50` }}>
                      {wish.guest_name} {wish.relation && `· ${wish.relation}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER / SHARE ── */}
      <section className="py-20 px-6 text-center relative overflow-hidden" style={{ backgroundColor: ONYX }}>
        <MughalArch className="absolute bottom-0 left-1/2 -translate-x-1/2 rotate-180 w-64 opacity-10 pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <p className="text-xs uppercase tracking-[0.5em]" style={{ color: `${GOLD}40` }}>Share This Invitation</p>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareWhatsApp}
              className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest"
              style={{ border: `1px solid ${GOLD}30`, color: GOLD }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyLink}
              className="flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest"
              style={{ border: `1px solid ${GOLD}30`, color: GOLD }}
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </motion.button>
          </div>
          <div className="pt-8">
            <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${GOLD}25` }}>
              Crafted with love by Veloria · The Royal Noor Series
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
