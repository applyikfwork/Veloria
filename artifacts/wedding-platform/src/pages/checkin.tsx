import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Search, 
  QrCode, 
  ChevronRight,
  LogOut,
  ArrowRight,
  UserCheck,
  Table as TableIcon,
  Utensils
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CheckinPage() {
  const [, params] = useRoute("/checkin/:invitationId");
  const invitationId = params?.invitationId;
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    checkedIn: 0,
    pending: 0
  });

  useEffect(() => {
    const savedAuth = sessionStorage.getItem(`auth-checkin-${invitationId}`);
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [invitationId]);

  useEffect(() => {
    if (isAuthenticated && invitationId) {
      fetchGuests();
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel(`guests-checkin-${invitationId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'guests',
          filter: `invitation_id=eq.${invitationId}`
        }, () => {
          fetchGuests();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
    return () => {};
  }, [isAuthenticated, invitationId]);

  async function fetchGuests() {
    if (!invitationId) return;
    
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('invitation_id', invitationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load guest list",
        variant: "destructive"
      });
      return;
    }

    setGuests(data || []);
    calculateStats(data || []);
  }

  function calculateStats(guestData: any[]) {
    const total = guestData.length;
    const confirmed = guestData.filter(g => g.attending).length;
    const checkedIn = guestData.filter(g => g.checked_in).length;
    const pending = confirmed - checkedIn;

    setStats({ total, confirmed, checkedIn, pending });
  }

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      setIsAuthenticated(true);
      sessionStorage.setItem(`auth-checkin-${invitationId}`, "true");
      toast({ title: "Welcome back", description: "Access granted." });
    } else {
      toast({ 
        title: "Access Denied", 
        description: "Incorrect PIN. Try 1234.",
        variant: "destructive" 
      });
    }
  };

  const handleCheckIn = async (qrCode: string) => {
    const guest = guests.find(g => g.qr_code === qrCode);
    
    if (!guest) {
      toast({
        title: "Guest not found",
        description: "No guest matches this QR code.",
        variant: "destructive"
      });
      return;
    }

    if (guest.checked_in) {
      toast({
        title: "Already checked in",
        description: `${guest.name} was already checked in.`,
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('guests')
      .update({ 
        checked_in: true, 
        checked_in_at: new Date().toISOString() 
      })
      .eq('id', guest.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to check in guest.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Check-in Successful!",
        description: `Welcome, ${guest.name}!`,
      });
      setScannedCode("");
    }
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.phone && g.phone.includes(search))
  );

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-serif text-white">Check-in Terminal</CardTitle>
              <p className="text-muted-foreground">Please enter your 4-digit PIN to access the dashboard.</p>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input 
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="text-center text-4xl tracking-[0.5em] h-16 bg-white/5 border-white/10"
                autoFocus
              />
              <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground">
                Unlock <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-primary/40 italic">Demo PIN: 1234</p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-foreground font-sans pb-24">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0B0B0F]/80 backdrop-blur-lg border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-serif text-white leading-none">Wedding Check-in</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary">Live Dashboard</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              sessionStorage.removeItem(`auth-checkin-${invitationId}`);
              setIsAuthenticated(false);
            }}
            className="text-muted-foreground hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Guests", val: stats.total, icon: Users, color: "text-blue-400" },
            { label: "Confirmed", val: stats.confirmed, icon: CheckCircle, color: "text-primary" },
            { label: "Checked In", val: stats.checkedIn, icon: UserCheck, color: "text-green-400" },
            { label: "Pending", val: stats.pending, icon: Clock, color: "text-orange-400" },
          ].map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <stat.icon className={`h-5 w-5 mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-white">{stat.val}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scan Bar */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
                <Input 
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckIn(scannedCode)}
                  placeholder="Paste QR Code or Scan..."
                  className="pl-12 h-14 bg-white/5 border-white/10 text-lg"
                />
              </div>
              <Button 
                onClick={() => handleCheckIn(scannedCode)}
                className="h-14 px-12 bg-primary text-primary-foreground"
              >
                CHECK IN GUEST
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guest List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-serif text-white">Guest List</h2>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or phone..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredGuests.map((guest) => (
              <motion.div 
                key={guest.id}
                layout
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  guest.checked_in 
                  ? "bg-green-500/5 border-green-500/20" 
                  : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    guest.checked_in ? "bg-green-500 text-white" : "bg-white/10 text-white/40"
                  }`}>
                    {guest.name[0]}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{guest.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <TableIcon className="h-3 w-3" /> Table: {guest.table_number || "TBD"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Utensils className="h-3 w-3" /> {guest.meal_preference}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {guest.checked_in ? (
                    <div className="flex flex-col items-end">
                      <span className="text-green-500 text-xs font-bold uppercase flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Checked In
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(guest.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleCheckIn(guest.qr_code)}
                      className="border-primary/20 text-primary hover:bg-primary/5"
                    >
                      Check In <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}

            {filteredGuests.length === 0 && (
              <div className="text-center py-24 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No guests found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
