import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <span className="font-serif text-3xl font-bold text-primary tracking-wider">Vivah</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium" data-testid="link-nav-features">Features</a>
            <a href="#templates" className="text-foreground/80 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium" data-testid="link-nav-templates">Templates</a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium" data-testid="link-nav-pricing">Pricing</a>
            <Link href="/create">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 rounded-full" data-testid="button-nav-cta">
                Create Invitation
              </Button>
            </Link>
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
          <Link href="/create" onClick={() => setMobileMenuOpen(false)}>
            <Button className="bg-primary text-primary-foreground w-full py-6 text-lg rounded-full mt-4">
              Create Your Invitation
            </Button>
          </Link>
        </motion.div>
      )}
    </>
  );
}
