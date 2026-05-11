import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ChevronLeft, X, Save, Eye, Check, Palette } from "lucide-react";
import { getTemplateById } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import WeddingTypeStep from "@/components/wizard/WeddingTypeStep";
import CoupleDetailsStep from "@/components/wizard/CoupleDetailsStep";
import FamilyDetailsStep from "@/components/wizard/FamilyDetailsStep";
import EventDetailsStep from "@/components/wizard/EventDetailsStep";
import DesignStyleStep from "@/components/wizard/DesignStyleStep";
import MusicVoiceStep from "@/components/wizard/MusicVoiceStep";
import PhotoGalleryStep from "@/components/wizard/PhotoGalleryStep";
import RSVPStep from "@/components/wizard/RSVPStep";
import LivePreviewStep from "@/components/wizard/LivePreviewStep";
import ExportShareStep from "@/components/wizard/ExportShareStep";
import LivePreviewPanel from "@/components/wizard/LivePreviewPanel";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { saveInvitation } from "@/lib/saveInvitation";

const TOTAL_STEPS = 10;

const STEP_NAMES = [
  "Wedding Type",
  "Couple Details",
  "Family Details",
  "Events",
  "Design Style",
  "Music & Voice",
  "Photos",
  "RSVP & Extras",
  "Live Preview",
  "Export & Share",
];

export default function CreateInvitationPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | undefined>();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Read template from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get('template');
    if (templateId) {
      const tmpl = getTemplateById(templateId);
      if (tmpl) {
        setSelectedTemplate(tmpl);
        setFormData(prev => ({ ...prev, designTheme: tmpl.designTheme, music: { ...prev.music, selectedMusic: tmpl.music } }));
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    weddingType: "",
    bride: { name: "", nickname: "", instagram: "", bio: "", photo: null as string | null },
    groom: { name: "", nickname: "", instagram: "", bio: "", photo: null as string | null },
    loveStory: { howTheyMet: "", specialMoments: "", proposalStory: "" },
    family: {
      brideParents: ["", ""],
      brideGrandparents: ["", ""],
      groomParents: ["", ""],
      groomGrandparents: ["", ""],
      blessingQuote: "",
      familyMessage: "",
      photos: [] as (string | null)[],
    },
    events: [] as any[],
    designTheme: "",
    music: { enabled: true, selectedMusic: "romantic", selectedVoice: "male-luxury" },
    photos: {
      couple: [] as (string | null)[],
      preWedding: [] as (string | null)[],
      family: [] as (string | null)[],
      video: null as string | null,
      createSlideshow: true,
      captions: {} as Record<string, string>,
    },
    rsvp: {
      enabled: true,
      message: "We can't wait to celebrate with you!",
      deadline: "",
      foodPreferences: ["veg"],
      whatsappEnabled: true,
      qrEnabled: false,
    },
    giftRegistry: {
      enabled: false,
      amazon: "",
      flipkart: "",
      custom: "",
      customLabel: "",
    },
    liveStream: {
      enabled: false,
      url: "",
      platform: "youtube",
    },
  });

  const handleSave = async (customSlug?: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const { slug } = await saveInvitation(formData, user.id, customSlug);
      setSavedSlug(slug);
      toast({
        title: "Success!",
        description: "Your invitation has been saved.",
      });
      if (currentStep < TOTAL_STEPS) {
        nextStep();
      }
    } catch (error: any) {
      toast({
        title: "Error saving invitation",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WeddingTypeStep
            data={formData.weddingType}
            onChange={(val) => updateFormData("weddingType", val)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <CoupleDetailsStep
            data={{ bride: formData.bride, groom: formData.groom, loveStory: formData.loveStory }}
            onChange={(val) => setFormData((prev) => ({ ...prev, ...val }))}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <FamilyDetailsStep
            data={formData.family}
            onChange={(val) => updateFormData("family", val)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <EventDetailsStep
            data={formData.events}
            onChange={(val) => updateFormData("events", val)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <DesignStyleStep
            data={formData.designTheme}
            onChange={(val) => updateFormData("designTheme", val)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <MusicVoiceStep
            data={formData.music}
            onChange={(val) => updateFormData("music", val)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <PhotoGalleryStep
            data={formData.photos}
            onChange={(val) => updateFormData("photos", val)}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 8:
        return (
          <RSVPStep
            data={formData.rsvp}
            onChange={(val) => updateFormData("rsvp", val)}
            onNext={nextStep}
            onBack={prevStep}
            giftRegistry={formData.giftRegistry}
            onGiftRegistryChange={(val) => updateFormData("giftRegistry", val)}
            liveStream={formData.liveStream}
            onLiveStreamChange={(val) => updateFormData("liveStream", val)}
          />
        );
      case 9:
        return (
          <LivePreviewStep
            data={formData}
            formData={formData}
            onChange={(val) => setFormData((prev) => ({ ...prev, ...val }))}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 10:
        return (
          <ExportShareStep
            formData={formData}
            onNext={nextStep}
            onBack={prevStep}
            savedSlug={savedSlug}
            isSaving={isSaving}
            onSaveSlug={handleSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-foreground font-sans relative overflow-hidden flex flex-col">
      {/* Floating particle background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{
              y: [null, Math.random() * 100 + "%"],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 md:mr-[340px]">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-widest text-primary font-medium">
                Step {currentStep} of {TOTAL_STEPS}
              </p>
              {selectedTemplate && (
                <span className="text-[10px] bg-primary/20 border border-primary/30 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Palette className="h-2.5 w-2.5" />
                  {selectedTemplate.name}
                </span>
              )}
            </div>
            <h1 className="text-lg font-serif">{STEP_NAMES[currentStep - 1]}</h1>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          className="text-white hover:bg-white/10"
          data-testid="button-exit"
        >
          <X className="h-6 w-6" />
        </Button>
      </header>

      {/* Progress Bar with step indicators */}
      <div className="relative z-10 px-6 py-3 bg-black/10 border-b border-white/5 md:mr-[340px]">
        <div className="flex items-center justify-between mb-2">
          {STEP_NAMES.map((name, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <div
                key={i}
                className="flex flex-col items-center gap-1 cursor-pointer"
                onClick={() => stepNum < currentStep && setCurrentStep(stepNum)}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary/30 border-2 border-primary text-primary"
                      : "bg-white/10 text-white/30"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : stepNum}
                </div>
                <span className={`text-[8px] uppercase tracking-wider hidden md:block transition-colors ${isCurrent ? "text-primary" : isCompleted ? "text-primary/60" : "text-white/20"}`}>
                  {name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
        <Progress
          value={(currentStep / TOTAL_STEPS) * 100}
          className="h-1 rounded-none bg-white/5"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto px-6 py-8 flex flex-col items-center md:mr-[340px]">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Floating Preview Button */}
      <div className="md:hidden fixed bottom-24 left-6 z-30">
        <Button
          onClick={() => setPreviewOpen(true)}
          className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center text-primary-foreground active:scale-95 transition-transform"
          data-testid="button-floating-preview"
        >
          <Eye className="h-6 w-6" />
        </Button>
      </div>

      <LivePreviewPanel
        formData={formData}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          handleSave();
        }}
      />

      {/* Footer Navigation */}
      <footer className="relative z-10 px-6 py-4 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-between md:justify-end gap-4 md:mr-[340px]">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="text-white md:hidden"
          data-testid="button-footer-back"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (currentStep === TOTAL_STEPS) {
              handleSave();
            } else {
              nextStep();
            }
          }}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95"
          data-testid="button-save-continue"
        >
          {currentStep === TOTAL_STEPS
            ? isSaving
              ? "Saving..."
              : "Finish"
            : "Save & Continue"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </footer>
    </div>
  );
}
