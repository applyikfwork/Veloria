import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Calendar, MapPin, Clock, Share2, ChevronDown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const CRIMSON = '#8B0000';
const GOLD = '#D4AF37';
const EMERALD = '#1A5C1A';
const DARK_WINE = '#1A0000';

const FILTER_STYLES: Record<string, { css: string; grainOpacity: number }> = {
  'vintage-cinema':    { css: 'sepia(0.35) contrast(1.15) brightness(0.9)', grainOpacity: 0.06 },
  'modern-vibrant':    { css: 'saturate(1.4) contrast(1.05)', grainOpacity: 0.03 },
  'warm-candlelight':  { css: 'sepia(0.25) brightness(1.05) contrast(1.08)', grainOpacity: 0.05 },
};

function PetalRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const petals = Array.from({ length: 35 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight - window.innerHeight,
      size: Math.random() * 18 + 8, rot: Math.random() * 360, rotSpeed: (Math.random() - 0.5) * 1.2,
      vy: Math.random() * 1.2 + 0.5, vx: (Math.random() - 0.5) * 0.8,
      op: Math.random() * 0.5 + 0.2, r: Math.floor(Math.random() * 50 + 180), g: Math.floor(Math.random() * 30),
    }));
    let id: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      petals.forEach(p => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},20,${p.op})`; ctx.fill(); ctx.restore();
        p.y += p.vy; p.x += p.vx; p.rot += p.rotSpeed;
        if (p.y > window.innerHeight + 30) { p.y = -30; p.x = Math.random() * window.innerWidth; }
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" />;
}

function MandalaDecor({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" style={{ opacity }}>
      {[1, 2, 3, 4, 5].map(r => (
        <circle key={r} cx="200" cy="200" r={r * 36} fill="none" stroke={GOLD} strokeWidth="0.6" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1="200" y1="200" x2={200 + Math.cos(a) * 180} y2={200 + Math.sin(a) * 180} stroke={GOLD} strokeWidth="0.4" />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <circle key={i} cx={200 + Math.cos(a) * 144} cy={200 + Math.sin(a) * 144} r="6" fill="none" stroke={GOLD} strokeWidth="0.8" />;
      })}
    </svg>
  );
}

function ConfettiCannon({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    c.width = window.innerWidth; c.height = window.innerHeight;
    const colors = [GOLD, '#FF6B6B', '#4ECDC4', '#FFE66D', EMERALD, '#FF8E53'];
    const pieces = Array.from({ length: 120 }, () => ({
      x: c.width / 2, y: c.height * 0.6, vx: (Math.random() - 0.5) * 18, vy: -(Math.random() * 20 + 5),
      w: Math.random() * 10 + 4, h: Math.random() * 5 + 2, rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8, color: colors[Math.floor(Math.random() * colors.length)], alpha: 1,
    }));
    let id: number;
    let frames = 0;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pieces.forEach(p => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        p.x += p.vx; p.y += p.vy; p.vy += 0.45; p.rot += p.rotV; p.alpha -= 0.012;
      });
      frames++; if (frames < 120 && pieces.some(p => p.alpha > 0)) id = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, c.width, c.height);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [active]);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-40" />;
}

interface Wish { id: string; guest_name: string; message: string; relation: string; created_at: string; }

export default function CrimsonShaadiInvitation({ invitation }: { invitation: any }) {
  const { toast } = useToast();
  const [showEntrance, setShowEntrance] = useState(true);
  const [slideIdx, setSlideIdx] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishForm, setWishForm] = useState({ name: '', relation: '', message: '' });
  const [submittingWish, setSubmittingWish] = useState(false);

  const filterStyle = invitation?.rsvp_settings?.templateSettings?.filterStyle || 'vintage-cinema';
  const filter = FILTER_STYLES[filterStyle] || FILTER_STYLES['vintage-cinema'];

  const brideName = invitation?.bride_name || 'Rhea';
  const groomName = invitation?.groom_name || 'Kabir';
  const bridePhoto = invitation?.bride_photo_url;
  const groomPhoto = invitation?.groom_photo_url;
  const events: any[] = invitation?.events || [];
  const family = invitation?.family_details || {};
  const gallery = family?.gallery || invitation?.gallery_photos;
  const galleryPhotos = [...(gallery?.couple || []), ...(gallery?.preWedding || [])].filter(Boolean);
  const rsvpEnabled = invitation?.rsvp_settings?.enabled !== false;
  const slug = invitation?.slug;
  const invId = invitation?.id;

  const firstEvent = events.find(e => e.name?.toLowerCase().includes('wedding') || e.name?.toLowerCase().includes('ceremony')) || events[0];
  const weddingDate = firstEvent?.date ? format(new Date(firstEvent.date + 'T12:00:00'), 'do MMMM yyyy').toUpperCase() : null;

  useEffect(() => {
    if (!invId) return;
    supabase.from('wishes').select('*').eq('invitation_id', invId).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setWishes(data); });
  }, [invId]);

  useEffect(() => {
    if (galleryPhotos.length < 2) return;
    const t = setInterval(() => setSlideIdx(i => (i + 1) % galleryPhotos.length), 3500);
    return () => clearInterval(t);
  }, [galleryPhotos.length]);

  const submitWish = async () => {
    if (!wishForm.name || !wishForm.message || !invId) return;
    setSubmittingWish(true);
    const { error } = await supabase.from('wishes').insert({ invitation_id: invId, ...wishForm });
    if (!error) {
      setWishes(w => [{ id: Date.now().toString(), guest_name: wishForm.name, message: wishForm.message, relation: wishForm.relation, created_at: new Date().toISOString() }, ...w]);
      setWishForm({ name: '', relation: '', message: '' });
      toast({ title: '💌 Blessing sent!', description: 'Your love has been received.' });
    }
    setSubmittingWish(false);
  };

  const share = () => {
    const url = `${window.location.origin}/i/${slug}`;
    if (navigator.share) navigator.share({ title: `${brideName} & ${groomName}'s Wedding`, url });
    else { navigator.clipboard.writeText(url); toast({ title: '🔗 Link copied!' }); }
  };

  const handleRSVP = () => {
    setConfetti(true);
    setTimeout(() => { setConfetti(false); window.location.href = `/i/${slug}/rsvp`; }, 2000);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: `linear-gradient(160deg, ${DARK_WINE} 0%, #2A0101 50%, ${DARK_WINE} 100%)`, fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}>
      <PetalRain />
      <ConfettiCannon active={confetti} />

      {/* Film grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        opacity: filter.grainOpacity, mixBlendMode: 'overlay',
      }} />

      {/* ── ENTRANCE ── */}
      <AnimatePresence>
        {showEntrance && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(to bottom, ${DARK_WINE}, ${CRIMSON}30, ${DARK_WINE})` }}>
            <div className="absolute inset-0 flex items-center justify-center"><MandalaDecor opacity={0.12} /></div>
            <div className="text-center space-y-6 px-8 relative z-10">
              <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <p className="text-xs tracking-[0.4em] uppercase text-gold-400" style={{ color: GOLD }}>A Bollywood Love Story</p>
              </motion.div>
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: 'spring' }}>
                <h1 className="text-5xl md:text-7xl font-light" style={{ fontFamily: 'Pinyon Script, cursive', color: GOLD, textShadow: `0 0 40px ${GOLD}60` }}>
                  {brideName} & {groomName}
                </h1>
              </motion.div>
              {weddingDate && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="text-sm tracking-[0.3em] uppercase" style={{ color: GOLD + '80' }}>
                  {weddingDate}
                </motion.p>
              )}
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                onClick={() => setShowEntrance(false)}
                className="text-xs tracking-[0.3em] uppercase border px-8 py-3 rounded-full mt-4 transition-colors hover:bg-white/5"
                style={{ borderColor: GOLD + '60', color: GOLD }}>
                Watch Their Story 🌹
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOVIE POSTER HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${CRIMSON}30 0%, transparent 70%)` }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-6 pointer-events-none"><MandalaDecor opacity={0.07} /></div>

        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xs tracking-[0.4em] uppercase mb-8" style={{ color: GOLD }}>
            A Grand Bollywood Wedding
          </motion.p>

          <div className="flex items-center justify-center gap-6 mb-8">
            {[bridePhoto, groomPhoto].map((photo, i) => (
              photo && (
                <motion.div key={i} initial={{ x: i === 0 ? -60 : 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                  className="w-32 h-40 md:w-40 md:h-52 rounded-2xl overflow-hidden border-2" style={{ borderColor: GOLD + '60', filter: filter.css }}>
                  <img src={photo} className="w-full h-full object-cover" alt="" />
                </motion.div>
              )
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <motion.h1 initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9, type: 'spring', stiffness: 100 }}
              className="text-5xl md:text-8xl" style={{ fontFamily: 'Pinyon Script, cursive', color: GOLD, textShadow: `0 0 30px ${GOLD}50` }}>
              {brideName}
            </motion.h1>
            <p className="text-xl my-2 tracking-[0.4em] opacity-40 uppercase text-white">weds</p>
            <motion.h1 initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0, type: 'spring', stiffness: 100 }}
              className="text-5xl md:text-8xl" style={{ fontFamily: 'Pinyon Script, cursive', color: GOLD, textShadow: `0 0 30px ${GOLD}50` }}>
              {groomName}
            </motion.h1>
          </motion.div>

          {weddingDate && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
              className="mt-6 border px-6 py-2 rounded-full inline-block text-xs tracking-[0.3em] uppercase" style={{ borderColor: GOLD + '50', color: GOLD }}>
              COMING — {weddingDate}
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-12 animate-bounce" style={{ color: GOLD + '60' }}>
          <ChevronDown className="h-6 w-6 mx-auto" />
        </motion.div>
      </section>

      {/* ── STAR CAST — Family ── */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD + '80' }}>The Supporting Cast</p>
          <h2 className="text-4xl font-light text-white mb-2">Our Families</h2>
          <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8">
          {[{ title: "Bride's Family", parents: family.brideParents }, { title: "Groom's Family", parents: family.groomParents }].map(({ title, parents }) => (
            <motion.div key={title} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="rounded-3xl border p-8 text-center" style={{ borderColor: GOLD + '20', background: `${CRIMSON}20` }}>
              <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto mb-4" style={{ borderColor: GOLD + '60', background: `${CRIMSON}40` }}>
                <Heart className="h-6 w-6" style={{ color: GOLD }} />
              </div>
              <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: GOLD + '70' }}>{title}</p>
              {(parents || []).filter(Boolean).map((p: string, i: number) => (
                <p key={i} className="text-lg text-white/80 font-light mb-1">{p}</p>
              ))}
            </motion.div>
          ))}
        </div>
        {family.blessingQuote && (
          <motion.blockquote initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mt-12 text-xl italic font-light max-w-2xl mx-auto" style={{ color: GOLD + '80' }}>
            {family.blessingQuote}
          </motion.blockquote>
        )}
      </section>

      {/* ── SCENES — Events ── */}
      {events.length > 0 && (
        <section className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD + '80' }}>The Grand Script</p>
            <h2 className="text-4xl font-light text-white mb-2">Scenes & Ceremonies</h2>
            <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="rounded-3xl border overflow-hidden" style={{ borderColor: GOLD + '30', background: `linear-gradient(135deg, ${CRIMSON}25, #2A010115)` }}>
                <div className="py-2 px-4 text-center" style={{ background: `linear-gradient(to right, ${CRIMSON}90, ${CRIMSON}50)` }}>
                  <p className="text-xs tracking-[0.3em] uppercase" style={{ color: GOLD }}>— Scene {i + 1} —</p>
                  <p className="text-xl font-light text-white mt-0.5">{event.name}</p>
                </div>
                <div className="p-6 space-y-3">
                  {event.date && (
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <Calendar className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <span>{format(new Date(event.date + 'T12:00:00'), 'EEEE, do MMMM yyyy')}</span>
                    </div>
                  )}
                  {event.time && (
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <Clock className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.venue && (
                    <div className="flex items-center gap-3 text-sm text-white/70">
                      <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
                      <div><p className="font-medium text-white">{event.venue}</p>{event.address && <p className="text-xs opacity-60">{event.address}</p>}</div>
                    </div>
                  )}
                  {event.address && (
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`} target="_blank" rel="noopener noreferrer"
                      className="block text-center text-xs border py-2 px-4 rounded-full transition-colors hover:bg-white/5" style={{ borderColor: GOLD + '40', color: GOLD }}>
                      Directions 🗺
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── MONTAGE — Gallery ── */}
      {galleryPhotos.length > 0 && (
        <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD + '80' }}>The Montage</p>
            <h2 className="text-4xl font-light text-white mb-2">Cinematic Gallery</h2>
            <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
          </motion.div>
          {/* Slideshow */}
          <div className="relative rounded-3xl overflow-hidden border-2 mb-6 aspect-video" style={{ borderColor: GOLD + '30' }}>
            <AnimatePresence mode="wait">
              <motion.img key={slideIdx} src={galleryPhotos[slideIdx]} className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }} style={{ filter: filter.css }} />
            </AnimatePresence>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, #00000050)' }} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryPhotos.map((_, i) => (
                <button key={i} onClick={() => setSlideIdx(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all" style={{ background: i === slideIdx ? GOLD : GOLD + '40' }} />
              ))}
            </div>
          </div>
          {/* Filmstrip */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {galleryPhotos.map((photo, i) => (
              <button key={i} onClick={() => setSlideIdx(i)} className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: i === slideIdx ? GOLD : 'transparent' }}>
                <img src={photo} className="w-full h-full object-cover" style={{ filter: filter.css }} alt="" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      {rsvpEnabled && (
        <section className="relative z-10 py-24 px-6 max-w-xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD + '80' }}>The Grand Celebration</p>
            <h2 className="text-4xl font-light text-white mb-4">Will You Attend?</h2>
            <p className="text-white/40 text-sm">Tap below for a surprise celebration 🎉</p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${CRIMSON}80` }} whileTap={{ scale: 0.95 }}
            onClick={handleRSVP}
            className="px-16 py-5 rounded-full text-lg font-semibold text-white shadow-2xl transition-all"
            style={{ background: `linear-gradient(135deg, ${CRIMSON}, #C41E3A)`, border: `2px solid ${GOLD}40` }}>
            💃 Yes, I'll be There!
          </motion.button>
          <p className="mt-4 text-xs opacity-30 text-white">Tap to confirm attendance with style</p>
        </section>
      )}

      {/* ── WISHES ── */}
      <section className="relative z-10 py-24 px-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD + '80' }}>Shower of Love</p>
          <h2 className="text-4xl font-light text-white mb-2">Leave a Wish</h2>
          <div className="w-32 h-px mx-auto mt-4" style={{ background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />
        </motion.div>
        <div className="rounded-3xl border p-8 mb-10 space-y-4" style={{ borderColor: GOLD + '20', background: `${CRIMSON}15` }}>
          <input value={wishForm.name} onChange={e => setWishForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/50" />
          <input value={wishForm.relation} onChange={e => setWishForm(f => ({ ...f, relation: e.target.value }))} placeholder="Your relation"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/50" />
          <textarea value={wishForm.message} onChange={e => setWishForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your heartfelt wish..."
            rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none resize-none focus:border-amber-500/50" />
          <button onClick={submitWish} disabled={submittingWish || !wishForm.name || !wishForm.message}
            className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all"
            style={{ background: `linear-gradient(to right, ${CRIMSON}, #C41E3A)`, color: GOLD }}>
            {submittingWish ? 'Sending...' : '🌹 Send Your Love'}
          </button>
        </div>
        <div className="space-y-4">
          {wishes.map(w => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-5" style={{ borderColor: GOLD + '15', background: `${CRIMSON}12` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: CRIMSON, color: GOLD }}>
                  {w.guest_name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{w.guest_name}</p>
                  {w.relation && <p className="text-xs" style={{ color: GOLD + '70' }}>{w.relation}</p>}
                </div>
              </div>
              <p className="text-white/60 text-sm italic">"{w.message}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 text-center border-t" style={{ borderColor: GOLD + '15' }}>
        <p className="text-xs tracking-[0.25em] uppercase text-white/20">Crafted with love by Veloria</p>
        <button onClick={share} className="mt-4 inline-flex items-center gap-2 text-xs border px-6 py-2 rounded-full transition-colors hover:bg-white/5"
          style={{ borderColor: GOLD + '30', color: GOLD }}>
          <Share2 className="h-3 w-3" /> Share This Invitation
        </button>
      </footer>
    </div>
  );
}
