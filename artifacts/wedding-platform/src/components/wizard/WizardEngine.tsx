import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Plus, Trash2, Calendar, Clock, MapPin, ChevronDown, ChevronUp, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { WizardStepConfig, WizardField } from "@/templates/types";

function getByPath(obj: any, path: string): any {
  return path.split('.').reduce((curr: any, key: string) => {
    if (curr === undefined || curr === null) return '';
    return curr[key];
  }, obj);
}

function setByPath(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const result = deepClone(obj);
  let curr = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (curr[key] === null || curr[key] === undefined || typeof curr[key] !== 'object') {
      curr[key] = {};
    } else {
      curr[key] = Array.isArray(curr[key]) ? [...curr[key]] : { ...curr[key] };
    }
    curr = curr[key];
  }
  curr[keys[keys.length - 1]] = value;
  return result;
}

function deepClone(obj: any): any {
  if (Array.isArray(obj)) return obj.map(deepClone);
  if (obj !== null && typeof obj === 'object') {
    const r: any = {};
    for (const k of Object.keys(obj)) r[k] = deepClone(obj[k]);
    return r;
  }
  return obj;
}

interface FieldProps {
  field: WizardField;
  formData: Record<string, any>;
  onFieldChange: (path: string, value: any) => void;
  accentColor: string;
}

function FieldText({ field, formData, onFieldChange, accentColor }: FieldProps) {
  const value = getByPath(formData, field.key) || '';
  return (
    <div className="space-y-2">
      <Label className="text-white/70 text-xs uppercase tracking-widest">
        {field.label}{field.required && <span style={{ color: accentColor }}> *</span>}
      </Label>
      <Input
        value={value}
        onChange={e => onFieldChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className="bg-white/5 border-white/10 text-white focus:border-primary focus:ring-primary/20 h-12"
      />
    </div>
  );
}

function FieldTextarea({ field, formData, onFieldChange }: FieldProps) {
  const value = getByPath(formData, field.key) || '';
  return (
    <div className="space-y-2">
      {field.label && (
        <Label className="text-white/70 text-xs uppercase tracking-widest">{field.label}</Label>
      )}
      <Textarea
        value={value}
        onChange={e => onFieldChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className="bg-white/5 border-white/10 text-white focus:border-primary focus:ring-primary/20 resize-none"
      />
      {field.hint && <p className="text-xs text-white/30 italic">{field.hint}</p>}
    </div>
  );
}

function FieldPhoto({ field, formData, onFieldChange, accentColor }: FieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const value = getByPath(formData, field.key);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onFieldChange(field.key, reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3 flex flex-col items-center">
      {field.label && (
        <Label className="text-white/70 text-xs uppercase tracking-widest self-start">{field.label}</Label>
      )}
      <label className="w-36 h-36 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/10 transition-all group overflow-hidden relative">
        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFile} />
        {loading ? (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        ) : value ? (
          <>
            <img src={value} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </>
        ) : (
          <>
            <Camera className="h-7 w-7 text-white/30 group-hover:text-primary transition-colors mb-1" />
            <span className="text-[10px] text-white/30">Upload</span>
          </>
        )}
      </label>
      {value && (
        <button
          onClick={() => onFieldChange(field.key, null)}
          className="text-[10px] text-white/30 hover:text-red-400 transition-colors"
        >
          Remove photo
        </button>
      )}
    </div>
  );
}

function FieldPhotoArray({ field, formData, onFieldChange }: FieldProps) {
  const arr: (string | null)[] = getByPath(formData, field.key) || Array(field.maxItems || 4).fill(null);
  const [loading, setLoading] = useState<number | null>(null);

  const handleFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(index);
    const reader = new FileReader();
    reader.onloadend = () => {
      const newArr = [...arr];
      newArr[index] = reader.result as string;
      onFieldChange(field.key, newArr);
      setLoading(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const remove = (index: number) => {
    const newArr = [...arr];
    newArr[index] = null;
    onFieldChange(field.key, newArr);
  };

  return (
    <div className="space-y-3">
      {field.label && (
        <div className="flex items-center gap-2">
          <Label className="text-white/70 text-xs uppercase tracking-widest">{field.label}</Label>
          <span className="text-[10px] text-white/30">{arr.filter(Boolean).length}/{field.maxItems || 4} uploaded</span>
        </div>
      )}
      {field.hint && <p className="text-xs text-white/30 italic mb-2">{field.hint}</p>}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: field.maxItems || 4 }).map((_, i) => {
          const photo = arr[i] || null;
          return (
            <label
              key={i}
              className="aspect-square rounded-xl border-2 border-dashed border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
            >
              <input type="file" className="hidden" accept="image/*" onChange={e => handleFile(i, e)} />
              {loading === i ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              ) : photo ? (
                <>
                  <img src={photo} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                    <button
                      className="h-7 w-7 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-red-400"
                      onClick={e => { e.preventDefault(); remove(i); }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Plus className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
                  <span className="text-[9px] text-white/20 mt-1">{i + 1}</span>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

const EVENT_PRESETS = ['Haldi', 'Mehndi', 'Sangeet', 'Wedding Ceremony', 'Reception'];

function FieldEventList({ field, formData, onFieldChange }: FieldProps) {
  const events: any[] = getByPath(formData, field.key) || [];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(events.length > 0 ? 0 : null);

  const addEvent = (name: string) => {
    const next = [
      ...events,
      { id: Date.now().toString(), name, date: '', time: '', venue: '', address: '', type: name.toLowerCase().replace(' ', '') },
    ];
    onFieldChange(field.key, next);
    setExpandedIdx(next.length - 1);
  };

  const update = (idx: number, key: string, val: string) => {
    const next = events.map((e, i) => i === idx ? { ...e, [key]: val } : e);
    onFieldChange(field.key, next);
  };

  const remove = (idx: number) => {
    const next = events.filter((_, i) => i !== idx);
    onFieldChange(field.key, next);
    if (expandedIdx === idx) setExpandedIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {EVENT_PRESETS.map(name => (
          <Button
            key={name}
            variant="outline"
            size="sm"
            onClick={() => addEvent(name)}
            className="rounded-full border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
            disabled={(field.maxItems || 6) <= events.length}
          >
            <Plus className="h-3 w-3 mr-1" /> {name}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addEvent('Custom Event')}
          className="rounded-full border-white/20 text-white/60 hover:bg-white/10 bg-transparent"
          disabled={(field.maxItems || 6) <= events.length}
        >
          <Plus className="h-3 w-3 mr-1" /> Custom
        </Button>
      </div>

      <div className="space-y-3">
        {events.map((event, idx) => (
          <div key={event.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div
              className="px-5 py-4 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{event.name}</p>
                  <p className="text-xs text-white/40">{event.date || 'Date not set'} · {event.venue || 'Venue not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={e => { e.stopPropagation(); remove(idx); }}
                  className="h-7 w-7 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {expandedIdx === idx ? <ChevronUp className="h-4 w-4 text-white/30" /> : <ChevronDown className="h-4 w-4 text-white/30" />}
              </div>
            </div>

            <AnimatePresence>
              {expandedIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 border-t border-white/5 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-primary/70 mb-1.5 block">Event Name</Label>
                        <Input value={event.name} onChange={e => update(idx, 'name', e.target.value)} className="bg-white/5 border-white/10 text-white focus:border-primary h-10" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs uppercase tracking-widest text-primary/70 mb-1.5 block">Date</Label>
                          <div className="relative">
                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                            <Input type="date" value={event.date} onChange={e => update(idx, 'date', e.target.value)} className="bg-white/5 border-white/10 text-white pl-8 focus:border-primary h-10 text-sm" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs uppercase tracking-widest text-primary/70 mb-1.5 block">Time</Label>
                          <div className="relative">
                            <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                            <Input type="time" value={event.time} onChange={e => update(idx, 'time', e.target.value)} className="bg-white/5 border-white/10 text-white pl-8 focus:border-primary h-10 text-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-primary/70 mb-1.5 block">Venue Name</Label>
                        <Input value={event.venue} onChange={e => update(idx, 'venue', e.target.value)} placeholder="e.g. Taj Palace" className="bg-white/5 border-white/10 text-white focus:border-primary h-10" />
                      </div>
                      <div>
                        <Label className="text-xs uppercase tracking-widest text-primary/70 mb-1.5 block">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                          <Input value={event.address} onChange={e => update(idx, 'address', e.target.value)} placeholder="Street, City" className="bg-white/5 border-white/10 text-white pl-8 focus:border-primary h-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-10 text-white/20">
            <p className="text-sm">Add your first event using the buttons above</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FieldToggle({ field, formData, onFieldChange, accentColor }: FieldProps) {
  const value = getByPath(formData, field.key);
  const isOn = value === true || value === undefined;
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div className="space-y-1">
        {field.label && <p className="text-white font-medium">{field.label}</p>}
        {field.hint && <p className="text-xs text-white/40 max-w-sm">{field.hint}</p>}
      </div>
      <Switch
        checked={isOn}
        onCheckedChange={val => onFieldChange(field.key, val)}
      />
    </div>
  );
}

function FieldTextPair({ field, formData, onFieldChange }: FieldProps) {
  const arr: string[] = getByPath(formData, field.key) || ['', ''];
  const labels = field.labels || ['First', 'Second'];
  const placeholders = field.placeholders || ['', ''];

  const update = (idx: number, val: string) => {
    const next = [...arr];
    next[idx] = val;
    onFieldChange(field.key, next);
  };

  return (
    <div className="space-y-3">
      {labels.map((label, i) => (
        <div key={i} className="space-y-1.5">
          <Label className="text-white/70 text-xs uppercase tracking-widest">{label}</Label>
          <Input
            value={arr[i] || ''}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholders[i]}
            className="bg-white/5 border-white/10 text-white focus:border-primary h-11"
          />
        </div>
      ))}
    </div>
  );
}

function renderField(field: WizardField, formData: Record<string, any>, onFieldChange: (path: string, value: any) => void, accentColor: string) {
  const props: FieldProps = { field, formData, onFieldChange, accentColor };
  switch (field.type) {
    case 'text': return <FieldText {...props} />;
    case 'textarea': return <FieldTextarea {...props} />;
    case 'photo': return <FieldPhoto {...props} />;
    case 'photo-array': return <FieldPhotoArray {...props} />;
    case 'event-list': return <FieldEventList {...props} />;
    case 'toggle': return <FieldToggle {...props} />;
    case 'text-pair': return <FieldTextPair {...props} />;
    default: return null;
  }
}

interface WizardEngineProps {
  step: WizardStepConfig;
  formData: Record<string, any>;
  onFieldChange: (path: string, value: any) => void;
  accentColor?: string;
}

export default function WizardEngine({ step, formData, onFieldChange, accentColor = '#D4AF37' }: WizardEngineProps) {
  const isTwoCol = step.layout === 'two-column';

  const leftFields = isTwoCol ? step.fields.filter(f => f.column === 'left') : [];
  const rightFields = isTwoCol ? step.fields.filter(f => f.column === 'right') : [];
  const fullFields = isTwoCol ? step.fields.filter(f => f.column === 'full' || !f.column) : step.fields;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">{step.title}</h2>
        {step.subtitle && <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">{step.subtitle}</p>}
      </div>

      {isTwoCol ? (
        <>
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              {leftFields.map(f => (
                <div key={f.key}>
                  {renderField(f, formData, onFieldChange, accentColor)}
                </div>
              ))}
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="space-y-6"
            >
              {rightFields.map(f => (
                <div key={f.key}>
                  {renderField(f, formData, onFieldChange, accentColor)}
                </div>
              ))}
            </motion.div>
          </div>
          {fullFields.length > 0 && (
            <div className="space-y-6">
              {fullFields.map(f => (
                <div key={f.key}>
                  {renderField(f, formData, onFieldChange, accentColor)}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-8">
          {fullFields.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.06 }}
            >
              {renderField(f, formData, onFieldChange, accentColor)}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export { setByPath };
