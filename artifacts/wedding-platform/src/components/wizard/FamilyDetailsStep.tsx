import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Plus, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FamilyDetailsStepProps {
  data: any;
  onChange: (val: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const FloatingInput = ({ label, id, value, onChange, textarea = false }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const Component = textarea ? Textarea : Input;

  return (
    <div className="relative mt-4 w-full">
      <Component
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "bg-white/5 border-white/10 text-white pt-6 pb-2 px-4 h-auto min-h-[56px] transition-all focus:border-primary focus:ring-primary/20",
          textarea && "min-h-[100px]"
        )}
        data-testid={`input-${id}`}
      />
      <Label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all pointer-events-none text-white/50",
          (isFocused || value)
            ? "top-2 text-xs text-primary font-medium"
            : "top-1/2 -translate-y-1/2 text-sm"
        )}
      >
        {label}
      </Label>
    </div>
  );
};

function FamilyPhotoSlot({
  photo,
  index,
  onUpload,
  onRemove,
}: {
  photo: string | null;
  index: number;
  onUpload: (dataUrl: string) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div
      className={cn(
        "aspect-square rounded-2xl border-2 border-dashed transition-all group overflow-hidden relative cursor-pointer",
        photo
          ? "border-primary/40 bg-black"
          : "border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/10"
      )}
      onClick={() => !photo && inputRef.current?.click()}
      data-testid={`upload-family-photo-${index}`}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      ) : photo ? (
        <>
          <img src={photo} alt={`Family ${index + 1}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              className="h-8 w-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              <Camera className="h-4 w-4" />
            </button>
            <button
              className="h-8 w-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center text-red-400"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Plus className="h-6 w-6 text-white/30 group-hover:text-primary transition-colors" />
          <span className="text-[10px] text-white/30 uppercase tracking-widest mt-2">Slot {index + 1}</span>
        </div>
      )}
    </div>
  );
}

export default function FamilyDetailsStep({ data, onChange, onNext, onBack }: FamilyDetailsStepProps) {
  const updateFamily = (field: string, index: number, value: string) => {
    const newList = [...data[field]];
    newList[index] = value;
    onChange({ ...data, [field]: newList });
  };

  const updateSimpleField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateFamilyPhoto = (index: number, dataUrl: string) => {
    const photos = [...(data.photos || [null, null, null, null])];
    photos[index] = dataUrl;
    onChange({ ...data, photos });
  };

  const removeFamilyPhoto = (index: number) => {
    const photos = [...(data.photos || [null, null, null, null])];
    photos[index] = null;
    onChange({ ...data, photos });
  };

  const familyPhotos: (string | null)[] = Array.from({ length: 4 }, (_, i) => data.photos?.[i] || null);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-12 text-white">Family Blessings</h2>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Bride's Family */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-6">Bride's Family</h3>
          <div className="space-y-4">
            <FloatingInput label="Father's Name" id="bride-father" value={data.brideParents[0]} onChange={(v: string) => updateFamily("brideParents", 0, v)} />
            <FloatingInput label="Mother's Name" id="bride-mother" value={data.brideParents[1]} onChange={(v: string) => updateFamily("brideParents", 1, v)} />
            <FloatingInput label="Grandfather's Name" id="bride-gfather" value={data.brideGrandparents[0]} onChange={(v: string) => updateFamily("brideGrandparents", 0, v)} />
            <FloatingInput label="Grandmother's Name" id="bride-gmother" value={data.brideGrandparents[1]} onChange={(v: string) => updateFamily("brideGrandparents", 1, v)} />
          </div>
        </motion.div>

        {/* Groom's Family */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-6">Groom's Family</h3>
          <div className="space-y-4">
            <FloatingInput label="Father's Name" id="groom-father" value={data.groomParents[0]} onChange={(v: string) => updateFamily("groomParents", 0, v)} />
            <FloatingInput label="Mother's Name" id="groom-mother" value={data.groomParents[1]} onChange={(v: string) => updateFamily("groomParents", 1, v)} />
            <FloatingInput label="Grandfather's Name" id="groom-gfather" value={data.groomGrandparents[0]} onChange={(v: string) => updateFamily("groomGrandparents", 0, v)} />
            <FloatingInput label="Grandmother's Name" id="groom-gmother" value={data.groomGrandparents[1]} onChange={(v: string) => updateFamily("groomGrandparents", 1, v)} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <FloatingInput label="Family Blessing Quote" id="blessing-quote" value={data.blessingQuote} onChange={(v: string) => updateSimpleField("blessingQuote", v)} textarea />
          <FloatingInput label="Family Message" id="family-message" value={data.familyMessage} onChange={(v: string) => updateSimpleField("familyMessage", v)} textarea />
        </div>

        <div className="pt-8">
          <div className="flex items-center gap-2 mb-6">
            <Camera className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-serif text-primary">Family Photo Gallery</h3>
            <span className="text-xs text-white/30 ml-2">
              {familyPhotos.filter(Boolean).length}/4 uploaded
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {familyPhotos.map((photo, i) => (
              <FamilyPhotoSlot
                key={i}
                photo={photo}
                index={i}
                onUpload={(url) => updateFamilyPhoto(i, url)}
                onRemove={() => removeFamilyPhoto(i)}
              />
            ))}
          </div>
          <p className="text-xs text-white/30 text-center mt-4">Click any slot to upload a family photo</p>
        </div>
      </motion.div>
    </div>
  );
}
