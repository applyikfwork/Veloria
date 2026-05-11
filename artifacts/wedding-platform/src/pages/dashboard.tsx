import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'wouter';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, ExternalLink, Settings, Users, Heart, MessageSquare,
  MessageCircle, Copy, Check, Download, Trash2, ChevronRight,
  UserCheck, LayoutDashboard, FileText, Bell, BarChart2,
  DollarSign, Store, Sparkles, Eye, Send, RefreshCw,
  TrendingUp, MapPin, AlertCircle, Star, Calendar, Wallet,
  ShoppingBag, PieChart, ArrowUpRight, Award, Clock, X, Plus as PlusIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

// ─── Budget Tracker ──────────────────────────────────────────────────────────
const BUDGET_CATEGORIES = ['Venue', 'Catering', 'Photography', 'Decoration', 'Dress & Jewelry', 'Music', 'Invitations', 'Transportation', 'Honeymoon', 'Miscellaneous'];

function useBudget(invId: string | null) {
  const key = `veloria_budget_${invId}`;
  const [items, setItems] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  const save = (next: any[]) => { setItems(next); localStorage.setItem(key, JSON.stringify(next)); };
  const add = (item: any) => save([...items, { ...item, id: Date.now().toString() }]);
  const remove = (id: string) => save(items.filter((i: any) => i.id !== id));
  const update = (id: string, field: string, val: any) =>
    save(items.map((i: any) => i.id === id ? { ...i, [field]: val } : i));
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(key) || '[]')); } catch { setItems([]); }
  }, [invId]);
  return { items, add, remove, update };
}

function BudgetTracker({ invId }: { invId: string }) {
  const { items, add, remove, update } = useBudget(invId);
  const [form, setForm] = useState({ category: BUDGET_CATEGORIES[0], description: '', budget: '', actual: '' });
  const [showForm, setShowForm] = useState(false);
  const totalBudget = items.reduce((s: number, i: any) => s + Number(i.budget || 0), 0);
  const totalActual = items.reduce((s: number, i: any) => s + Number(i.actual || 0), 0);
  const pct = totalBudget > 0 ? Math.min((totalActual / totalBudget) * 100, 100) : 0;

  const chartData = BUDGET_CATEGORIES
    .map(cat => ({ name: cat.split(' ')[0], value: items.filter((i: any) => i.category === cat).reduce((s: number, i: any) => s + Number(i.budget || 0), 0) }))
    .filter(d => d.value > 0);
  const COLORS = ['#D4AF37', '#B59530', '#E8C547', '#F0D060', '#A08020', '#C8A030', '#D4AF37', '#B59530'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6 text-center">
            <Wallet className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">₹{totalBudget.toLocaleString()}</p>
            <p className="text-xs text-white/40 mt-1">Total Budget</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6 text-center">
            <DollarSign className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">₹{totalActual.toLocaleString()}</p>
            <p className="text-xs text-white/40 mt-1">Spent So Far</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6 text-center">
            <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${totalActual > totalBudget ? 'text-red-400' : 'text-green-400'}`} />
            <p className={`text-2xl font-bold ${totalActual > totalBudget ? 'text-red-400' : 'text-green-400'}`}>
              ₹{Math.abs(totalBudget - totalActual).toLocaleString()}
            </p>
            <p className="text-xs text-white/40 mt-1">{totalActual > totalBudget ? 'Over Budget' : 'Remaining'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex justify-between text-xs text-white/40 mb-2">
          <span>Budget Used</span>
          <span>{pct.toFixed(0)}%</span>
        </div>
        <Progress value={pct} className={`h-3 ${pct > 90 ? '[&>div]:bg-red-500' : pct > 70 ? '[&>div]:bg-yellow-500' : ''}`} />
      </div>

      {chartData.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="text-sm font-medium text-white/60 mb-4">Budget Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} contentStyle={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Budget Items</h3>
        <Button onClick={() => setShowForm(f => !f)} size="sm" className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  >
                    {BUDGET_CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                  </select>
                  <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-white/10 border-white/10" />
                  <Input placeholder="Budget (₹)" type="number" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className="bg-white/10 border-white/10" />
                  <Input placeholder="Actual (₹)" type="number" value={form.actual} onChange={e => setForm(f => ({ ...f, actual: e.target.value }))} className="bg-white/10 border-white/10" />
                </div>
                <div className="flex gap-2">
                  <Button className="bg-primary text-black" size="sm" onClick={() => { if (form.description || form.budget) { add(form); setForm({ category: BUDGET_CATEGORIES[0], description: '', budget: '', actual: '' }); setShowForm(false); } }}>
                    Save Item
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/40" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 bg-white/5">
              <TableHead className="text-white/60">Category</TableHead>
              <TableHead className="text-white/60">Description</TableHead>
              <TableHead className="text-white/60 text-right">Budget</TableHead>
              <TableHead className="text-white/60 text-right">Actual</TableHead>
              <TableHead className="text-white/60 text-right">Diff</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: any) => {
              const diff = Number(item.budget || 0) - Number(item.actual || 0);
              return (
                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                  <TableCell><Badge variant="outline" className="border-primary/30 text-primary text-xs">{item.category}</Badge></TableCell>
                  <TableCell className="text-white/80">{item.description || '—'}</TableCell>
                  <TableCell className="text-right text-white/60">₹{Number(item.budget || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right text-white/80">₹{Number(item.actual || 0).toLocaleString()}</TableCell>
                  <TableCell className={`text-right font-semibold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>{diff >= 0 ? '+' : ''}₹{Math.abs(diff).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-white/30 hover:text-red-400 h-7 w-7" onClick={() => remove(item.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-white/30 italic">Add budget items to track your wedding expenses.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Vendor Directory ────────────────────────────────────────────────────────
const VENDOR_CATEGORIES = ['Photographer', 'Videographer', 'Caterer', 'Decorator', 'Mehendi Artist', 'Makeup Artist', 'DJ / Band', 'Pandit / Priest', 'Florist', 'Venue', 'Travel Agent', 'Other'];
const VENDOR_STATUS = ['Enquired', 'Shortlisted', 'Booked', 'Paid', 'Completed', 'Cancelled'];
const STATUS_COLORS: Record<string, string> = { Enquired: 'text-yellow-400', Shortlisted: 'text-blue-400', Booked: 'text-primary', Paid: 'text-green-400', Completed: 'text-green-600', Cancelled: 'text-red-400' };

function useVendors(invId: string | null) {
  const key = `veloria_vendors_${invId}`;
  const [vendors, setVendors] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  const save = (next: any[]) => { setVendors(next); localStorage.setItem(key, JSON.stringify(next)); };
  const add = (v: any) => save([...vendors, { ...v, id: Date.now().toString() }]);
  const remove = (id: string) => save(vendors.filter((v: any) => v.id !== id));
  const updateStatus = (id: string, status: string) => save(vendors.map((v: any) => v.id === id ? { ...v, status } : v));
  useEffect(() => {
    try { setVendors(JSON.parse(localStorage.getItem(key) || '[]')); } catch { setVendors([]); }
  }, [invId]);
  return { vendors, add, remove, updateStatus };
}

function VendorDirectory({ invId }: { invId: string }) {
  const { vendors, add, remove, updateStatus } = useVendors(invId);
  const [form, setForm] = useState({ category: VENDOR_CATEGORIES[0], name: '', phone: '', email: '', amount: '', notes: '', status: 'Enquired' });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Vendor Directory</h3>
        <Button onClick={() => setShowForm(f => !f)} size="sm" className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30">
          <Plus className="w-4 h-4 mr-1" /> Add Vendor
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    {VENDOR_CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                  </select>
                  <Input placeholder="Vendor Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-white/10 border-white/10" />
                  <Input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-white/10 border-white/10" />
                  <Input placeholder="Email (optional)" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-white/10 border-white/10" />
                  <Input placeholder="Amount (₹)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="bg-white/10 border-white/10" />
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="bg-white/10 border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    {VENDOR_STATUS.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                  </select>
                </div>
                <Input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="bg-white/10 border-white/10" />
                <div className="flex gap-2">
                  <Button className="bg-primary text-black" size="sm" onClick={() => { if (form.name) { add(form); setForm({ category: VENDOR_CATEGORIES[0], name: '', phone: '', email: '', amount: '', notes: '', status: 'Enquired' }); setShowForm(false); } }}>
                    Save Vendor
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/40" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v: any) => (
          <motion.div key={v.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all">
              <CardContent className="pt-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white">{v.name}</h4>
                    <Badge variant="outline" className="border-white/10 text-white/40 text-[10px] mt-1">{v.category}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white/20 hover:text-red-400 h-7 w-7" onClick={() => remove(v.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {v.phone && (
                  <div className="flex items-center gap-2">
                    <a href={`tel:${v.phone}`} className="text-sm text-white/60 hover:text-white">{v.phone}</a>
                    <a href={`https://wa.me/91${v.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
                {v.amount && <p className="text-sm text-primary font-semibold">₹{Number(v.amount).toLocaleString()}</p>}
                {v.notes && <p className="text-xs text-white/40 italic">{v.notes}</p>}
                <select
                  value={v.status}
                  onChange={e => updateStatus(v.id, e.target.value)}
                  className={`w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none ${STATUS_COLORS[v.status] || 'text-white'}`}
                >
                  {VENDOR_STATUS.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                </select>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {vendors.length === 0 && (
          <div className="col-span-full py-16 text-center text-white/30 italic border-2 border-dashed border-white/5 rounded-xl">
            <Store className="w-10 h-10 mx-auto mb-3 opacity-20" />
            Add your vendors to track bookings and payments.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Analytics Tab ───────────────────────────────────────────────────────────
function AnalyticsTab({ guests, wishes, invitation }: { guests: any[]; wishes: any[]; invitation: any }) {
  const attending = guests.filter(g => g.attending);
  const notAttending = guests.filter(g => !g.attending);
  const checkedIn = guests.filter(g => g.checked_in);
  const totalHeads = guests.reduce((s, g) => s + (g.guest_count || 1), 0);
  const attendingHeads = attending.reduce((s, g) => s + (g.guest_count || 1), 0);

  const pieData = [
    { name: 'Attending', value: attending.length || 0 },
    { name: 'Not Attending', value: notAttending.length || 0 },
    { name: 'Pending', value: Math.max(0, 0) },
  ].filter(d => d.value > 0);

  const mealData = Object.entries(
    guests.reduce((acc: any, g) => { const m = g.meal_preference || 'Not specified'; acc[m] = (acc[m] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const rsvpByDate = wishes.reduce((acc: any, w) => {
    const d = format(new Date(w.created_at), 'MMM d');
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const wishChart = Object.entries(rsvpByDate).slice(-7).map(([date, count]) => ({ date, count }));

  const PIE_COLORS = ['#D4AF37', '#ef4444', '#6b7280'];

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Users className="w-5 h-5 text-blue-400" />, label: 'Total RSVPs', value: guests.length, sub: `${totalHeads} total heads` },
          { icon: <UserCheck className="w-5 h-5 text-green-400" />, label: 'Attending', value: attending.length, sub: `${attendingHeads} heads confirmed` },
          { icon: <Heart className="w-5 h-5 text-red-400" />, label: 'Wishes', value: wishes.length, sub: 'love messages' },
          { icon: <Award className="w-5 h-5 text-primary" />, label: 'Checked In', value: checkedIn.length, sub: `of ${attending.length} confirmed` },
        ].map((s, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardContent className="pt-5">
              <div className="flex justify-between items-center mb-2">{s.icon}<ArrowUpRight className="w-4 h-4 text-white/20" /></div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-1 font-medium">{s.label}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* RSVP Pie Chart */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white text-base">RSVP Status</CardTitle></CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <RechartsPie>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-white/30 italic text-sm">No RSVPs yet</div>
            )}
          </CardContent>
        </Card>

        {/* Wishes over time */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white text-base">Wishes Over Time</CardTitle></CardHeader>
          <CardContent>
            {wishChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={wishChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-white/30 italic text-sm">No wishes yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meal preferences */}
      {mealData.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader><CardTitle className="text-white text-base">Meal Preferences</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mealData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="value" fill="#D4AF37" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Share link */}
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="pt-5 flex items-center gap-4">
          <ExternalLink className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium">Share your invitation link</p>
            <p className="text-xs text-white/40 truncate">{window.location.origin}/i/{invitation?.slug}</p>
          </div>
          <Button size="sm" className="bg-primary text-black shrink-0" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/i/${invitation?.slug}`); }}>
            <Copy className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── AI Tools Tab ────────────────────────────────────────────────────────────
function AIToolsTab({ invitation }: { invitation: any }) {
  const [vowsResult, setVowsResult] = useState('');
  const [speechResult, setSpeechResult] = useState('');
  const [loadingVows, setLoadingVows] = useState(false);
  const [loadingSpeech, setLoadingSpeech] = useState(false);
  const [vowsForm, setVowsForm] = useState({ role: 'bride', tone: 'romantic and emotional', keywords: 'love, commitment, forever' });
  const [speechForm, setSpeechForm] = useState({ speakerName: '', speakerRole: 'best friend', tone: 'warm, funny, and heartfelt', memories: '' });
  const { toast } = useToast();

  const generateVows = async () => {
    setLoadingVows(true);
    try {
      const res = await fetch('/api/ai/vows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brideName: invitation?.bride_name, groomName: invitation?.groom_name, ...vowsForm }),
      });
      const data = await res.json();
      setVowsResult(data.vows || '');
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
    finally { setLoadingVows(false); }
  };

  const generateSpeech = async () => {
    setLoadingSpeech(true);
    try {
      const res = await fetch('/api/ai/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brideName: invitation?.bride_name, groomName: invitation?.groom_name, ...speechForm }),
      });
      const data = await res.json();
      setSpeechResult(data.speech || '');
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
    finally { setLoadingSpeech(false); }
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast({ title: 'Copied!' }); };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Vow Writer */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" /> AI Vow Writer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {['bride', 'groom', 'both'].map(r => (
                <button key={r} onClick={() => setVowsForm(f => ({ ...f, role: r }))}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize border transition-all ${vowsForm.role === r ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}>
                  {r === 'both' ? 'Joint' : r}
                </button>
              ))}
            </div>
            <Input placeholder="Tone (e.g. romantic, humorous...)" value={vowsForm.tone} onChange={e => setVowsForm(f => ({ ...f, tone: e.target.value }))} className="bg-white/10 border-white/10" />
            <Input placeholder="Themes (e.g. travel, faith, growth...)" value={vowsForm.keywords} onChange={e => setVowsForm(f => ({ ...f, keywords: e.target.value }))} className="bg-white/10 border-white/10" />
            <Button className="w-full bg-primary text-black" onClick={generateVows} disabled={loadingVows}>
              {loadingVows ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Vows</>}
            </Button>
            {vowsResult && (
              <div className="bg-black/40 rounded-xl p-4 space-y-3">
                <p className="text-white/80 italic text-sm leading-relaxed whitespace-pre-wrap">{vowsResult}</p>
                <Button size="sm" variant="outline" className="border-white/10 text-white/60" onClick={() => copy(vowsResult)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy Vows
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Speech Writer */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> AI Speech Writer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Your name (speaker)" value={speechForm.speakerName} onChange={e => setSpeechForm(f => ({ ...f, speakerName: e.target.value }))} className="bg-white/10 border-white/10" />
            <Input placeholder="Your role (best man, sister, parent...)" value={speechForm.speakerRole} onChange={e => setSpeechForm(f => ({ ...f, speakerRole: e.target.value }))} className="bg-white/10 border-white/10" />
            <Input placeholder="Tone (e.g. funny, emotional, formal...)" value={speechForm.tone} onChange={e => setSpeechForm(f => ({ ...f, tone: e.target.value }))} className="bg-white/10 border-white/10" />
            <Input placeholder="Shared memories or stories" value={speechForm.memories} onChange={e => setSpeechForm(f => ({ ...f, memories: e.target.value }))} className="bg-white/10 border-white/10" />
            <Button className="w-full bg-primary text-black" onClick={generateSpeech} disabled={loadingSpeech}>
              {loadingSpeech ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Writing...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Speech</>}
            </Button>
            {speechResult && (
              <div className="bg-black/40 rounded-xl p-4 space-y-3">
                <p className="text-white/80 italic text-sm leading-relaxed whitespace-pre-wrap">{speechResult}</p>
                <Button size="sm" variant="outline" className="border-white/10 text-white/60" onClick={() => copy(speechResult)}>
                  <Copy className="w-4 h-4 mr-2" /> Copy Speech
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RSVP Reminder Generator */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5 text-green-400" /> RSVP Reminder Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/50 text-sm mb-4">Generate personalised WhatsApp reminders for guests who haven't RSVPd yet.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Gentle Reminder', emoji: '🌸', message: `Hi [Name]! Just a gentle reminder that we'd love to have you at our wedding. Please RSVP at [Link] 🙏` },
              { name: 'Countdown Push', emoji: '⏰', message: `Only [X] days left to RSVP for [Bride] & [Groom]'s wedding! We don't want to miss celebrating with you. RSVP here: [Link]` },
              { name: 'Personal Touch', emoji: '💝', message: `Dear [Name], our wedding wouldn't be complete without you. Your presence means the world to us. Please let us know: [Link]` },
              { name: 'Final Call', emoji: '📢', message: `Final reminder! RSVP closes [Date]. Please confirm your attendance for [Bride] & [Groom]'s wedding: [Link]` },
            ].map((template) => (
              <div key={template.name} className="bg-black/40 rounded-xl p-4 space-y-2 hover:bg-black/60 transition-colors">
                <p className="text-sm font-medium text-white">{template.emoji} {template.name}</p>
                <p className="text-xs text-white/50 italic">{template.message}</p>
                <Button size="sm" variant="outline" className="border-white/10 text-white/60 w-full" onClick={() => { navigator.clipboard.writeText(template.message); }}>
                  <Copy className="w-3 h-3 mr-1" /> Copy Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [invitations, setInvitations] = useState<any[]>([]);
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);
  const [guests, setGuests] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // WhatsApp Manager State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bulkList, setBulkList] = useState('');
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && !user) { setLocation('/'); return; }
    if (user) fetchData();
  }, [user, authLoading]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: invs } = await supabase
        .from('invitations').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      setInvitations(invs || []);
      if (invs && invs.length > 0) {
        setSelectedInvId(invs[0].id);
        await fetchInvDetails(invs[0].id);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function fetchInvDetails(invId: string) {
    try {
      const [{ data: g }, { data: w }] = await Promise.all([
        supabase.from('guests').select('*').eq('invitation_id', invId).order('created_at', { ascending: false }),
        supabase.from('wishes').select('*').eq('invitation_id', invId).order('created_at', { ascending: false }),
      ]);
      setGuests(g || []);
      setWishes(w || []);
      // Build notifications from recent RSVPs + wishes
      const notifs = [
        ...(g || []).slice(0, 3).map((guest: any) => ({
          id: `rsvp-${guest.id}`, type: 'rsvp', icon: <UserCheck className="w-4 h-4 text-green-400" />,
          text: `${guest.name} ${guest.attending ? 'confirmed attendance' : 'declined'}`,
          time: guest.created_at, color: guest.attending ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
        })),
        ...(w || []).slice(0, 3).map((wish: any) => ({
          id: `wish-${wish.id}`, type: 'wish', icon: <Heart className="w-4 h-4 text-red-400" />,
          text: `${wish.guest_name} left a blessing: "${wish.message.slice(0, 40)}..."`,
          time: wish.created_at, color: 'border-red-500/20 bg-red-500/5'
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setNotifications(notifs);
    } catch (err) { console.error(err); }
  }

  const handleInvChange = (id: string) => { setSelectedInvId(id); fetchInvDetails(id); };

  const getWhatsAppLink = (name: string, phone: string) => {
    const inv = invitations.find(i => i.id === selectedInvId);
    if (!inv) return '';
    const url = `${window.location.origin}/i/${inv.slug}?guest=${encodeURIComponent(name)}`;
    const text = `Dear ${name}, you are lovingly invited to ${inv.bride_name} & ${inv.groom_name}'s wedding! View invitation: ${url}`;
    const clean = phone.replace(/\D/g, '');
    const final = clean.startsWith('91') ? clean : `91${clean}`;
    return `https://wa.me/${final}?text=${encodeURIComponent(text)}`;
  };

  const copyLink = (name: string, phone: string, key: string) => {
    navigator.clipboard.writeText(getWhatsAppLink(name, phone));
    setCopiedLinks(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopiedLinks(p => ({ ...p, [key]: false })), 2000);
    toast({ title: 'Copied!', description: `Link for ${name} copied.` });
  };

  const exportCSV = () => {
    if (!guests.length) return;
    const csv = [['Name', 'Email', 'Phone', 'Attending', 'Count', 'Meal', 'Checked-in'],
      ...guests.map(g => [g.name, g.email || '', g.phone || '', g.attending ? 'Yes' : 'No', g.guest_count || 1, g.meal_preference || '', g.checked_in ? 'Yes' : 'No'])]
      .map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'guests.csv';
    a.click();
  };

  if (loading || authLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const selectedInv = invitations.find(i => i.id === selectedInvId);
  const confirmedCount = guests.filter(g => g.attending).length;
  const totalHeads = guests.reduce((s, g) => s + (g.guest_count || 1), 0);
  const attendingHeads = guests.filter(g => g.attending).reduce((s, g) => s + (g.guest_count || 1), 0);

  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      {/* Top Nav */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl text-primary tracking-wide">Veloria</Link>
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="relative">
                <Bell className="w-5 h-5 text-white/60" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-black text-[9px] font-bold flex items-center justify-center">{notifications.length}</span>
              </div>
            )}
            <Button variant="ghost" className="text-white/60 hover:text-white text-sm" onClick={() => setLocation('/')}>Home</Button>
            <Button className="bg-primary text-black font-bold text-sm" onClick={() => setLocation('/create')}>
              <Plus className="w-4 h-4 mr-1.5" />Create New
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-4 shrink-0">
            <h2 className="text-sm uppercase tracking-widest text-white/30 font-medium px-1 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Your Invitations
            </h2>
            <div className="space-y-2">
              {invitations.map(inv => (
                <motion.button key={inv.id} whileHover={{ x: 2 }} onClick={() => handleInvChange(inv.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedInvId === inv.id ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'bg-white/3 border-white/8 text-white/60 hover:bg-white/6 hover:border-white/15'}`}>
                  <p className="font-semibold text-sm text-white truncate">{inv.bride_name} & {inv.groom_name}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{inv.wedding_type}</p>
                  {selectedInvId === inv.id && (
                    <div className="flex gap-1 mt-3">
                      <Link href={`/i/${inv.slug}`} onClick={e => e.stopPropagation()} className="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary/20">View Live ↗</Link>
                      <Link href={`/i/${inv.slug}/memory`} onClick={e => e.stopPropagation()} className="text-[10px] text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full hover:bg-white/10">Memory Book</Link>
                    </div>
                  )}
                </motion.button>
              ))}
              {invitations.length === 0 && (
                <div className="p-6 text-center border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-white/30 italic text-sm">No invitations yet</p>
                </div>
              )}
            </div>

            {/* Recent notifications */}
            {notifications.length > 0 && (
              <div className="space-y-2 pt-4">
                <h3 className="text-xs uppercase tracking-widest text-white/30 px-1 flex items-center gap-2">
                  <Bell className="w-3 h-3" /> Recent Activity
                </h3>
                {notifications.slice(0, 4).map(n => (
                  <div key={n.id} className={`p-3 rounded-xl border text-xs ${n.color}`}>
                    <div className="flex items-start gap-2">
                      {n.icon}
                      <p className="text-white/70 leading-snug">{n.text}</p>
                    </div>
                    <p className="text-white/20 mt-1 ml-6">{n.time ? format(new Date(n.time), 'MMM d, h:mm a') : ''}</p>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-8">
            {selectedInv ? (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-white">{selectedInv.bride_name} <span className="text-primary">♥</span> {selectedInv.groom_name}</h1>
                    <p className="text-white/30 text-sm mt-1">Manage your invitation, guests, budget, and vendors</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-white rounded-full" asChild>
                      <Link href={`/i/${selectedInv.slug}`}><ExternalLink className="w-4 h-4 mr-1.5" />View Live</Link>
                    </Button>
                    <Button size="sm" className="bg-primary text-black font-bold rounded-full" asChild>
                      <Link href="/create"><Settings className="w-4 h-4 mr-1.5" />Edit Invitation</Link>
                    </Button>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'RSVPs', value: guests.length, sub: `${totalHeads} total heads`, icon: <Users className="w-5 h-5 text-blue-400" />, color: 'text-blue-400' },
                    { label: 'Confirmed', value: confirmedCount, sub: `${attendingHeads} heads attending`, icon: <UserCheck className="w-5 h-5 text-green-400" />, color: 'text-green-400' },
                    { label: 'Wishes', value: wishes.length, sub: 'love messages', icon: <Heart className="w-5 h-5 text-red-400" />, color: 'text-red-400' },
                    { label: 'Checked In', value: guests.filter(g => g.checked_in).length, sub: 'on the day', icon: <Check className="w-5 h-5 text-primary" />, color: 'text-primary' },
                  ].map((s, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 hover:border-white/15 transition-all">
                      <CardContent className="pt-5">
                        <div className="flex items-center justify-between mb-3">{s.icon}<span className="text-[10px] text-white/30 uppercase tracking-wider">{s.label}</span></div>
                        <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] text-white/30 mt-1">{s.sub}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="guests" className="w-full">
                  <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 flex-wrap h-auto gap-1 rounded-2xl">
                    {[
                      { val: 'guests', label: 'Guests', icon: <Users className="w-3.5 h-3.5" /> },
                      { val: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-3.5 h-3.5" /> },
                      { val: 'wishes', label: 'Wishes', icon: <Heart className="w-3.5 h-3.5" /> },
                      { val: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
                      { val: 'budget', label: 'Budget', icon: <Wallet className="w-3.5 h-3.5" /> },
                      { val: 'vendors', label: 'Vendors', icon: <Store className="w-3.5 h-3.5" /> },
                      { val: 'ai', label: 'AI Tools', icon: <Sparkles className="w-3.5 h-3.5" /> },
                    ].map(t => (
                      <TabsTrigger key={t.val} value={t.val} className="data-[state=active]:bg-primary data-[state=active]:text-black rounded-xl text-xs flex items-center gap-1.5 px-3">
                        {t.icon}{t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* Guest List */}
                  <TabsContent value="guests" className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <h3 className="text-xl font-bold">Guest List</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/10 rounded-full" onClick={exportCSV}>
                          <Download className="w-4 h-4 mr-1.5" />Export CSV
                        </Button>
                        <Button className="bg-primary text-black font-bold rounded-full" size="sm" asChild>
                          <Link href={`/checkin/${selectedInv.id}`}>Check-in Dashboard</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10 bg-white/3">
                            <TableHead className="text-white/40 text-xs">Name</TableHead>
                            <TableHead className="text-white/40 text-xs">Attending</TableHead>
                            <TableHead className="text-white/40 text-xs">Heads</TableHead>
                            <TableHead className="text-white/40 text-xs">Meal</TableHead>
                            <TableHead className="text-white/40 text-xs">Status</TableHead>
                            <TableHead />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {guests.map(g => (
                            <TableRow key={g.id} className="border-white/5 hover:bg-white/5 transition-colors">
                              <TableCell className="font-medium text-white">
                                <div>{g.name}<div className="text-[10px] text-white/30">{g.phone || g.email}</div></div>
                              </TableCell>
                              <TableCell><span className={g.attending ? 'text-green-400' : 'text-red-400'}>{g.attending ? '✓ Yes' : '✗ No'}</span></TableCell>
                              <TableCell className="text-white/60">{g.guest_count || 1}</TableCell>
                              <TableCell className="text-white/50 text-xs">{g.meal_preference || '—'}</TableCell>
                              <TableCell>{g.checked_in ? <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1 w-fit"><Check className="w-3 h-3" />In</span> : <span className="text-xs text-white/30">Pending</span>}</TableCell>
                              <TableCell><Button variant="ghost" size="icon" className="h-7 w-7 text-white/20 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button></TableCell>
                            </TableRow>
                          ))}
                          {guests.length === 0 && (
                            <TableRow><TableCell colSpan={6} className="text-center py-12 text-white/30 italic">No RSVPs received yet.</TableCell></TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* WhatsApp */}
                  <TabsContent value="whatsapp" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-white/5 border-white/10 rounded-2xl">
                        <CardHeader><CardTitle className="text-base">Send Invitation</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <Input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Guest Name" className="bg-white/10 border-white/10 focus:border-primary" />
                          <Input value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="WhatsApp Number (10 digits)" className="bg-white/10 border-white/10 focus:border-primary" />
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full font-bold" onClick={() => { if (!guestName || !guestPhone) return; window.open(getWhatsAppLink(guestName, guestPhone), '_blank'); setGuestName(''); setGuestPhone(''); }}>
                            <MessageCircle className="w-4 h-4 mr-2" />Send on WhatsApp
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/5 border-white/10 rounded-2xl">
                        <CardHeader><CardTitle className="text-base">Bulk Generator</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <textarea value={bulkList} onChange={e => setBulkList(e.target.value)} placeholder="John, 9876543210&#10;Jane, 9988776655&#10;One pair per line" className="w-full h-32 bg-white/10 border border-white/10 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:border-primary" />
                        </CardContent>
                      </Card>
                    </div>
                    {bulkList && (
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader><CardTitle className="text-base">Generated Links</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          {bulkList.split('\n').filter(l => l.includes(',')).map((line, i) => {
                            const [name, phone] = line.split(',').map(s => s.trim());
                            if (!name || !phone) return null;
                            const key = `bulk-${i}`;
                            return (
                              <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <div><p className="font-semibold text-sm">{name}</p><p className="text-xs text-white/30">{phone}</p></div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="text-primary h-8" onClick={() => copyLink(name, phone, key)}>
                                    {copiedLinks[key] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-green-400 h-8" onClick={() => window.open(getWhatsAppLink(name, phone), '_blank')}>
                                    <MessageCircle className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Wishes */}
                  <TabsContent value="wishes">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishes.map(w => (
                        <Card key={w.id} className="bg-white/5 border-white/10 hover:border-white/15 transition-all rounded-2xl">
                          <CardContent className="pt-5">
                            <Heart className="w-4 h-4 text-red-400 mb-3" />
                            <p className="text-white/80 italic text-sm leading-relaxed mb-4">"{w.message}"</p>
                            <div className="border-t border-white/10 pt-3">
                              <p className="font-bold text-primary text-sm">{w.guest_name}</p>
                              {w.relation && <p className="text-xs text-white/30">{w.relation}</p>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {wishes.length === 0 && <div className="col-span-full py-16 text-center text-white/30 italic">No wishes yet.</div>}
                    </div>
                  </TabsContent>

                  {/* Analytics */}
                  <TabsContent value="analytics">
                    <AnalyticsTab guests={guests} wishes={wishes} invitation={selectedInv} />
                  </TabsContent>

                  {/* Budget */}
                  <TabsContent value="budget">
                    <BudgetTracker invId={selectedInv.id} />
                  </TabsContent>

                  {/* Vendors */}
                  <TabsContent value="vendors">
                    <VendorDirectory invId={selectedInv.id} />
                  </TabsContent>

                  {/* AI Tools */}
                  <TabsContent value="ai">
                    <AIToolsTab invitation={selectedInv} />
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <LayoutDashboard className="w-10 h-10 text-white/20" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2">Welcome to Your Dashboard</h2>
                <p className="text-white/40 max-w-md mb-8">Create your first invitation to start managing guests, tracking your budget, and coordinating vendors.</p>
                <Button className="bg-primary text-black font-bold rounded-full px-8" onClick={() => setLocation('/create')}>
                  <Plus className="w-4 h-4 mr-2" />Create Your First Invitation
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
