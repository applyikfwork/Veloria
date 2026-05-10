import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Partners() {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    // Simple counter animation for the dashboard
    const duration = 2000;
    const target = 45200;
    const interval = 20;
    const steps = duration / interval;
    const increment = target / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="partners" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <div className="flex-1 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/30 border border-secondary/50 text-[#F7E7CE] mb-6">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium tracking-wide uppercase">Partner Program</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Become a <span className="text-primary italic">Vivah Partner</span>
              </h2>
              
              <p className="text-lg text-foreground/80 mb-8 font-light leading-relaxed">
                For Photographers, Videographers, and Wedding Planners. Elevate your clients' experience while building an additional revenue stream.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Earn generous referral rewards for every couple.",
                  "Exclusive Partner Dashboard with real-time analytics.",
                  "Co-branded invitations featuring your logo.",
                  "Priority support and dedicated account manager."
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-start gap-3 text-foreground/90"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Button size="lg" className="h-14 px-8 bg-primary text-primary-foreground text-lg rounded-full font-semibold hover:bg-primary/90 transition-transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                Apply for Partnership
              </Button>
            </motion.div>
          </div>

          {/* Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full perspective-[1000px]"
          >
            <div className="bg-card/40 backdrop-blur-2xl rounded-3xl border border-primary/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(212,175,55,0.1)] transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-500 relative overflow-hidden">
              
              {/* Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                <div>
                  <p className="text-foreground/60 text-sm font-medium tracking-wider uppercase mb-1">Total Earnings</p>
                  <h3 className="text-4xl font-serif font-bold text-foreground flex items-center gap-2">
                    ₹{count.toLocaleString()}
                    <span className="inline-flex items-center text-xs font-sans font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full align-middle">
                      <TrendingUp className="w-3 h-3 mr-1" /> +12%
                    </span>
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background/50 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-primary/70" />
                    <span className="text-sm text-foreground/70">Referrals</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">23</p>
                </div>
                <div className="bg-background/50 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-primary/70" />
                    <span className="text-sm text-foreground/70">Conversion</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">84%</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-foreground/70 mb-4 font-medium">Recent Activity</p>
                <div className="space-y-3">
                  {[
                    { name: "Rahul & Sneha", amount: "₹1,500", time: "2h ago" },
                    { name: "Vikram & Pooja", amount: "₹1,500", time: "5h ago" },
                    { name: "Arun & Maya", amount: "₹1,500", time: "1d ago" }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-[#F7E7CE]">
                          {activity.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.name}</p>
                          <p className="text-xs text-foreground/50">{activity.time}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-primary">{activity.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
