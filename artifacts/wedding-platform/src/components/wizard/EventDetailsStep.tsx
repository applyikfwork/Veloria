import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, Clock, MapPin, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EventDetailsStepProps {
  data: any[];
  onChange: (val: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const PRESET_EVENTS = ["Haldi", "Mehndi", "Sangeet", "Wedding Ceremony", "Reception"];

export default function EventDetailsStep({ data, onChange, onNext, onBack }: EventDetailsStepProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const addEvent = (name: string) => {
    const newEvent = {
      id: Date.now().toString(),
      name,
      date: "",
      time: "",
      venue: "",
      address: "",
      dressCode: ""
    };
    onChange([...data, newEvent]);
    setExpandedIndex(data.length);
  };

  const updateEvent = (index: number, field: string, value: string) => {
    const newList = [...data];
    newList[index] = { ...newList[index], [field]: value };
    onChange(newList);
  };

  const removeEvent = (index: number) => {
    const newList = data.filter((_, i) => i !== index);
    onChange(newList);
    if (expandedIndex === index) setExpandedIndex(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-10 text-white">Event Schedule</h2>
      
      {/* Event Selection Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {PRESET_EVENTS.map((event) => (
          <Button
            key={event}
            variant="outline"
            onClick={() => addEvent(event)}
            className="rounded-full border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
            data-testid={`button-add-event-${event}`}
          >
            <Plus className="mr-2 h-4 w-4" />
            {event}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => addEvent("Custom Event")}
          className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent"
          data-testid="button-add-custom-event"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Custom
        </Button>
      </div>

      {/* Active Events List */}
      <div className="space-y-4 mb-16">
        {data.map((event, index) => (
          <div 
            key={event.id}
            className={cn(
              "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all",
              expandedIndex === index && "border-primary/40 ring-1 ring-primary/20"
            )}
          >
            <div 
              className="px-6 py-4 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-white font-medium">{event.name}</h4>
                  <p className="text-xs text-white/50">{event.date || "Set date"} • {event.venue || "Set venue"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white/30 hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => { e.stopPropagation(); removeEvent(index); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {expandedIndex === index ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 border-t border-white/5 pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-primary/70 mb-2 block">Event Name</Label>
                        <Input 
                          value={event.name} 
                          onChange={(e) => updateEvent(index, 'name', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus:border-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs uppercase tracking-widest text-primary/70 mb-2 block">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input 
                              type="date"
                              value={event.date} 
                              onChange={(e) => updateEvent(index, 'date', e.target.value)}
                              className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary appearance-none"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs uppercase tracking-widest text-primary/70 mb-2 block">Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input 
                              type="time"
                              value={event.time} 
                              onChange={(e) => updateEvent(index, 'time', e.target.value)}
                              className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-primary/70 mb-2 block">Venue Name</Label>
                        <Input 
                          value={event.venue} 
                          onChange={(e) => updateEvent(index, 'venue', e.target.value)}
                          className="bg-white/5 border-white/10 text-white focus:border-primary"
                          placeholder="e.g. Taj Palace"
                        />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-primary/70 mb-2 block">Address / Maps Link</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                          <Input 
                            value={event.address} 
                            onChange={(e) => updateEvent(index, 'address', e.target.value)}
                            className="bg-white/5 border-white/10 text-white pl-10 focus:border-primary"
                            placeholder="Street address or Google Maps URL"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs uppercase tracking-widest text-primary/70 mb-2 block">Dress Code</Label>
                      <Input 
                        value={event.dressCode} 
                        onChange={(e) => updateEvent(index, 'dressCode', e.target.value)}
                        className="bg-white/5 border-white/10 text-white focus:border-primary"
                        placeholder="e.g. Traditional Indian / Black Tie"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Mini Timeline Preview */}
      {data.length > 0 && (
        <div className="mt-12 bg-black/40 rounded-3xl p-8 border border-white/5">
          <h3 className="text-xl font-serif text-white mb-8 text-center">Your Wedding Timeline</h3>
          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-primary/20" />
            <div className="space-y-8 relative">
              {data.sort((a,b) => (a.date > b.date ? 1 : -1)).map((event, i) => (
                <div key={event.id} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary border-4 border-[#0B0B0F] z-10 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{event.date || "Date not set"} • {event.time || "Time not set"}</p>
                    <h4 className="text-lg text-white font-serif">{event.name}</h4>
                    <p className="text-sm text-white/60">{event.venue || "Venue not set"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
