import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Share2, ChevronDown, MessageCircle, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const IVORY = "#FAF6EE";
const GOLD = "#BF8C2C";
const GREEN = "#2D5016";
const BLUSH = "#E8C4BE";
const TERRACOTTA = "#C4622D";

function JasmineGarland({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 120" className={className} fill="none">
      <path d="M0,60 Q75,20 150,60 Q225,100 300,60 Q375,20 450,60 Q525,100 600,60" stroke={GREEN} strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
      {[0, 75, 150, 225, 300, 375, 450, 525].map((x, i) => {
        const y = i % 2 === 0 ? 60 : 60;
        return (
          <g key={i} transform={`translate(${x}, ${y})`}>
            {[0,60,120,180,240,300].map((angle, j) => (
              <ellipse key={j} cx={Math.cos((angle * Math.PI) / 180) * 8} cy={Math.sin((angle * Math.PI) / 180) * 8} rx="5" ry="3" fill="#FDFAF4" fillOpacity="0.8" transform={`rotate(${angle})`} />
            ))}
            <circle cx="0" cy="0" r="2.5" fill={GOLD} fillOpacity="0.7" />
          </g>
        );
      })}
    </svg>
  );
}

function KolamBorder() {
  return (
    <div className="w-full overflow-hidden py-4">
      <svg viewBox="0 0 800 40" className="w-full opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 40 + 20}, 20)`}>
            <circle cx="0" cy="0" r="3" fill={GOLD} />
            <circle cx="10" cy="0" r="1.5" fill={GOLD} />
            <circle cx="-10" cy="0" r="1.5" fill={GOLD} />
            <circle cx="0" cy="10" r="1.5" fill={GREEN} />
            <circle cx="0" cy="-10" r="1.5" fill={GREEN} />
            <circle cx="7" cy="7" r="1" fill={TERRACOTTA} />
            <circle cx="-7" cy="-7" r="1" fill={TERRACOTTA} />
          </g>
        ))}
      </svg>
    </div>
  );
}

function LotusDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-10">
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60)` }} />
      <svg viewBox="0 0 60 40" width="60" height="40" fill="none">
        <ellipse cx="30" cy="30" rx="6" ry="12" fill={BLUSH} fillOpacity="0.6" transform="rotate(-30 30 30)" />
        <ellipse cx="30" cy="30" rx="6" ry="12" fill={BLUSH} fillOpacity="0.7" />
        <ellipse cx="30" cy="30" rx="6" ry="12" fill={BLUSH} fillOpacity="0.6" transform="rotate(30 30 30)" />
        <ellipse cx="30" cy="30" rx="3" ry="8" fill={GOLD} fillOpacity="0.5" transform="rotate(-15 30 30)" />
        <ellipse cx="30" cy="30" rx="3" ry="8" fill={GOLD} fillOpacity="0.6" />
        <ellipse cx="30" cy="30" rx="3" ry="8" fill={GOLD} fillOpacity="0.5" transform="rotate(15 30 30)" />
        <circle cx="30" cy="24" r="3" fill={GOLD} />
      </svg>
      <div className="h-px flex-1 max-w-24" style={{ background: `linear-gradient(to left, transparent, ${GOLD}60)` }} />
    </div>
  );
}

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function IvoryBlossomInvitation({ invitation }: { invitation: any }) {
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

  useEffect(() => { const t = setTimeout(() => setShowEntrance(false), 3200); return () => clearTimeout(t); }, []);
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
      toast({ title: "RSVP received ✿", description: "We look forward to your presence." });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingRsvp(false); }
  };

  const handleWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;
    setSubmittingWish(true);
    try {
      const { data } = await supabase.from("wishes").insert({ invitation_id: invitation.id, guest_name: wishForm.name, relation: wishForm.relation, message: wishForm.message }).select().single();
      if (data) { setWishes(p => [data, ...p]); setWishForm({ name: "", relation: "", message: "" }); toast({ title: "Blessing sent ✿" }); }
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSubmittingWish(false); }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: IVORY, fontFamily: "'Lora', serif", color: GREEN }}>

      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
            style={{ backgroundColor: IVORY }}
            onClick={() => setShowEntrance(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="text-center px-8">
              <JasmineGarland className="w-72 mx-auto mb-6 opacity-70" />
              <p className="text-xs uppercase tracking-[0.5em] mb-4" style={{ color: `${GOLD}90` }}>Ivory Blossom · Veloria</p>
              <p className="text-lg mb-3" style={{ color: TERRACOTTA, letterSpacing: "0.1em" }}>विवाह</p>
              <h1 className="text-5xl md:text-6xl mb-2 leading-none" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN, fontStyle: "italic" }}>{bride}</h1>
              <p className="text-xl mb-2" style={{ color: GOLD }}>✿</p>
              <h1 className="text-5xl md:text-6xl leading-none" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN, fontStyle: "italic" }}>{groom}</h1>
              <motion.p animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} className="mt-10 text-[10px] tracking-[0.5em] uppercase" style={{ color: `${GOLD}70` }}>Tap to enter</motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: `linear-gradient(180deg, ${IVORY} 0%, #F5EFE3 100%)` }}>
        <JasmineGarland className="absolute top-0 left-0 right-0 w-full opacity-40" />
        <div className="relative z-10 text-center px-6 py-24">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-xl mb-2" style={{ color: TERRACOTTA, letterSpacing: "0.15em" }}>
            விவாஹம்
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: `${GOLD}80` }}>
            A Sacred Union
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl leading-none mb-3 italic"
            style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN, textShadow: `0 2px 20px ${GREEN}15` }}>
            {bride}
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex items-center justify-center gap-6 my-5">
            <div className="h-px w-16 md:w-24" style={{ background: `linear-gradient(to right, transparent, ${GOLD}70)` }} />
            <Leaf className="w-5 h-5" style={{ color: GREEN }} />
            <div className="h-px w-16 md:w-24" style={{ background: `linear-gradient(to left, transparent, ${GOLD}70)` }} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl leading-none mb-8 italic"
            style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN, textShadow: `0 2px 20px ${GREEN}15` }}>
            {groom}
          </motion.h1>
          {mainEvent?.date && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="flex flex-col items-center gap-2">
              <div className="px-6 py-2 rounded-sm text-sm tracking-[0.25em] uppercase" style={{ border: `1px solid ${GOLD}60`, color: GOLD, background: `${GOLD}10` }}>
                {format(new Date(mainEvent.date), "EEEE · MMMM d, yyyy")}
              </div>
              {mainEvent.venue && <p className="text-sm tracking-wider mt-1" style={{ color: `${GREEN}80` }}>{mainEvent.venue}</p>}
            </motion.div>
          )}
        </div>
        <KolamBorder />
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute bottom-10 flex flex-col items-center gap-2" style={{ color: `${GOLD}60` }}>
          <span className="text-[9px] tracking-[0.4em] uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* SHLOKA / BLESSING */}
      {invitation?.family_details?.blessingQuote && (
        <section className="py-20 px-6" style={{ backgroundColor: "#F5EFE3" }}>
          <div className="max-w-2xl mx-auto text-center">
            <FadeUp>
              <div className="py-12 px-8" style={{ borderTop: `2px solid ${GOLD}50`, borderBottom: `2px solid ${GOLD}50` }}>
                <p className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: `${GOLD}70` }}>Family Blessings</p>
                <p className="text-xl md:text-2xl italic leading-relaxed" style={{ color: GREEN }}>"{invitation.family_details.blessingQuote}"</p>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* FAMILY */}
      {(invitation?.family_details?.brideParents?.some(Boolean) || invitation?.family_details?.groomParents?.some(Boolean)) && (
        <section className="py-20 px-6" style={{ backgroundColor: IVORY }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}70` }}>Our Families</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN }}>United in Love</h2>
                <LotusDivider />
              </div>
            </FadeUp>
            <div className="grid md:grid-cols-2 gap-8">
              {invitation.family_details.brideParents?.some(Boolean) && (
                <FadeUp delay={0.1}>
                  <div className="p-8 text-center rounded-sm" style={{ border: `1px solid ${GOLD}40`, background: `${GOLD}06` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Bride's Family</p>
                    {invitation.family_details.brideParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: GREEN }}>{n}</p>
                    ))}
                  </div>
                </FadeUp>
              )}
              {invitation.family_details.groomParents?.some(Boolean) && (
                <FadeUp delay={0.2}>
                  <div className="p-8 text-center rounded-sm" style={{ border: `1px solid ${GOLD}40`, background: `${GOLD}06` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: GOLD }}>Groom's Family</p>
                    {invitation.family_details.groomParents.filter(Boolean).map((n: string, i: number) => (
                      <p key={i} className="text-lg italic" style={{ color: GREEN }}>{n}</p>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${IVORY} 0%, #EEE8D8 100%)` }}>
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}70` }}>The Celebrations</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN }}>Ceremonies</h2>
                <LotusDivider />
              </div>
            </FadeUp>
            <div className="space-y-5">
              {events.map((ev: any, i: number) => (
                <FadeUp key={ev.id || i} delay={i * 0.1}>
                  <motion.div whileHover={{ x: 4 }} className="p-6 rounded-sm flex gap-5 items-start" style={{ background: IVORY, border: `1px solid ${GOLD}40`, boxShadow: `0 2px 12px ${GOLD}12` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${GREEN}15`, border: `1px solid ${GREEN}30`, color: GREEN, fontSize: "1.1rem" }}>
                      ✿
                    </div>
                    <div>
                      <p className="text-lg italic mb-2 font-medium" style={{ color: GREEN }}>{ev.name}</p>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: `${GREEN}80` }}>
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
        <section className="py-20 px-6" style={{ backgroundColor: IVORY }}>
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}70` }}>Moments</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN }}>Gallery</h2>
                <LotusDivider />
              </div>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.slice(0, 6).map((p, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <motion.div whileHover={{ scale: 1.03 }} className="aspect-square overflow-hidden rounded-sm" style={{ border: `2px solid ${GOLD}50`, boxShadow: `0 4px 16px ${GREEN}12` }}>
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
        <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${IVORY} 0%, #EEE8D8 100%)` }}>
          <div className="max-w-lg mx-auto">
            <FadeUp>
              <div className="text-center mb-12">
                <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}70` }}>Your Presence</p>
                <h2 className="text-4xl md:text-5xl italic" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN }}>RSVP</h2>
                <LotusDivider />
              </div>
            </FadeUp>
            {rsvpDone ? (
              <FadeUp>
                <div className="text-center p-12 rounded-sm" style={{ border: `1px solid ${GOLD}50`, background: `${GOLD}08` }}>
                  <p className="text-4xl mb-4">✿</p>
                  <h3 className="text-3xl italic mb-3" style={{ color: GREEN }}>Namaste</h3>
                  <p style={{ color: `${GREEN}80` }}>Your presence fills our hearts with joy.</p>
                </div>
              </FadeUp>
            ) : (
              <FadeUp delay={0.1}>
                <form onSubmit={handleRsvp} className="space-y-5 p-8 rounded-sm" style={{ background: IVORY, border: `1px solid ${GOLD}40`, boxShadow: `0 4px 20px ${GREEN}10` }}>
                  {[
                    { ph: "Your full name *", val: rsvpForm.name, k: "name", t: "text" },
                    { ph: "WhatsApp number", val: rsvpForm.phone, k: "phone", t: "tel" },
                  ].map(f => (
                    <input key={f.k} type={f.t} value={f.val} onChange={e => setRsvpForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                      className="w-full bg-transparent px-0 py-3 text-base outline-none placeholder:italic"
                      style={{ borderBottom: `1px solid ${GOLD}60`, color: GREEN, fontFamily: "'Lora', serif", fontSize: "1rem" }} />
                  ))}
                  <div className="flex gap-4">
                    {["yes", "no"].map(v => (
                      <button key={v} type="button" onClick={() => setRsvpForm(p => ({ ...p, attending: v }))}
                        className="flex-1 py-3 text-sm uppercase tracking-widest rounded-sm transition-all"
                        style={{ border: `1px solid ${rsvpForm.attending === v ? GREEN : GOLD}70`, background: rsvpForm.attending === v ? GREEN : "transparent", color: rsvpForm.attending === v ? IVORY : GREEN }}>
                        {v === "yes" ? "✓ Attending" : "✗ Regrets"}
                      </button>
                    ))}
                  </div>
                  <select value={rsvpForm.meal} onChange={e => setRsvpForm(p => ({ ...p, meal: e.target.value }))} className="w-full bg-transparent py-3 outline-none"
                    style={{ borderBottom: `1px solid ${GOLD}60`, color: `${GREEN}90`, fontFamily: "'Lora', serif" }}>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="jain">Jain</option>
                    <option value="vegan">Vegan</option>
                  </select>
                  <textarea value={rsvpForm.message} onChange={e => setRsvpForm(p => ({ ...p, message: e.target.value }))} placeholder="A message of love (optional)" rows={2}
                    className="w-full bg-transparent px-0 py-3 text-base outline-none resize-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${GOLD}50`, color: GREEN, fontFamily: "'Lora', serif", fontSize: "1rem" }} />
                  <motion.button type="submit" disabled={submittingRsvp} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    className="w-full py-4 text-sm uppercase tracking-[0.3em] rounded-sm font-medium"
                    style={{ background: GREEN, color: IVORY }}>
                    {submittingRsvp ? "Sending..." : "✿ Confirm Attendance ✿"}
                  </motion.button>
                </form>
              </FadeUp>
            )}
          </div>
        </section>
      )}

      {/* WISHES */}
      <section className="py-20 px-6" style={{ backgroundColor: IVORY }}>
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: `${GOLD}70` }}>Blessings</p>
              <h2 className="text-4xl md:text-5xl italic" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN }}>Wishes</h2>
              <LotusDivider />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <form onSubmit={handleWish} className="space-y-4 mb-12 p-8 rounded-sm" style={{ border: `1px solid ${GOLD}40`, background: `${GOLD}05` }}>
              <div className="grid grid-cols-2 gap-4">
                {[{ ph: "Your name *", val: wishForm.name, k: "name" }, { ph: "Your relation", val: wishForm.relation, k: "relation" }].map(f => (
                  <input key={f.k} value={f.val} onChange={e => setWishForm(p => ({ ...p, [f.k]: e.target.value }))} placeholder={f.ph}
                    className="bg-transparent py-2 text-base outline-none placeholder:italic"
                    style={{ borderBottom: `1px solid ${GOLD}40`, color: GREEN, fontFamily: "'Lora', serif", fontSize: "1rem" }} />
                ))}
              </div>
              <textarea value={wishForm.message} onChange={e => setWishForm(p => ({ ...p, message: e.target.value }))} placeholder="Write your blessing *" rows={3}
                className="w-full bg-transparent py-2 outline-none resize-none placeholder:italic"
                style={{ borderBottom: `1px solid ${GOLD}40`, color: GREEN, fontFamily: "'Lora', serif", fontSize: "1rem" }} />
              <motion.button type="submit" disabled={submittingWish} whileTap={{ scale: 0.98 }} className="w-full py-3 text-sm uppercase tracking-widest rounded-sm"
                style={{ border: `1px solid ${GREEN}50`, color: GREEN, background: "transparent" }}>
                {submittingWish ? "Sending..." : "Send Blessing ✿"}
              </motion.button>
            </form>
          </FadeUp>
          {wishes.length > 0 && (
            <div className="space-y-4">
              {wishes.slice(0, 6).map((w, i) => (
                <FadeUp key={w.id} delay={i * 0.05}>
                  <div className="p-6 rounded-sm" style={{ border: `1px solid ${GOLD}30`, background: IVORY, boxShadow: `0 2px 8px ${GREEN}08` }}>
                    <p className="text-lg italic mb-3 leading-relaxed" style={{ color: `${GREEN}90` }}>"{w.message}"</p>
                    <p className="text-sm font-medium" style={{ color: GOLD }}>{w.guest_name}{w.relation ? ` · ${w.relation}` : ""}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 text-center" style={{ background: `linear-gradient(180deg, ${IVORY}, #EDE7D3)` }}>
        <JasmineGarland className="w-80 mx-auto mb-8 opacity-50" />
        <h2 className="text-5xl italic mb-2" style={{ fontFamily: "'Libre Baskerville', serif", color: GREEN }}>{bride} ✿ {groom}</h2>
        {mainEvent?.date && <p className="text-sm tracking-[0.3em] uppercase mb-8" style={{ color: `${GOLD}80` }}>{format(new Date(mainEvent.date), "MMMM d, yyyy")}</p>}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { const t = `You're invited to ${bride} & ${groom}'s wedding ✿\n${window.location.href}`; window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank"); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest rounded-sm" style={{ border: `1px solid ${GREEN}50`, color: GREEN }}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => { navigator.clipboard.writeText(window.location.href); toast({ title: "Link copied ✿" }); }} className="flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest rounded-sm" style={{ border: `1px solid ${GOLD}60`, color: GOLD }}>
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
        <KolamBorder />
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: `${GREEN}40` }}>Created with Veloria · India's Finest Digital Invitations</p>
      </footer>
    </div>
  );
}
