import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Share2, ChevronDown, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const MAROON = "#5C1020";
const ROSE = "#C87B6A";
const PINK = "#E8A0A8";
const GOLD = "#D4A83A";
const CREAM = "#FBF5ED";
const BG = "#1A0A0D";

function PhulkariParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const dots = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1, op: Math.random() * 0.5 + 0.1, opDir: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.008 + 0.004,
      color: Math.random() > 0.5 ? GOLD : Math.random() > 0.5 ? ROSE : PINK,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      dots.forEach(d => {
        ctx.beginPath(); ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        const r = d.color === GOLD ? 212 : d.color === ROSE ? 200 : 232;
        const g = d.color === GOLD ? 168 : d.color === ROSE ? 123 : 160;
        const b = d.color === GOLD ? 58 : d.color === ROSE ? 106 : 168;
        ctx.fillStyle = `rgba(${r},${g},${b},${d.op})`; ctx.fill();
        d.op += d.opDir * d.speed;
        if (d.op >= 0.65 || d.op <= 0.05) d.opDir *= -1;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function KhandaSymbol({ size = 80, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ opacity }}>
      <circle cx="50" cy="50" r="40" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={GOLD} strokeWidth="0.6" />
      <line x1="50" y1="15" x2="50" y2="85" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="30" x2="80" y2="70" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="80" y1="30" x2="20" y2="70" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="50" cy="50" r="5" fill={GOLD} />
    </svg>
  );
}

function PhulkariDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px flex-1 max-w-20" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
      <div className="flex gap-1">
        {[ROSE, GOLD, PINK, GOLD, ROSE].map((c, i) => (
          <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c, opacity: 0.7 }} />
        ))}
      </div>
      <div className="h-px flex-1 max-w-20" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
    </div>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function RoseAnandInvitation({ invitation }: { invitation: any }) {
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
  if (invitation?.bride_photo_url) photos.push(invitation.bride_photo_url);
  if (invitation?.groom_photo_url) photos.push(invitation.groom_photo_url);
  if (!photos.length) photos.push("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400", "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1400");

  useEffect(() => { const t = setTimeout(() => setShowEntrance(false), 3500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!invitation?.id) return;
    supabase.from("wishes").select("*").eq("invitation_id", invitation.id).order("created_at", { ascending: false }).then(({ data }) => { if (data) setWishes(data); });
  }, [invitation?.id]);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name) return;
    setSubmittingRsvp(true);
    try {
      await supabase.from("guests").insert({ invitation_id: invitation.id, name: rsvpForm.name, phone: rsvpForm.phone, attending: rsvpForm.attending === "yes", meal_preference: rsvpForm.meal, message: rsvpForm.message });
      setRsvpDone(true);
      toast({ title: "Waheguru Ji Ka Khalsa 🌸", description: "RSVP received with blessings." });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;
    setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "Blessing sent 🌸" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingWish(false); }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: BG, fontFamily: "'Cormorant Garamond', serif", color: CREAM }}>
      <PhulkariParticles />

      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ background: `radial-gradient(ellipse at center, ${MAROON}90 0%, ${BG} 70%)` }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="text-center px-8">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex justify-center mb-6">
                <KhandaSymbol size={100} opacity={0.8} />
              </motion.div>
              <p className="text-sm tracking-[0.4em] uppercase mb-4" style={{ color: `${GOLD}80`, fontFamily: "'Cinzel', serif" }}>ੴ Ik Onkar</p>
              <p className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: `${GOLD}60` }}>Rosé Anand · Veloria</p>
              <h1 className="text-5xl md:text-6xl italic mb-2 leading-none" style={{ fontWeight: 300 }}>{bride}</h1>
              <p className="text-xl mb-2" style={{ color: GOLD }}>✿</p>
              <h1 className="text-5xl md:text-6xl italic leading-none" style={{ fontWeight: 300 }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-10 text-[10px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}50` }}>Tap to enter</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 30%, ${MAROON}70 0%, ${BG} 65%)` }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <svg viewBox="0 0 600 600" className="w-full max-w-2xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i} transform={`translate(300,300) rotate(${i * 45})`}>
                <ellipse cx="0" cy="-200" rx="30" ry="80" fill={ROSE} fillOpacity="0.6" />
                <ellipse cx="0" cy="-130" rx="15" ry="40" fill={GOLD} fillOpacity="0.4" />
              </g>
            ))}
          </svg>
        </div>
        <div className="relative z-10 text-center px-6 py-24">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="flex justify-center mb-6">
            <KhandaSymbol size={70} opacity={0.6} />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="text-sm tracking-[0.3em] mb-2" style={{ color: GOLD, fontFamily: "'Cinzel', serif" }}>
            ੴ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="text-[10px] uppercase tracking-[0.5em] mb-8" style={{ color: `${GOLD}60` }}>
            Anand Karaj · A Sacred Union
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7rem] italic leading-none mb-3" style={{ fontWeight: 300, textShadow: `0 0 60px ${ROSE}30` }}>
            {bride}
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex items-center justify-center gap-6 my-5">
            <div className="h-px w-16 md:w-24" style={{ background: `linear-gradient(to right, transparent, ${ROSE}70)` }} />
            <span className="text-xl" style={{ color: ROSE }}>✿</span>
            <div className="h-px w-16 md:w-24" style={{ background: `linear-gradient(to left, transparent, ${ROSE}70)` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7rem] italic leading-none mb-8" style={{ fontWeight: 300, textShadow: `0 0 60px ${ROSE}30` }}>
            {groom}
          </motion.h1>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex flex-col items-center gap-2">
              <div className="px-6 py-2 text-sm tracking-[0.25em] uppercase" style={{ border: `1px solid ${ROSE}60`, color: ROSE, background: `${ROSE}12` }}>
                {format(new Date(mainEvent.date), "MMMM d, yyyy")}
              </div>
              {mainEvent.venue && <p className="text-sm tracking-wider mt-1" style={{ color: `${CREAM}70` }}>{mainEvent.venue}</p>}
            </motion.div>
          )}
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-2" style={{ color: `${GOLD}40` }}>
          <span className="text-[9px] tracking-[0.5em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ARDAS / BLESSING */}
      {invitation?.family_details?.blessingQuote && (
        <section className="py-20 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2A0C14 50%, ${BG} 100%)` }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <div className="py-12 px-8" style={{ borderTop: `1px solid ${ROSE}40`, borderBottom: `1px solid ${ROSE}40` }}>
                <KhandaSymbol size={40} opacity={0.4} />
                <p className="text-xs uppercase tracking-[0.5em] mt-4 mb-6" style={{ color: `${GOLD}60` }}>Ardas · Family Blessings</p>
                <p className="text-xl md:text-2xl italic leading-relaxed" style={{ color: CREAM }}>"{invitation.family_details.blessingQuote}"</p>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* FAMILY */}
      {(invitation?.family_details?.brideParents?.some(Boolean) || invitation?.family_details?.groomParents?.some(Boolean)) && (
        <section className="py-20 px-6" style={{ backgroundColor: BG }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Our Families</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Together as One</h2>
                <PhulkariDivider />
              </div>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-6">
              {invitation.family_details.brideParents?.some(Boolean) && (
                <FadeUp delay={0.1}>
                  <div className="p-8 text-center" style={{ border: `1px solid ${ROSE}30`, background: `${ROSE}08` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: ROSE }}>Bride's Family</p>
                    {invitation.family_details.brideParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${CREAM}90` }}>{n}</p>
                    ))}
                  </div>
                </FadeUp>
              )}
              {invitation.family_details.groomParents?.some(Boolean) && (
                <FadeUp delay={0.2}>
                  <div className="p-8 text-center" style={{ border: `1px solid ${ROSE}30`, background: `${ROSE}08` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: ROSE }}>Groom's Family</p>
                    {invitation.family_details.groomParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${CREAM}90` }}>{n}</p>
                    ))}
                  </div>
                </FadeUp>
              )}
            </div>
          </div>
        </section>
      )}

      {/* EVENTS */}
      {events.length > 0 && (
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2A0C14 50%, ${BG} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>The Celebrations</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Events</h2>
                <PhulkariDivider />
              </div>
            </FadeUp>
            <div className="space-y-5">
              {events.map((ev: any, i: number) => (
                <FadeUp key={ev.id || i} delay={i * 0.1}>
                  <motion.div whileHover={{ x: 6 }} className="p-6 flex gap-5 items-start" style={{ background: `linear-gradient(135deg, ${MAROON}60, ${BG}90)`, border: `1px solid ${ROSE}30` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg" style={{ background: `${ROSE}20`, border: `1px solid ${ROSE}40`, color: ROSE }}>
                      ✿
                    </div>
                    <div>
                      <p className="text-lg italic mb-2" style={{ color: CREAM }}>{ev.name}</p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: `${CREAM}70` }}>
                        {ev.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" style={{ color: GOLD }} />{format(new Date(ev.date), "MMM d, yyyy")}</span>}
                        {ev.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" style={{ color: GOLD }} />{ev.time}</span>}
                        {ev.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: GOLD }} />{ev.venue}</span>}
                      </div>
                    </div>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PHOTOS */}
      {photos.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: BG }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Memories</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Gallery</h2>
                <PhulkariDivider />
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <motion.div whileHover={{ scale: 1.03 }} className="aspect-square overflow-hidden" style={{ border: `2px solid ${ROSE}40`, boxShadow: `0 4px 20px ${ROSE}15` }}>
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP */}
      {invitation?.rsvp_config?.enabled !== false && (
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2A0C14 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Join Us</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>RSVP</h2>
                <PhulkariDivider />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-12" style={{ border: `1px solid ${ROSE}40`, background: `${ROSE}08` }}>
                  <KhandaSymbol size={50} opacity={0.5} />
                  <h3 className="text-3xl italic mt-4 mb-3">Waheguru Ji Ka Khalsa</h3>
                  <p style={{ color: `${CREAM}70` }}>Your RSVP is received with joy and love.</p>
                </div>
              </FadeUp>
            ) : (
              <FadeUp delay={0.1}>
                <form onSubmit={handleRsvp} className="space-y-5">
                  {[
                    { ph: "Your full name *", val: rsvpForm.name, k: "name", t: "text" },
                    { ph: "WhatsApp number", val: rsvpForm.phone, k: "phone", t: "tel" },
                  ].map(f => (
                    <input key={f.k} type={f.t} value={f.val} onChange={e => setRsvpForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                      className="w-full bg-transparent px-0 py-3 text-base outline-none placeholder:italic"
                      style={{ borderBottom: `1px solid ${ROSE}50`, color: CREAM, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                  ))}
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))}
                        className="flex-1 py-3 text-sm uppercase tracking-widest transition-all"
                        style={{ border: `1px solid ${ROSE}50`, background: rsvpForm.attending === v ? ROSE : "transparent", color: rsvpForm.attending === v ? CREAM : ROSE }}>
                        {v === "yes" ? "✓ Attending" : "✗ Regrets"}
                      </button>
                    ))}
                  </div>
                  <select value={rsvpForm.meal} onChange={e => setRsvpForm(p => ({ ...p, meal: e.target.value }))} className="w-full bg-transparent py-3 outline-none"
                    style={{ borderBottom: `1px solid ${ROSE}50`, color: `${CREAM}90`, fontFamily: "'Cormorant Garamond', serif" }}>
                    <option value="vegetarian" style={{ background: BG }}>Vegetarian</option>
                    <option value="non-vegetarian" style={{ background: BG }}>Non-Vegetarian</option>
                    <option value="jain" style={{ background: BG }}>Jain</option>
                  </select>
                  <textarea value={rsvpForm.message} onChange={e => setRsvpForm(p => ({ ...p, message: e.target.value }))} placeholder="A message for the couple (optional)" rows={2}
                    className="w-full bg-transparent px-0 py-3 text-base outline-none resize-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${ROSE}40`, color: CREAM, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                  <motion.button type="submit" disabled={submittingRsvp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 text-sm uppercase tracking-[0.3em]"
                    style={{ background: `linear-gradient(135deg, ${ROSE}30, ${MAROON}40)`, border: `1px solid ${ROSE}60`, color: ROSE }}>
                    {submittingRsvp ? "Sending..." : "✿ Confirm Attendance ✿"}
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
              <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Leave a Blessing</p>
              <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Wishes</h2>
              <PhulkariDivider />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-4 mb-12 p-8" style={{ border: `1px solid ${ROSE}25`, background: `${ROSE}06` }}>
              <div className="grid grid-cols-2 gap-4">
                {[{ ph: "Your name *", val: wishForm.name, k: "name" }, { ph: "Relation", val: wishForm.relation, k: "relation" }].map(f => (
                  <input key={f.k} value={f.val} onChange={e => setWishForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    className="bg-transparent py-2 text-base outline-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${ROSE}35`, color: CREAM, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                ))}
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your blessing *" rows={3}
                className="w-full bg-transparent py-2 outline-none resize-none placeholder:italic"
                style={{ borderBottom: `1px solid ${ROSE}35`, color: CREAM, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
              <motion.button type="submit" disabled={submittingWish} whileTap={{ scale: 0.98 }} className="w-full py-3 text-sm uppercase tracking-widest"
                style={{ border: `1px solid ${ROSE}40`, color: ROSE, background: "transparent" }}>
                {submittingWish ? "Sending..." : "Send Blessing ✿"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-6" style={{ border: `1px solid ${ROSE}20`, background: `${ROSE}05` }}>
                    <p className="text-lg italic mb-3 leading-relaxed" style={{ color: `${CREAM}90` }}>"{w.message}"</p>
                    <p className="text-sm" style={{ color: ROSE }}>{w.guest_name}{w.relation ? ` · ${w.relation}` : ""}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, ${BG}, #0A0305)` }}>
        <KhandaSymbol size={60} opacity={0.35} />
        <h2 className="text-5xl italic mt-4 mb-2" style={{ fontWeight: 300 }}>{bride} ✿ {groom}</h2>
        {mainEvent?.date && <p className="text-sm tracking-[0.3em] uppercase mb-8" style={{ color: `${GOLD}60` }}>{format(new Date(mainEvent.date), "MMMM d, yyyy")}</p>}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { const t = `You're invited to ${bride} & ${groom}'s Anand Karaj ✿\n${window.location.href}`; window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank"); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest" style={{ border: `1px solid ${ROSE}40`, color: ROSE }}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied ✿" }); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${CREAM}25` }}>Created with Veloria</p>
      </footer>
    </div>
  );
}
