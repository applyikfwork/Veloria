import React from 'react';
import { Instagram, Twitter, Facebook, Heart, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer
      className="pt-20 pb-10 md:pb-20 border-t border-primary/15 relative"
      style={{ backgroundColor: 'var(--section-bg-deep)' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-serif text-4xl font-bold text-primary tracking-wider mb-4 block">Veloria</span>
            <p className="text-foreground/60 text-sm leading-relaxed mb-6">
              Where love meets timeless art. The world's most luxurious digital Indian wedding invitation platform.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/25 hover:text-primary transition-colors text-foreground/60">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/25 hover:text-primary transition-colors text-foreground/60">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/25 hover:text-primary transition-colors text-foreground/60">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Product links — includes Features & Pricing */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/templates"><span className="text-foreground/60 hover:text-primary text-sm transition-colors cursor-pointer">Templates</span></Link></li>
              <li><a href="/#features" className="text-foreground/60 hover:text-primary text-sm transition-colors">Features</a></li>
              <li><a href="/#pricing" className="text-foreground/60 hover:text-primary text-sm transition-colors">Pricing</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-primary text-sm transition-colors">Showcase</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground/60 hover:text-primary text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">Stay Inspired</h4>
            <p className="text-foreground/60 text-sm mb-4">Subscribe for wedding trends and design inspiration.</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-background/50 border-primary/20 text-foreground placeholder:text-foreground/40 focus-visible:ring-primary rounded-lg"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-sm">
            © {new Date().getFullYear()} Veloria Inc. All rights reserved.
          </p>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 hover:border-primary/40 hover:bg-primary/8 transition-all text-foreground/50 hover:text-primary text-sm font-medium"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <>
                <Moon size={15} />
                <span>Switch to Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={15} />
                <span>Switch to Light Royal</span>
              </>
            )}
          </button>

          <p className="text-foreground/40 text-sm flex items-center gap-1">
            Crafted with <Heart size={14} className="text-primary fill-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
