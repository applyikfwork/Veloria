import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Calendar,
  Users,
  Utensils,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { useToast } from "@/hooks/use-toast";

export default function RSVPPage() {
  const [, params] = useRoute("/i/:slug/rsvp");
  const slug = params?.slug;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    relation: "",
    attending: true,
    guest_count: 1,
    plus_one: false,
    plus_one_name: "",
    events_attending: [] as string[],
    meal_preference: "Veg",
    dietary_notes: "",
    message: ""
  });

  useEffect(() => {
    async function fetchInvitation() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setInvitation(data);
        // Initialize events attending
        if (data.events) {
          setFormData(prev => ({
            ...prev,
            events_attending: data.events.map((e: any) => e.name)
          }));
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Could not load invitation details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchInvitation();
  }, [slug]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const qrString = `GUEST-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('guests')
        .insert([{
          invitation_id: invitation.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          attending: formData.attending,
          guest_count: formData.guest_count,
          plus_one: formData.plus_one,
          meal_preference: formData.meal_preference,
          dietary_notes: formData.dietary_notes,
          events_attending: formData.events_attending,
          qr_code: qrString,
          relation: formData.relation // Note: Make sure to add this to SQL if not present, but for now we follow session plan
        }])
        .select()
        .single();

      if (error) throw error;

      setGuestId(data.id);
      setQrCode(qrString);
      setSubmitted(true);
      toast({
        title: "RSVP Confirmed!",
        description: "We've received your response. See you there!",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Submission failed",
        description: "There was an error saving your RSVP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] p-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-serif text-white">RSVP Confirmed!</h1>
            <p className="text-muted-foreground">Thank you, {formData.name}. Your presence means the world to us.</p>
          </div>
          
          {qrCode && (
            <div className="mt-8">
              <QRCodeDisplay 
                value={qrCode} 
                coupleNames={`${invitation.bride_name} & ${invitation.groom_name}`}
                fileName={`${formData.name.replace(/\s+/g, '-')}-rsvp`}
              />
              <p className="mt-4 text-sm text-primary/60 italic">Please save this QR code for check-in at the venue.</p>
            </div>
          )}

          <Button 
            onClick={() => setLocation(`/i/${slug}`)}
            variant="outline"
            className="w-full border-white/10 text-white mt-8"
          >
            Back to Invitation
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-foreground font-sans">
      {/* Header */}
      <div className="h-64 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent opacity-50" />
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 text-center space-y-4 px-6"
        >
          <Heart className="h-8 w-8 text-primary mx-auto fill-primary/20" />
          <h1 className="text-3xl md:text-5xl font-serif text-white">Your Presence is Requested</h1>
          <p className="text-primary/80 font-serif italic text-lg">
            For the wedding of {invitation.bride_name} & {invitation.groom_name}
          </p>
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-12 pb-24 relative z-20">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardContent className="p-8">
            {/* Progress Indicator */}
            <div className="flex justify-between mb-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
              {[1, 2, 3].map((s) => (
                <div 
                  key={s}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                    step >= s ? "bg-primary border-primary text-primary-foreground" : "bg-[#1A1A1F] border-white/10 text-white/40"
                  }`}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      About You
                    </h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                          placeholder="Enter your full name"
                          className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30"
                          data-testid="input-name"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                            placeholder="your@email.com"
                            className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30"
                            data-testid="input-email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                            placeholder="+91 00000 00000"
                            className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30"
                            data-testid="input-phone"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relation">Relation to the Couple</Label>
                        <Input 
                          id="relation"
                          value={formData.relation}
                          onChange={(e) => setFormData(f => ({ ...f, relation: e.target.value }))}
                          placeholder="e.g. Friend, Cousin, Colleague"
                          className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30"
                          data-testid="input-relation"
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={nextStep} 
                    disabled={!formData.name}
                    className="w-full bg-primary text-primary-foreground h-12 text-lg"
                    data-testid="button-next-1"
                  >
                    Next Step <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Your Attendance
                    </h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFormData(f => ({ ...f, attending: true }))}
                        className={`p-6 rounded-2xl border-2 transition-all text-center space-y-2 ${
                          formData.attending 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-white/5 border-white/10 text-white/60"
                        }`}
                        data-testid="button-attending-yes"
                      >
                        <Check className={`h-8 w-8 mx-auto ${formData.attending ? "opacity-100" : "opacity-0"}`} />
                        <span className="block font-medium">Yes, I'll be there</span>
                      </button>
                      <button
                        onClick={() => setFormData(f => ({ ...f, attending: false }))}
                        className={`p-6 rounded-2xl border-2 transition-all text-center space-y-2 ${
                          !formData.attending 
                          ? "bg-destructive/10 border-destructive text-destructive" 
                          : "bg-white/5 border-white/10 text-white/60"
                        }`}
                        data-testid="button-attending-no"
                      >
                        <span className="block font-medium">Regretfully, No</span>
                      </button>
                    </div>

                    {formData.attending && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <Label>Events You're Attending</Label>
                          <div className="grid gap-3">
                            {invitation.events?.map((event: any, idx: number) => (
                              <div key={idx} className="flex items-center space-x-3 bg-white/5 p-3 rounded-lg border border-white/10">
                                <Checkbox 
                                  id={`event-${idx}`}
                                  checked={formData.events_attending.includes(event.name)}
                                  onCheckedChange={(checked) => {
                                    setFormData(f => ({
                                      ...f,
                                      events_attending: checked 
                                        ? [...f.events_attending, event.name]
                                        : f.events_attending.filter(e => e !== event.name)
                                    }));
                                  }}
                                  data-testid={`checkbox-event-${idx}`}
                                />
                                <label htmlFor={`event-${idx}`} className="text-sm font-medium text-white/80 cursor-pointer flex-1">
                                  {event.name} - <span className="text-xs text-muted-foreground">{event.date}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="guest_count">Total Guests (including yourself)</Label>
                          <Input 
                            id="guest_count"
                            type="number"
                            min="1"
                            max="10"
                            value={formData.guest_count}
                            onChange={(e) => setFormData(f => ({ ...f, guest_count: parseInt(e.target.value) }))}
                            className="bg-white/5 border-white/10"
                            data-testid="input-guest-count"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 border-white/10">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button onClick={nextStep} className="flex-1 bg-primary text-primary-foreground">
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif text-white flex items-center gap-2">
                      <Utensils className="h-5 w-5 text-primary" />
                      Preferences
                    </h2>

                    <div className="space-y-4">
                      <Label>Meal Preference</Label>
                      <RadioGroup 
                        value={formData.meal_preference}
                        onValueChange={(val) => setFormData(f => ({ ...f, meal_preference: val }))}
                        className="grid grid-cols-2 gap-4"
                      >
                        {["Veg", "Non-Veg", "Jain", "Vegan"].map((pref) => (
                          <div key={pref}>
                            <RadioGroupItem value={pref} id={`pref-${pref}`} className="peer sr-only" />
                            <Label
                              htmlFor={`pref-${pref}`}
                              className="flex items-center justify-center p-4 rounded-xl border-2 border-white/10 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all cursor-pointer hover:bg-white/5"
                            >
                              {pref}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dietary">Dietary Notes / Allergies</Label>
                      <Textarea 
                        id="dietary"
                        value={formData.dietary_notes}
                        onChange={(e) => setFormData(f => ({ ...f, dietary_notes: e.target.value }))}
                        placeholder="e.g. No nuts, gluten-free, etc."
                        className="bg-white/5 border-white/10 min-h-[80px]"
                        data-testid="textarea-dietary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message for the Couple</Label>
                      <Textarea 
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                        placeholder="Send your love..."
                        className="bg-white/5 border-white/10 min-h-[100px]"
                        data-testid="textarea-message"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={prevStep} className="flex-1 border-white/10">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={submitting}
                      className="flex-1 bg-primary text-primary-foreground group relative overflow-hidden"
                      data-testid="button-submit-rsvp"
                    >
                      {submitting ? (
                        <span className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Confirm RSVP <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
