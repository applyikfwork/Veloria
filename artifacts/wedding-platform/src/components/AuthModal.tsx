import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

const FloatingInput = ({ label, id, value, onChange, type = "text" }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mt-4 w-full">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "bg-white/5 border-white/10 text-white pt-6 pb-2 px-4 h-14 transition-all focus:border-primary focus:ring-primary/20",
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

export default function AuthModal({ isOpen, onSuccess, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password);
      toast({
        title: "Account created",
        description: "Please check your email for the confirmation link.",
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0B0B0F] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              data-testid="button-close-modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                <span className="text-2xl font-serif font-bold text-black">V</span>
              </div>
              <h2 className="text-2xl font-serif text-white mb-2" data-testid="text-modal-title">Save Your Invitation</h2>
              <p className="text-white/50 text-center text-sm" data-testid="text-modal-subtitle">
                Create a free account to save and share your wedding invitation
              </p>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-full p-1 mb-6">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-testid="tab-signin"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  data-testid="tab-signup"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <FloatingInput 
                    label="Email Address" 
                    id="signin-email" 
                    type="email" 
                    value={email} 
                    onChange={setEmail} 
                  />
                  <FloatingInput 
                    label="Password" 
                    id="signin-password" 
                    type="password" 
                    value={password} 
                    onChange={setPassword} 
                  />
                  
                  {error && (
                    <p className="text-destructive text-sm mt-2 text-center" data-testid="text-error">
                      {error}
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-lg mt-6 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                    data-testid="button-signin-submit"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <FloatingInput 
                    label="Email Address" 
                    id="signup-email" 
                    type="email" 
                    value={email} 
                    onChange={setEmail} 
                  />
                  <FloatingInput 
                    label="Password" 
                    id="signup-password" 
                    type="password" 
                    value={password} 
                    onChange={setPassword} 
                  />
                  <FloatingInput 
                    label="Confirm Password" 
                    id="signup-confirm-password" 
                    type="password" 
                    value={confirmPassword} 
                    onChange={setConfirmPassword} 
                  />
                  
                  {error && (
                    <p className="text-destructive text-sm mt-2 text-center" data-testid="text-error">
                      {error}
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-lg mt-6 shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                    data-testid="button-signup-submit"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
