import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Search, Sparkles, X, ChevronRight, Users, Crown, Star,
  Flame, Eye, Wand2, Filter, Check, GitCompare, ArrowRight,
  Layers, Globe, Heart, Zap, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TEMPLATES, CEREMONY_FILTERS, STYLE_FILTERS, REGION_FILTERS,
  MOOD_FILTERS, BUDGET_FILTERS, CURATED_COLLECTIONS, TRENDING_TEMPLATE_IDS,
  filterTemplates, getTemplateById, type WeddingTemplate
} from "@/lib/templates";
import { getTemplateModule } from "@/templates/registry";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// ─── Animated Card Preview ───────────────────────────────────────────────────

function AnimatedCardPreview({ template }: { template: WeddingTemplate }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const animType = template.previewAnimation;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = c.offsetWidth;
    c.height = c.offsetHeight;
    const W = c.width, H = c.height;
    const accent = template.accentColor;
    const hex = (h: string) => {
      const r = parseInt(h.slice(1, 3), 16);
      const g = parseInt(h.slice(3, 5), 16);
      const b = parseInt(h.slice(5, 7), 16);
      return `${r},${g},${b}`;
    };
    const rgb = hex(accent.length === 7 ? accent : '#D4AF37');

    let t = 0;
    let animId: number;

    if (animType === 'stars') {
      const stars = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3, phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.008,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        stars.forEach(s => {
          const op = (Math.sin(s.phase + t * s.speed * 60) + 1) / 2 * 0.8 + 0.1;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${op})`; ctx.fill();
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'petals' || animType === 'bloom') {
      const petals = Array.from({ length: 25 }, () => ({
        x: Math.random() * W, y: Math.random() * H - H,
        speed: Math.random() * 0.8 + 0.3, drift: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 4 + 2, op: Math.random() * 0.5 + 0.2,
        rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.04,
        sway: Math.random() * 2, swaySpeed: Math.random() * 0.03 + 0.01,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        petals.forEach(p => {
          p.y += p.speed; p.x += p.drift + Math.sin(t * p.swaySpeed * 60) * p.sway * 0.08;
          p.rot += p.rotSpeed;
          if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * 1.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${p.op})`; ctx.fill(); ctx.restore();
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'sparkle') {
      const sparks = Array.from({ length: 35 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.5 + 0.5, phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.04 + 0.01,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        sparks.forEach(s => {
          const op = (Math.sin(s.phase + t * s.speed * 60) + 1) / 2;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * op, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${op * 0.9})`; ctx.fill();
          if (op > 0.8) {
            const len = s.r * 3;
            [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2].forEach(a => {
              ctx.beginPath();
              ctx.moveTo(s.x, s.y);
              ctx.lineTo(s.x + Math.cos(a) * len, s.y + Math.sin(a) * len);
              ctx.strokeStyle = `rgba(${rgb},${(op - 0.8) * 2})`;
              ctx.lineWidth = 0.5; ctx.stroke();
            });
          }
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'particles') {
      const pts = Array.from({ length: 40 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.5 + 0.5, op: Math.random() * 0.5 + 0.15,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${p.op})`; ctx.fill();
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'wave') {
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        [0.7, 0.78, 0.86].forEach((yFrac, i) => {
          ctx.beginPath();
          for (let x = 0; x <= W; x += 3) {
            const y = H * yFrac + Math.sin(x * 0.02 + t * (1 + i * 0.3)) * (6 + i * 3);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
          ctx.fillStyle = `rgba(${rgb},${0.12 - i * 0.03})`; ctx.fill();
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'garba') {
      const dots = Array.from({ length: 32 }, (_, i) => ({
        angle: (i / 32) * Math.PI * 2, r: 30 + (i % 3) * 15,
        speed: 0.015 * (i % 2 === 0 ? 1 : -1), size: Math.random() * 2.5 + 1,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        dots.forEach(d => {
          d.angle += d.speed;
          const x = W / 2 + Math.cos(d.angle) * d.r;
          const y = H / 2 + Math.sin(d.angle) * d.r * 0.55;
          ctx.beginPath(); ctx.arc(x, y, d.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},0.5)`; ctx.fill();
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'rain') {
      const drops = Array.from({ length: 60 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        len: Math.random() * 12 + 5, speed: Math.random() * 2.5 + 1.5,
        op: Math.random() * 0.3 + 0.1,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        drops.forEach(d => {
          d.y += d.speed;
          if (d.y > H) { d.y = -d.len; d.x = Math.random() * W; }
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1, d.y + d.len);
          ctx.strokeStyle = `rgba(${rgb},${d.op})`; ctx.lineWidth = 0.8; ctx.stroke();
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'mandala') {
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        const cx = W / 2, cy = H / 2;
        [1, 2, 3].forEach((ring, ri) => {
          const r = 15 + ring * 15, pts = 6 + ring * 3;
          for (let i = 0; i < pts; i++) {
            const a = (i / pts) * Math.PI * 2 + t * 0.3 * (ri % 2 === 0 ? 1 : -1);
            const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
            ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${0.5 - ri * 0.1})`; ctx.fill();
          }
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rgb},0.12)`; ctx.lineWidth = 0.8; ctx.stroke();
        });
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},0.6)`; ctx.fill();
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else if (animType === 'shimmer') {
      const bars = Array.from({ length: 5 }, (_, i) => ({ x: i * (W / 5) - W, width: W / 5 * 0.6 }));
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        bars.forEach((b, i) => {
          b.x = ((t * 80 + i * (W / 5)) % (W + W / 5)) - W / 5;
          const grad = ctx.createLinearGradient(b.x, 0, b.x + b.width, 0);
          grad.addColorStop(0, `rgba(${rgb},0)`);
          grad.addColorStop(0.5, `rgba(${rgb},0.12)`);
          grad.addColorStop(1, `rgba(${rgb},0)`);
          ctx.fillStyle = grad;
          ctx.fillRect(b.x, 0, b.width, H);
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
    } else {
      // glow fallback
      const draw = () => {
        ctx.clearRect(0, 0, W, H);
        t += 0.016;
        const op = (Math.sin(t * 1.5) + 1) / 2 * 0.18 + 0.04;
        const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
        grad.addColorStop(0, `rgba(${rgb},${op})`);
        grad.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        animId = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => cancelAnimationFrame(animId);
  }, [template.id]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Template Card ─────────────────────────────────────────────────────────

function TemplateCard({
  template, onPreview, onTryLive, compareIds, onToggleCompare,
}: {
  template: WeddingTemplate;
  onPreview: (t: WeddingTemplate) => void;
  onTryLive: (t: WeddingTemplate) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}) {
  const [, setLocation] = useLocation();
  const inCompare = compareIds.includes(template.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden border cursor-pointer shadow-sm hover:shadow-lg transition-all"
      style={{ borderColor: inCompare ? template.accentColor : template.accentColor + '44' }}
    >
      {/* Animated Card Visual */}
      <div
        className={`relative h-52 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${template.cardGradient}`}
        onClick={() => onPreview(template)}
      >
        <AnimatedCardPreview template={template} />
        <div className="absolute inset-3 rounded-xl border border-white/10 pointer-events-none z-10" />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.4 }}
            className="text-5xl mb-3 drop-shadow-lg"
          >
            {template.heroEmoji}
          </motion.div>
          <h3 className="text-xl font-serif font-bold text-white drop-shadow-md text-center px-4">
            {template.name}
          </h3>
          <p className="text-xs text-white/50 mt-1 px-4 text-center line-clamp-1">{template.tagline}</p>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 z-20 flex-wrap p-4">
          <Button size="sm" variant="outline"
            className="border-white/40 text-white hover:bg-white/20 rounded-full h-8 text-xs"
            onClick={(e) => { e.stopPropagation(); onPreview(template); }}>
            <Eye className="h-3 w-3 mr-1" /> Preview
          </Button>
          <Button size="sm"
            className="text-black rounded-full h-8 text-xs font-semibold"
            style={{ backgroundColor: template.accentColor }}
            onClick={(e) => { e.stopPropagation(); onTryLive(template); }}>
            <Zap className="h-3 w-3 mr-1" /> Try It Live
          </Button>
          <Button size="sm" variant="outline"
            className={`rounded-full h-8 text-xs font-semibold transition-all ${inCompare ? 'bg-white/25 border-white text-white' : 'border-white/40 text-white hover:bg-white/15'}`}
            onClick={(e) => { e.stopPropagation(); onToggleCompare(template.id); }}>
            <GitCompare className="h-3 w-3 mr-1" /> {inCompare ? '✓ Added' : 'Compare'}
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-30">
          {template.isPremium && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/90 text-black">Premium</span>
          )}
          {template.isNew && !template.isPremium && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/90 text-black">New</span>
          )}
          {template.isTrending && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/90 text-white flex items-center gap-1">
              <Flame className="h-2.5 w-2.5" /> Hot
            </span>
          )}
        </div>

        {/* Compare checkbox */}
        <button
          className={`absolute top-3 right-3 z-30 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${inCompare ? 'border-white bg-white' : 'border-white/40 bg-transparent hover:border-white/70'}`}
          onClick={(e) => { e.stopPropagation(); onToggleCompare(template.id); }}
        >
          {inCompare && <Check className="h-3 w-3 text-black" />}
        </button>
      </div>

      {/* Card Info */}
      <div className="p-4 bg-card border-t border-border/20 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {template.swatches.slice(0, 4).map((color, i) => (
              <div key={i} className="w-4 h-4 rounded-full border border-foreground/10 shadow-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          {template.usedByCount > 0 ? (
            <div className="flex items-center gap-1 text-foreground/40 text-xs">
              <Users className="h-3 w-3" />
              <span>{template.usedByCount.toLocaleString()}</span>
            </div>
          ) : (
            <span className="text-[9px] uppercase tracking-wider text-emerald-500 font-semibold">Just launched</span>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {template.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/8 border border-primary/20 text-primary/70">{tag}</span>
          ))}
          {template.budgetTier === 'free' && (
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">Free</span>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            className="flex-1 rounded-xl h-9 text-xs font-semibold"
            style={{ backgroundColor: template.accentColor + '18', color: template.accentColor, borderColor: template.accentColor + '44' }}
            variant="outline"
            onClick={() => onTryLive(template)}
          >
            Try It Live
          </Button>
          <Button
            className="rounded-xl h-9 px-3 text-xs font-semibold text-black"
            style={{ backgroundColor: template.accentColor }}
            onClick={() => setLocation(`/create?template=${template.id}`)}
          >
            Use <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Try It Live Modal ────────────────────────────────────────────────────────

function TryItLiveModal({ template, onClose, onUse }: { template: WeddingTemplate; onClose: () => void; onUse: () => void }) {
  const mod = getTemplateModule(template.id);
  const sampleInvitation = {
    id: 'preview-' + template.id,
    bride_name: 'Priya',
    groom_name: 'Arjun',
    events: [
      { id: '1', name: 'Wedding Ceremony', date: '2026-02-14', time: '11:00 AM', venue: 'The Grand Palace Ballroom, Mumbai', address: 'Marine Drive, Mumbai' },
      { id: '2', name: 'Reception', date: '2026-02-14', time: '7:00 PM', venue: 'Terrace Gardens, Mumbai', address: 'Marine Drive, Mumbai' },
    ],
    family_details: {
      brideParents: ['Mr. Sunil Sharma', 'Mrs. Anita Sharma'],
      groomParents: ['Mr. Vikram Mehta', 'Mrs. Seema Mehta'],
      blessingQuote: 'May their love be as timeless as the stars above.',
    },
    rsvp_config: { enabled: true },
    gallery_photos: null,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-foreground/80 backdrop-blur-md flex flex-col"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-card/95 border-b border-border/30 shrink-0 z-10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{template.heroEmoji}</span>
          <div>
            <h3 className="font-serif text-base font-bold text-foreground">{template.name}</h3>
            <p className="text-xs text-foreground/50">Live preview — sample data · scroll to explore</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="rounded-full text-black font-semibold h-8 text-xs" style={{ backgroundColor: template.accentColor }} onClick={onUse}>
            Customize This Template <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-foreground/8 hover:bg-foreground/15 flex items-center justify-center text-foreground/50 hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preview iframe-like scroll area */}
      <div className="flex-1 overflow-hidden flex items-start justify-center" onClick={e => e.stopPropagation()}>
        <div className="w-full max-w-sm md:max-w-md mx-auto h-full overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {mod?.InvitationComponent ? (
            <div className="pointer-events-none select-none">
              <mod.InvitationComponent invitation={sampleInvitation} />
            </div>
          ) : (
            <div className={`w-full min-h-full flex flex-col items-center justify-center bg-gradient-to-br ${template.cardGradient} p-12`}>
              <div className="text-6xl mb-6">{template.heroEmoji}</div>
              <h2 className="text-4xl font-serif text-white mb-3">Priya & Arjun</h2>
              <p className="text-white/60 text-center">February 14, 2026</p>
              <p className="text-white/40 text-sm mt-2">The Grand Palace, Mumbai</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Side-by-Side Comparison ──────────────────────────────────────────────────

function ComparisonDrawer({ ids, onClose, onUse }: { ids: string[]; onClose: () => void; onUse: (id: string) => void }) {
  const templates = ids.map(id => getTemplateById(id)).filter(Boolean) as WeddingTemplate[];
  if (!templates.length) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-[200] bg-card/97 border-t border-border/40 shadow-2xl backdrop-blur-md"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-border/20">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Comparing {templates.length} Templates</span>
            <span className="text-xs text-foreground/40">Select up to 3</span>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-full bg-foreground/8 flex items-center justify-center text-foreground/50 hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <div className="grid pb-4 pt-3 px-6 gap-4" style={{ gridTemplateColumns: `repeat(${templates.length}, minmax(240px, 1fr))` }}>
            {templates.map(t => (
              <div key={t.id} className="flex flex-col gap-3">
                <div className={`h-36 rounded-xl bg-gradient-to-br ${t.cardGradient} flex items-center justify-center relative overflow-hidden border`} style={{ borderColor: t.accentColor + '40' }}>
                  <div className="text-4xl">{t.heroEmoji}</div>
                  <div className="absolute bottom-2 left-0 right-0 text-center text-white text-sm font-serif font-bold">{t.name}</div>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    ['Style', t.style], ['Region', t.region.replace('-', ' ')],
                    ['Mood', t.mood], ['Ceremony', t.ceremony], ['Budget', t.budgetTier],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-foreground/40 capitalize">{k}</span>
                      <span className="text-foreground/80 capitalize">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="text-foreground/40">Used by</span>
                    <span className="text-foreground/80">{t.usedByCount > 0 ? `${t.usedByCount.toLocaleString()} couples` : 'Just launched'}</span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {t.swatches.slice(0, 4).map((c, i) => <div key={i} className="w-5 h-5 rounded-full border border-foreground/10" style={{ backgroundColor: c }} />)}
                </div>
                <Button
                  size="sm"
                  className="rounded-xl h-8 text-xs font-semibold text-black"
                  style={{ backgroundColor: t.accentColor }}
                  onClick={() => onUse(t.id)}
                  disabled={t.isPremium}
                >
                  {t.isPremium ? <><Crown className="h-3 w-3 mr-1" />Upgrade</> : `Use ${t.name}`}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── AI Quiz Modal ────────────────────────────────────────────────────────────

const AI_QUIZ_STEPS = [
  {
    question: "What's the occasion?",
    key: 'ceremony',
    options: ['Wedding', 'Engagement', 'Sangeet', 'Mehndi & Haldi', 'Reception', 'All Events'],
    icon: '💍',
  },
  {
    question: "What vibe are you going for?",
    key: 'vibe',
    options: ['Royal & Grand', 'Romantic & Soft', 'Modern & Minimal', 'Festive & Colourful', 'Traditional & Classic', 'Destination & Breezy'],
    icon: '✨',
  },
  {
    question: "Your cultural heritage?",
    key: 'region',
    options: ['North Indian / Rajput', 'South Indian / Tamil / Kerala', 'Punjabi / Sikh', 'Bengali / Odiya', 'Marathi / Gujarati', 'Pan-Indian / NRI / Fusion'],
    icon: '🗺️',
  },
  {
    question: "What's your colour preference?",
    key: 'color',
    options: ['Rich Golds & Reds', 'Blush & Pastels', 'Dark & Moody', 'Whites & Ivories', 'Bright & Festive', 'No Preference'],
    icon: '🎨',
  },
  {
    question: "Budget for this invitation?",
    key: 'budget',
    options: ['Free only — just starting out', 'Open to Premium — want the best'],
    icon: '💰',
  },
];

function AiQuizModal({ onClose, onPick }: { onClose: () => void; onPick: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finding, setFinding] = useState(false);

  const pickTemplate = (finalAnswers: Record<string, string>) => {
    setFinding(true);
    setTimeout(() => {
      const { ceremony, vibe, region, color, budget } = finalAnswers;
      const isPremiumOk = budget?.includes('Premium');

      let pool = TEMPLATES.filter(t => !t.isPremium || isPremiumOk);

      // Match ceremony
      if (ceremony && !ceremony.includes('All')) {
        const cer = ceremony.toLowerCase().split(' ')[0];
        const cerMatch = pool.filter(t => t.ceremony.includes(cer) || cer.includes(t.ceremony));
        if (cerMatch.length > 0) pool = cerMatch;
      }

      // Match region
      if (region) {
        const r = region.toLowerCase();
        let regionMatch = pool;
        if (r.includes('north') || r.includes('rajput')) regionMatch = pool.filter(t => t.region === 'north-indian' || t.region === 'rajasthani');
        else if (r.includes('south') || r.includes('tamil') || r.includes('kerala')) regionMatch = pool.filter(t => ['south-indian', 'kerala'].includes(t.region));
        else if (r.includes('punjabi') || r.includes('sikh')) regionMatch = pool.filter(t => t.region === 'punjabi');
        else if (r.includes('bengali') || r.includes('odiya')) regionMatch = pool.filter(t => t.region === 'bengali');
        else if (r.includes('marathi') || r.includes('gujarati')) regionMatch = pool.filter(t => ['pan-indian', 'rajasthani'].includes(t.region));
        else if (r.includes('nri') || r.includes('fusion') || r.includes('pan')) regionMatch = pool.filter(t => ['pan-indian', 'destination', 'modern'].includes(t.region));
        if (regionMatch.length > 0) pool = regionMatch;
      }

      // Match vibe / mood
      if (vibe) {
        const v = vibe.toLowerCase();
        let moodMatch = pool;
        if (v.includes('royal') || v.includes('grand')) moodMatch = pool.filter(t => t.mood === 'royal' || t.style === 'luxury');
        else if (v.includes('romantic')) moodMatch = pool.filter(t => t.mood === 'romantic');
        else if (v.includes('minimal') || v.includes('modern')) moodMatch = pool.filter(t => t.style === 'minimal' || t.mood === 'modern');
        else if (v.includes('festive') || v.includes('colourful')) moodMatch = pool.filter(t => t.mood === 'festive' || t.style === 'festive' || t.style === 'bollywood');
        else if (v.includes('destination') || v.includes('breezy')) moodMatch = pool.filter(t => t.style === 'destination' || t.region === 'destination');
        if (moodMatch.length > 0) pool = moodMatch;
      }

      // Match color
      if (color) {
        const c = color.toLowerCase();
        let colorMatch = pool;
        if (c.includes('gold') || c.includes('red')) colorMatch = pool.filter(t => t.swatches.some(s => /D4AF37|DC143C|C9973A|FF6B35/i.test(s)));
        else if (c.includes('blush') || c.includes('pastel')) colorMatch = pool.filter(t => t.mood === 'romantic' && t.style !== 'bollywood');
        else if (c.includes('dark') || c.includes('moody')) colorMatch = pool.filter(t => t.previewAnimation === 'stars' || t.previewAnimation === 'shimmer');
        else if (c.includes('white') || c.includes('ivory')) colorMatch = pool.filter(t => t.style === 'minimal');
        else if (c.includes('bright') || c.includes('festive')) colorMatch = pool.filter(t => t.mood === 'festive' || t.mood === 'playful');
        if (colorMatch.length > 0) pool = colorMatch;
      }

      // Fallback
      if (pool.length === 0) pool = TEMPLATES.filter(t => !t.isPremium || isPremiumOk);

      // Sort by trendiness
      pool.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
      onPick(pool[0].id);
    }, 1800);
  };

  const current = AI_QUIZ_STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-foreground/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-card border border-border/40 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <button onClick={onClose} className="absolute top-5 right-5 h-8 w-8 rounded-full bg-foreground/8 hover:bg-foreground/15 flex items-center justify-center text-foreground/50">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-2xl bg-purple-500/15 flex items-center justify-center text-xl">
              {finding ? '🔮' : current.icon}
            </div>
            <div>
              <h3 className="text-foreground font-serif text-lg">AI Template Recommender</h3>
              <p className="text-xs text-foreground/40">{finding ? 'Finding your perfect match...' : `${AI_QUIZ_STEPS.length} questions · 30 seconds`}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-2">
            {AI_QUIZ_STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-purple-500' : i === step ? 'bg-purple-400' : 'bg-foreground/10'}`} />
            ))}
          </div>
          <p className="text-xs text-foreground/30">Step {Math.min(step + 1, AI_QUIZ_STEPS.length)} of {AI_QUIZ_STEPS.length}</p>
        </div>

        <AnimatePresence mode="wait">
          {finding ? (
            <motion.div
              key="finding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-8 pb-10 text-center"
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity } }}
                className="text-5xl mb-6 inline-block"
              >
                ✨
              </motion.div>
              <p className="text-foreground/60 text-sm">Analysing your preferences across {TEMPLATES.length} templates...</p>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-8 pb-8"
            >
              <h4 className="text-foreground font-serif text-xl mb-5">{current.question}</h4>
              <div className="grid grid-cols-2 gap-2">
                {current.options.map(opt => (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const newAnswers = { ...answers, [current.key]: opt };
                      setAnswers(newAnswers);
                      if (step < AI_QUIZ_STEPS.length - 1) {
                        setStep(s => s + 1);
                      } else {
                        pickTemplate(newAnswers);
                      }
                    }}
                    className={`p-3 rounded-xl text-sm text-left border transition-all ${answers[current.key] === opt ? 'border-purple-500 bg-purple-500/15 text-foreground' : 'border-border/30 text-foreground/60 hover:border-purple-500/40 hover:bg-purple-500/8'}`}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="mt-5 text-xs text-foreground/40 hover:text-foreground flex items-center gap-1">
                  ← Back
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Smart Filter Bar ─────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
        active
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-background border-border/40 text-foreground/60 hover:border-primary/50 hover:text-foreground'
      }`}
    >
      {label}
    </motion.button>
  );
}

// ─── Curated Collections ──────────────────────────────────────────────────────

function CuratedCollections({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-5">
        <Layers className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-serif text-foreground font-bold">Curated Collections</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {CURATED_COLLECTIONS.map(col => {
          const count = TEMPLATES.filter(t => t.collection === col.id).length;
          return (
            <motion.button
              key={col.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(col.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/30 bg-card hover:border-primary/40 hover:bg-card/80 transition-all text-center group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{col.emoji}</span>
              <span className="text-xs font-semibold text-foreground/80 leading-tight">{col.name}</span>
              <span className="text-[10px] text-foreground/40">{count} templates</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [ceremonyFilter, setCeremonyFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [moodFilter, setMoodFilter] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("All");
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'free-first'>('popular');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [previewTemplate, setPreviewTemplate] = useState<WeddingTemplate | null>(null);
  const [tryLiveTemplate, setTryLiveTemplate] = useState<WeddingTemplate | null>(null);
  const [showAiQuiz, setShowAiQuiz] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleToggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      const next = [...prev, id];
      if (next.length >= 2) setShowComparison(true);
      return next;
    });
  };

  const trendingTemplates = useMemo(() =>
    TRENDING_TEMPLATE_IDS.slice(0, 6).map(id => getTemplateById(id)).filter(Boolean) as WeddingTemplate[],
    []
  );

  const filteredTemplates = useMemo(() => {
    let result = filterTemplates(TEMPLATES, {
      ceremony: ceremonyFilter,
      region: regionFilter,
      mood: moodFilter,
      budget: budgetFilter,
      search,
      collection: activeCollection || undefined,
    });

    if (sortBy === 'popular') result = [...result].sort((a, b) => b.usedByCount - a.usedByCount);
    else if (sortBy === 'newest') result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sortBy === 'free-first') result = [...result].sort((a, b) => (a.budgetTier === 'premium' ? 1 : 0) - (b.budgetTier === 'premium' ? 1 : 0));

    return result;
  }, [ceremonyFilter, regionFilter, moodFilter, budgetFilter, search, sortBy, activeCollection]);

  const isFiltered = search || ceremonyFilter !== 'All' || regionFilter !== 'All' || moodFilter !== 'All' || budgetFilter !== 'All' || activeCollection;
  const activeCollection_ = CURATED_COLLECTIONS.find(c => c.id === activeCollection);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Page Hero */}
      <div className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: 'var(--section-bg)' }}>
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--hero-orb-gold)' }} />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'var(--hero-orb-purple)' }} />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="text-primary text-xs uppercase tracking-[0.35em] mb-4 font-semibold">
              {TEMPLATES.length}+ Stunning Designs
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-5 leading-tight">
              Wedding <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent italic">Templates</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Browse {TEMPLATES.length} cinematic wedding templates — each one animated, live-previewable, and ready to publish in minutes.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by style, region, mood..."
                  className="pl-11 bg-background border-border/40 text-foreground placeholder:text-foreground/30 rounded-full h-12 focus:border-primary/60 w-full shadow-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={() => setShowAiQuiz(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 gap-2 h-12 shrink-0 shadow-md"
              >
                <Wand2 className="h-4 w-4" /> AI Pick For Me
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">

        {/* Trending Section */}
        {!isFiltered && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-serif text-foreground font-bold">Trending This Week</h2>
              <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-500 bg-red-500/8">
                🔥 {trendingTemplates.length} picks
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {trendingTemplates.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border group h-36 flex flex-col items-center justify-center bg-gradient-to-br ${t.cardGradient}`}
                  style={{ borderColor: t.accentColor + '40' }}
                  onClick={() => setTryLiveTemplate(t)}
                >
                  <AnimatedCardPreview template={t} />
                  <div className="relative z-10 text-center px-2">
                    <div className="text-3xl mb-1">{t.heroEmoji}</div>
                    <p className="text-white/90 text-xs font-serif font-bold leading-tight">{t.name}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                    <span className="text-white text-xs font-medium">Try Live →</span>
                  </div>
                  <div className="absolute top-2 left-2 z-30">
                    {t.isNew && <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-400/90 text-black">New</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Curated Collections */}
        {!isFiltered && <CuratedCollections onSelect={id => setActiveCollection(id)} />}

        {/* Active Collection Header */}
        {activeCollection_ && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{activeCollection_.emoji}</span>
            <div>
              <h2 className="text-xl font-serif text-foreground font-bold">{activeCollection_.name}</h2>
              <p className="text-sm text-foreground/50">{activeCollection_.description}</p>
            </div>
            <button onClick={() => setActiveCollection(null)} className="ml-auto h-8 w-8 rounded-full bg-foreground/8 flex items-center justify-center text-foreground/50 hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Smart Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-border/40 bg-card text-foreground/60 hover:text-foreground text-xs font-medium transition-all"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
              {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {/* Sort */}
            <div className="flex gap-1 ml-auto">
              {(['popular', 'newest', 'free-first'] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${sortBy === s ? 'bg-foreground/10 border-foreground/30 text-foreground' : 'border-border/30 text-foreground/40 hover:text-foreground/70'}`}>
                  {s === 'popular' ? '🔥 Popular' : s === 'newest' ? '✨ Newest' : '🆓 Free First'}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card border border-border/30 rounded-2xl p-5 space-y-4 mb-4">
                  {[
                    { label: '💍 Ceremony', filters: CEREMONY_FILTERS, value: ceremonyFilter, set: setCeremonyFilter },
                    { label: '🗺️ Region', filters: REGION_FILTERS, value: regionFilter, set: setRegionFilter },
                    { label: '✨ Mood', filters: MOOD_FILTERS, value: moodFilter, set: setMoodFilter },
                    { label: '💰 Budget', filters: BUDGET_FILTERS, value: budgetFilter, set: setBudgetFilter },
                  ].map(({ label, filters, value, set }) => (
                    <div key={label} className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-foreground/40 font-medium min-w-20 shrink-0">{label}</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {filters.map(f => (
                          <FilterPill key={f} label={f} active={value === f} onClick={() => set(f)} />
                        ))}
                      </div>
                    </div>
                  ))}
                  {(ceremonyFilter !== 'All' || regionFilter !== 'All' || moodFilter !== 'All' || budgetFilter !== 'All') && (
                    <button onClick={() => { setCeremonyFilter('All'); setRegionFilter('All'); setMoodFilter('All'); setBudgetFilter('All'); }}
                      className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                      <X className="h-3 w-3" /> Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground/50">
              Showing <span className="text-foreground font-semibold">{filteredTemplates.length}</span> templates
              {isFiltered && <button onClick={() => { setSearch(''); setCeremonyFilter('All'); setRegionFilter('All'); setMoodFilter('All'); setBudgetFilter('All'); setActiveCollection(null); }} className="ml-2 text-primary text-xs hover:underline">Clear all</button>}
            </p>
            {compareIds.length > 0 && (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-black shadow-md"
                style={{ backgroundColor: '#D4AF37' }}
              >
                <GitCompare className="h-3.5 w-3.5" />
                Compare {compareIds.length} templates
              </motion.button>
            )}
          </div>
        </div>

        {/* Template Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-serif text-foreground mb-2">No templates found</h3>
            <p className="text-foreground/50 text-sm mb-6">Try clearing filters or searching something else</p>
            <Button variant="outline" onClick={() => { setSearch(''); setCeremonyFilter('All'); setRegionFilter('All'); setMoodFilter('All'); setBudgetFilter('All'); setActiveCollection(null); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map(t => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  onPreview={setPreviewTemplate}
                  onTryLive={setTryLiveTemplate}
                  compareIds={compareIds}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center py-16 rounded-3xl border border-border/30 bg-card/50"
        >
          <p className="text-4xl mb-4">✨</p>
          <h3 className="text-3xl font-serif font-bold text-foreground mb-3">
            Not sure which to pick?
          </h3>
          <p className="text-foreground/50 mb-8 max-w-md mx-auto">Let our AI recommend the perfect template based on your ceremony, vibe, and heritage.</p>
          <Button
            onClick={() => setShowAiQuiz(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 h-12 gap-2 text-base shadow-lg"
          >
            <Wand2 className="h-5 w-5" /> Start AI Recommender
          </Button>
        </motion.div>
      </div>

      <Footer />

      {/* Modals */}
      <AnimatePresence>
        {tryLiveTemplate && (
          <TryItLiveModal
            key="try-live"
            template={tryLiveTemplate}
            onClose={() => setTryLiveTemplate(null)}
            onUse={() => { setLocation(`/create?template=${tryLiveTemplate.id}`); setTryLiveTemplate(null); }}
          />
        )}
        {previewTemplate && !tryLiveTemplate && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-foreground/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-3xl bg-card border border-border/40 rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{previewTemplate.heroEmoji}</span>
                  <div>
                    <h2 className="text-xl font-serif text-foreground font-bold">{previewTemplate.name}</h2>
                    <p className="text-sm text-foreground/50">{previewTemplate.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="rounded-full text-xs" style={{ backgroundColor: previewTemplate.accentColor, color: '#000' }}
                    onClick={() => { setTryLiveTemplate(previewTemplate); setPreviewTemplate(null); }}>
                    <Zap className="h-3 w-3 mr-1" /> Try It Live
                  </Button>
                  <button onClick={() => setPreviewTemplate(null)} className="h-9 w-9 rounded-full bg-foreground/8 hover:bg-foreground/15 flex items-center justify-center text-foreground/50">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-[1fr_260px] gap-0">
                <div className={`h-72 md:h-96 bg-gradient-to-br ${previewTemplate.cardGradient} relative overflow-hidden flex items-center justify-center`}>
                  <AnimatedCardPreview template={previewTemplate} />
                  <div className="relative z-10 text-center px-8">
                    <div className="text-6xl mb-4">{previewTemplate.heroEmoji}</div>
                    <h3 className="text-4xl font-serif text-white mb-2 italic font-light">Priya</h3>
                    <div className="flex items-center justify-center gap-4 my-3">
                      <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${previewTemplate.accentColor}80)` }} />
                      <span style={{ color: previewTemplate.accentColor }} className="text-lg">♥</span>
                      <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${previewTemplate.accentColor}80)` }} />
                    </div>
                    <h3 className="text-4xl font-serif text-white italic font-light">Arjun</h3>
                    <p className="text-white/50 text-xs mt-4 tracking-widest uppercase">February 14, 2026</p>
                  </div>
                </div>

                <div className="bg-foreground/3 border-l border-border/20 p-6 flex flex-col gap-4">
                  <div className="space-y-2.5">
                    {[
                      ['Ceremony', previewTemplate.ceremony], ['Style', previewTemplate.style],
                      ['Region', previewTemplate.region.replace('-', ' ')], ['Mood', previewTemplate.mood],
                      ['Budget', previewTemplate.budgetTier], ['Music', previewTemplate.music],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-foreground/40 capitalize">{k}</span>
                        <span className="text-foreground/80 capitalize">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-foreground/40 mb-2 uppercase tracking-wider">Palette</p>
                    <div className="flex gap-2 flex-wrap">
                      {previewTemplate.swatches.map((c, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg border border-foreground/10" style={{ backgroundColor: c }} title={c} />
                      ))}
                    </div>
                  </div>
                  {previewTemplate.usedByCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-foreground/50">
                      <Users className="h-4 w-4" />
                      {previewTemplate.usedByCount.toLocaleString()} couples used this
                    </div>
                  )}
                  <div className="mt-auto space-y-2">
                    {previewTemplate.isPremium && (
                      <div className="text-xs text-amber-600 dark:text-amber-400/80 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-lg px-3 py-2 flex items-center gap-2">
                        <Crown className="h-3 w-3 shrink-0" /> Premium template
                      </div>
                    )}
                    <Button className="w-full rounded-xl font-bold text-black"
                      style={{ backgroundColor: previewTemplate.accentColor }}
                      onClick={() => setLocation(`/create?template=${previewTemplate.id}`)}
                      disabled={previewTemplate.isPremium}>
                      {previewTemplate.isPremium ? 'Upgrade to Use' : 'Customize Template'}
                    </Button>
                    <button onClick={() => handleToggleCompare(previewTemplate.id)}
                      className={`w-full py-2 text-xs font-medium rounded-xl border transition-all ${compareIds.includes(previewTemplate.id) ? 'border-primary/60 text-primary bg-primary/8' : 'border-border/40 text-foreground/50 hover:border-primary/40'}`}>
                      <GitCompare className="h-3 w-3 inline mr-1" />
                      {compareIds.includes(previewTemplate.id) ? '✓ Added to comparison' : 'Add to comparison'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showAiQuiz && (
          <AiQuizModal
            key="ai-quiz"
            onClose={() => setShowAiQuiz(false)}
            onPick={(id) => {
              setShowAiQuiz(false);
              const t = getTemplateById(id);
              if (t) setTryLiveTemplate(t);
            }}
          />
        )}
        {showComparison && compareIds.length >= 2 && (
          <ComparisonDrawer
            key="comparison"
            ids={compareIds}
            onClose={() => setShowComparison(false)}
            onUse={(id) => { setLocation(`/create?template=${id}`); setShowComparison(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
