import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Search, Sparkles, X, ChevronRight, Users, Crown, Star,
  Flame, Eye, Wand2, Filter, SlidersHorizontal, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TEMPLATES, CEREMONY_FILTERS, STYLE_FILTERS, REGION_FILTERS,
  TRENDING_TEMPLATE_IDS, getTemplateById, type WeddingTemplate
} from "@/lib/templates";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function TemplateCard({ template, onPreview }: { template: WeddingTemplate; onPreview: (t: WeddingTemplate) => void }) {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: template.accentColor + '44' }}
    >
      {/* Card Visual */}
      <div
        className={`relative h-52 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${template.cardGradient}`}
        onClick={() => onPreview(template)}
      >
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxLjUiIGZpbGw9IndoaXRlIi8+PC9zdmc+')] mix-blend-overlay" />
        <div className="absolute inset-3 rounded-xl border border-white/10 pointer-events-none" />

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

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="outline"
            className="border-white/40 text-white hover:bg-white/20 rounded-full h-9"
            onClick={(e) => { e.stopPropagation(); onPreview(template); }}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
          </Button>
          <Button
            size="sm"
            className="text-black rounded-full h-9 font-semibold"
            style={{ backgroundColor: template.accentColor }}
            onClick={(e) => { e.stopPropagation(); setLocation(`/create?template=${template.id}`); }}
          >
            Use This
          </Button>
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {template.isPremium && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/90 text-black">
              Premium
            </span>
          )}
          {template.isNew && !template.isPremium && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/90 text-black">
              New
            </span>
          )}
          {template.isTrending && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/90 text-white flex items-center gap-1">
              <Flame className="h-2.5 w-2.5" /> Hot
            </span>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 bg-card border-t border-border/20 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {template.swatches.slice(0, 4).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full border border-foreground/10 shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-foreground/40 text-xs">
            <Users className="h-3 w-3" />
            <span>{template.usedByCount.toLocaleString()} couples</span>
          </div>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {template.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/8 border border-primary/20 text-primary/70">
              {tag}
            </span>
          ))}
        </div>

        <Button
          className="w-full rounded-xl h-9 text-sm font-semibold mt-auto"
          style={{ backgroundColor: template.accentColor + '18', color: template.accentColor, borderColor: template.accentColor + '44' }}
          variant="outline"
          onClick={() => setLocation(`/create?template=${template.id}`)}
        >
          Use Template <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

function TemplatePreviewModal({ template, onClose, onUse }: { template: WeddingTemplate; onClose: () => void; onUse: () => void }) {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-foreground/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-4xl bg-card border border-border/40 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{template.heroEmoji}</span>
              <h2 className="text-xl font-serif text-foreground font-bold">{template.name}</h2>
              {template.isTrending && <Badge className="bg-red-500/15 text-red-500 border-red-500/30 text-[9px]"><Flame className="h-2.5 w-2.5 mr-1" />Trending</Badge>}
            </div>
            <p className="text-sm text-foreground/50">{template.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-foreground/8 hover:bg-foreground/15 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-0">
          {/* Preview area */}
          <div className="p-6 flex flex-col items-center gap-4 min-h-[400px]">
            <div className="flex gap-2 bg-foreground/5 rounded-full p-1 border border-border/30">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'mobile' ? 'bg-foreground/15 text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}
              >
                Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'desktop' ? 'bg-foreground/15 text-foreground' : 'text-foreground/40 hover:text-foreground/70'}`}
              >
                Desktop
              </button>
            </div>

            <div className={`relative rounded-2xl overflow-hidden border border-foreground/10 transition-all duration-500 bg-gradient-to-br ${template.cardGradient} flex flex-col items-center justify-center ${viewMode === 'mobile' ? 'w-[200px] h-[360px]' : 'w-full h-[300px]'}`}>
              <div className="absolute inset-4 border border-white/10 rounded-xl pointer-events-none" />
              <div className="text-center space-y-4 px-6">
                <div className="text-4xl">{template.heroEmoji}</div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-white/40">{template.ceremony}</p>
                  <h3 className="text-2xl font-serif text-white">Priya</h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-8 bg-white/30" />
                    <span className="text-white/60 text-xs">♥</span>
                    <div className="h-px w-8 bg-white/30" />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Arjun</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/60">15 February 2026</p>
                  <p className="text-xs text-white/40">The Grand Palace, Mumbai</p>
                </div>
                <div className="flex justify-center gap-1">
                  {template.swatches.slice(0, 3).map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Template details */}
          <div className="bg-foreground/3 border-l border-border/20 p-6 flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">Details</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Ceremony', value: template.ceremony },
                  { label: 'Style', value: template.style },
                  { label: 'Region', value: template.region.replace('-', ' ') },
                  { label: 'Mood', value: template.mood },
                  { label: 'Music', value: template.music },
                ].map(d => (
                  <div key={d.label} className="flex justify-between text-sm">
                    <span className="text-foreground/40 capitalize">{d.label}</span>
                    <span className="text-foreground/80 capitalize">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-3">Palette</p>
              <div className="flex gap-2">
                {template.swatches.map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-lg border border-foreground/10" style={{ backgroundColor: c }} />
                    <span className="text-[8px] text-foreground/30">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-foreground/40 mb-2">Social proof</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-foreground/40" />
                <span className="text-foreground/60 text-sm">{template.usedByCount.toLocaleString()} couples used this</span>
              </div>
            </div>

            <div className="mt-auto space-y-2">
              {template.isPremium && (
                <div className="text-xs text-amber-600 dark:text-amber-400/80 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Crown className="h-3 w-3 shrink-0" />
                  Premium template — upgrade to unlock
                </div>
              )}
              <Button
                className="w-full rounded-xl font-bold"
                style={{ backgroundColor: template.accentColor, color: '#000' }}
                onClick={onUse}
                disabled={template.isPremium}
              >
                {template.isPremium ? 'Upgrade to Use' : 'Customize This Template'}
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 border-t border-border/20 pt-4">
          <p className="text-xs text-foreground/30 text-center">
            Your details will be applied to this template — name, photos, events, and everything you fill in
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AiPickModal({ onClose, onPick }: { onClose: () => void; onPick: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ ceremony: '', vibe: '', region: '' });

  const steps = [
    {
      question: "What ceremony are you planning?",
      key: 'ceremony',
      options: ['Wedding', 'Engagement', 'Sangeet', 'Mehndi', 'Haldi', 'Reception'],
    },
    {
      question: "What vibe do you want?",
      key: 'vibe',
      options: ['Royal & Grand', 'Romantic & Soft', 'Modern & Minimal', 'Festive & Colourful', 'Traditional & Classic'],
    },
    {
      question: "Your cultural background?",
      key: 'region',
      options: ['North Indian', 'South Indian', 'Punjabi', 'Bengali', 'Pan-Indian / Fusion', 'Destination'],
    },
  ];

  const pickTemplate = () => {
    const ceremony = answers.ceremony.toLowerCase();
    const vibe = answers.vibe.toLowerCase();
    const region = answers.region.toLowerCase().replace(' / ', '-').replace(' ', '-');

    let matches = TEMPLATES.filter(t => {
      const matchesCeremony = t.ceremony === ceremony || ceremony === '';
      const matchesRegion = t.region.includes(region.split('-')[0]) || region.includes('pan') || region.includes('fusion');
      return matchesCeremony && matchesRegion && !t.isPremium;
    });

    if (matches.length === 0) matches = TEMPLATES.filter(t => !t.isPremium);

    if (vibe.includes('royal') || vibe.includes('grand')) {
      matches = matches.filter(t => t.mood === 'royal' || t.style === 'luxury') || matches;
    } else if (vibe.includes('romantic')) {
      matches = matches.filter(t => t.mood === 'romantic') || matches;
    } else if (vibe.includes('minimal')) {
      matches = matches.filter(t => t.style === 'minimal') || matches;
    } else if (vibe.includes('festive')) {
      matches = matches.filter(t => t.mood === 'festive') || matches;
    }

    if (matches.length === 0) matches = TEMPLATES.filter(t => !t.isPremium);
    onPick(matches[0].id);
  };

  const current = steps[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-foreground/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-card border border-border/40 rounded-3xl overflow-hidden shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 rounded-full bg-foreground/8 hover:bg-foreground/15 flex items-center justify-center text-foreground/50 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <Wand2 className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="text-foreground font-serif text-lg">AI Template Picker</h3>
            <p className="text-xs text-foreground/40">3 quick questions → perfect match</p>
          </div>
        </div>

        <div className="mb-2 flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-purple-500' : 'bg-foreground/10'}`} />
          ))}
        </div>
        <p className="text-xs text-foreground/30 mb-6">Step {step + 1} of {steps.length}</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="text-foreground font-serif text-xl mb-6">{current.question}</h4>
            <div className="grid grid-cols-2 gap-2">
              {current.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setAnswers(prev => ({ ...prev, [current.key]: opt }));
                    if (step < steps.length - 1) {
                      setStep(s => s + 1);
                    } else {
                      pickTemplate();
                    }
                  }}
                  className={`p-3 rounded-xl text-sm text-left border transition-all hover:border-purple-500/50 hover:bg-purple-500/8 ${answers[current.key as keyof typeof answers] === opt ? 'border-purple-500 bg-purple-500/15 text-foreground' : 'border-border/30 text-foreground/60'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [ceremonyFilter, setCeremonyFilter] = useState("All");
  const [styleFilter, setStyleFilter] = useState("All");
  const [showPremium, setShowPremium] = useState(true);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'free-first'>('popular');
  const [previewTemplate, setPreviewTemplate] = useState<WeddingTemplate | null>(null);
  const [showAiPicker, setShowAiPicker] = useState(false);

  const trendingTemplates = useMemo(() =>
    TRENDING_TEMPLATE_IDS.map(id => getTemplateById(id)).filter(Boolean) as WeddingTemplate[],
    []
  );

  const filteredTemplates = useMemo(() => {
    let result = TEMPLATES.filter(t => {
      if (ceremonyFilter !== 'All' && t.ceremony !== ceremonyFilter.toLowerCase()) return false;
      if (styleFilter !== 'All' && t.style !== styleFilter.toLowerCase()) return false;
      if (!showPremium && t.isPremium) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!t.name.toLowerCase().includes(q) && !t.tagline.toLowerCase().includes(q) && !t.tags.some(tag => tag.toLowerCase().includes(q)) && !t.region.includes(q) && !t.ceremony.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'popular') result = [...result].sort((a, b) => b.usedByCount - a.usedByCount);
    else if (sortBy === 'newest') result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    else if (sortBy === 'free-first') result = [...result].sort((a, b) => (a.isPremium ? 1 : 0) - (b.isPremium ? 1 : 0));

    return result;
  }, [ceremonyFilter, styleFilter, showPremium, search, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Page Hero */}
      <div
        className="pt-32 pb-16 relative overflow-hidden"
        style={{ backgroundColor: 'var(--section-bg)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--hero-orb-gold)' }} />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'var(--hero-orb-purple)' }} />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-primary text-xs uppercase tracking-[0.35em] mb-4 font-semibold">
              {TEMPLATES.length}+ Stunning Designs
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-5 leading-tight">
              Wedding <span className="bg-gradient-to-r from-primary via-amber-400 to-primary bg-clip-text text-transparent italic">Templates</span>
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Browse {TEMPLATES.length} cinematic wedding templates. Select one, fill in your details, and go live instantly — no design skills needed.
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
                onClick={() => setShowAiPicker(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 gap-2 h-12 shrink-0 shadow-md"
              >
                <Wand2 className="h-4 w-4" />
                AI Pick For Me
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">

        {/* Trending Section */}
        {!search && ceremonyFilter === 'All' && styleFilter === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Flame className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-serif text-foreground font-bold">Trending This Week</h2>
              <div className="h-px flex-1 bg-border/30" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  whileHover={{ y: -4 }}
                  className="group relative rounded-2xl overflow-hidden border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderColor: template.accentColor + '44' }}
                  onClick={() => setPreviewTemplate(template)}
                >
                  <div className={`h-36 bg-gradient-to-br ${template.cardGradient} flex flex-col items-center justify-center relative`}>
                    <div className="absolute inset-3 border border-white/10 rounded-xl pointer-events-none" />
                    <div className="text-3xl mb-2">{template.heroEmoji}</div>
                    <h4 className="text-sm font-serif text-white font-bold px-3 text-center">{template.name}</h4>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">Preview</span>
                    </div>
                  </div>
                  <div className="p-3 bg-card border-t border-border/20">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {template.swatches.slice(0, 3).map((c, i) => (
                          <div key={i} className="w-3 h-3 rounded-full border border-foreground/10" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-[10px] text-foreground/40">{template.usedByCount.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-8 space-y-4 p-5 rounded-2xl bg-card border border-border/25 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-foreground/50 text-sm">
              <Filter className="h-4 w-4" />
              <span className="font-medium">By Ceremony:</span>
            </div>
            {CEREMONY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setCeremonyFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  ceremonyFilter === f
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'border-border/40 text-foreground/55 hover:border-primary/40 hover:text-primary/80 bg-background'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-foreground/50 text-sm">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="font-medium">By Style:</span>
            </div>
            {STYLE_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStyleFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  styleFilter === f
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'border-border/40 text-foreground/55 hover:border-primary/40 hover:text-primary/80 bg-background'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => setShowPremium(!showPremium)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                showPremium
                  ? 'border-amber-400/50 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10'
                  : 'border-border/40 text-foreground/50 bg-background'
              }`}
            >
              <Crown className="h-3 w-3" />
              {showPremium ? 'Showing Premium' : 'Free Only'}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-foreground/40 text-xs font-medium">{filteredTemplates.length} templates</span>
              <span className="text-foreground/20">|</span>
              <span className="text-foreground/40 text-xs">Sort:</span>
              {(['popular', 'newest', 'free-first'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1 rounded-full transition-all border ${
                    sortBy === s
                      ? 'bg-foreground/10 text-foreground border-border/40'
                      : 'text-foreground/40 hover:text-foreground/70 border-transparent'
                  }`}
                >
                  {s === 'popular' ? 'Popular' : s === 'newest' ? 'Newest' : 'Free First'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <AnimatePresence mode="popLayout">
          {filteredTemplates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-serif text-foreground mb-2">No templates found</h3>
              <p className="text-foreground/45 mb-6">Try adjusting your filters or search query</p>
              <Button
                onClick={() => { setSearch(''); setCeremonyFilter('All'); setStyleFilter('All'); }}
                variant="outline"
                className="border-border/40 text-foreground rounded-full"
              >
                Clear All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
            >
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={setPreviewTemplate}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center rounded-3xl p-12 border border-primary/20 shadow-[0_0_60px_rgba(212,175,55,0.08)]"
          style={{ backgroundColor: 'var(--section-bg)' }}
        >
          <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-5">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-serif text-foreground mb-3 font-bold">Can't Find the Right One?</h2>
          <p className="text-foreground/55 mb-8 max-w-md mx-auto">Start with a blank canvas and customize everything — theme, colors, music, and more.</p>
          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Link href="/create">
              <Button className="bg-gradient-to-r from-primary to-amber-500 text-primary-foreground hover:opacity-90 rounded-full px-8 py-6 h-auto text-base font-semibold shadow-md">
                Start From Scratch <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button
              onClick={() => setShowAiPicker(true)}
              variant="outline"
              className="border-purple-500/40 text-purple-600 dark:text-purple-400 hover:bg-purple-500/8 rounded-full px-8 py-6 h-auto text-base"
            >
              <Wand2 className="h-5 w-5 mr-2" />
              Let AI Choose For Me
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onUse={() => {
              setPreviewTemplate(null);
              setLocation(`/create?template=${previewTemplate.id}`);
            }}
          />
        )}
      </AnimatePresence>

      {/* AI Picker Modal */}
      <AnimatePresence>
        {showAiPicker && (
          <AiPickModal
            onClose={() => setShowAiPicker(false)}
            onPick={(id) => {
              setShowAiPicker(false);
              const t = getTemplateById(id);
              if (t) setPreviewTemplate(t);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
