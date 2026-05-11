import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Menu, X, LogOut, LayoutDashboard, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';
import { useToast } from '@/hooks/use-toast';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
      toast({ title: "Signed out successfully" });
      setLocation('/');
    } catch (e: any) {
      toast({ title: "Error signing out", description: e.message, variant: "destructive" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-primary/20 py-4 shadow-[0_4px_30px_rgba(212,175,55,0.1)]' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
              <span className="font-serif text-3xl font-bold text-primary tracking-wider">Veloria</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium" data-testid="link-nav-features">Features</a>
            <a href="#templates" className="text-foreground/80 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium" data-testid="link-nav-templates">Templates</a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium" data-testid="link-nav-pricing">Pricing</a>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-primary hover:bg-primary/20 transition-all"
                  data-testid="button-user-menu"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-[#0B0B0F] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-white/40">Signed in as</p>
                        <p className="text-sm text-white truncate font-medium">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-primary hover:bg-white/5 transition-colors" data-testid="button-goto-dashboard">
                          <LayoutDashboard size={16} />
                          My Dashboard
                        </button>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-red-400 hover:bg-white/5 transition-colors"
                        data-testid="button-signout"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setAuthModalOpen(true)}
                  className="text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full px-5"
                  data-testid="button-nav-signin"
                >
                  Sign In
                </Button>
                <Link href="/templates">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 rounded-full" data-testid="button-nav-cta">
                    Create Invitation
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col items-center gap-8 border-b border-primary/20 shadow-2xl"
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#templates" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-primary transition-colors">Templates</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-xl font-serif text-foreground hover:text-primary transition-colors">Pricing</a>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full py-6 text-lg rounded-full border-primary/30 text-primary">
                    <LayoutDashboard size={18} className="mr-2" />
                    My Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="text-red-400">
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-6 text-lg rounded-full border-primary/30 text-primary"
                >
                  Sign In / Sign Up
                </Button>
                <Link href="/templates" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-primary text-primary-foreground w-full py-6 text-lg rounded-full mt-2">
                    Create Your Invitation
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          toast({ title: "Welcome to Veloria!", description: "You are now signed in." });
        }}
      />
    </>
  );
}
