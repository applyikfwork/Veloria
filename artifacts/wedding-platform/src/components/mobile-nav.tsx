import React from 'react';
import { Home, Sparkles, LayoutTemplate, Tag } from 'lucide-react';
import { Link } from 'wouter';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-white/10 z-40 pb-safe">
      <div className="flex items-center justify-around p-3">
        <a href="#home" className="flex flex-col items-center gap-1 text-primary p-2">
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#features" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors p-2">
          <Sparkles size={20} />
          <span className="text-[10px] font-medium">Features</span>
        </a>
        <a href="#templates" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors p-2">
          <LayoutTemplate size={20} />
          <span className="text-[10px] font-medium">Templates</span>
        </a>
        <a href="#pricing" className="flex flex-col items-center gap-1 text-foreground/60 hover:text-primary transition-colors p-2">
          <Tag size={20} />
          <span className="text-[10px] font-medium">Pricing</span>
        </a>
      </div>
    </div>
  );
}
