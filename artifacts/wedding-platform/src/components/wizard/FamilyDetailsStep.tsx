import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Plus } from "lucide-react";
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

export default function FamilyDetailsStep({ data, onChange, onNext, onBack }: FamilyDetailsStepProps) {
  const updateFamily = (field: string, index: number, value: string) => {
    const newList = [...data[field]];
    newList[index] = value;
    onChange({ ...data, [field]: newList });
  };

  const updateSimpleField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif text-center mb-12 text-white">Family Blessings</h2>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Bride's Family */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-6">Bride's Family</h3>
          <div className="space-y-4">
            <FloatingInput label="Father's Name" id="bride-father" value={data.brideParents[0]} onChange={(v: string) => updateFamily('brideParents', 0, v)} />
            <FloatingInput label="Mother's Name" id="bride-mother" value={data.brideParents[1]} onChange={(v: string) => updateFamily('brideParents', 1, v)} />
            <FloatingInput label="Grandfather's Name" id="bride-gfather" value={data.brideGrandparents[0]} onChange={(v: string) => updateFamily('brideGrandparents', 0, v)} />
            <FloatingInput label="Grandmother's Name" id="bride-gmother" value={data.brideGrandparents[1]} onChange={(v: string) => updateFamily('brideGrandparents', 1, v)} />
          </div>
        </motion.div>

        {/* Groom's Family */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xl font-serif text-primary border-b border-primary/20 pb-2 mb-6">Groom's Family</h3>
          <div className="space-y-4">
            <FloatingInput label="Father's Name" id="groom-father" value={data.groomParents[0]} onChange={(v: string) => updateFamily('groomParents', 0, v)} />
            <FloatingInput label="Mother's Name" id="groom-mother" value={data.groomParents[1]} onChange={(v: string) => updateFamily('groomParents', 1, v)} />
            <FloatingInput label="Grandfather's Name" id="groom-gfather" value={data.groomGrandparents[0]} onChange={(v: string) => updateFamily('groomGrandparents', 0, v)} />
            <FloatingInput label="Grandmother's Name" id="groom-gmother" value={data.groomGrandparents[1]} onChange={(v: string) => updateFamily('groomGrandparents', 1, v)} />
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
          <FloatingInput label="Family Blessing Quote" id="blessing-quote" value={data.blessingQuote} onChange={(v: string) => updateSimpleField('blessingQuote', v)} textarea />
          <FloatingInput label="Family Message" id="family-message" value={data.familyMessage} onChange={(v: string) => updateSimpleField('familyMessage', v)} textarea />
        </div>

        <div className="pt-8">
          <h3 className="text-xl font-serif text-primary mb-6">Family Photo Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/10 transition-all group"
                data-testid={`upload-family-photo-${i}`}
              >
                <Plus className="h-6 w-6 text-white/30 group-hover:text-primary transition-colors" />
                <span className="text-[10px] text-white/30 uppercase tracking-widest mt-2">Slot {i+1}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
