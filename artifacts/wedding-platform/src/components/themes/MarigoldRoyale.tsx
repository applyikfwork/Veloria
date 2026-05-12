import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar, MapPin, Clock, Share2, ChevronDown, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const CRIMSON = "#3D0A14";
const GOLD = "#C9973A";
const SAFFRON = "#E8841A";
const IVORY = "#FAF5EC";
const VELVET = "#1C0509";

function PetalRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const petals = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight - window.innerHeight,
      size: Math.random() * 14 + 6, rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.0 + 0.4, vx: (Math.random() - 0.5) * 0.9,
      op: Math.random() * 0.45 + 0.2,
      isGold: Math.random() > 0.6,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      petals.forEach(p => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size / 2.5, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold ? `rgba(201,151,58,${p.op})` : `rgba(232,132,26,${p.op})`;
        ctx.fill(); ctx.restore();
        p.y += p.vy; p.x += p.vx; p.rot += p.rotSpeed;
        if (p.y > window.innerHeight + 30) { p.y = -30; p.x = Math.random() * window.innerWidth; }
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function Mandala({ size = 300, opacity = 0.12 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 300 300" width={size} height={size} style={{ opacity }}>
      {[1,2,3,4,5,6].map(r => (
        <circle key={r} cx="150" cy="150" r={r * 22} fill="none" stroke={GOLD} strokeWidth="0.6" />
      ))}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <line key={i} x1="150" y1="150" x2={150 + Math.cos(a) * 132} y2={150 + Math.sin(a) * 132} stroke={GOLD} strokeWidth="0.4" />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <ellipse key={i} cx={150 + Math.cos(a) * 88} cy={150 + Math.sin(a) * 88} rx="8" ry="14" fill="none" stroke={GOLD} strokeWidth="0.7" transform={`rotate(${(i / 8) * 360 + 90},${150 + Math.cos(a) * 88},${150 + Math.sin(a) * 88})`} />;
      })}
      <circle cx="150" cy="150" r="6" fill={GOLD} fillOpacity="0.5" />
      <circle cx="150" cy="150" r="3" fill={GOLD} fillOpacity="0.8" />
    </svg>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px flex-1 max-w-20" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
      <div className="flex gap-1.5 items-center">
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }} />
        <div className="text-sm" style={{ color: GOLD }}>✿</div>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: GOLD }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: GOLD }} />
      </div>
      <div className="h-px flex-1 max-w-20" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
    </div>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function MarigoldRoyaleInvitation({ invitation }: { invitation: any }) {
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
      toast({ title: "✿ RSVP Received", description: "Your presence is our blessing." });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;
    setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "Blessing received ✿" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingWish(false); }
  };

  const shareWhatsApp = () => {
    const text = `You are lovingly invited to the wedding of ${bride} & ${groom} 🌸\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: VELVET, fontFamily: "'Cormorant Garamond', serif", color: IVORY }}>
      <PetalRain />

      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ background: `radial-gradient(ellipse at center, ${CRIMSON} 0%, ${VELVET} 70%)` }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="text-center px-8">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex justify-center mb-6">
                <Mandala size={160} opacity={0.7} />
              </motion.div>
              <p className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: `${GOLD}90` }}>Veloria Presents</p>
              <h1 className="text-5xl md:text-7xl italic mb-2 leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{bride}</h1>
              <p className="text-2xl mb-2" style={{ color: GOLD }}>✿</p>
              <h1 className="text-5xl md:text-7xl italic leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="mt-10 text-[10px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}50` }}>Tap to enter</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 30%, ${CRIMSON} 0%, ${VELVET} 60%)` }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <Mandala size={500} opacity={1} />
        </div>
        <div className="relative z-10 text-center px-6 py-24">
          <motion.p initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }} transition={{ duration: 1.5, delay: 0.2 }} className="text-[10px] uppercase mb-10" style={{ color: `${GOLD}70` }}>
            Marigold Royale · Veloria
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="text-6xl md:text-[7rem] italic leading-none mb-3" style={{ fontWeight: 300, textShadow: `0 0 80px ${GOLD}25` }}>
            {bride}
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex items-center justify-center gap-6 my-5">
            <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(to right, transparent, ${GOLD}70)` }} />
            <span className="text-xl" style={{ color: GOLD }}>✿</span>
            <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(to left, transparent, ${GOLD}70)` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="text-6xl md:text-[7rem] italic leading-none mb-8" style={{ fontWeight: 300, textShadow: `0 0 80px ${GOLD}25` }}>
            {groom}
          </motion.h1>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }} className="flex flex-col items-center gap-3">
              <div className="px-6 py-2 rounded-sm text-sm tracking-[0.3em] uppercase" style={{ border: `1px solid ${GOLD}50`, color: GOLD, background: `${GOLD}10` }}>
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

      {/* BLESSING VERSE */}
      {invitation?.family_details?.blessingQuote && (
        <section className="py-20 px-6" style={{ background: `linear-gradient(180deg, ${VELVET} 0%, #2A0810 50%, ${VELVET} 100%)` }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <div className="py-12 px-8" style={{ borderTop: `1px solid ${GOLD}40`, borderBottom: `1px solid ${GOLD}40` }}>
                <p className="text-xs uppercase tracking-[0.4em] mb-6" style={{ color: `${GOLD}60` }}>With Blessings From Both Families</p>
                <p className="text-2xl md:text-3xl italic leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", color: IVORY }}>
                  "{invitation.family_details.blessingQuote}"
                </p>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* FAMILY */}
      {(invitation?.family_details?.brideParents || invitation?.family_details?.groomParents) && (
        <section className="py-20 px-6" style={{ backgroundColor: VELVET }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Our Families</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>United in Love</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-8">
              {invitation.family_details.brideParents?.some(Boolean) && (
                <FadeUp delay={0.1}>
                  <div className="text-center p-8" style={{ border: `1px solid ${GOLD}25`, background: `${GOLD}06` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Bride's Family</p>
                    {invitation.family_details.brideParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${IVORY}90` }}>{n}</p>
                    ))}
                  </div>
                </FadeUp>
              )}
              {invitation.family_details.groomParents?.some(Boolean) && (
                <FadeUp delay={0.2}>
                  <div className="text-center p-8" style={{ border: `1px solid ${GOLD}25`, background: `${GOLD}06` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Groom's Family</p>
                    {invitation.family_details.groomParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${IVORY}90` }}>{n}</p>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${VELVET} 0%, ${CRIMSON}40 50%, ${VELVET} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>The Grand Celebration</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Ceremonies & Events</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block" style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}50, transparent)` }} />
              <div className="space-y-8">
                {events.map((ev: any, i: number) => (
                  <FadeUp key={ev.id || i} delay={i * 0.1}>
                    <div className={`md:flex md:gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                      <div className="md:w-1/2" />
                      <div className="hidden md:flex items-center justify-center w-8 shrink-0 relative z-10">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: GOLD, boxShadow: `0 0 12px ${GOLD}60` }} />
                      </div>
                      <div className="md:w-1/2">
                        <motion.div whileHover={{ scale: 1.02 }} className="p-6 rounded-sm" style={{ background: `linear-gradient(135deg, ${CRIMSON}80, ${VELVET}90)`, border: `1px solid ${GOLD}30` }}>
                          <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: GOLD }}>
                            {ev.name}
                          </p>
                          {ev.date && (
                            <div className="flex items-center gap-2 text-sm mb-1" style={{ color: `${IVORY}90` }}>
                              <Calendar className="w-3.5 h-3.5" style={{ color: GOLD }} />
                              <span>{format(new Date(ev.date), "EEEE, MMMM d, yyyy")}</span>
                            </div>
                          )}
                          {ev.time && (
                            <div className="flex items-center gap-2 text-sm mb-1" style={{ color: `${IVORY}70` }}>
                              <Clock className="w-3.5 h-3.5" style={{ color: GOLD }} />
                              <span>{ev.time}</span>
                            </div>
                          )}
                          {ev.venue && (
                            <div className="flex items-center gap-2 text-sm" style={{ color: `${IVORY}70` }}>
                              <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} />
                              <span>{ev.venue}{ev.address ? `, ${ev.address}` : ""}</span>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PHOTO GALLERY */}
      {photos.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: VELVET }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Moments</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Our Gallery</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((photo, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <motion.div whileHover={{ scale: 1.03 }} className="aspect-square overflow-hidden" style={{ border: `1px solid ${GOLD}30` }}>
                    <img src={photo} alt="" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP */}
      {invitation?.rsvp_config?.enabled !== false && (
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${VELVET} 0%, #2A0810 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Your Presence</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>RSVP</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-12" style={{ border: `1px solid ${GOLD}40`, background: `${GOLD}08` }}>
                  <p className="text-4xl mb-4">✿</p>
                  <h3 className="text-3xl italic mb-3">Gratitude</h3>
                  <p style={{ color: `${IVORY}70` }}>Your presence is our greatest blessing.</p>
                </div>
              </FadeUp>
            ) : (
              <FadeUp delay={0.1}>
                <form onSubmit={handleRsvp} className="space-y-5">
                  {[
                    { placeholder: "Your full name *", value: rsvpForm.name, key: "name", type: "text" },
                    { placeholder: "WhatsApp number", value: rsvpForm.phone, key: "phone", type: "tel" },
                  ].map(f => (
                    <input key={f.key} type={f.type} value={f.value} onChange={e => setRsvpForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                      className="w-full bg-transparent px-0 py-3 text-base outline-none placeholder:italic"
                      style={{ borderBottom: `1px solid ${GOLD}40`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                  ))}
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))}
                        className="flex-1 py-3 text-sm uppercase tracking-widest transition-all"
                        style={{ border: `1px solid ${GOLD}50`, background: rsvpForm.attending === v ? GOLD : "transparent", color: rsvpForm.attending === v ? VELVET : GOLD }}>
                        {v === "yes" ? "✓ Attending" : "✗ Regrets"}
                      </button>
                    ))}
                  </div>
                  <select value={rsvpForm.meal} onChange={e => setRsvpForm(p => ({ ...p, meal: e.target.value }))}
                    className="w-full bg-transparent py-3 text-base outline-none"
                    style={{ borderBottom: `1px solid ${GOLD}40`, color: `${IVORY}90`, fontFamily: "'Cormorant Garamond', serif" }}>
                    <option value="vegetarian" style={{ background: VELVET }}>Vegetarian</option>
                    <option value="non-vegetarian" style={{ background: VELVET }}>Non-Vegetarian</option>
                    <option value="jain" style={{ background: VELVET }}>Jain</option>
                    <option value="vegan" style={{ background: VELVET }}>Vegan</option>
                  </select>
                  <textarea value={rsvpForm.message} onChange={e => setRsvpForm(p => ({ ...p, message: e.target.value }))} placeholder="A message of love (optional)" rows={2}
                    className="w-full bg-transparent px-0 py-3 text-base outline-none resize-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${GOLD}40`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                  <motion.button type="submit" disabled={submittingRsvp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 text-sm uppercase tracking-[0.3em] font-medium transition-all"
                    style={{ background: `linear-gradient(135deg, ${GOLD}30, ${SAFFRON}20)`, border: `1px solid ${GOLD}60`, color: GOLD }}>
                    {submittingRsvp ? "Sending..." : "✿ Send My RSVP ✿"}
                  </motion.button>
                </form>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* WISHES */}
      <section className="py-20 px-6" style={{ backgroundColor: VELVET }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Leave a Blessing</p>
              <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Wishes Wall</h2>
              <GoldDivider />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-4 mb-12 p-8" style={{ border: `1px solid ${GOLD}25`, background: `${GOLD}05` }}>
              <div className="grid grid-cols-2 gap-4">
                <input value={wishForm.name} onChange={e => setWishForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name *"
                  className="bg-transparent py-2 text-base outline-none placeholder:italic"
                  style={{ borderBottom: `1px solid ${GOLD}30`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                <input value={wishForm.relation} onChange={e => setWishForm(p => ({ ...p, relation: e.target.value }))} placeholder="Your relation"
                  className="bg-transparent py-2 text-base outline-none placeholder:italic"
                  style={{ borderBottom: `1px solid ${GOLD}30`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your blessing for the couple *" rows={3}
                className="w-full bg-transparent py-2 text-base outline-none resize-none placeholder:italic"
                style={{ borderBottom: `1px solid ${GOLD}30`, color: IVORY, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
              <motion.button type="submit" disabled={submittingWish} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full py-3 text-sm uppercase tracking-[0.25em]"
                style={{ border: `1px solid ${GOLD}40`, color: GOLD, background: "transparent" }}>
                {submittingWish ? "Sending..." : "Send Blessing ✿"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-6" style={{ border: `1px solid ${GOLD}20`, background: `${GOLD}05` }}>
                    <p className="text-lg italic mb-4 leading-relaxed" style={{ color: `${IVORY}90` }}>"{w.message}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-px h-8" style={{ backgroundColor: `${GOLD}40` }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: GOLD }}>{w.guest_name}</p>
                        {w.relation && <p className="text-xs uppercase tracking-widest" style={{ color: `${IVORY}50` }}>{w.relation}</p>}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, ${VELVET}, #0A0003)` }}>
        <Mandala size={80} opacity={0.3} />
        <h2 className="text-5xl italic mt-4 mb-2" style={{ fontWeight: 300 }}>{bride} ✿ {groom}</h2>
        {mainEvent?.date && <p className="text-sm tracking-[0.3em] uppercase mb-8" style={{ color: `${GOLD}60` }}>{format(new Date(mainEvent.date), "MMMM d, yyyy")}</p>}
        <div className="flex justify-center gap-6 mb-8">
          <motion.button whileHover={{ scale: 1.05 }} onClick={shareWhatsApp} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied ✿" }); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${IVORY}30` }}>Created with Veloria · India's Finest Digital Invitations</p>
      </footer>
    </div>
  );
}
