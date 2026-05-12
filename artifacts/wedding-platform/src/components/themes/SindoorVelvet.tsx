import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Share2, ChevronDown, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const RED = "#8B1A1A";
const GOLD = "#C9973A";
const WHITE = "#FBF8F2";
const GREEN = "#1A4A1A";
const BG = "#1A0303";

function AlponaPattern({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <circle cx="200" cy="200" r="180" fill="none" stroke={WHITE} strokeWidth="0.8" />
      <circle cx="200" cy="200" r="140" fill="none" stroke={WHITE} strokeWidth="0.5" />
      <circle cx="200" cy="200" r="100" fill="none" stroke={GOLD} strokeWidth="0.8" />
      <circle cx="200" cy="200" r="60" fill="none" stroke={WHITE} strokeWidth="0.5" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x1 = 200 + Math.cos(a) * 60, y1 = 200 + Math.sin(a) * 60;
        const x2 = 200 + Math.cos(a) * 180, y2 = 200 + Math.sin(a) * 180;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={WHITE} strokeWidth="0.4" />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const cx = 200 + Math.cos(a) * 120; const cy = 200 + Math.sin(a) * 120;
        return <g key={i}><circle cx={cx} cy={cy} r="8" fill="none" stroke={GOLD} strokeWidth="0.7" /><circle cx={cx} cy={cy} r="3" fill={GOLD} fillOpacity="0.5" /></g>;
      })}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const cx = 200 + Math.cos(a) * 160; const cy = 200 + Math.sin(a) * 160;
        return <circle key={i} cx={cx} cy={cy} r="4" fill="none" stroke={WHITE} strokeWidth="0.5" />;
      })}
      <circle cx="200" cy="200" r="10" fill={GOLD} fillOpacity="0.4" />
      <circle cx="200" cy="200" r="4" fill={GOLD} fillOpacity="0.8" />
    </svg>
  );
}

function SholaBorder() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
      <svg viewBox="0 0 60 20" width="60" height="20">
        {[0,1,2,3,4].map(i => (
          <rect key={i} x={i * 12} y="6" width="8" height="8" rx="1" fill="none" stroke={GOLD} strokeWidth="0.8" transform={`rotate(45 ${i * 12 + 4} 10)`} />
        ))}
      </svg>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
    </div>
  );
}

function ConchShell({ size = 40, opacity = 0.5 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ opacity }}>
      <path d="M30,5 Q45,10 50,25 Q55,40 40,52 Q35,55 30,52 Q20,48 15,38 Q8,25 20,15 Q25,10 30,5 Z" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <path d="M30,15 Q40,20 42,30 Q44,40 35,46 Q30,48 25,45 Q18,40 18,30 Q18,20 25,17 Z" fill="none" stroke={GOLD} strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx="30" cy="28" r="4" fill={GOLD} fillOpacity="0.4" />
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

export default function SindoorVelvetInvitation({ invitation }: { invitation: any }) {
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
      toast({ title: "শুভ বিবাহ 🌺", description: "RSVP received with all our blessings." });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;
    setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "আশীর্বাদ পাঠানো হয়েছে" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingWish(false); }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: BG, fontFamily: "'Merriweather', serif", color: WHITE }}>

      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ background: `radial-gradient(ellipse at center, ${RED}80 0%, ${BG} 70%)` }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} className="text-center px-8 relative">
              <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
                <AlponaPattern opacity={0.8} />
                <ConchShell size={60} opacity={0.7} />
              </div>
              <p className="text-2xl tracking-widest mb-3" style={{ color: GOLD, fontFamily: "'Abril Fatface', serif" }}>শুভ বিবাহ</p>
              <p className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: `${GOLD}70` }}>Sindoor Velvet · Veloria</p>
              <h1 className="text-5xl md:text-6xl mb-2 leading-none" style={{ fontFamily: "'Abril Fatface', cursive" }}>{bride}</h1>
              <p className="text-xl mb-2" style={{ color: GOLD }}>⁘</p>
              <h1 className="text-5xl md:text-6xl leading-none" style={{ fontFamily: "'Abril Fatface', cursive" }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-10 text-[10px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}50` }}>Tap to enter</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 30%, ${RED}60 0%, ${BG} 65%)` }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-2xl h-full max-h-screen relative"><AlponaPattern opacity={0.1} /></div>
        </div>
        <div className="relative z-10 text-center px-6 py-24">
          <motion.p initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-2xl mb-2 tracking-widest" style={{ color: GOLD, fontFamily: "'Abril Fatface', serif" }}>
            শুভ বিবাহ
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="text-[10px] uppercase tracking-[0.5em] mb-10" style={{ color: `${GOLD}60` }}>
            An Eternal Bond
          </motion.p>
          <div className="flex justify-center items-center gap-6 mb-6">
            <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.9 }}>
              <ConchShell size={50} opacity={0.5} />
            </motion.div>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl leading-none mb-2" style={{ fontFamily: "'Abril Fatface', serif", textShadow: `0 0 60px ${RED}50` }}>
                {bride}
              </motion.h1>
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex items-center justify-center gap-4 my-3">
                <div className="h-px w-12 md:w-20" style={{ background: `linear-gradient(to right, transparent, ${GOLD}70)` }} />
                <span className="text-xl" style={{ color: GOLD }}>⁘</span>
                <div className="h-px w-12 md:w-20" style={{ background: `linear-gradient(to left, transparent, ${GOLD}70)` }} />
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl md:text-8xl leading-none" style={{ fontFamily: "'Abril Fatface', serif", textShadow: `0 0 60px ${RED}50` }}>
                {groom}
              </motion.h1>
            </div>
            <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.9 }}>
              <ConchShell size={50} opacity={0.5} />
            </motion.div>
          </div>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="flex flex-col items-center gap-2 mt-6">
              <div className="px-6 py-2 text-sm tracking-[0.25em] uppercase" style={{ border: `1px solid ${GOLD}50`, color: GOLD, background: `${GOLD}10` }}>
                {format(new Date(mainEvent.date), "MMMM d, yyyy")}
              </div>
              {mainEvent.venue && <p className="text-sm mt-1" style={{ color: `${WHITE}70` }}>{mainEvent.venue}</p>}
            </motion.div>
          )}
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-2" style={{ color: `${GOLD}40` }}>
          <span className="text-[9px] tracking-[0.5em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ASHIRVAD */}
      {invitation?.family_details?.blessingQuote && (
        <section className="py-20 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2A0505 50%, ${BG} 100%)` }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <div className="py-12 px-8 relative overflow-hidden" style={{ border: `1px solid ${GOLD}35` }}>
                <div className="absolute inset-0 pointer-events-none"><AlponaPattern opacity={0.05} /></div>
                <ConchShell size={36} opacity={0.5} />
                <p className="text-xs uppercase tracking-[0.5em] mt-4 mb-6" style={{ color: `${GOLD}60` }}>আশীর্বাদ · Ashirvad</p>
                <p className="text-xl md:text-2xl italic leading-relaxed" style={{ color: WHITE }}>"{invitation.family_details.blessingQuote}"</p>
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
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>পরিবার · Our Families</p>
                <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Abril Fatface', serif" }}>United in Sindoor</h2>
                <SholaBorder />
              </div>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-6">
              {invitation.family_details.brideParents?.some(Boolean) && (
                <FadeUp delay={0.1}>
                  <div className="p-8 text-center relative overflow-hidden" style={{ border: `1px solid ${GOLD}30`, background: `${RED}20` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Bride's Family</p>
                    {invitation.family_details.brideParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${WHITE}90` }}>{n}</p>
                    ))}
                  </div>
                </FadeUp>
              )}
              {invitation.family_details.groomParents?.some(Boolean) && (
                <FadeUp delay={0.2}>
                  <div className="p-8 text-center relative overflow-hidden" style={{ border: `1px solid ${GOLD}30`, background: `${RED}20` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Groom's Family</p>
                    {invitation.family_details.groomParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: `${WHITE}90` }}>{n}</p>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2A0505 50%, ${BG} 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>অনুষ্ঠান · Ceremonies</p>
                <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Abril Fatface', serif" }}>The Celebrations</h2>
                <SholaBorder />
              </div>
            </FadeUp>
            <div className="space-y-5">
              {events.map((ev: any, i: number) => (
                <FadeUp key={ev.id || i} delay={i * 0.1}>
                  <motion.div whileHover={{ x: 5 }} className="p-6 flex gap-5 items-start relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${RED}50, ${BG}90)`, border: `1px solid ${GOLD}30` }}>
                    <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ background: `${RED}60`, border: `1px solid ${GOLD}40`, color: GOLD }}>
                      ⁘
                    </div>
                    <div>
                      <p className="text-lg mb-2 font-medium" style={{ color: WHITE }}>{ev.name}</p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: `${WHITE}70` }}>
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
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>স্মৃতি · Memories</p>
                <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Abril Fatface', serif" }}>Gallery</h2>
                <SholaBorder />
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <motion.div whileHover={{ scale: 1.03 }} className="aspect-square overflow-hidden" style={{ border: `2px solid ${GOLD}40`, boxShadow: `0 4px 20px ${RED}25` }}>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${BG} 0%, #2A0505 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>Your Presence</p>
                <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Abril Fatface', serif" }}>RSVP</h2>
                <SholaBorder />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-12 relative overflow-hidden" style={{ border: `1px solid ${GOLD}40`, background: `${RED}20` }}>
                  <div className="relative w-24 h-24 mx-auto mb-4"><AlponaPattern opacity={0.5} /></div>
                  <h3 className="text-3xl mb-3" style={{ fontFamily: "'Abril Fatface', serif" }}>আনন্দিত</h3>
                  <p style={{ color: `${WHITE}70` }}>Your RSVP is received with joy.</p>
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
                      style={{ borderBottom: `1px solid ${GOLD}50`, color: WHITE, fontFamily: "'Merriweather', serif", fontSize: "0.95rem" }} />
                  ))}
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))}
                        className="flex-1 py-3 text-sm uppercase tracking-widest transition-all"
                        style={{ border: `1px solid ${RED}80`, background: rsvpForm.attending === v ? RED : "transparent", color: rsvpForm.attending === v ? WHITE : `${WHITE}80` }}>
                        {v === "yes" ? "✓ Attending" : "✗ Regrets"}
                      </button>
                    ))}
                  </div>
                  <select value={rsvpForm.meal} onChange={e => setRsvpForm(p => ({ ...p, meal: e.target.value }))} className="w-full bg-transparent py-3 outline-none"
                    style={{ borderBottom: `1px solid ${GOLD}50`, color: `${WHITE}90`, fontFamily: "'Merriweather', serif" }}>
                    <option value="vegetarian" style={{ background: BG }}>Vegetarian</option>
                    <option value="non-vegetarian" style={{ background: BG }}>Non-Vegetarian</option>
                    <option value="jain" style={{ background: BG }}>Jain</option>
                  </select>
                  <textarea value={rsvpForm.message} onChange={e => setRsvpForm(p => ({ ...p, message: e.target.value }))} placeholder="A blessing for the couple (optional)" rows={2}
                    className="w-full bg-transparent px-0 py-3 text-base outline-none resize-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${GOLD}45`, color: WHITE, fontFamily: "'Merriweather', serif", fontSize: "0.95rem" }} />
                  <motion.button type="submit" disabled={submittingRsvp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-4 text-sm uppercase tracking-[0.3em]"
                    style={{ background: `linear-gradient(135deg, ${RED}50, ${RED}30)`, border: `1px solid ${GOLD}50`, color: GOLD }}>
                    {submittingRsvp ? "Sending..." : "⁘ Confirm Attendance ⁘"}
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
              <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}60` }}>আশীর্বাদ · Blessings</p>
              <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "'Abril Fatface', serif" }}>Wishes</h2>
              <SholaBorder />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-4 mb-12 p-8" style={{ border: `1px solid ${GOLD}25`, background: `${RED}15` }}>
              <div className="grid grid-cols-2 gap-4">
                {[{ ph: "Your name *", val: wishForm.name, k: "name" }, { ph: "Relation", val: wishForm.relation, k: "relation" }].map(f => (
                  <input key={f.k} value={f.val} onChange={e => setWishForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    className="bg-transparent py-2 text-base outline-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${GOLD}35`, color: WHITE, fontFamily: "'Merriweather', serif", fontSize: "0.95rem" }} />
                ))}
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your blessing *" rows={3}
                className="w-full bg-transparent py-2 outline-none resize-none placeholder:italic"
                style={{ borderBottom: `1px solid ${GOLD}35`, color: WHITE, fontFamily: "'Merriweather', serif", fontSize: "0.95rem" }} />
              <motion.button type="submit" disabled={submittingWish} whileTap={{ scale: 0.98 }} className="w-full py-3 text-sm uppercase tracking-widest"
                style={{ border: `1px solid ${GOLD}40`, color: GOLD, background: "transparent" }}>
                {submittingWish ? "Sending..." : "Send Blessing ⁘"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-6 relative overflow-hidden" style={{ border: `1px solid ${GOLD}20`, background: `${RED}12` }}>
                    <p className="text-lg italic mb-3 leading-relaxed" style={{ color: `${WHITE}90` }}>"{w.message}"</p>
                    <p className="text-sm" style={{ color: GOLD }}>{w.guest_name}{w.relation ? ` · ${w.relation}` : ""}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${BG}, #0A0101)` }}>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <AlponaPattern opacity={0.3} />
          <div className="absolute inset-0 flex items-center justify-center">
            <ConchShell size={45} opacity={0.5} />
          </div>
        </div>
        <h2 className="text-5xl mb-2" style={{ fontFamily: "'Abril Fatface', serif" }}>{bride} ⁘ {groom}</h2>
        {mainEvent?.date && <p className="text-sm tracking-[0.3em] uppercase mb-8" style={{ color: `${GOLD}60` }}>{format(new Date(mainEvent.date), "MMMM d, yyyy")}</p>}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { const t = `শুভ বিবাহ — You're invited to ${bride} & ${groom}'s wedding ⁘\n${window.location.href}`; window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank"); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest" style={{ border: `1px solid ${RED}80`, color: `${WHITE}80` }}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied ⁘" }); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest" style={{ border: `1px solid ${GOLD}50`, color: GOLD }}>
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${WHITE}25` }}>Created with Veloria</p>
      </footer>
    </div>
  );
}
