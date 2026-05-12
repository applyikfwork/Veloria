import { useEffect, useState, useMemo, useRef } from "react";
import { useRoute, Link } from "wouter";
import RoyalNoorInvitation from "@/components/themes/RoyalNoor";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  MessageCircle, 
  Copy,
  ChevronRight,
  Sparkles,
  Globe,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Instagram,
  ChevronLeft,
  Gift,
  ShoppingBag,
  Video,
  ExternalLink,
  Eye
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, differenceInSeconds, isPast } from "date-fns";

// Types for data
interface Event {
  name: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  type: string;
}

interface Wish {
  id: string;
  guest_name: string;
  message: string;
  relation: string;
  created_at: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}

export default function InvitationPage() {
  const [, params] = useRoute("/i/:slug");
  const slug = params?.slug;
  const { toast } = useToast();
  
  // URL Params
  const searchParams = new URLSearchParams(window.location.search);
  const guestName = searchParams.get('guest');

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState(false);
  
  // Features State
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [quizScores, setQuizScores] = useState<any[]>([]);
  const [language, setLanguage] = useState(localStorage.getItem('veloria_lang') || 'en');
  const [translations, setTranslations] = useState<any>({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  // Cinematic entrance state
  const [showEntrance, setShowEntrance] = useState(true);
  const [entranceDismissed, setEntranceDismissed] = useState(false);

  // Quiz State
  const [quizStep, setQuizStep] = useState<'start' | 'playing' | 'end'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [aiQuestions, setAiQuestions] = useState<QuizQuestion[]>([]);

  // Wish Form State
  const [wishForm, setWishForm] = useState({ name: '', relation: '', message: '' });
  const [submittingWish, setSubmittingWish] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      if (!slug) return;
      
      setLoading(true);
      try {
        const { data: inv, error: invError } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (invError || !inv) {
          setError(true);
        } else {
          setInvitation(inv);
          
          // Fetch wishes
          const { data: wishData } = await supabase
            .from('wishes')
            .select('*')
            .eq('invitation_id', inv.id)
            .order('created_at', { ascending: false });
          if (wishData) setWishes(wishData);

          // Fetch quiz attempts
          const { data: scoreData } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('invitation_id', inv.id)
            .order('score', { ascending: false })
            .limit(5);
          if (scoreData) setQuizScores(scoreData);

          // Fetch AI quiz questions if possible
          try {
            const res = await fetch('/api/ai/quiz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                brideName: inv.bride_name,
                groomName: inv.groom_name,
                howTheyMet: inv.love_story?.howTheyMet
              })
            });
            const quizData = await res.json();
            if (quizData.questions) setAiQuestions(quizData.questions);
          } catch (e) {
            console.error("Failed to fetch AI quiz", e);
          }
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Auto-dismiss cinematic entrance after 3s
  useEffect(() => {
    if (!invitation) return;
    const timer = setTimeout(() => setShowEntrance(false), 3000);
    return () => clearTimeout(timer);
  }, [invitation]);

  // Track page view silently
  useEffect(() => {
    if (!slug) return;
    supabase.from('invitations').select('id').eq('slug', slug).single().then(({ data }) => {
      if (data?.id) {
        supabase.from('invitation_views').insert({ invitation_id: data.id, viewed_at: new Date().toISOString(), referrer: document.referrer || null }).then(() => {});
      }
    });
  }, [slug]);

  // Handle Translation
  useEffect(() => {
    if (language === 'en') {
      setTranslations({});
      return;
    }

    async function translate() {
      try {
        const res = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: "Are getting married. You are lovingly invited to celebrate with us.",
            targetLanguage: language
          })
        });
        const data = await res.json();
        if (data.translation) {
          const parts = data.translation.split('.');
          setTranslations({
            gettingMarried: parts[0],
            invited: parts[1] || data.translation
          });
        }
      } catch (e) {
        console.error("Translation failed", e);
      }
    }
    translate();
    localStorage.setItem('veloria_lang', language);
  }, [language]);

  // Photos for slideshow — uses all gallery photos + profile photos
  const photos = useMemo(() => {
    const list: string[] = [];
    // Add gallery photos first (highest quality, user-uploaded)
    const gallery = invitation?.gallery_photos;
    if (gallery?.couple?.length) list.push(...gallery.couple.filter(Boolean));
    if (gallery?.preWedding?.length) list.push(...gallery.preWedding.filter(Boolean));
    if (gallery?.family?.length) list.push(...gallery.family.filter(Boolean));
    // Add profile photos
    if (invitation?.bride_photo_url) list.push(invitation.bride_photo_url);
    if (invitation?.groom_photo_url) list.push(invitation.groom_photo_url);
    // Fall back to stock photos if nothing uploaded
    if (list.length === 0) {
      list.push("https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200");
      list.push("https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200");
      list.push("https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1200");
    }
    return list;
  }, [invitation]);

  // Slideshow timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex(prev => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [photos]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Invitation link has been copied to clipboard.",
    });
  };

  const shareWhatsApp = () => {
    const text = `You're invited to the wedding of ${invitation.bride_name} & ${invitation.groom_name}! Check out the invitation here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.message) return;

    setSubmittingWish(true);
    try {
      const { data, error } = await supabase
        .from('wishes')
        .insert({
          invitation_id: invitation.id,
          guest_name: wishForm.name,
          relation: wishForm.relation,
          message: wishForm.message
        })
        .select()
        .single();

      if (data) {
        setWishes([data, ...wishes]);
        setWishForm({ name: '', relation: '', message: '' });
        toast({ title: "Thank you!", description: "Your blessing has been added to the wall." });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to add wish. Please try again.", variant: "destructive" });
    } finally {
      setSubmittingWish(false);
    }
  };

  const hardcodedQuestions: QuizQuestion[] = [
    { question: "Who made the first move?", options: [invitation?.bride_name, invitation?.groom_name, "It was mutual", "A friend set them up"], answer: 2 },
    { question: "Where was their first date?", options: ["Coffee Shop", "Restaurant", "The Beach", "Movies"], answer: 0 },
    { question: "What is their favorite activity together?", options: ["Traveling", "Watching Movies", "Cooking", "Dancing"], answer: 0 },
    { question: "Who is the better cook?", options: [invitation?.bride_name, invitation?.groom_name, "Both are great", "Neither!"], answer: 1 },
    { question: "Who said 'I love you' first?", options: [invitation?.bride_name, invitation?.groom_name, "At the same time", "Still waiting!"], answer: 1 },
  ];

  const questions = aiQuestions.length > 0 ? aiQuestions : hardcodedQuestions;

  const submitQuizScore = async (finalScore: number) => {
    if (!guestName) return;
    try {
      await supabase.from('quiz_attempts').insert({
        invitation_id: invitation.id,
        player_name: guestName,
        score: finalScore,
        total: questions.length
      });
      // Refresh leaderboard
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('invitation_id', invitation.id)
        .order('score', { ascending: false })
        .limit(5);
      if (data) setQuizScores(data);
    } catch (e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif text-white mb-4">Invitation Not Found</h1>
        <p className="text-muted-foreground mb-8">The invitation you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'royal-gold': return 'from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A]';
      case 'bollywood-glam': return 'from-[#4A0E0E] via-[#800020] to-[#4A0E0E]';
      case 'floral-bliss': return 'from-[#FFF5F5] via-[#FFE4E1] to-[#FFF5F5]';
      case 'dark-luxury': return 'from-[#0B0B0F] via-[#1A1A1F] to-[#0B0B0F]';
      case 'royal-noor': return 'from-[#0F0F0F] via-[#1C1400] to-[#0F0F0F]';
      default: return 'from-[#0B0B0F] via-[#1A1A1F] to-[#0B0B0F]';
    }
  };

  if (invitation.design_theme === 'royal-noor') {
    return <RoyalNoorInvitation invitation={invitation} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-foreground font-sans selection:bg-primary/30">
      {/* Cinematic Entrance Overlay */}
      <AnimatePresence>
        {showEntrance && !entranceDismissed && invitation && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0B0B0F] cursor-pointer"
            onClick={() => { setShowEntrance(false); setEntranceDismissed(true); }}
          >
            {/* Gold shimmer background */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Floating rings icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 120 }}
              className="text-6xl mb-8 select-none"
            >
              💍
            </motion.div>
            {/* Couple names */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center px-8"
            >
              <p className="text-primary/60 uppercase tracking-[0.4em] text-xs font-medium mb-4">
                You are cordially invited to the wedding of
              </p>
              <h1 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-wide">
                {invitation.bride_name}
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="flex items-center justify-center gap-4 my-4"
              >
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-24" />
                <Heart className="w-5 h-5 text-primary fill-primary" />
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent flex-1 max-w-24" />
              </motion.div>
              <h1 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-wide">
                {invitation.groom_name}
              </h1>
            </motion.div>
            {/* Date */}
            {invitation.events?.[0]?.date && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mt-8 text-white/40 text-sm tracking-widest uppercase font-medium"
              >
                {format(new Date(invitation.events[0].date), 'MMMM d, yyyy')}
              </motion.p>
            )}
            {/* Tap to open hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 1.8, duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
              className="absolute bottom-12 flex flex-col items-center gap-2"
            >
              <p className="text-white/25 text-xs tracking-[0.3em] uppercase">Tap to open</p>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Entrance — Floating Petals */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden>
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/60 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 18 + 10}px`,
            }}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 60 : 900,
              opacity: [0, 0.8, 0.6, 0],
              rotate: Math.random() > 0.5 ? 360 : -360,
              x: [0, Math.random() * 80 - 40, Math.random() * 80 - 40, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              delay: Math.random() * 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: Math.random() * 8 + 4,
            }}
          >
            {['🌸', '🌹', '✨', '❤️', '🌺', '💫'][i % 6]}
          </motion.div>
        ))}
      </div>

      {/* Personalized Guest Greeting */}
      <AnimatePresence>
        {guestName && (
          <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 py-3 px-4 text-center border-b border-primary/30 sticky top-0 z-[60] backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-3 text-primary">
              <Heart className="h-4 w-4 fill-primary animate-pulse" />
              <p className="font-serif text-lg tracking-wide">
                Dear <span className="font-bold">{guestName}</span>, you are lovingly invited to celebrate with us
              </p>
              <Heart className="h-4 w-4 fill-primary animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Toggle */}
      <div className="fixed top-20 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full bg-black/50 backdrop-blur-md border-white/10 hover:border-primary/50">
              <Globe className="h-5 w-5 text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
            <DropdownMenuItem onClick={() => setLanguage('en')}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('Hindi')}>हिन्दी (Hindi)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('Tamil')}>தமிழ் (Tamil)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('Punjabi')}>ਪੰਜਾਬੀ (Punjabi)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('Telugu')}>తెలుగు (Telugu)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Hero Section */}
      <section className={`relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-gradient-to-b ${getThemeGradient(invitation.design_theme)}`}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 space-y-6"
        >
          <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1 uppercase tracking-widest text-xs bg-primary/5">
            {invitation.wedding_type?.replace('-', ' ')}
          </Badge>
          
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-serif text-white">
              {invitation.bride_name}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-primary/50" />
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <div className="h-[1px] w-12 bg-primary/50" />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white">
              {invitation.groom_name}
            </h1>
          </div>

          <div className="space-y-2">
            <p className="text-xl md:text-2xl text-primary/80 font-serif italic">
              {translations.gettingMarried || "Are getting married"}
            </p>
            {translations.invited && (
              <p className="text-sm text-primary/60 italic max-w-xs mx-auto">
                {translations.invited}
              </p>
            )}
          </div>

          {invitation.events?.[0] && (
            <div className="pt-8 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{invitation.events[0].date}</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span>{invitation.events[0].venue}</span>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-primary/50">
            <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to Discover</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent"
            />
          </div>
        </motion.div>
      </section>

      {/* Countdown Timer */}
      <CountdownSection events={invitation.events} />

      {/* Couple Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto space-y-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Bride */}
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            initial={{ opacity: 0, x: -20 }}
            className="space-y-6 text-center md:text-left"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-primary/20 mx-auto md:mx-0">
                <img 
                  src={invitation.bride_photo_url || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200"} 
                  alt={invitation.bride_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-white">{invitation.bride_name}</h3>
              <p className="text-primary/60 italic">The Bride</p>
              <p className="text-muted-foreground leading-relaxed">{invitation.bride_bio}</p>
            </div>
          </motion.div>

          {/* Groom */}
          <motion.div 
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            initial={{ opacity: 0, x: 20 }}
            className="space-y-6 text-center md:text-right"
          >
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-primary/20 mx-auto md:ml-auto md:mr-0">
                <img 
                  src={invitation.groom_photo_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"} 
                  alt={invitation.groom_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif text-white">{invitation.groom_name}</h3>
              <p className="text-primary/60 italic">The Groom</p>
              <p className="text-muted-foreground leading-relaxed">{invitation.groom_bio}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Family Blessings Section */}
      {invitation.family_details && (invitation.family_details.brideParents?.[0] || invitation.family_details.groomParents?.[0] || invitation.family_details.blessingQuote) && (
        <section className="py-20 px-6 bg-gradient-to-b from-black/40 to-primary/5">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3"
            >
              <div className="h-px w-16 bg-primary/40 mx-auto" />
              <h2 className="text-4xl font-serif text-white">With the Blessings of</h2>
              <p className="text-muted-foreground italic">Our families who made us who we are</p>
            </motion.div>

            {invitation.family_details.blessingQuote && (
              <motion.blockquote
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center italic text-lg text-primary/80 font-serif max-w-2xl mx-auto border-l-2 border-primary/30 pl-6"
              >
                "{invitation.family_details.blessingQuote}"
              </motion.blockquote>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Bride's Family */}
              {(invitation.family_details.brideParents?.[0] || invitation.family_details.brideParents?.[1]) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-primary/20" />
                    <h4 className="text-primary/80 text-xs uppercase tracking-widest font-medium whitespace-nowrap">Bride's Family</h4>
                    <div className="h-px flex-1 bg-primary/20" />
                  </div>
                  <div className="space-y-2">
                    {invitation.family_details.brideParents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-white/80 text-center font-serif text-lg">{name}</p>
                    ))}
                    {invitation.family_details.brideGrandparents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-white/40 text-center text-sm italic">{name}</p>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Groom's Family */}
              {(invitation.family_details.groomParents?.[0] || invitation.family_details.groomParents?.[1]) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-primary/20" />
                    <h4 className="text-primary/80 text-xs uppercase tracking-widest font-medium whitespace-nowrap">Groom's Family</h4>
                    <div className="h-px flex-1 bg-primary/20" />
                  </div>
                  <div className="space-y-2">
                    {invitation.family_details.groomParents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-white/80 text-center font-serif text-lg">{name}</p>
                    ))}
                    {invitation.family_details.groomGrandparents?.filter(Boolean).map((name: string, i: number) => (
                      <p key={i} className="text-white/40 text-center text-sm italic">{name}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {invitation.family_details.familyMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center text-muted-foreground text-base leading-relaxed max-w-2xl mx-auto"
              >
                {invitation.family_details.familyMessage}
              </motion.p>
            )}
          </div>
        </section>
      )}

      {/* Cinematic Photo Reveal */}
      <section className="py-24 bg-black overflow-hidden relative min-h-[60vh] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhotoIndex}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "linear" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={photos[currentPhotoIndex]} 
              className="w-full h-full object-cover"
              alt="Slideshow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
          </motion.div>
        </AnimatePresence>
        
        <div className="relative z-10 text-center space-y-4 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            <h2 className="text-5xl md:text-6xl font-serif text-white">Our Story in Photos</h2>
            <p className="text-primary/80 font-serif italic text-xl mt-4">
              {invitation.bride_name} & {invitation.groom_name}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-8 flex gap-2 z-20">
          {photos.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentPhotoIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentPhotoIndex ? 'bg-primary w-6' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Love Story Section */}
      {invitation.love_story && (invitation.love_story.howTheyMet || invitation.love_story.specialMoments || invitation.love_story.proposalStory) && (
        <section className="py-24 px-6 bg-white/5 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <Sparkles className="h-8 w-8 text-primary mx-auto opacity-50" />
              <h2 className="text-4xl font-serif text-white">Our Love Story</h2>
            </div>

            <div className="space-y-10 text-left">
              {invitation.love_story.howTheyMet && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <h3 className="text-primary text-xs uppercase tracking-widest flex items-center gap-2">
                    <Heart className="h-3 w-3 fill-primary" /> How We Met
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed italic">
                    "{invitation.love_story.howTheyMet}"
                  </p>
                </motion.div>
              )}

              {invitation.love_story.specialMoments && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3 border-l-2 border-primary/20 pl-6"
                >
                  <h3 className="text-primary text-xs uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="h-3 w-3" /> Our Special Moments
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed italic">
                    "{invitation.love_story.specialMoments}"
                  </p>
                </motion.div>
              )}

              {invitation.love_story.proposalStory && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-3"
                >
                  <h3 className="text-primary text-xs uppercase tracking-widest flex items-center gap-2">
                    <Heart className="h-3 w-3 fill-primary" /> The Proposal
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed italic">
                    "{invitation.love_story.proposalStory}"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Events Timeline */}
      {invitation.events && invitation.events.length > 0 && (
        <section className="py-24 px-6 max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-white mb-16">The Celebration</h2>
          <div className="space-y-12">
            {invitation.events.map((event: Event, index: number) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <Badge className="bg-primary/20 text-primary border-primary/20">{event.type}</Badge>
                    <h3 className="text-2xl font-serif text-white group-hover:text-primary transition-colors">{event.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-white/10 hover:border-primary/50 text-white w-full md:w-auto"
                      onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(event.venue + ' ' + (event.address || ''))}`, '_blank')}
                    >
                      Get Directions
                    </Button>
                  </div>
                  <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden border border-white/10">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(event.venue + ' ' + (event.address || ''))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Love Quiz Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-primary/10">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <Trophy className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-4xl font-serif text-white">How Well Do You Know Them?</h2>
          <p className="text-muted-foreground">Test your knowledge about the lovely couple!</p>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            {quizStep === 'start' && (
              <div className="space-y-6">
                <p className="text-white/70 italic">5 fun questions. Are you ready?</p>
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  onClick={() => setQuizStep('playing')}
                >
                  Start Quiz
                </Button>
                {quizScores.length > 0 && (
                  <div className="pt-6 border-t border-white/10 mt-6 text-left">
                    <h4 className="text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Trophy className="h-3 w-3" /> Leaderboard
                    </h4>
                    <div className="space-y-2">
                      {quizScores.map((qs, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-white/80">{i+1}. {qs.player_name}</span>
                          <span className="text-primary font-bold">{qs.score}/{qs.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {quizStep === 'playing' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs text-primary mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <Progress value={((currentQuestion) / questions.length) * 100} className="h-1 bg-white/10" />
                <h3 className="text-xl font-serif text-white py-4 min-h-[80px]">{questions[currentQuestion].question}</h3>
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((opt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="border-white/10 hover:border-primary text-white hover:bg-primary/10 py-6 h-auto whitespace-normal"
                      onClick={() => {
                        if (i === questions[currentQuestion].answer) {
                          setScore(s => s + 1);
                          toast({ title: "Correct!", className: "bg-green-500 text-white border-none" });
                        } else {
                          toast({ title: "Wrong!", variant: "destructive" });
                        }
                        
                        if (currentQuestion < questions.length - 1) {
                          setCurrentQuestion(q => q + 1);
                        } else {
                          setQuizStep('end');
                          submitQuizScore(score + (i === questions[currentQuestion].answer ? 1 : 0));
                        }
                      }}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {quizStep === 'end' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-6 py-8"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-3xl font-serif text-white">Well Done!</h3>
                <p className="text-4xl font-bold text-primary">{score} / {questions.length}</p>
                <p className="text-white/60">
                  {score === questions.length ? "You know them perfectly!" : "You're a great friend!"}
                </p>
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center gap-2"
                    onClick={() => {
                      const text = `I just scored ${score}/${questions.length} on ${invitation.bride_name} & ${invitation.groom_name}'s wedding quiz! Can you beat me? ${window.location.href}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                  >
                    <MessageCircle className="h-4 w-4" /> Share Result
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-primary"
                    onClick={() => {
                      setQuizStep('start');
                      setCurrentQuestion(0);
                      setScore(0);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Wishes Wall Section */}
      <section className="py-24 px-6 bg-black/40">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Heart className="h-8 w-8 text-primary mx-auto opacity-50" />
            <h2 className="text-4xl font-serif text-white">Leave Your Blessing</h2>
            <p className="text-muted-foreground">{wishes.length} love messages and counting</p>
          </div>

          <div className="grid md:grid-cols-5 gap-12">
            <form onSubmit={handleWishSubmit} className="md:col-span-2 space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 h-fit sticky top-24">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Name</label>
                <Input 
                  value={wishForm.name}
                  onChange={e => setWishForm({ ...wishForm, name: e.target.value })}
                  placeholder="Your Name" 
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Relation (Optional)</label>
                <Input 
                  value={wishForm.relation}
                  onChange={e => setWishForm({ ...wishForm, relation: e.target.value })}
                  placeholder="e.g. Friend, Cousin" 
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Message</label>
                <Textarea 
                  value={wishForm.message}
                  onChange={e => setWishForm({ ...wishForm, message: e.target.value })}
                  placeholder="Write your wishes..." 
                  className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30 min-h-[100px]"
                  required
                />
              </div>
              <Button disabled={submittingWish} type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {submittingWish ? "Sending..." : "Send Blessing"}
              </Button>
            </form>

            <div className="md:col-span-3 space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {wishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative group"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">{wish.guest_name}</h4>
                          {wish.relation && <span className="text-xs text-primary/70">{wish.relation}</span>}
                        </div>
                        <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                          {format(new Date(wish.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-muted-foreground italic leading-relaxed">"{wish.message}"</p>
                      <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-primary transition-colors mt-4">
                        <Heart className="h-3 w-3" /> Like
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {wishes.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-white/30">Be the first to leave a blessing!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gift Registry Section */}
      {invitation.gift_registry?.enabled && (
        <section className="py-20 px-6 bg-gradient-to-b from-black to-primary/5">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto">
                <Gift className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-4xl font-serif text-white">Our Gift Registry</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Your presence is the greatest gift. But if you'd like to bless us with something, here are our wishlists:
              </p>
            </div>

            <div className="grid gap-4">
              {invitation.gift_registry.amazon && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={invitation.gift_registry.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[#FF9900]/10 border border-[#FF9900]/30 hover:bg-[#FF9900]/20 transition-all text-left group"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#FF9900]/20 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6 text-[#FF9900]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Amazon Wishlist</h4>
                    <p className="text-xs text-white/40">View our curated gift list</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-[#FF9900] transition-colors" />
                </motion.a>
              )}
              {invitation.gift_registry.flipkart && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={invitation.gift_registry.flipkart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-[#2874F0]/10 border border-[#2874F0]/30 hover:bg-[#2874F0]/20 transition-all text-left group"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#2874F0]/20 flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-6 w-6 text-[#2874F0]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Flipkart Wishlist</h4>
                    <p className="text-xs text-white/40">View our curated gift list</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-[#2874F0] transition-colors" />
                </motion.a>
              )}
              {invitation.gift_registry.custom && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  href={invitation.gift_registry.custom}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-2xl bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all text-left group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{invitation.gift_registry.customLabel || 'Our Registry'}</h4>
                    <p className="text-xs text-white/40">View our wishlist</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-primary transition-colors" />
                </motion.a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Live Stream Section */}
      {invitation.live_stream?.enabled && invitation.live_stream?.url && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-6 mb-8 rounded-2xl overflow-hidden border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-md"
        >
          <div className="p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Video className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full">Live</span>
                  <h3 className="text-white font-semibold text-lg">Join Us Live</h3>
                </div>
                <p className="text-white/50 text-sm">Can't attend in person? Watch our ceremony live!</p>
              </div>
            </div>
            <a
              href={invitation.live_stream.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 flex items-center gap-2 shadow-lg shadow-blue-500/30">
                <Eye className="h-4 w-4" />
                Watch Live Stream
              </Button>
            </a>
          </div>
        </motion.div>
      )}

      {/* Hashtag Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif text-white">Our Wedding Hashtag</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
              <div className="text-5xl md:text-7xl font-serif text-primary tracking-tighter flex items-center gap-2">
                #{invitation.wedding_hashtag || `${invitation.bride_name}${invitation.groom_name}Wedding`.replace(/\s/g, '')}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full"
                onClick={() => {
                  navigator.clipboard.writeText(`#${invitation.wedding_hashtag || `${invitation.bride_name}${invitation.groom_name}Wedding`.replace(/\s/g, '')}`);
                  toast({ title: "Hashtag copied!" });
                }}
              >
                <Copy className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group overflow-hidden relative">
                <Instagram className="h-10 w-10 text-white/10 group-hover:text-primary/40 transition-all duration-500 scale-100 group-hover:scale-125" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full px-8 py-6 h-auto text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            onClick={() => window.open('https://instagram.com', '_blank')}
          >
            <Instagram className="h-5 w-5" /> Share on Instagram
          </Button>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 px-6 bg-gradient-to-t from-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="w-24 h-[1px] bg-primary mx-auto opacity-50" />
          <h2 className="text-5xl font-serif text-white">Will You Join Us?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your presence would mean the world to us as we begin our new journey together.
            Please let us know if you'll be attending by {invitation.rsvp_settings?.deadline || 'the end of this month'}.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href={`/i/${slug}/rsvp`}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-16 py-8 text-xl h-auto shadow-2xl shadow-primary/20 hover:scale-105 transition-transform w-full md:w-auto">
                RSVP Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 text-center bg-black/40">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-serif text-white text-3xl">Veloria</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-white/60">
            <Link href={`/i/${slug}/video`} className="hover:text-primary transition-colors">Video Invitation</Link>
            <Link href={`/save-the-date/${slug}`} className="hover:text-primary transition-colors">Save the Date</Link>
            <Link href={`/i/${slug}/memory`} className="hover:text-primary transition-colors">Memory Book</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Couple Dashboard</Link>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Veloria Cinematic Invitations</p>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Created with love in India</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={shareWhatsApp}
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="h-7 w-7" />
        </motion.button>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const text = `You're invited to the wedding of ${invitation.bride_name} & ${invitation.groom_name}! Check out the invitation here: ${window.location.href}`;
            if (navigator.share) {
              navigator.share({
                title: `${invitation.bride_name} & ${invitation.groom_name}'s Wedding`,
                text: text,
                url: window.location.href,
              }).catch(() => copyLink());
            } else {
              copyLink();
            }
          }}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:bg-primary/90 transition-colors"
        >
          <Share2 className="h-7 w-7" />
        </motion.div>
      </div>
    </div>
  );
}

function CountdownSection({ events }: { events: Event[] }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });
  
  const targetEvent = useMemo(() => {
    if (!events?.length) return null;
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events]);

  useEffect(() => {
    if (!targetEvent) return;

    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(`${targetEvent.date} ${targetEvent.time || '00:00'}`);
      const diff = differenceInSeconds(target, now);

      if (diff <= 0) {
        setTimeLeft(prev => ({ ...prev, expired: true }));
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(diff / (60 * 60 * 24)),
          hours: Math.floor((diff / (60 * 60)) % 24),
          minutes: Math.floor((diff / 60) % 60),
          seconds: Math.floor(diff % 60),
          expired: false
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetEvent]);

  if (!targetEvent) return null;

  if (timeLeft.expired) {
    return (
      <section className="py-12 bg-white/5 backdrop-blur-md text-center">
        <h3 className="text-2xl font-serif text-primary">We celebrated our special day!</h3>
      </section>
    );
  }

  const isCritical = timeLeft.days === 0 && !timeLeft.expired;

  return (
    <section className="py-16 px-6 bg-white/5 backdrop-blur-md overflow-hidden relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
        <h3 className="text-sm uppercase tracking-[0.3em] text-white/40">Counting down to our big day</h3>
        
        <div className={`flex gap-4 md:gap-8 ${isCritical ? 'animate-pulse' : ''}`}>
          <TimeUnit value={timeLeft.days} label="Days" isCritical={isCritical} />
          <TimeUnit value={timeLeft.hours} label="Hours" isCritical={isCritical} />
          <TimeUnit value={timeLeft.minutes} label="Mins" isCritical={isCritical} />
          <TimeUnit value={timeLeft.seconds} label="Secs" isCritical={isCritical} />
        </div>
      </div>
    </section>
  );
}

function TimeUnit({ value, label, isCritical }: { value: number, label: string, isCritical: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div 
        key={value}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-16 h-20 md:w-24 md:h-28 rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-bold font-serif shadow-xl backdrop-blur-xl border ${isCritical ? 'bg-red-950/40 border-red-500 text-red-500 shadow-red-500/20' : 'bg-white/10 border-white/10 text-primary'}`}
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
      <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/40">{label}</span>
    </div>
  );
}
