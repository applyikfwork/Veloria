import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, X, Eye, Check, Save } from "lucide-react";
import { getTemplateModule } from "@/templates/registry";
import type { TemplateModule } from "@/templates/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import WizardEngine, { setByPath } from "@/components/wizard/WizardEngine";
import ExportShareStep from "@/components/wizard/ExportShareStep";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { saveInvitation } from "@/lib/saveInvitation";

export default function CreateInvitationPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [templateModule, setTemplateModule] = useState<TemplateModule | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | undefined>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('template');
    if (templateId) {
      const mod = getTemplateModule(templateId);
      if (mod) {
        setTemplateModule(mod);
        setFormData({ ...mod.defaultFormData });
        return;
      }
    }
    setLocation('/templates');
  }, []);

  if (!templateModule) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading template...</div>
      </div>
    );
  }

  const wizardSteps = templateModule.wizardSteps;
  const totalSteps = wizardSteps.length + 1;
  const isShareStep = currentStep === totalSteps;
  const currentWizardStep = !isShareStep ? wizardSteps[currentStep - 1] : null;
  const stepName = currentWizardStep ? currentWizardStep.title : 'Share';

  const handleFieldChange = (path: string, value: any) => {
    setFormData(prev => setByPath(prev, path, value));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(p => p + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(p => p - 1);
    }
  };

  const handleSave = async (customSlug?: string) => {
    if (!user) { setAuthModalOpen(true); return; }
    setIsSaving(true);
    try {
      const { slug } = await saveInvitation(formData, user.id, customSlug);
      setSavedSlug(slug);
      toast({ title: 'Invitation saved!', description: 'Your invitation is live.' });
      if (currentStep < totalSteps) nextStep();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not save.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 400 : -400, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-foreground flex flex-col overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: templateModule.accentColor + '40' }}
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0.2 }}
            animate={{ y: [null, Math.random() * 100 + '%'], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: Math.random() * 20 + 10, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-xs uppercase tracking-widest font-medium" style={{ color: templateModule.accentColor }}>
                Step {currentStep} of {totalSteps}
              </p>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border"
                style={{ backgroundColor: templateModule.accentColor + '15', borderColor: templateModule.accentColor + '40', color: templateModule.accentColor }}
              >
                {templateModule.heroEmoji} {templateModule.name}
              </span>
            </div>
            <h1 className="text-lg font-serif text-white">{stepName}</h1>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation('/templates')}
          className="text-white hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </Button>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-6 py-3 bg-black/10 border-b border-white/5">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <button
                key={i}
                onClick={() => stepNum < currentStep && setCurrentStep(stepNum)}
                className="flex flex-col items-center gap-1 flex-1 group"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                  style={{
                    backgroundColor: isCompleted ? templateModule.accentColor : isCurrent ? templateModule.accentColor + '30' : '#ffffff10',
                    border: isCurrent ? `2px solid ${templateModule.accentColor}` : 'none',
                    color: isCompleted ? '#000' : isCurrent ? templateModule.accentColor : '#ffffff30',
                  }}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : stepNum}
                </div>
                <span
                  className="text-[8px] uppercase tracking-wider hidden md:block truncate max-w-[60px] text-center"
                  style={{ color: isCurrent ? templateModule.accentColor : isCompleted ? templateModule.accentColor + '60' : '#ffffff20' }}
                >
                  {i < wizardSteps.length ? wizardSteps[i].title.split(' ')[0] : 'Share'}
                </span>
              </button>
            );
          })}
        </div>
        <Progress
          value={(currentStep / totalSteps) * 100}
          className="h-0.5 rounded-none bg-white/5"
        />
      </div>

      {/* Main content */}
      <main className="flex-1 relative z-10 overflow-y-auto px-6 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.15 } }}
              className="w-full"
            >
              {isShareStep ? (
                <ExportShareStep
                  formData={formData}
                  onNext={nextStep}
                  onBack={prevStep}
                  savedSlug={savedSlug}
                  isSaving={isSaving}
                  onSaveSlug={handleSave}
                />
              ) : currentWizardStep ? (
                <WizardEngine
                  step={currentWizardStep}
                  formData={formData}
                  onFieldChange={handleFieldChange}
                  accentColor={templateModule.accentColor}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-between md:justify-end gap-4">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="text-white md:hidden"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (isShareStep) {
              handleSave();
            } else {
              nextStep();
            }
          }}
          disabled={isSaving}
          className="px-8 rounded-full shadow-lg transition-all active:scale-95 text-black font-semibold"
          style={{ backgroundColor: templateModule.accentColor }}
        >
          {isShareStep
            ? isSaving ? 'Saving...' : 'Save & Go Live'
            : 'Continue'}
          {!isShareStep && <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />}
        </Button>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => { setAuthModalOpen(false); handleSave(); }}
      />
    </div>
  );
}
