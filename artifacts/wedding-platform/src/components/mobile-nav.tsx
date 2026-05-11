import React from 'react';
import { Home, LayoutTemplate } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-primary/15 z-40 pb-safe">
      <div className="flex items-center justify-around p-3">
        <Link href="/">
          <div className={`flex flex-col items-center gap-1 p-2 transition-colors cursor-pointer ${location === '/' ? 'text-primary' : 'text-foreground/50 hover:text-primary'}`}>
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </div>
        </Link>
        <Link href="/templates">
          <div className={`flex flex-col items-center gap-1 p-2 transition-colors cursor-pointer ${location === '/templates' ? 'text-primary' : 'text-foreground/50 hover:text-primary'}`}>
            <LayoutTemplate size={20} />
            <span className="text-[10px] font-medium">Templates</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
