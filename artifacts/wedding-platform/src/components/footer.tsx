import React from 'react';
import { Instagram, Twitter, Facebook, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-[#040406] pt-20 pb-10 md:pb-20 border-t border-white/5 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="font-serif text-4xl font-bold text-primary tracking-wider mb-4 block">Veloria</span>
            <p className="text-foreground/60 text-sm leading-relaxed mb-6">
              Where love meets timeless art. The world's most luxurious digital Indian wedding invitation platform.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-foreground/80">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-foreground/80">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors text-foreground/80">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground/60 hover:text-primary text-sm transition-colors">Templates</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-primary text-sm transition-colors">Features</a></li>
              <li><a href="#" className="text-foreground/60 hover:text-primary text-sm transition-colors">Pricing</a></li>
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
                className="bg-white/5 border-white/10 text-foreground placeholder:text-foreground/40 focus-visible:ring-primary rounded-lg"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-sm">
            © {new Date().getFullYear()} Veloria Inc. All rights reserved.
          </p>
          <p className="text-foreground/40 text-sm flex items-center gap-1">
            Crafted with <Heart size={14} className="text-primary fill-primary" /> in India
          </p>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href="#" 
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform z-50 group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="text-white" />
        <span className="absolute right-full mr-4 bg-background border border-white/10 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
          Need help? Chat with us
        </span>
      </a>
    </footer>
  );
}
