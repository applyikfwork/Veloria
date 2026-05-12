import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const CHARCOAL = "#1C1C1E";
const CHAMPAGNE = "#C9A84C";
const CREAM = "#F8F5F0";
const SILVER = "#A8A8B3";
const BG = "#0A0A0C";
const ACCENT = "#E8D9B5";

function ShimmerParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      size: Math.random() * 1.5 + 0.3, phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005, color: Math.random() > 0.6 ? CHAMPAGNE : SILVER,
    }));
    let t = 0, id: number;
    const draw = () => {
      t += 0.016; ctx.clearRect(0, 0, c.width, c.height);
      stars.forEach(s => {
        const op = (Math.sin(s.phase + t * s.speed * 60) + 1) / 2 * 0.5;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color === CHAMPAGNE ? `rgba(201,168,76,${op})` : `rgba(168,168,179,${op})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function GeometricCrest({ size = 200, opacity = 0.1 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ opacity }}>
      <rect x="20" y="20" width="160" height="160" rx="2" fill="none" stroke={CHAMPAGNE} strokeWidth="0.8" />
      <rect x="35" y="35" width="130" height="130" rx="1" fill="none" stroke={SILVER} strokeWidth="0.5" />
      <line x1="100" y1="20" x2="100" y2="180" stroke={CHAMPAGNE} strokeWidth="0.4" />
      <line x1="20" y1="100" x2="180" y2="100" stroke={CHAMPAGNE} strokeWidth="0.4" />
      <line x1="20" y1="20" x2="180" y2="180" stroke={SILVER} strokeWidth="0.3" />
      <line x1="180" y1="20" x2="20" y2="180" stroke={SILVER} strokeWidth="0.3" />
      {[25, 45, 65].map(r => <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={CHAMPAGNE} strokeWidth="0.4" strokeDasharray="3 6" />)}
      <polygon points="100,55 115,85 148,85 122,104 132,135 100,116 68,135 78,104 52,85 85,85" fill="none" stroke={CHAMPAGNE} strokeWidth="0.7" />
      <circle cx="100" cy="100" r="6" fill={CHAMPAGNE} fillOpacity="0.5" />
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
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="h-px flex-1 max-w-28" style={{ background: `linear-gradient(to right, transparent, ${CHAMPAGNE}40)` }} />
      <div className="w-1.5 h-1.5 rotate-45" style={{ background: CHAMPAGNE, opacity: 0.6 }} />
      <div className="w-2.5 h-2.5 rotate-45" style={{ background: CHAMPAGNE, opacity: 0.4 }} />
      <div className="w-1.5 h-1.5 rotate-45" style={{ background: CHAMPAGNE, opacity: 0.6 }} />
      <div className="h-px flex-1 max-w-28" style={{ background: `linear-gradient(to left, transparent, ${CHAMPAGNE}40)` }} />
    </div>
  );
}

export default function NRILondonInvitation({ invitation }: { invitation: any }) {
  const { toast } = useToast();
  const [showEntrance, setShowEntrance] = useState(true);
  const [rsvpForm, setRsvpForm] = useState({ name: "", phone: "", attending: "yes", dietary: "no preference", message: "" });
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
      await supabase.from("guests").insert({ invitation_id: invitation.id, name: rsvpForm.name, phone: rsvpForm.phone, attending: rsvpForm.attending === "yes", meal_preference: rsvpForm.dietary, message: rsvpForm.message });
      setRsvpDone(true); toast({ title: "Thank you sincerely ✨", description: "We look forward to seeing you." });
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault(); if (!wishForm.name || !wishForm.message) return; setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "Wishes sent ✨" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSubmittingWish(false); }
  };

  const shareWhatsApp = () => {
    const text = `✨ You are invited to the wedding of ${bride} & ${groom}!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: BG, fontFamily: "'Cormorant Garamond', serif", color: CREAM }}>
      <ShimmerParticles />
      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ background: `radial-gradient(ellipse at center, #1C1C1E 0%, ${BG} 70%)` }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="text-center px-8">
              <div className="flex justify-center mb-8"><GeometricCrest size={120} opacity={0.9} /></div>
              <p className="text-[10px] uppercase tracking-[0.8em] mb-3" style={{ color: `${CHAMPAGNE}70`, letterSpacing: "0.6em" }}>NRI London Wedding · Veloria</p>
              <h1 className="text-5xl md:text-6xl italic mb-2 leading-none" style={{ fontWeight: 300, letterSpacing: "0.05em" }}>{bride}</h1>
              <p className="text-xl mb-2" style={{ color: CHAMPAGNE }}>◆</p>
              <h1 className="text-5xl md:text-6xl italic leading-none" style={{ fontWeight: 300, letterSpacing: "0.05em" }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-12 text-[10px] tracking-[0.6em] uppercase" style={{ color: `${CHAMPAGNE}40` }}>Please tap to enter</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 40%, #1C1C1E 0%, ${BG} 70%)` }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
            <GeometricCrest size={560} opacity={0.05} />
          </motion.div>
        </div>
        <div className="relative z-10 text-center px-6 py-24">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-[10px] uppercase tracking-[0.7em] mb-10" style={{ color: `${CHAMPAGNE}60` }}>
            NRI Wedding · London & Dubai
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7.5rem] italic leading-none mb-4" style={{ fontWeight: 300, letterSpacing: "0.04em", textShadow: `0 0 100px ${CHAMPAGNE}20` }}>
            {bride}
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex items-center justify-center gap-6 my-6">
            <div className="h-px w-16 md:w-32" style={{ background: `linear-gradient(to right, transparent, ${CHAMPAGNE}50)` }} />
            <span style={{ color: CHAMPAGNE, fontSize: "0.6rem", letterSpacing: "0.4em" }}>◆ ◆ ◆</span>
            <div className="h-px w-16 md:w-32" style={{ background: `linear-gradient(to left, transparent, ${CHAMPAGNE}50)` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[7.5rem] italic leading-none mb-10" style={{ fontWeight: 300, letterSpacing: "0.04em", textShadow: `0 0 100px ${CHAMPAGNE}20` }}>
            {groom}
          </motion.h1>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex flex-col items-center gap-4">
              <div className="px-8 py-3 text-xs tracking-[0.5em] uppercase" style={{ border: `1px solid ${CHAMPAGNE}40`, color: CHAMPAGNE, letterSpacing: "0.4em" }}>
                {format(new Date(mainEvent.date), "MMMM d, yyyy")}
              </div>
              {mainEvent.venue && <p className="text-sm tracking-[0.2em] uppercase text-xs" style={{ color: `${CREAM}50`, letterSpacing: "0.3em" }}>{mainEvent.venue}</p>}
            </motion.div>
          )}
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-2" style={{ color: `${CHAMPAGNE}30` }}>
          <span className="text-[8px] tracking-[0.5em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* EVENTS */}
      {events.length > 0 && (
        <section className="py-28 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #111114 50%, ${BG} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[9px] uppercase tracking-[0.7em] mb-4" style={{ color: `${CHAMPAGNE}50` }}>Schedule of Events</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300, letterSpacing: "0.06em" }}>The Programme</h2>
                <Divider />
              </div>
            </FadeUp>
            <div className="space-y-4">
              {events.map((ev: any, i: number) => (
                <FadeUp key={ev.id || i} delay={i * 0.1}>
                  <div className="p-7 flex gap-6 items-start" style={{ background: "#0D0D10", border: `1px solid ${CHAMPAGNE}20` }}>
                    <div className="text-center pt-1 min-w-12">
                      <div className="text-2xl font-light" style={{ color: CHAMPAGNE }}>{(i + 1).toString().padStart(2, "0")}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xl mb-2" style={{ color: CREAM, fontWeight: 300, letterSpacing: "0.04em" }}>{ev.name}</p>
                      <div className="flex flex-wrap gap-5 text-xs" style={{ color: `${CREAM}50`, letterSpacing: "0.15em" }}>
                        {ev.date && <span className="flex items-center gap-2 uppercase"><Calendar className="w-3 h-3" style={{ color: CHAMPAGNE }} />{format(new Date(ev.date), "MMM d, yyyy")}</span>}
                        {ev.time && <span className="flex items-center gap-2 uppercase"><Clock className="w-3 h-3" style={{ color: CHAMPAGNE }} />{ev.time}</span>}
                        {ev.venue && <span className="flex items-center gap-2 uppercase"><MapPin className="w-3 h-3" style={{ color: CHAMPAGNE }} />{ev.venue}</span>}
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PHOTOS */}
      {photos.length > 0 && (
        <section className="py-24 px-6" style={{ backgroundColor: BG }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-14">
                <p className="text-[9px] uppercase tracking-[0.6em] mb-4" style={{ color: `${CHAMPAGNE}50` }}>Gallery</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Moments Together</h2>
                <Divider />
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.slice(0, 6).map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <motion.div whileHover={{ scale: 1.02 }} className="aspect-square overflow-hidden" style={{ border: `1px solid ${CHAMPAGNE}25` }}>
                    <img src={p} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RSVP */}
      {invitation?.rsvp_config?.enabled !== false && (
        <section className="py-28 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #111114 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-14">
                <p className="text-[9px] uppercase tracking-[0.6em] mb-4" style={{ color: `${CHAMPAGNE}50` }}>Attendance</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>RSVP</h2>
                <Divider />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-14" style={{ border: `1px solid ${CHAMPAGNE}30` }}>
                  <p className="text-3xl mb-4" style={{ color: CHAMPAGNE }}>◆</p>
                  <h3 className="text-3xl italic mb-3">Thank you sincerely</h3>
                  <p style={{ color: `${CREAM}60`, letterSpacing: "0.1em", fontSize: "0.85rem" }}>We look forward to your company.</p>
                </div>
              </FadeUp>
            ) : (
              <FadeUp delay={0.1}>
                <form onSubmit={handleRsvp} className="space-y-6">
                  {[{ ph: "Full Name *", val: rsvpForm.name, k: "name", t: "text" }, { ph: "Contact Number", val: rsvpForm.phone, k: "phone", t: "tel" }].map(f => (
                    <input key={f.k} type={f.t} value={f.val} onChange={e => setRsvpForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                      className="w-full bg-transparent px-0 py-3 text-base outline-none placeholder:uppercase placeholder:text-xs placeholder:tracking-widest"
                      style={{ borderBottom: `1px solid ${SILVER}30`, color: CREAM, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.04em" }} />
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))}
                        className="py-3 text-xs uppercase tracking-[0.3em] transition-all"
                        style={{ border: `1px solid ${CHAMPAGNE}${rsvpForm.attending === v ? "80" : "30"}`, background: rsvpForm.attending === v ? `${CHAMPAGNE}15` : "transparent", color: rsvpForm.attending === v ? CHAMPAGNE : `${CREAM}50` }}>
                        {v === "yes" ? "Attending" : "Regrets"}
                      </button>
                    ))}
                  </div>
                  <select value={rsvpForm.dietary} onChange={e => setRsvpForm(p => ({ ...p, dietary: e.target.value }))} className="w-full bg-transparent py-3 text-xs uppercase tracking-widest outline-none"
                    style={{ borderBottom: `1px solid ${SILVER}30`, color: `${CREAM}70`, fontFamily: "'Cormorant Garamond', serif" }}>
                    <option value="no preference" style={{ background: BG }}>No Dietary Preference</option>
                    <option value="vegetarian" style={{ background: BG }}>Vegetarian</option>
                    <option value="vegan" style={{ background: BG }}>Vegan</option>
                    <option value="halal" style={{ background: BG }}>Halal</option>
                    <option value="gluten-free" style={{ background: BG }}>Gluten Free</option>
                  </select>
                  <motion.button type="submit" disabled={submittingRsvp} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 text-xs uppercase tracking-[0.5em]"
                    style={{ border: `1px solid ${CHAMPAGNE}50`, color: CHAMPAGNE, background: `${CHAMPAGNE}08` }}>
                    {submittingRsvp ? "Please wait..." : "Confirm Attendance ◆"}
                  </motion.button>
                </form>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* WISHES */}
      <section className="py-24 px-6" style={{ backgroundColor: BG }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-14">
              <p className="text-[9px] uppercase tracking-[0.6em] mb-4" style={{ color: `${CHAMPAGNE}50` }}>Well Wishes</p>
              <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300 }}>Message Wall</h2>
              <Divider />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-5 mb-14 p-10" style={{ border: `1px solid ${CHAMPAGNE}18` }}>
              <div className="grid grid-cols-2 gap-5">
                {[{ ph: "Your Name *", val: wishForm.name, k: "name" }, { ph: "Your Relation", val: wishForm.relation, k: "relation" }].map(f => (
                  <input key={f.k} value={f.val} onChange={e => setWishForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    className="bg-transparent py-2 text-base outline-none placeholder:uppercase placeholder:text-xs placeholder:tracking-widest"
                    style={{ borderBottom: `1px solid ${SILVER}25`, color: CREAM, fontFamily: "'Cormorant Garamond', serif" }} />
                ))}
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Your message to the couple..." rows={3}
                className="w-full bg-transparent py-2 outline-none resize-none"
                style={{ borderBottom: `1px solid ${SILVER}25`, color: CREAM, fontFamily: "'Cormorant Garamond', serif" }} />
              <motion.button type="submit" disabled={submittingWish} whileTap={{ scale: 0.98 }} className="w-full py-3 text-xs uppercase tracking-[0.4em]"
                style={{ border: `1px solid ${CHAMPAGNE}35`, color: CHAMPAGNE }}>
                {submittingWish ? "Sending..." : "Send Wishes ◆"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-7" style={{ borderLeft: `2px solid ${CHAMPAGNE}30`, background: "#0D0D10" }}>
                    <p className="text-lg italic mb-3 leading-relaxed" style={{ color: `${CREAM}80` }}>"{w.message}"</p>
                    <p className="text-xs uppercase tracking-[0.3em]" style={{ color: CHAMPAGNE }}>{w.guest_name}{w.relation ? ` · ${w.relation}` : ""}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-18 px-6 text-center" style={{ background: `linear-gradient(180deg, ${BG}, #050508)` }}>
        <div className="flex justify-center mb-8"><GeometricCrest size={56} opacity={0.5} /></div>
        <p className="text-[9px] uppercase tracking-[0.6em] mb-4" style={{ color: `${CHAMPAGNE}45`, letterSpacing: "0.5em" }}>NRI London Wedding · Veloria</p>
        <h3 className="text-2xl italic mb-8" style={{ fontWeight: 300, letterSpacing: "0.06em" }}>{bride} & {groom}</h3>
        <div className="flex justify-center gap-3">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={shareWhatsApp}
            className="px-7 py-3 text-xs uppercase tracking-[0.35em]"
            style={{ border: `1px solid ${CHAMPAGNE}40`, color: CHAMPAGNE }}>
            Share Invitation
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied." }); }}
            className="px-7 py-3 text-xs uppercase tracking-[0.35em]"
            style={{ border: `1px solid ${SILVER}30`, color: `${CREAM}60` }}>
            Copy Link
          </motion.button>
        </div>
        <p className="text-[9px] mt-12 uppercase tracking-[0.3em]" style={{ color: `${CREAM}18` }}>Made with love on Veloria</p>
      </footer>
    </div>
  );
}
