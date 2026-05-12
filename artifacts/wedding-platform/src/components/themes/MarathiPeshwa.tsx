import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const PURPLE = "#4A0E6B";
const GOLD = "#C9973A";
const IVORY = "#FAF5EC";
const LIGHT_PURPLE = "#8B3DBF";
const BG = "#1A0326";
const SILK = "#D4A8FF";

function PaithaniParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1, speed: Math.random() * 0.4 + 0.1,
      op: Math.random() * 0.4 + 0.1, drift: (Math.random() - 0.5) * 0.3,
      color: [GOLD, SILK, LIGHT_PURPLE][Math.floor(Math.random() * 3)],
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach(p => {
        p.y -= p.speed; p.x += p.drift;
        if (p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        const rgb = p.color === GOLD ? "201,151,58" : p.color === SILK ? "212,168,255" : "139,61,191";
        ctx.fillStyle = `rgba(${rgb},${p.op})`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function PaithaniPattern({ size = 240, opacity = 0.1 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} style={{ opacity }}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*Math.PI*2, a2 = ((i+0.5)/8)*Math.PI*2;
        const x1 = 120 + Math.cos(a)*90, y1 = 120 + Math.sin(a)*90;
        const x2 = 120 + Math.cos(a2)*55, y2 = 120 + Math.sin(a2)*55;
        return <g key={i}>
          <path d={`M 120 120 L ${x1} ${y1}`} stroke={GOLD} strokeWidth="0.8" />
          <circle cx={x1} cy={y1} r="6" fill={PURPLE} stroke={GOLD} strokeWidth="0.7" />
          <circle cx={x2} cy={y2} r="3" fill={GOLD} fillOpacity="0.6" />
        </g>;
      })}
      {[20,40,60,85].map(r => <circle key={r} cx="120" cy="120" r={r} fill="none" stroke={GOLD} strokeWidth="0.5" strokeDasharray={r > 60 ? "4 4" : "none"} />)}
      <circle cx="120" cy="120" r="8" fill={GOLD} fillOpacity="0.7" />
      <circle cx="120" cy="120" r="3" fill={PURPLE} />
    </svg>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${GOLD}50)` }} />
      <div className="flex gap-2 items-center">
        {[PURPLE, GOLD, SILK, GOLD, PURPLE].map((c, i) => (
          <div key={i} className={`rounded-full ${i === 2 ? "w-3 h-3" : "w-1.5 h-1.5"}`} style={{ backgroundColor: c, opacity: 0.75 }} />
        ))}
      </div>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${GOLD}50)` }} />
    </div>
  );
}

export default function MarathiPeshwaInvitation({ invitation }: { invitation: any }) {
  const { toast } = useToast();
  const [showEntrance, setShowEntrance] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({ name: "", phone: "", attending: "yes", meal: "vegetarian", message: "" });
  const [rsvpDone, setRsvpDone] = useState(false);
  const [wishForm, setWishForm] = useState({ name: "", relation: "", message: "" });
  const [wishes, setWishes] = useState<any[]>([]);
  const [submittingWish, setSubmittingWish] = useState(false);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  const bride = invitation?.bride_name || "The Bride";
  const groom = invitation?.groom_name || "The Groom";
  const events: any[] = invitation?.events || [];
  const mainEvent = events[0];
  const photos: string[] = [];
  const g = invitation?.family_details?.gallery || invitation?.gallery_photos;
  if (g?.couple?.length) photos.push(...g.couple.filter(Boolean));
  if (!photos.length) photos.push("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400", "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1400");

  useEffect(() => { const t = setTimeout(() => setShowEntrance(false), 3500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!invitation?.id) return;
    supabase.from("wishes").select("*").eq("invitation_id", invitation.id).order("created_at", { ascending: false }).then(({ data }) => { if (data) setWishes(data); });
  }, [invitation?.id]);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault(); if (!rsvpForm.name) return; setSubmittingRsvp(true);
    try {
      await supabase.from("guests").insert({ invitation_id: invitation.id, name: rsvpForm.name, phone: rsvpForm.phone, attending: rsvpForm.attending === "yes", meal_preference: rsvpForm.meal, message: rsvpForm.message });
      setRsvpDone(true); toast({ title: "खूप आभारी आहे 🪷", description: "Your presence will honour us." });
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault(); if (!wishForm.name || !wishForm.message) return; setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "Blessing sent 🪷" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSubmittingWish(false); }
  };

  const shareWhatsApp = () => {
    const text = `🪷 आपण आमंत्रित आहात! ${bride} & ${groom} यांच्या विवाह सोहळ्यात.\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: BG, fontFamily: "'Cormorant Garamond', serif", color: IVORY }}>
      <PaithaniParticles />
      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ background: `radial-gradient(ellipse at center, #4A0E6B 0%, ${BG} 70%)` }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="text-center px-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex justify-center mb-6">
                <PaithaniPattern size={120} opacity={0.9} />
              </motion.div>
              <p className="text-xs uppercase tracking-[0.5em] mb-2" style={{ color: `${GOLD}80` }}>Marathi Peshwa · Veloria</p>
              <p className="text-xl mb-4" style={{ color: SILK, fontStyle: "italic" }}>शुभ विवाह</p>
              <h1 className="text-5xl md:text-6xl italic mb-2 leading-none" style={{ fontWeight: 300 }}>{bride}</h1>
              <p className="text-2xl mb-2" style={{ color: GOLD }}>✧</p>
              <h1 className="text-5xl md:text-6xl italic leading-none" style={{ fontWeight: 300 }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-10 text-[10px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}50` }}>Tap to enter</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, #4A0E6B 0%, ${BG} 70%)` }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}>
            <PaithaniPattern size={520} opacity={0.07} />
          </motion.div>
        </div>
        <div className="relative z-10 text-center px-6 py-24">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: `${GOLD}70` }}>
            Marathi Peshwa Wedding
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7rem] italic leading-none mb-3" style={{ fontWeight: 300, textShadow: `0 0 80px ${SILK}30` }}>
            {bride}
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex items-center justify-center gap-6 my-5">
            <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(to right, transparent, ${GOLD}70)` }} />
            <span style={{ color: GOLD }}>✧</span>
            <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(to left, transparent, ${GOLD}70)` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7rem] italic leading-none mb-8" style={{ fontWeight: 300, textShadow: `0 0 80px ${SILK}30` }}>
            {groom}
          </motion.h1>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex flex-col items-center gap-3">
              <div className="px-6 py-2 text-sm tracking-[0.3em] uppercase" style={{ border: `1px solid ${GOLD}50`, color: GOLD, background: `${GOLD}10` }}>
                {format(new Date(mainEvent.date), "MMMM d, yyyy")}
              </div>
              {mainEvent.venue && <p className="text-sm tracking-widest" style={{ color: `${IVORY}80` }}>{mainEvent.venue}</p>}
            </motion.div>
          )}
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-2" style={{ color: `${GOLD}40` }}>
          <span className="text-[9px] tracking-[0.4em] uppercase">Discover</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* EVENTS */}
      {events.length > 0 && (
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2D0F45 50%, ${BG} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Vivah Sohala</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Events</h2>
                <Divider />
              </div>
            </FadeUp>
            <div className="space-y-5">
              {events.map((ev: any, i: number) => (
                <FadeUp key={ev.id || i} delay={i * 0.1}>
                  <div className="p-6 flex gap-5 items-start" style={{ background: `linear-gradient(135deg, #2D0F45 80%, ${BG})`, border: `1px solid ${SILK}30` }}>
                    <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40`, color: GOLD }}>✧</div>
                    <div>
                      <p className="text-lg italic mb-2" style={{ color: IVORY }}>{ev.name}</p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: `${IVORY}70` }}>
                        {ev.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" style={{ color: GOLD }} />{format(new Date(ev.date), "MMM d, yyyy")}</span>}
                        {ev.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" style={{ color: GOLD }} />{ev.time}</span>}
                        {ev.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: GOLD }} />{ev.venue}</span>}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP */}
      {invitation?.rsvp_config?.enabled !== false && (
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2D0F45 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Join the Celebration</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>RSVP</h2>
                <Divider />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-12" style={{ border: `1px solid ${GOLD}40`, background: `${GOLD}08` }}>
                  <p className="text-4xl mb-4">🪷</p>
                  <h3 className="text-3xl italic mb-3">Khup Aabhari Ahe</h3>
                  <p style={{ color: `${IVORY}70` }}>We eagerly await your presence.</p>
                </div>
              </FadeUp>
            ) : (
              <FadeUp delay={0.1}>
                <form onSubmit={handleRsvp} className="space-y-5">
                  {[{ ph: "Your full name *", val: rsvpForm.name, k: "name", t: "text" }, { ph: "WhatsApp number", val: rsvpForm.phone, k: "phone", t: "tel" }].map(f => (
                    <input key={f.k} type={f.t} value={f.val} onChange={e => setRsvpForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                      className="w-full bg-transparent px-0 py-3 text-base outline-none placeholder:italic"
                      style={{ borderBottom: `1px solid ${SILK}40`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                  ))}
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))} className="flex-1 py-3 text-sm uppercase tracking-widest transition-all"
                        style={{ border: `1px solid ${SILK}40`, background: rsvpForm.attending === v ? PURPLE : "transparent", color: rsvpForm.attending === v ? IVORY : SILK }}>
                        {v === "yes" ? "✓ Attending" : "✗ Regrets"}
                      </button>
                    ))}
                  </div>
                  <motion.button type="submit" disabled={submittingRsvp} whileTap={{ scale: 0.98 }} className="w-full py-4 text-sm uppercase tracking-[0.3em]"
                    style={{ background: `linear-gradient(135deg, ${PURPLE}80, ${LIGHT_PURPLE}20)`, border: `1px solid ${GOLD}50`, color: GOLD }}>
                    {submittingRsvp ? "Sending..." : "✧ Confirm Attendance ✧"}
                  </motion.button>
                </form>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* WISHES */}
      <section className="py-20 px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Ashirwad</p>
              <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Wishes Wall</h2>
              <Divider />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-4 mb-12 p-8" style={{ border: `1px solid ${SILK}25`, background: `${SILK}06` }}>
              <div className="grid grid-cols-2 gap-4">
                {[{ ph: "Your name *", val: wishForm.name, k: "name" }, { ph: "Relation", val: wishForm.relation, k: "relation" }].map(f => (
                  <input key={f.k} value={f.val} onChange={e => setWishForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    className="bg-transparent py-2 text-base outline-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${SILK}35`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                ))}
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Your blessing *" rows={3}
                className="w-full bg-transparent py-2 outline-none resize-none placeholder:italic"
                style={{ borderBottom: `1px solid ${SILK}35`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
              <motion.button type="submit" disabled={submittingWish} whileTap={{ scale: 0.98 }} className="w-full py-3 text-sm uppercase tracking-widest"
                style={{ border: `1px solid ${SILK}40`, color: SILK }}>
                {submittingWish ? "Sending..." : "Send Blessing ✧"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-6" style={{ border: `1px solid ${SILK}20`, background: `${SILK}06` }}>
                    <p className="text-lg italic mb-3 leading-relaxed" style={{ color: `${IVORY}90` }}>"{w.message}"</p>
                    <p className="text-sm" style={{ color: GOLD }}>{w.guest_name}{w.relation ? ` · ${w.relation}` : ""}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, ${BG}, #0A0115)` }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="inline-block mb-6">
          <PaithaniPattern size={60} opacity={0.6} />
        </motion.div>
        <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${GOLD}60` }}>Marathi Peshwa · Veloria</p>
        <h3 className="text-2xl italic mb-6" style={{ fontWeight: 300 }}>{bride} & {groom}</h3>
        <div className="flex justify-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareWhatsApp} className="px-6 py-3 text-xs uppercase tracking-wider"
            style={{ border: `1px solid ${SILK}50`, color: SILK, background: `${SILK}10` }}>
            Share via WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied!" }); }}
            className="px-6 py-3 text-xs uppercase tracking-wider" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>
            Copy Link
          </motion.button>
        </div>
        <p className="text-[10px] mt-10" style={{ color: `${IVORY}25` }}>Made with love on Veloria</p>
      </footer>
    </div>
  );
}
