import { motion } from "framer-motion";
import { CheckCircle2, Users, Calendar, MessageSquare, QrCode, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface RSVPStepProps {
  data: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const FOOD_PREFERENCES = [
  { id: "veg", label: "Veg" },
  { id: "non-veg", label: "Non-Veg" },
  { id: "jain", label: "Jain" },
  { id: "vegan", label: "Vegan" },
];

export default function RSVPStep({ data, onChange, onNext, onBack }: RSVPStepProps) {
  const toggleFoodPref = (id: string) => {
    const prefs = data.foodPreferences || [];
    if (prefs.includes(id)) {
      onChange({ ...data, foodPreferences: prefs.filter((p: string) => p !== id) });
    } else {
      onChange({ ...data, foodPreferences: [...prefs, id] });
    }
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">RSVP Experience</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Customize how your guests respond to your invitation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <div>
                <Label className="text-white text-base">Enable RSVP</Label>
                <p className="text-xs text-muted-foreground">Allow guests to confirm attendance</p>
              </div>
            </div>
            <Switch 
              checked={data.enabled} 
              onCheckedChange={(val) => onChange({ ...data, enabled: val })}
              data-testid="toggle-rsvp-enable"
            />
          </div>

          <div className={cn("space-y-6 transition-opacity duration-300", !data.enabled && "opacity-40 pointer-events-none")}>
            <div className="space-y-3">
              <Label className="text-white">Custom RSVP Message</Label>
              <Textarea
                placeholder="We can't wait to celebrate with you!"
                value={data.message}
                onChange={(e) => onChange({ ...data, message: e.target.value })}
                className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30 min-h-[100px]"
                data-testid="input-rsvp-message"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-white">RSVP Deadline</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <Input
                    type="date"
                    value={data.deadline}
                    onChange={(e) => onChange({ ...data, deadline: e.target.value })}
                    className="bg-white/5 border-white/10 focus:border-primary focus:ring-primary/30 pl-10"
                    data-testid="input-rsvp-deadline"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white">Food Preferences (Options for Guests)</Label>
              <div className="flex flex-wrap gap-2">
                {FOOD_PREFERENCES.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => toggleFoodPref(pref.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                      data.foodPreferences?.includes(pref.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-white/5 text-white border-white/10 hover:border-white/20"
                    )}
                    data-testid={`chip-food-${pref.id}`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-xs text-white">WhatsApp Confirmation</span>
                </div>
                <Switch 
                  checked={data.whatsappEnabled} 
                  onCheckedChange={(val) => onChange({ ...data, whatsappEnabled: val })}
                  data-testid="toggle-whatsapp"
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-primary" />
                  <span className="text-xs text-white">QR Code Entry</span>
                </div>
                <Switch 
                  checked={data.qrEnabled} 
                  onCheckedChange={(val) => onChange({ ...data, qrEnabled: val })}
                  data-testid="toggle-qr"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             </div>
             <h3 className="text-lg font-serif text-white mb-6">Guest Tracking Preview</h3>
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                 <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Confirmed</p>
                 <p className="text-2xl font-bold text-primary">45</p>
               </div>
               <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                 <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">Pending</p>
                 <p className="text-2xl font-bold text-white">12</p>
               </div>
             </div>
             <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded-lg">
                  <span className="text-white/70">Priya & Family</span>
                  <span className="text-primary font-medium">Attending (4)</span>
                </div>
                <div className="flex items-center justify-between text-xs p-2 bg-white/5 rounded-lg">
                  <span className="text-white/70">Rahul Sharma</span>
                  <span className="text-primary font-medium">Attending (1)</span>
                </div>
             </div>
           </div>

           <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 backdrop-blur-xl">
             <div className="flex items-center gap-3 mb-4">
               <Smartphone className="h-5 w-5 text-primary" />
               <h3 className="text-lg font-serif text-white">Mobile View Preview</h3>
             </div>
             <div className="aspect-[9/16] max-w-[200px] mx-auto bg-black/80 rounded-[2rem] border-[4px] border-white/10 p-4 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-1 bg-white/10 rounded-full mb-6" />
                <h4 className="text-white font-serif text-sm mb-2">Will you join us?</h4>
                <div className="w-full h-8 bg-primary rounded-lg mb-2" />
                <div className="w-full h-8 bg-white/10 rounded-lg" />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
