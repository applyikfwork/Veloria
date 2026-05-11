import React from 'react';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/features';
import SocialProof from '@/components/SocialProof';
import Templates from '@/components/templates';
import Testimonials from '@/components/testimonials';
import Pricing from '@/components/pricing';
import Footer from '@/components/footer';
import MobileNav from '@/components/mobile-nav';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <SocialProof />
      <Templates />
      <Testimonials />
      <Pricing />
      <Footer />
      <MobileNav />
    </main>
  );
}
