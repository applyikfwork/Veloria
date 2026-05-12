import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Heart, Calendar, MapPin, Clock, Share2, Copy, MessageCircle, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const MOODS: Record<string, { gold: string; secondary: string; bg1: string; bg2: string; text: string }> = {
  'antique-gold-oxblood':     { gold: '#FFD700', secondary: '#9B1B30', bg1: '#120800', bg2: '#1C1000', text: '#FDF5E6' },
  'champagne-gold-emerald':   { gold: '#F5D567', secondary: '#2D5A27', bg1: '#0A100A', bg2: '#101A10', text: '#F5F0E8' },
  'rose-gold-navy':           { gold: '#D4B8C0', secondary: '#1A2B4A', bg1: '#0D0A14', bg2: '#181028', text: '#F8F0F4' },
};

function GoldenDust({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.4, vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.2, op: Math.random() * 0.5 + 0.1, od: Math.random() > 0.5 ? 1 : -1,
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const [r, g, b] = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
        ctx.fillStyle = `rgba(${r},${g},${b},${p.op})`; ctx.fill();
        p.y += p.vy; p.x += p.vx; p.op += p.od * 0.003;
        if (p.op > 0.6 || p.op < 0.05) p.od *= -1;
        if (p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; }
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, [color]);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function MughalArch({ color, opacity = 0.5 }: { color: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 400 320" fill="none" className="w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,315 L20,160 C20,55 100,20 200,20 C300,20 380,55 380,160 L380,315" stroke={color} strokeWidth="1.5" opacity={opacity * 0.9} />
      <path d="M50,315 L50,165 C50,80 110,48 200,48 C290,48 350,80 350,165 L350,315" stroke={color} strokeWidth="0.8" opacity={opacity * 0.5} />
      <path d="M80,315 L80,170 C80,105 125,78 200,78 C275,78 320,105 320,170 L320,315" stroke={color} strokeWidth="0.4" opacity={opacity * 0.3} />
      {[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9].map((t, i) => {
        const angle = Math.PI * t;
        const cx = 200 + Math.cos(Math.PI - angle) * 180;
        const cy = 20 + (1 - Math.sin(angle)) * 140;
        return <circle key={i} cx={cx} cy={cy} r="3" fill={color} opacity={opacity * 0.6} />;
      })}
      <circle cx="200" cy="20" r="6" fill={color} opacity={opacity * 0.8} />
      <circle cx="200" cy="20" r="3" fill={color} opacity={opacity} />
      <path d="M170,315 L170,175 Q170,108 200,108 Q230,108 230,175 L230,315" stroke={color} strokeWidth="0.6" opacity={opacity * 0.25} />
      <line x1="20" y1="315" x2="380" y2="315" stroke={color} strokeWidth="1" opacity={opacity * 0.4} />
      <line x1="20" y1="310" x2="380" y2="310" stroke={color} strokeWidth="0.4" opacity={opacity * 0.2} />
    </svg>
  );
}

function WaxSeal({ color, onClick }: { color: string; onClick: () => void }) {
  return (
    <motion.button onClick={onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} className="relative w-32 h-32 mx-auto block">
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-2xl">
        <circle cx="60" cy="60" r="55" fill={color} />
        <circle cx="60" cy="60" r="48" fill={color} stroke="#00000030" strokeWidth="1" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2; const x1 = 60 + Math.cos(a) * 49; const y1 = 60 + Math.sin(a) * 49;
          const x2 = 60 + Math.cos(a) * 55; const y2 = 60 + Math.sin(a) * 55;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00000030" strokeWidth="1.5" />;
        })}
        <text x="60" y="52" textAnchor="middle" fill="#000000" fillOpacity="0.7" fontSize="8" fontFamily="serif" letterSpacing="2">ROYAL</text>
        <text x="60" y="64" textAnchor="middle" fill="#000000" fillOpacity="0.8" fontSize="14" fontFamily="serif">✦</text>
        <text x="60" y="76" textAnchor="middle" fill="#000000" fillOpacity="0.7" fontSize="8" fontFamily="serif" letterSpacing="2">RSVP</text>
      </svg>
    </motion.button>
  );
}

interface Wish { id: string; guest_name: string; message: string; relation: string; created_at: string; }

export default function MaharajaGoldInvitation({ invitation }: { invitation: any }) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);
  const [showEntrance, setShowEntrance] = useState(true);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishForm, setWishForm] = useState({ name: '', relation: '', message: '' });
  const [submittingWish, setSubmittingWish] = useState(false);

  const colorMood = invitation?.rsvp_settings?.templateSettings?.colorMood || 'antique-gold-oxblood';
  const mood = MOODS[colorMood] || MOODS['antique-gold-oxblood'];

  const brideName = invitation?.bride_name || 'Ananya';
  const groomName = invitation?.groom_name || 'Vikram';
  const bridePhoto = invitation?.bride_photo_url;
  const groomPhoto = invitation?.groom_photo_url;
  const events: any[] = invitation?.events || [];
  const family = invitation?.family_details || {};
  const loveStory = invitation?.love_story || {};
  const gallery = family?.gallery || invitation?.gallery_photos;
  const galleryPhotos = [...(gallery?.couple || []), ...(gallery?.preWedding || [])].filter(Boolean);
  const rsvpEnabled = invitation?.rsvp_settings?.enabled !== false;
  const slug = invitation?.slug;
  const invId = invitation?.id;

  const firstEvent = events[0];
  const weddingDate = firstEvent?.date ? format(new Date(firstEvent.date + 'T12:00:00'), 'do MMMM yyyy') : null;

  useEffect(() => {
    if (!invId) return;
    supabase.from('wishes').select('*').eq('invitation_id', invId).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setWishes(data); });
  }, [invId]);

  const submitWish = async () => {
    if (!wishForm.name || !wishForm.message || !invId) return;
    setSubmittingWish(true);
    const { error } = await supabase.from('wishes').insert({ invitation_id: invId, ...wishForm });
    if (!error) {
      setWishes(w => [{ id: Date.now().toString(), guest_name: wishForm.name, message: wishForm.message, relation: wishForm.relation, created_at: new Date().toISOString() }, ...w]);
      setWishForm({ name: '', relation: '', message: '' });
      toast({ title: 'Blessing received!', description: 'Your blessing has been added.' });
    }
    setSubmittingWish(false);
  };

  const share = () => {
    const url = `${window.location.origin}/i/${slug}`;
    if (navigator.share) { navigator.share({ title: `${brideName} & ${groomName}'s Wedding`, url }); }
    else { navigator.clipboard.writeText(url); toast({ title: 'Link copied!' }); }
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden relative"
      style={{ background: `linear-gradient(160deg, ${mood.bg1} 0%, ${mood.bg2} 50%, ${mood.bg1} 100%)`, color: mood.text, fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
      <GoldenDust color={mood.gold} />

      {/* Entrance Overlay */}
      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: `linear-gradient(to bottom, ${mood.bg1}, ${mood.bg2})` }}>
            <div className="text-center space-y-6 px-8">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }}>
                <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: mood.gold }}>Veloria Presents</p>
                <MughalArch color={mood.gold} opacity={0.7} />
              </motion.div>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
                <h1 className="text-4xl md:text-6xl font-light tracking-wide" style={{ fontFamily: 'Pinyon Script, cursive', color: mood.gold }}>
                  {brideName} <span className="text-2xl opacity-50">&</span> {groomName}
                </h1>
              </motion.div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                onClick={() => setShowEntrance(false)}
                className="text-xs tracking-[0.25em] uppercase border px-8 py-3 rounded-full hover:bg-white/5 transition-colors mt-4"
                style={{ borderColor: mood.gold + '60', color: mood.gold }}>
                Enter the Palace ✦
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <motion.section style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-32">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <MughalArch color={mood.gold} opacity={0.6} />
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: mood.gold }}>With the blessings of God and family</p>
        </motion.div>

        <div className="flex items-center gap-8 mb-8">
          {bridePhoto && (
            <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="w-28 h-28 rounded-full overflow-hidden border-4" style={{ borderColor: mood.gold + '60' }}>
              <img src={bridePhoto} className="w-full h-full object-cover" alt={brideName} />
            </motion.div>
          )}
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7 }}>
            <Heart className="h-8 w-8" style={{ color: mood.gold }} fill={mood.gold} />
          </motion.div>
          {groomPhoto && (
            <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="w-28 h-28 rounded-full overflow-hidden border-4" style={{ borderColor: mood.gold + '60' }}>
              <img src={groomPhoto} className="w-full h-full object-cover" alt={groomName} />
            </motion.div>
          )}
        </div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="text-5xl md:text-8xl font-light mb-3" style={{ fontFamily: 'Pinyon Script, cursive', color: mood.gold }}>
          {brideName}
        </motion.h1>
        <motion.p className="text-xl tracking-[0.3em] uppercase opacity-50 mb-2" style={{ color: mood.gold }}>weds</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="text-5xl md:text-8xl font-light mb-8" style={{ fontFamily: 'Pinyon Script, cursive', color: mood.gold }}>
          {groomName}
        </motion.h1>

        {weddingDate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="border px-8 py-3 rounded-full text-sm tracking-[0.2em] uppercase" style={{ borderColor: mood.gold + '40', color: mood.gold }}>
            {weddingDate}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          className="mt-16 animate-bounce" style={{ color: mood.gold + '60' }}>
          <ChevronDown className="h-6 w-6 mx-auto" />
        </motion.div>
      </motion.section>

      {/* ── HERITAGE — Family ── */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: mood.gold + '80' }}>The Heritage</p>
          <h2 className="text-4xl font-light" style={{ color: mood.gold }}>Family of the Bride & Groom</h2>
          <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${mood.gold}, transparent)` }} />
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12">
          {[{ title: "Bride's Family", parents: family.brideParents }, { title: "Groom's Family", parents: family.groomParents }].map(({ title, parents }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center p-8 rounded-3xl border" style={{ borderColor: mood.gold + '20', background: `${mood.gold}08` }}>
              <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto mb-4" style={{ borderColor: mood.gold + '50' }}>
                <Sparkles className="h-6 w-6" style={{ color: mood.gold }} />
              </div>
              <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: mood.gold + '70' }}>{title}</p>
              {(parents || []).filter(Boolean).map((p: string, i: number) => (
                <p key={i} className="text-lg font-light mb-1" style={{ color: mood.text }}>{p}</p>
              ))}
            </motion.div>
          ))}
        </div>
        {family.blessingQuote && (
          <motion.blockquote initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mt-12 text-xl italic font-light max-w-2xl mx-auto" style={{ color: mood.gold + '90' }}>
            {family.blessingQuote}
          </motion.blockquote>
        )}
      </section>

      {/* ── SAGA — Love Story ── */}
      {(loveStory.howTheyMet || loveStory.specialMoments || loveStory.proposalStory) && (
        <section className="relative z-10 py-24 px-6 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: mood.gold + '80' }}>The Royal Saga</p>
            <h2 className="text-4xl font-light" style={{ color: mood.gold }}>Their Love Story</h2>
            <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${mood.gold}, transparent)` }} />
          </motion.div>
          <div className="relative border-l-2 pl-10 space-y-16 ml-4" style={{ borderColor: mood.gold + '30' }}>
            {[
              { key: 'howTheyMet', chapter: 'Chapter I', text: loveStory.howTheyMet },
              { key: 'specialMoments', chapter: 'Chapter II', text: loveStory.specialMoments },
              { key: 'proposalStory', chapter: 'Chapter III', text: loveStory.proposalStory },
            ].filter(c => c.text).map((c, i) => (
              <motion.div key={c.key} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative">
                <div className="absolute -left-[50px] w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs"
                  style={{ borderColor: mood.gold, background: mood.bg1, color: mood.gold }}>✦</div>
                <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: mood.gold + '70' }}>{c.chapter}</p>
                <p className="text-lg font-light leading-relaxed opacity-80">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── CEREMONIES — Events ── */}
      {events.length > 0 && (
        <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: mood.gold + '80' }}>The Royal Itinerary</p>
            <h2 className="text-4xl font-light" style={{ color: mood.gold }}>Ceremonies & Events</h2>
            <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${mood.gold}, transparent)` }} />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="rounded-3xl overflow-hidden border" style={{ borderColor: mood.secondary + '40', background: `linear-gradient(135deg, ${mood.secondary}15, ${mood.bg2})` }}>
                <div className="p-2" style={{ background: `linear-gradient(to right, ${mood.secondary}80, ${mood.secondary}40)` }}>
                  <p className="text-center text-xs tracking-[0.25em] uppercase py-1" style={{ color: mood.gold }}>{event.name}</p>
                </div>
                <div className="p-6 space-y-3">
                  {event.date && (
                    <div className="flex items-center gap-3 text-sm opacity-80">
                      <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: mood.gold }} />
                      <span>{format(new Date(event.date + 'T12:00:00'), 'EEEE, do MMMM yyyy')}</span>
                    </div>
                  )}
                  {event.time && (
                    <div className="flex items-center gap-3 text-sm opacity-80">
                      <Clock className="h-4 w-4 flex-shrink-0" style={{ color: mood.gold }} />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex items-center gap-3 text-sm opacity-80">
                      <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: mood.gold }} />
                      <div><p className="font-medium">{event.venue}</p>{event.address && <p className="text-xs opacity-60">{event.address}</p>}</div>
                    </div>
                  )}
                  {event.address && (
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`} target="_blank" rel="noopener noreferrer"
                      className="block text-center text-xs border py-2 px-4 rounded-full mt-3 transition-colors hover:bg-white/5" style={{ borderColor: mood.gold + '40', color: mood.gold }}>
                      View on Map ✦
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── DARBAR — Gallery ── */}
      {galleryPhotos.length > 0 && (
        <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: mood.gold + '80' }}>The Royal Darbar</p>
            <h2 className="text-4xl font-light" style={{ color: mood.gold }}>Gallery of Memories</h2>
            <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${mood.gold}, transparent)` }} />
          </motion.div>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {galleryPhotos.map((photo, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="break-inside-avoid rounded-2xl overflow-hidden border-2" style={{ borderColor: mood.gold + '30' }}>
                <img src={photo} className="w-full" alt="" style={{ filter: 'sepia(0.1) contrast(1.05)' }} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── RSVP — Imperial Seal ── */}
      {rsvpEnabled && (
        <section className="relative z-10 py-24 px-6 max-w-xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: mood.gold + '80' }}>The Imperial Stamp</p>
            <h2 className="text-4xl font-light mb-4" style={{ color: mood.gold }}>Confirm Your Presence</h2>
            <p className="opacity-60 text-sm">Press the Royal Seal to confirm your attendance</p>
          </motion.div>
          <WaxSeal color={mood.secondary} onClick={() => window.location.href = `/i/${slug}/rsvp`} />
          <motion.p className="mt-6 text-xs opacity-40" initial={{ opacity: 0 }} whileInView={{ opacity: 0.4 }} viewport={{ once: true }}>
            Click the seal to open the RSVP
          </motion.p>
        </section>
      )}

      {/* ── WISHES ── */}
      <section className="relative z-10 py-24 px-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: mood.gold + '80' }}>Blessings Wall</p>
          <h2 className="text-4xl font-light" style={{ color: mood.gold }}>Leave a Blessing</h2>
          <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${mood.gold}, transparent)` }} />
        </motion.div>
        <div className="rounded-3xl border p-8 mb-10 space-y-4" style={{ borderColor: mood.gold + '20', background: `${mood.gold}06` }}>
          <input value={wishForm.name} onChange={e => setWishForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
            className="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm placeholder:opacity-30 outline-none" style={{ borderColor: mood.gold + '30', color: mood.text }} />
          <input value={wishForm.relation} onChange={e => setWishForm(f => ({ ...f, relation: e.target.value }))} placeholder="Your relation (e.g. Friend, Cousin)"
            className="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm placeholder:opacity-30 outline-none" style={{ borderColor: mood.gold + '30', color: mood.text }} />
          <textarea value={wishForm.message} onChange={e => setWishForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your blessing..."
            rows={3} className="w-full bg-white/5 border rounded-xl px-4 py-3 text-sm placeholder:opacity-30 outline-none resize-none" style={{ borderColor: mood.gold + '30', color: mood.text }} />
          <button onClick={submitWish} disabled={submittingWish || !wishForm.name || !wishForm.message}
            className="w-full py-3 rounded-xl text-sm tracking-[0.15em] uppercase font-medium transition-opacity disabled:opacity-40"
            style={{ background: mood.gold, color: mood.bg1 }}>
            {submittingWish ? 'Sending...' : 'Send Blessing ✦'}
          </button>
        </div>
        <div className="space-y-4">
          {wishes.map(w => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-5" style={{ borderColor: mood.gold + '15', background: `${mood.gold}05` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: mood.secondary, color: mood.gold }}>{w.guest_name[0].toUpperCase()}</div>
                <div>
                  <p className="text-sm font-medium">{w.guest_name}</p>
                  {w.relation && <p className="text-xs opacity-40">{w.relation}</p>}
                </div>
              </div>
              <p className="text-sm opacity-70 italic">"{w.message}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 text-center border-t" style={{ borderColor: mood.gold + '15' }}>
        <p className="text-xs tracking-[0.25em] uppercase opacity-30">Crafted with love by Veloria</p>
        <button onClick={share} className="mt-4 inline-flex items-center gap-2 text-xs border px-6 py-2 rounded-full transition-colors hover:bg-white/5"
          style={{ borderColor: mood.gold + '30', color: mood.gold }}>
          <Share2 className="h-3 w-3" /> Share Invitation
        </button>
      </footer>
    </div>
  );
}
