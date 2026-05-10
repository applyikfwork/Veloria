import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ExternalLink, 
  Settings, 
  Users, 
  Heart, 
  MessageSquare, 
  MessageCircle, 
  Copy, 
  Check, 
  Download,
  Trash2,
  ChevronRight,
  UserCheck,
  LayoutDashboard,
  Search,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [invitations, setInvitations] = useState<any[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // WhatsApp Manager State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bulkList, setBulkList] = useState('');
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, setLocation]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: invs, error: invError } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (invError) throw invError;
      setInvitations(invs || []);

      if (invs && invs.length > 0) {
        setSelectedInvId(invs[0].id);
        fetchInvDetails(invs[0].id);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchInvDetails(invId: string) {
    try {
      const { data: guestsData } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_id', invId);
      
      const { data: wishesData } = await supabase
        .from('wishes')
        .select('*')
        .eq('invitation_id', invId);

      setGuests(guestsData || []);
      setWishes(wishesData || []);
    } catch (err) {
      console.error('Error fetching details:', err);
    }
  }

  const handleInvChange = (id: string) => {
    setSelectedInvId(id);
    fetchInvDetails(id);
  };

  const getWhatsAppLink = (name: string, phone: string) => {
    const inv = invitations.find(i => i.id === selectedInvId);
    if (!inv) return '';
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/i/${inv.slug}?guest=${encodeURIComponent(name)}`;
    const text = `Dear ${name}, you are lovingly invited to ${inv.bride_name} & ${inv.groom_name}'s wedding! View invitation: ${url}`;
    
    // Clean phone: remove non-numeric
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    
    return `https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`;
  };

  const copyLink = (name: string, phone: string, key: string) => {
    const link = getWhatsAppLink(name, phone);
    navigator.clipboard.writeText(link);
    setCopiedLinks(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedLinks(prev => ({ ...prev, [key]: false }));
    }, 2000);
    toast({ title: "Copied!", description: `Link for ${name} copied.` });
  };

  const exportCSV = () => {
    if (guests.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Attending', 'Count', 'Meal', 'Events', 'Check-in'];
    const rows = guests.map(g => [
      g.name,
      g.email || '',
      g.phone || '',
      g.attending ? 'Yes' : 'No',
      g.guest_count || 1,
      g.meal_preference || '',
      (g.events_attending || []).join(';'),
      g.checked_in ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "guests_export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedInv = invitations.find(i => i.id === selectedInvId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Nav */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            VIVAH
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white/60 hover:text-white" onClick={() => setLocation('/')}>
              Home
            </Button>
            <Button className="bg-primary text-black font-bold" onClick={() => setLocation('/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-4">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <LayoutDashboard className="w-5 h-5 mr-2 text-primary" />
              Your Invitations
            </h2>
            <div className="space-y-2">
              {invitations.map(inv => (
                <button
                  key={inv.id}
                  onClick={() => handleInvChange(inv.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedInvId === inv.id 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <p className="font-bold truncate">{inv.bride_name} & {inv.groom_name}</p>
                  <p className="text-xs opacity-60">{inv.wedding_type}</p>
                </button>
              ))}
              {invitations.length === 0 && (
                <p className="text-white/40 italic text-sm p-4 bg-white/5 rounded-xl">No invitations created yet.</p>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {selectedInv ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{selectedInv.bride_name} & {selectedInv.groom_name}</h1>
                    <p className="text-white/40">Manage your wedding invitation and guests</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10" asChild>
                      <Link href={`/i/${selectedInv.slug}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-white/10" asChild>
                      <Link href={`/i/${selectedInv.slug}/memory`}>
                        <FileText className="w-4 h-4 mr-2" />
                        Memory Book
                      </Link>
                    </Button>
                    <Button className="bg-primary text-black font-bold">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-xs text-white/40">Total Guests</span>
                      </div>
                      <p className="text-3xl font-bold">{guests.reduce((acc, g) => acc + (g.guest_count || 1), 0)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <UserCheck className="w-5 h-5 text-green-400" />
                        <span className="text-xs text-white/40">RSVPs</span>
                      </div>
                      <p className="text-3xl font-bold">{guests.length}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        <span className="text-xs text-white/40">Wishes</span>
                      </div>
                      <p className="text-3xl font-bold">{wishes.length}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-xs text-white/40">Checked In</span>
                      </div>
                      <p className="text-3xl font-bold">{guests.filter(g => g.checked_in).length}</p>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="guests" className="w-full">
                  <TabsList className="bg-white/5 border-white/10 p-1 mb-6">
                    <TabsTrigger value="guests" className="data-[state=active]:bg-primary data-[state=active]:text-black">Guest List</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="data-[state=active]:bg-primary data-[state=active]:text-black">WhatsApp Manager</TabsTrigger>
                    <TabsTrigger value="wishes" className="data-[state=active]:bg-primary data-[state=active]:text-black">Wishes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="guests" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Confirmed Guests</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/10" onClick={exportCSV}>
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button className="bg-primary text-black" size="sm" asChild>
                          <Link href={`/checkin/${selectedInv.id}`}>
                            Check-in Dashboard
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10 bg-white/5">
                            <TableHead className="text-white/60">Name</TableHead>
                            <TableHead className="text-white/60">Attending</TableHead>
                            <TableHead className="text-white/60">Guests</TableHead>
                            <TableHead className="text-white/60">Meal Pref</TableHead>
                            <TableHead className="text-white/60">Status</TableHead>
                            <TableHead className="text-white/60 text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {guests.map((guest) => (
                            <TableRow key={guest.id} className="border-white/10 hover:bg-white/10">
                              <TableCell className="font-medium">
                                <div>
                                  {guest.name}
                                  <div className="text-xs text-white/40">{guest.phone || guest.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={guest.attending ? "text-green-400" : "text-red-400"}>
                                  {guest.attending ? "Yes" : "No"}
                                </span>
                              </TableCell>
                              <TableCell>{guest.guest_count || 1}</TableCell>
                              <TableCell>{guest.meal_preference || '-'}</TableCell>
                              <TableCell>
                                {guest.checked_in ? (
                                  <span className="flex items-center text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                                    <Check className="w-3 h-3 mr-1" /> Checked In
                                  </span>
                                ) : (
                                  <span className="text-xs text-white/40">Pending</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="text-white/40 hover:text-red-400">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {guests.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-12 text-white/40 italic">
                                No RSVPs received yet.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="whatsapp" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg">Add Single Guest</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Guest Name</label>
                            <Input 
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="e.g. John Doe"
                              className="bg-white/5 border-white/10 focus:ring-primary/30 focus:border-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">WhatsApp Number</label>
                            <Input 
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              placeholder="e.g. 9876543210"
                              className="bg-white/5 border-white/10 focus:ring-primary/30 focus:border-primary"
                            />
                          </div>
                          <Button 
                            className="w-full bg-primary text-black font-bold"
                            onClick={() => {
                              if (!guestName || !guestPhone) return;
                              const link = getWhatsAppLink(guestName, guestPhone);
                              window.open(link, '_blank');
                              setGuestName('');
                              setGuestPhone('');
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Open WhatsApp
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg">Bulk Invitation Generator</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm text-white/60">Paste list (Name, Phone)</label>
                            <textarea 
                              value={bulkList}
                              onChange={(e) => setBulkList(e.target.value)}
                              placeholder="John, 9876543210&#10;Jane, 9988776655"
                              className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:ring-primary/30 focus:border-primary outline-none"
                            />
                          </div>
                          <p className="text-xs text-white/40">One pair per line. Format: Name, Phone</p>
                        </CardContent>
                      </Card>
                    </div>

                    {bulkList && (
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-lg">Generated Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {bulkList.split('\n').filter(line => line.includes(',')).map((line, i) => {
                              const [name, phone] = line.split(',').map(s => s.trim());
                              if (!name || !phone) return null;
                              const key = `bulk-${i}`;
                              return (
                                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                  <div>
                                    <p className="font-bold text-sm">{name}</p>
                                    <p className="text-xs text-white/40">{phone}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-primary hover:bg-primary/10"
                                      onClick={() => copyLink(name, phone, key)}
                                    >
                                      {copiedLinks[key] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-green-500 hover:bg-green-500/10"
                                      onClick={() => window.open(getWhatsAppLink(name, phone), '_blank')}
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="wishes">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishes.map((wish) => (
                        <Card key={wish.id} className="bg-white/5 border-white/10 p-6">
                          <p className="text-white/80 italic mb-4">"{wish.message}"</p>
                          <div className="border-t border-white/10 pt-4">
                            <p className="font-bold text-primary">{wish.guest_name}</p>
                            <p className="text-xs text-white/40">{wish.relation}</p>
                          </div>
                        </Card>
                      ))}
                      {wishes.length === 0 && (
                        <div className="col-span-full py-12 text-center text-white/40 italic">
                          No wishes yet.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <LayoutDashboard className="w-16 h-16 text-white/10 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Invitation Selected</h2>
                <p className="text-white/40 max-w-md">
                  Choose an invitation from the sidebar or create a new one to manage your wedding.
                </p>
                <Button className="mt-6 bg-primary text-black font-bold" onClick={() => setLocation('/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invitation
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
