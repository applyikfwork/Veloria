import { motion } from "framer-motion";
import { CheckCircle2, Users, Calendar, MessageSquare, QrCode, Smartphone, Gift, Video, ExternalLink, ShoppingBag } from "lucide-react";
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
  giftRegistry?: any;
  onGiftRegistryChange?: (val: any) => void;
  liveStream?: any;
  onLiveStreamChange?: (val: any) => void;
}

const FOOD_PREFERENCES = [
  { id: "veg", label: "Veg" },
  { id: "non-veg", label: "Non-Veg" },
  { id: "jain", label: "Jain" },
  { id: "vegan", label: "Vegan" },
];

const STREAM_PLATFORMS = [
  { id: "youtube", label: "YouTube Live" },
  { id: "zoom", label: "Zoom" },
  { id: "meet", label: "Google Meet" },
  { id: "other", label: "Other" },
];

export default function RSVPStep({
  data,
  onChange,
  onNext,
  onBack,
  giftRegistry = { enabled: false, amazon: "", flipkart: "", custom: "", customLabel: "" },
  onGiftRegistryChange,
  liveStream = { enabled: false, url: "", platform: "youtube" },
  onLiveStreamChange,
}: RSVPStepProps) {
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
          Customize how your guests respond and enhance their experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left column: RSVP settings */}
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

        {/* Right column: preview */}
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
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-serif text-white">Mobile View Preview</h3>
            </div>
            <div className="aspect-[9/16] max-w-[180px] mx-auto bg-black/80 rounded-[2rem] border-[4px] border-white/10 p-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-1 bg-white/10 rounded-full mb-6" />
              <h4 className="text-white font-serif text-sm mb-2">Will you join us?</h4>
              <div className="w-full h-8 bg-primary rounded-lg mb-2" />
              <div className="w-full h-8 bg-white/10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Gift Registry Section */}
      {onGiftRegistryChange && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-white">Digital Gift Registry</h3>
                <p className="text-xs text-white/40">Let guests see your wishlist</p>
              </div>
            </div>
            <Switch
              checked={giftRegistry.enabled}
              onCheckedChange={(val) => onGiftRegistryChange({ ...giftRegistry, enabled: val })}
              data-testid="toggle-gift-registry"
            />
          </div>

          {giftRegistry.enabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="px-6 pb-6 pt-4 space-y-4 border-t border-white/5"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-orange-400" />
                    Amazon Wishlist URL
                  </Label>
                  <Input
                    value={giftRegistry.amazon}
                    onChange={(e) => onGiftRegistryChange({ ...giftRegistry, amazon: e.target.value })}
                    placeholder="https://amazon.in/wishlist/..."
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70 flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-yellow-400" />
                    Flipkart Wishlist URL
                  </Label>
                  <Input
                    value={giftRegistry.flipkart}
                    onChange={(e) => onGiftRegistryChange({ ...giftRegistry, flipkart: e.target.value })}
                    placeholder="https://flipkart.com/wishlist/..."
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Custom Link Label</Label>
                  <Input
                    value={giftRegistry.customLabel}
                    onChange={(e) => onGiftRegistryChange({ ...giftRegistry, customLabel: e.target.value })}
                    placeholder="e.g. Our Wedding Registry"
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/70">Custom Registry URL</Label>
                  <Input
                    value={giftRegistry.custom}
                    onChange={(e) => onGiftRegistryChange({ ...giftRegistry, custom: e.target.value })}
                    placeholder="https://..."
                    className="bg-white/5 border-white/10 focus:border-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-white/30 italic">Guests will see gift registry links on your invitation page.</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Live Stream Section */}
      {onLiveStreamChange && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/10 rounded-3xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Video className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-white">Live Ceremony Stream</h3>
                <p className="text-xs text-white/40">For guests who can't attend in person</p>
              </div>
            </div>
            <Switch
              checked={liveStream.enabled}
              onCheckedChange={(val) => onLiveStreamChange({ ...liveStream, enabled: val })}
              data-testid="toggle-live-stream"
            />
          </div>

          {liveStream.enabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="px-6 pb-6 pt-4 space-y-4 border-t border-white/5"
            >
              <div className="space-y-2">
                <Label className="text-white/70">Platform</Label>
                <div className="flex flex-wrap gap-2">
                  {STREAM_PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onLiveStreamChange({ ...liveStream, platform: p.id })}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm border transition-all",
                        liveStream.platform === p.id
                          ? "bg-blue-500/20 border-blue-500 text-blue-300"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-400" />
                  Stream / Meeting Link
                </Label>
                <Input
                  value={liveStream.url}
                  onChange={(e) => onLiveStreamChange({ ...liveStream, url: e.target.value })}
                  placeholder="https://youtube.com/live/... or zoom.us/j/..."
                  className="bg-white/5 border-white/10 focus:border-blue-500/50"
                />
              </div>
              <p className="text-xs text-white/30 italic">A "Join Live Stream" button will appear on your invitation for remote guests.</p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
