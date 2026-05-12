import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const CORAL = "#E8634A";
const OCEAN = "#1E6B8C";
const SAND = "#F5E6C8";
const TURQUOISE = "#2EC4B6";
const BG = "#FDF6EC";
const DARK = "#1A2E38";

function WaveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    let t = 0, id: number;
    const draw = () => {
      t += 0.012;
      ctx.clearRect(0, 0, c.width, c.height);
      [
        { y: 0.72, amp: 18, freq: 0.008, speed: 1, color: "30,107,140", op: 0.06 },
        { y: 0.77, amp: 14, freq: 0.01, speed: -1.2, color: "46,196,182", op: 0.05 },
        { y: 0.82, amp: 10, freq: 0.012, speed: 0.8, color: "30,107,140", op: 0.04 },
      ].forEach(w => {
        ctx.beginPath();
        for (let x = 0; x <= c.width; x += 4) {
          const y = c.height * w.y + Math.sin(x * w.freq + t * w.speed) * w.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(c.width, c.height); ctx.lineTo(0, c.height); ctx.closePath();
        ctx.fillStyle = `rgba(${w.color},${w.op})`; ctx.fill();
      });
      const sparks = Array.from({ length: 8 }, (_, i) => ({
        x: (i / 8 + 0.05) * c.width + Math.sin(t * 0.5 + i) * 40,
        y: c.height * 0.72 + Math.sin(i * 1.3 + t) * 15,
      }));
      sparks.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,99,74,0.25)`; ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function TropicalPattern({ size = 240, opacity = 0.1 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} style={{ opacity }}>
      <circle cx="120" cy="120" r="100" fill="none" stroke={CORAL} strokeWidth="1" strokeDasharray="6 10" />
      <circle cx="120" cy="120" r="70" fill="none" stroke={OCEAN} strokeWidth="0.7" strokeDasharray="3 8" />
      <circle cx="120" cy="120" r="40" fill="none" stroke={TURQUOISE} strokeWidth="0.5" />
      {[0,1,2,3,4,5].map(i => {
        const a = (i/6)*Math.PI*2;
        const cx = 120+Math.cos(a)*70, cy = 120+Math.sin(a)*70;
        return <circle key={i} cx={cx} cy={cy} r="5" fill={CORAL} fillOpacity="0.5" />;
      })}
      {[0,1,2,3].map(i => {
        const a = (i/4)*Math.PI*2 + Math.PI/8;
        const x2 = 120+Math.cos(a)*90, y2 = 120+Math.sin(a)*90;
        return <line key={i} x1="120" y1="120" x2={x2} y2={y2} stroke={OCEAN} strokeWidth="0.5" strokeOpacity="0.5" />;
      })}
      <circle cx="120" cy="120" r="10" fill={CORAL} fillOpacity="0.4" />
      <circle cx="120" cy="120" r="5" fill={OCEAN} fillOpacity="0.6" />
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
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${CORAL}50)` }} />
      <div className="flex gap-2">
        {[OCEAN, CORAL, TURQUOISE, CORAL, OCEAN].map((c, i) => (
          <div key={i} className={`rounded-full ${i === 2 ? "w-3 h-3" : "w-1.5 h-1.5"}`} style={{ backgroundColor: c, opacity: 0.7 }} />
        ))}
      </div>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${CORAL}50)` }} />
    </div>
  );
}

export default function GoaBeachInvitation({ invitation }: { invitation: any }) {
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
      setRsvpDone(true); toast({ title: "See you on the beach! 🌊", description: "We're so excited to celebrate with you." });
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault(); if (!wishForm.name || !wishForm.message) return; setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "Wish sent! 🌊" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); } finally { setSubmittingWish(false); }
  };

  const shareWhatsApp = () => {
    const text = `🌊 You're invited to the beach wedding of ${bride} & ${groom}!\n\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: BG, fontFamily: "'Cormorant Garamond', serif", color: DARK }}>
      <WaveCanvas />
      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ background: `linear-gradient(180deg, #87CEEB 0%, #E8C4A0 50%, ${SAND} 100%)` }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="text-center px-8">
              <div className="flex justify-center mb-6"><TropicalPattern size={120} opacity={0.9} /></div>
              <p className="text-xs uppercase tracking-[0.5em] mb-2" style={{ color: `${OCEAN}80` }}>Goa Beach Wedding · Veloria</p>
              <h1 className="text-5xl md:text-6xl italic mb-2 leading-none" style={{ fontWeight: 300, color: DARK }}>{bride}</h1>
              <p className="text-2xl mb-2" style={{ color: CORAL }}>〜</p>
              <h1 className="text-5xl md:text-6xl italic leading-none" style={{ fontWeight: 300, color: DARK }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-10 text-[10px] tracking-[0.5em] uppercase" style={{ color: `${OCEAN}60` }}>Tap to begin</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `linear-gradient(180deg, #87CEEB 0%, #E8D4B0 55%, ${BG} 100%)` }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}>
            <TropicalPattern size={480} opacity={0.08} />
          </motion.div>
        </div>
        <div className="relative z-10 text-center px-6 py-24">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: OCEAN }}>
            A Goa Beach Wedding
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="text-6xl md:text-[7rem] italic leading-none mb-3" style={{ fontWeight: 300, color: DARK }}>
            {bride}
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex items-center justify-center gap-6 my-5">
            <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(to right, transparent, ${CORAL}60)` }} />
            <span className="text-xl" style={{ color: CORAL }}>〜</span>
            <div className="h-px w-16 md:w-28" style={{ background: `linear-gradient(to left, transparent, ${CORAL}60)` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} className="text-6xl md:text-[7rem] italic leading-none mb-8" style={{ fontWeight: 300, color: DARK }}>
            {groom}
          </motion.h1>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex flex-col items-center gap-3">
              <div className="px-6 py-2 text-sm tracking-[0.3em] uppercase" style={{ border: `1px solid ${CORAL}60`, color: CORAL, background: `${CORAL}10`, borderRadius: "2px" }}>
                {format(new Date(mainEvent.date), "MMMM d, yyyy")}
              </div>
              {mainEvent.venue && <p className="text-sm tracking-widest" style={{ color: `${DARK}70` }}>{mainEvent.venue}</p>}
            </motion.div>
          )}
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-2" style={{ color: `${OCEAN}50` }}>
          <span className="text-[9px] tracking-[0.4em] uppercase">Dive in</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* EVENTS */}
      {events.length > 0 && (
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #E8F4F8 50%, ${BG} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: OCEAN }}>Sun, Sand & Celebration</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300, color: DARK }}>Events</h2>
                <Divider />
              </div>
            </FadeUp>
            <div className="space-y-5">
              {events.map((ev: any, i: number) => (
                <FadeUp key={ev.id || i} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -3 }} className="p-6 flex gap-5 items-start" style={{ background: "#fff", border: `1px solid ${CORAL}25`, boxShadow: `0 4px 20px ${OCEAN}10` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${CORAL}15`, border: `1px solid ${CORAL}40`, color: CORAL }}>
                      🌊
                    </div>
                    <div>
                      <p className="text-lg italic mb-2" style={{ color: DARK }}>{ev.name}</p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: `${DARK}60` }}>
                        {ev.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" style={{ color: CORAL }} />{format(new Date(ev.date), "MMM d, yyyy")}</span>}
                        {ev.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" style={{ color: CORAL }} />{ev.time}</span>}
                        {ev.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: CORAL }} />{ev.venue}</span>}
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
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: OCEAN }}>Moments</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300, color: DARK }}>Gallery</h2>
                <Divider />
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <motion.div whileHover={{ scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }} className="aspect-square overflow-hidden" style={{ border: `3px solid white`, boxShadow: `0 4px 20px ${OCEAN}20` }}>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #E8F4F8 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: OCEAN }}>Are you coming?</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300, color: DARK }}>RSVP</h2>
                <Divider />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-12 bg-white" style={{ boxShadow: `0 8px 40px ${OCEAN}15`, border: `1px solid ${CORAL}25` }}>
                  <p className="text-4xl mb-4">🌊</p>
                  <h3 className="text-3xl italic mb-3" style={{ color: DARK }}>See you on the beach!</h3>
                  <p style={{ color: `${DARK}60` }}>We can't wait to celebrate with you.</p>
                </div>
              </FadeUp>
            ) : (
              <FadeUp delay={0.1}>
                <form onSubmit={handleRsvp} className="space-y-5 bg-white p-8" style={{ boxShadow: `0 8px 40px ${OCEAN}10`, border: `1px solid ${CORAL}20` }}>
                  {[{ ph: "Your full name *", val: rsvpForm.name, k: "name", t: "text" }, { ph: "WhatsApp number", val: rsvpForm.phone, k: "phone", t: "tel" }].map(f => (
                    <input key={f.k} type={f.t} value={f.val} onChange={e => setRsvpForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                      className="w-full bg-transparent px-0 py-3 text-base outline-none placeholder:italic"
                      style={{ borderBottom: `1px solid ${OCEAN}30`, color: DARK, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                  ))}
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))} className="flex-1 py-3 text-sm uppercase tracking-widest transition-all"
                        style={{ border: `1px solid ${CORAL}50`, background: rsvpForm.attending === v ? CORAL : "transparent", color: rsvpForm.attending === v ? "white" : CORAL }}>
                        {v === "yes" ? "🌊 Attending" : "✗ Regrets"}
                      </button>
                    ))}
                  </div>
                  <select value={rsvpForm.meal} onChange={e => setRsvpForm(p => ({ ...p, meal: e.target.value }))} className="w-full bg-transparent py-3 outline-none"
                    style={{ borderBottom: `1px solid ${OCEAN}30`, color: `${DARK}80`, fontFamily: "'Cormorant Garamond', serif" }}>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="seafood">Seafood</option>
                    <option value="vegan">Vegan</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                  </select>
                  <motion.button type="submit" disabled={submittingRsvp} whileTap={{ scale: 0.98 }} className="w-full py-4 text-sm uppercase tracking-[0.3em] text-white"
                    style={{ background: `linear-gradient(135deg, ${CORAL}, ${OCEAN})`, boxShadow: `0 4px 20px ${CORAL}30` }}>
                    {submittingRsvp ? "Sending..." : "🌊 Confirm Attendance"}
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
              <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: OCEAN }}>Leave a Message</p>
              <h2 className="text-4xl md:text-5xl italic" style={{ fontWeight: 300, color: DARK }}>Wishes Wall</h2>
              <Divider />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-4 mb-12 p-8 bg-white" style={{ boxShadow: `0 4px 24px ${OCEAN}10`, border: `1px solid ${CORAL}20` }}>
              <div className="grid grid-cols-2 gap-4">
                {[{ ph: "Your name *", val: wishForm.name, k: "name" }, { ph: "How do you know them?", val: wishForm.relation, k: "relation" }].map(f => (
                  <input key={f.k} value={f.val} onChange={e => setWishForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    className="bg-transparent py-2 text-base outline-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${OCEAN}25`, color: DARK, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
                ))}
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your wishes for the couple *" rows={3}
                className="w-full bg-transparent py-2 outline-none resize-none placeholder:italic"
                style={{ borderBottom: `1px solid ${OCEAN}25`, color: DARK, fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }} />
              <motion.button type="submit" disabled={submittingWish} whileTap={{ scale: 0.98 }} className="w-full py-3 text-sm uppercase tracking-widest"
                style={{ border: `1px solid ${CORAL}40`, color: CORAL }}>
                {submittingWish ? "Sending..." : "Send Wishes 🌊"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-6 bg-white" style={{ boxShadow: `0 2px 12px ${OCEAN}10`, borderLeft: `3px solid ${CORAL}50` }}>
                    <p className="text-lg italic mb-3 leading-relaxed" style={{ color: `${DARK}80` }}>"{w.message}"</p>
                    <p className="text-sm" style={{ color: OCEAN }}>{w.guest_name}{w.relation ? ` · ${w.relation}` : ""}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, ${BG}, #E8C4A0)` }}>
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }} className="inline-block mb-6">
          <TropicalPattern size={60} opacity={0.5} />
        </motion.div>
        <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: `${OCEAN}70` }}>Goa Beach Wedding · Veloria</p>
        <h3 className="text-2xl italic mb-6" style={{ fontWeight: 300, color: DARK }}>{bride} & {groom}</h3>
        <div className="flex justify-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareWhatsApp} className="px-6 py-3 text-xs uppercase tracking-wider text-white"
            style={{ background: `linear-gradient(135deg, ${CORAL}, ${OCEAN})` }}>
            Share via WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied!" }); }}
            className="px-6 py-3 text-xs uppercase tracking-wider" style={{ border: `1px solid ${OCEAN}40`, color: OCEAN }}>
            Copy Link
          </motion.button>
        </div>
        <p className="text-[10px] mt-10" style={{ color: `${DARK}30` }}>Made with love on Veloria</p>
      </footer>
    </div>
  );
}
