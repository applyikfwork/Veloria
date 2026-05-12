import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Share2, ChevronDown, MessageCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const MIDNIGHT = "#07080F";
const GOLD = "#D4A843";
const SAND = "#E8CFA0";
const ROSE = "#C4716A";
const INDIGO = "#1A1535";

function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.3, op: Math.random(), opDir: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.015 + 0.005,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,230,200,${s.op})`; ctx.fill();
        s.op += s.opDir * s.speed;
        if (s.op >= 0.95 || s.op <= 0.05) s.opDir *= -1;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function FortSilhouette() {
  return (
    <svg viewBox="0 0 800 200" className="w-full" preserveAspectRatio="xMidYMax slice" style={{ fill: `${GOLD}30` }}>
      <path d="M0,200 L0,140 L20,140 L20,110 L30,110 L30,100 L40,100 L40,110 L50,110 L50,85 L60,85 L60,70 L70,70 L70,60 L80,60 L80,70 L90,70 L90,55 L100,55 L100,70 L110,70 L110,60 L120,60 L120,70 L130,70 L130,85 L140,85 L140,110 L150,110 L150,95 L165,80 L180,95 L180,110 L200,110 L200,90 L210,80 L225,70 L240,80 L250,90 L260,90 L260,75 L275,60 L290,50 L305,40 L320,50 L335,60 L350,75 L350,90 L360,90 L360,80 L375,70 L390,80 L390,90 L400,90 L400,75 L415,60 L430,50 L445,60 L460,75 L460,90 L470,90 L470,80 L485,70 L500,80 L510,90 L520,90 L520,95 L535,80 L550,95 L550,110 L560,110 L560,85 L570,70 L580,60 L590,55 L600,60 L610,70 L620,85 L620,110 L650,110 L650,85 L660,70 L670,60 L680,55 L690,60 L700,70 L710,85 L710,110 L720,110 L720,100 L730,100 L730,110 L740,110 L740,85 L750,85 L750,110 L760,110 L760,140 L780,140 L780,140 L800,140 L800,200 Z" />
    </svg>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px flex-1 max-w-20" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
      <Star className="w-3 h-3" style={{ color: GOLD, fill: GOLD }} />
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

export default function MidnightSaharaInvitation({ invitation }: { invitation: any }) {
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
      toast({ title: "✦ RSVP Received", description: "You'll be counted under desert stars." });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;
    setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "Blessing sent ✦" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingWish(false); }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: MIDNIGHT, fontFamily: "'Playfair Display', serif", color: SAND }}>
      <StarField />

      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ background: `radial-gradient(ellipse at 50% 30%, ${INDIGO} 0%, ${MIDNIGHT} 80%)` }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center px-8">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 4, repeat: Infinity }}>
                <div className="w-28 h-28 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ background: `radial-gradient(circle, #FFEEDD 0%, ${GOLD}40 40%, transparent 70%)`, boxShadow: `0 0 60px ${GOLD}40` }}>
                  <span className="text-4xl">✦</span>
                </div>
              </motion.div>
              <p className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: `${GOLD}80` }}>Midnight Sahara · Veloria</p>
              <h1 className="text-5xl md:text-7xl italic mb-2" style={{ fontStyle: "italic" }}>{bride}</h1>
              <p className="text-xl mb-2" style={{ color: GOLD }}>✦</p>
              <h1 className="text-5xl md:text-7xl italic" style={{ fontStyle: "italic" }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-10 text-[10px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}50` }}>Tap to enter</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 0%, ${INDIGO} 0%, ${MIDNIGHT} 70%)` }}>
        {/* Moon */}
        <motion.div animate={{ boxShadow: [`0 0 40px ${GOLD}30`, `0 0 80px ${GOLD}50`, `0 0 40px ${GOLD}30`] }} transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
          style={{ background: `radial-gradient(circle, #FFEEDD 0%, #E8CFA0 60%, ${GOLD}40 100%)` }} />
        <div className="absolute bottom-0 w-full opacity-50 pointer-events-none">
          <FortSilhouette />
        </div>
        <div className="relative z-10 text-center px-6 py-32">
          <motion.p initial={{ opacity: 0, letterSpacing: "0.1em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }} transition={{ duration: 1.5, delay: 0.3 }} className="text-[10px] uppercase mb-12" style={{ color: `${GOLD}70` }}>
            Under Desert Stars
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }} className="text-6xl md:text-8xl italic leading-none mb-3" style={{ color: "#F0EBE0", textShadow: `0 0 60px ${GOLD}20` }}>
            {bride}
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex items-center justify-center gap-6 my-5">
            <div className="h-px w-20" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
            <Star className="w-4 h-4" style={{ color: GOLD, fill: GOLD }} />
            <div className="h-px w-20" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.7 }} className="text-6xl md:text-8xl italic leading-none mb-8" style={{ color: "#F0EBE0", textShadow: `0 0 60px ${GOLD}20` }}>
            {groom}
          </motion.h1>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex flex-col items-center gap-2">
              <p className="text-sm tracking-[0.4em] uppercase" style={{ color: GOLD }}>{format(new Date(mainEvent.date), "MMMM d, yyyy")}</p>
              {mainEvent.venue && <p className="text-sm tracking-wider" style={{ color: `${SAND}70` }}>{mainEvent.venue}</p>}
            </motion.div>
          )}
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-32 flex flex-col items-center gap-2" style={{ color: `${GOLD}40` }}>
          <span className="text-[9px] tracking-[0.5em] uppercase">Discover</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* BLESSING */}
      {invitation?.family_details?.blessingQuote && (
        <section className="py-20 px-6" style={{ background: `linear-gradient(180deg, ${MIDNIGHT} 0%, ${INDIGO}80 50%, ${MIDNIGHT} 100%)` }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <div className="py-12 px-8 rounded-lg" style={{ border: `1px solid ${GOLD}25`, background: `${GOLD}05` }}>
                <Star className="w-5 h-5 mx-auto mb-6" style={{ color: GOLD, fill: GOLD }} />
                <p className="text-xl md:text-2xl italic leading-relaxed" style={{ color: SAND }}>"{invitation.family_details.blessingQuote}"</p>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* FAMILY */}
      {(invitation?.family_details?.brideParents?.some(Boolean) || invitation?.family_details?.groomParents?.some(Boolean)) && (
        <section className="py-20 px-6" style={{ backgroundColor: MIDNIGHT }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Our Families</p>
                <h2 className="text-4xl md:text-5xl italic">Under One Sky</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-6">
              {invitation.family_details.brideParents?.some(Boolean) && (
                <FadeUp delay={0.1}>
                  <div className="p-8 text-center rounded-lg" style={{ border: `1px solid ${GOLD}20`, background: `${INDIGO}50` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Bride's Family</p>
                    {invitation.family_details.brideParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${SAND}90` }}>{n}</p>
                    ))}
                  </div>
                </FadeUp>
              )}
              {invitation.family_details.groomParents?.some(Boolean) && (
                <FadeUp delay={0.2}>
                  <div className="p-8 text-center rounded-lg" style={{ border: `1px solid ${GOLD}20`, background: `${INDIGO}50` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Groom's Family</p>
                    {invitation.family_details.groomParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${SAND}90` }}>{n}</p>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${MIDNIGHT} 0%, ${INDIGO} 50%, ${MIDNIGHT} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>The Journey</p>
                <h2 className="text-4xl md:text-5xl italic">Ceremonies</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            <div className="space-y-6">
              {events.map((ev: any, i: number) => (
                <FadeUp key={ev.id || i} delay={i * 0.1}>
                  <motion.div whileHover={{ x: 6 }} className="p-6 rounded-lg flex gap-6 items-start" style={{ background: `linear-gradient(135deg, ${INDIGO}90, ${MIDNIGHT})`, border: `1px solid ${GOLD}25` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ border: `1px solid ${GOLD}40`, color: GOLD, fontSize: "1.2rem" }}>
                      ✦
                    </div>
                    <div>
                      <p className="text-lg italic mb-2" style={{ color: SAND }}>{ev.name}</p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: `${SAND}70` }}>
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
        <section className="py-20 px-6" style={{ backgroundColor: MIDNIGHT }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Captured Moments</p>
                <h2 className="text-4xl md:text-5xl italic">Gallery</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <motion.div whileHover={{ scale: 1.04 }} className="aspect-square overflow-hidden rounded-sm" style={{ boxShadow: `0 0 20px ${GOLD}15`, border: `1px solid ${GOLD}20` }}>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${MIDNIGHT} 0%, ${INDIGO}60 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Join Us</p>
                <h2 className="text-4xl md:text-5xl italic">RSVP</h2>
                <GoldDivider />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-12 rounded-lg" style={{ border: `1px solid ${GOLD}40`, background: `${GOLD}08` }}>
                  <Star className="w-10 h-10 mx-auto mb-4" style={{ color: GOLD, fill: GOLD }} />
                  <h3 className="text-3xl italic mb-3">See you under the stars</h3>
                  <p style={{ color: `${SAND}70` }}>Your RSVP is received with joy.</p>
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
                      style={{ borderBottom: `1px solid ${GOLD}40`, color: SAND, fontFamily: "'Playfair Display', serif", fontSize: "1rem" }} />
                  ))}
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))}
                        className="flex-1 py-3 text-sm uppercase tracking-widest rounded transition-all"
                        style={{ border: `1px solid ${GOLD}40`, background: rsvpForm.attending === v ? GOLD : "transparent", color: rsvpForm.attending === v ? MIDNIGHT : GOLD }}>
                        {v === "yes" ? "✦ Attending" : "✗ Regrets"}
                      </button>
                    ))}
                  </div>
                  <select value={rsvpForm.meal} onChange={e => setRsvpForm(p => ({ ...p, meal: e.target.value }))} className="w-full bg-transparent py-3 outline-none"
                    style={{ borderBottom: `1px solid ${GOLD}40`, color: `${SAND}90`, fontFamily: "'Playfair Display', serif" }}>
                    <option value="vegetarian" style={{ background: MIDNIGHT }}>Vegetarian</option>
                    <option value="non-vegetarian" style={{ background: MIDNIGHT }}>Non-Vegetarian</option>
                    <option value="jain" style={{ background: MIDNIGHT }}>Jain</option>
                  </select>
                  <textarea value={rsvpForm.message} onChange={e => setRsvpForm(p => ({ ...p, message: e.target.value }))} placeholder="A message for the couple (optional)" rows={2}
                    className="w-full bg-transparent px-0 py-3 text-base outline-none resize-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${GOLD}40`, color: SAND, fontFamily: "'Playfair Display', serif", fontSize: "1rem" }} />
                  <motion.button type="submit" disabled={submittingRsvp} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-4 text-sm uppercase tracking-[0.3em] rounded"
                    style={{ background: `linear-gradient(135deg, ${GOLD}25, ${ROSE}15)`, border: `1px solid ${GOLD}50`, color: GOLD }}>
                    {submittingRsvp ? "Sending..." : "✦ Confirm Attendance ✦"}
                  </motion.button>
                </form>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* WISHES */}
      <section className="py-20 px-6" style={{ backgroundColor: MIDNIGHT }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Leave a Wish</p>
              <h2 className="text-4xl md:text-5xl italic">Wishes</h2>
              <GoldDivider />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-4 mb-12 p-8 rounded-lg" style={{ border: `1px solid ${GOLD}20`, background: `${INDIGO}40` }}>
              <div className="grid grid-cols-2 gap-4">
                <input value={wishForm.name} onChange={e => setWishForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name *"
                  className="bg-transparent py-2 text-base outline-none placeholder:italic"
                  style={{ borderBottom: `1px solid ${GOLD}30`, color: SAND, fontFamily: "'Playfair Display', serif", fontSize: "1rem" }} />
                <input value={wishForm.relation} onChange={e => setWishForm(p => ({ ...p, relation: e.target.value }))} placeholder="Relation"
                  className="bg-transparent py-2 text-base outline-none placeholder:italic"
                  style={{ borderBottom: `1px solid ${GOLD}30`, color: SAND, fontFamily: "'Playfair Display', serif", fontSize: "1rem" }} />
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your blessing *" rows={3}
                className="w-full bg-transparent py-2 outline-none resize-none placeholder:italic"
                style={{ borderBottom: `1px solid ${GOLD}30`, color: SAND, fontFamily: "'Playfair Display', serif", fontSize: "1rem" }} />
              <motion.button type="submit" disabled={submittingWish} whileTap={{ scale: 0.98 }} className="w-full py-3 text-sm uppercase tracking-widest rounded"
                style={{ border: `1px solid ${GOLD}40`, color: GOLD, background: "transparent" }}>
                {submittingWish ? "Sending..." : "Send Blessing ✦"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-6 rounded-lg" style={{ border: `1px solid ${GOLD}15`, background: `${INDIGO}30` }}>
                    <p className="text-lg italic mb-3" style={{ color: `${SAND}90` }}>"{w.message}"</p>
                    <p className="text-sm" style={{ color: GOLD }}>{w.guest_name}{w.relation ? ` · ${w.relation}` : ""}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${MIDNIGHT}, #020308)` }}>
        <div className="absolute bottom-0 w-full opacity-20 pointer-events-none">
          <FortSilhouette />
        </div>
        <motion.div animate={{ boxShadow: [`0 0 30px ${GOLD}20`, `0 0 60px ${GOLD}35`, `0 0 30px ${GOLD}20`] }} transition={{ duration: 4, repeat: Infinity }} className="w-12 h-12 rounded-full mx-auto mb-6" style={{ background: `radial-gradient(circle, #FFEEDD, ${GOLD}60)` }} />
        <h2 className="text-4xl italic mb-2">{bride} ✦ {groom}</h2>
        {mainEvent?.date && <p className="text-sm tracking-[0.4em] uppercase mb-8" style={{ color: `${GOLD}60` }}>{format(new Date(mainEvent.date), "MMMM d, yyyy")}</p>}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { const t = `You're invited to ${bride} & ${groom}'s wedding ✦\n${window.location.href}`; window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank"); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest rounded" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied ✦" }); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest rounded" style={{ border: `1px solid ${GOLD}40`, color: GOLD }}>
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${SAND}30` }}>Created with Veloria</p>
      </footer>
    </div>
  );
}
