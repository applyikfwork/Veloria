import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, Share2, MessageCircle, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function MemoryBookPage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<any>(null);
  const [wishes, setWishes] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: invData, error: invError } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (invError) throw invError;
        setInvitation(invData);

        const { data: wishesData } = await supabase
          .from('wishes')
          .select('*')
          .eq('invitation_id', invData.id)
          .order('created_at', { ascending: false });
        
        setWishes(wishesData || []);

        const { data: guestsData } = await supabase
          .from('guests')
          .select('*')
          .eq('invitation_id', invData.id);
        
        setGuests(guestsData || []);
      } catch (err) {
        console.error('Error fetching memory book data:', err);
        toast({
          title: "Error",
          description: "Could not load memory book.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchData();
  }, [slug, toast]);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = document.getElementById('memory-book-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#000000',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invitation.bride_name}_${invitation.groom_name}_MemoryBook.pdf`);
      
      toast({
        title: "Success",
        description: "Memory book downloaded as PDF",
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied",
      description: "Memory book link copied to clipboard.",
    });
  };

  const shareWhatsApp = () => {
    const text = `Take a look at ${invitation.bride_name} & ${invitation.groom_name}'s Memory Book! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Invitation not found
      </div>
    );
  }

  const confirmedGuests = guests.filter(g => g.attending).length;
  const totalGuests = guests.reduce((acc, g) => acc + (g.guest_count || 1), 0);
  const attendingCount = guests.filter(g => g.attending).reduce((acc, g) => acc + (g.guest_count || 1), 0);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-serif">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent mb-4"
          >
            {invitation.bride_name} & {invitation.groom_name}'s Memory Book
          </motion.h1>
          <p className="text-white/60 italic text-lg">A collection of love, blessings, and memories</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 no-print">
          <Button 
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="bg-primary hover:bg-primary/80 text-black font-bold px-6"
            data-testid="button-download-pdf"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Download PDF
          </Button>
          <Button 
            onClick={shareWhatsApp}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            data-testid="button-share-whatsapp"
          >
            <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
            Share on WhatsApp
          </Button>
          <Button 
            onClick={copyLink}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            data-testid="button-copy-link"
          >
            {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
            Copy Link
          </Button>
        </div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-center">
            <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">Total RSVP's</h3>
            <p className="text-3xl font-bold text-primary">{guests.length}</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-center">
            <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">Confirmed Guests</h3>
            <p className="text-3xl font-bold text-primary">{attendingCount}</p>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 text-center">
            <h3 className="text-white/60 text-sm uppercase tracking-wider mb-2">Wishes Received</h3>
            <p className="text-3xl font-bold text-primary">{wishes.length}</p>
          </Card>
        </motion.div>

        {/* Memory Book Content (for PDF capture) */}
        <div id="memory-book-content" className="space-y-12 pb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Love & Blessings</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishes.map((wish, index) => (
                <motion.div
                  key={wish.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      <span className="text-xs text-white/40">{new Date(wish.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-white/90 italic mb-4 flex-grow">"{wish.message}"</p>
                    <div className="border-t border-white/10 pt-4">
                      <p className="font-bold text-primary">{wish.guest_name}</p>
                      {wish.relation && <p className="text-xs text-white/50">{wish.relation}</p>}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {wishes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-white/40 italic">No wishes yet. Be the first to leave a blessing!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
