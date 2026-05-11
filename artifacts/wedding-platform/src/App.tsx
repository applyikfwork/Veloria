import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import CreateInvitationPage from "./pages/create-invitation";
import InvitationPage from "./pages/invitation";
import RSVPPage from "./pages/rsvp";
import CheckinPage from "./pages/checkin";
import VideoInvitationPage from "./pages/video-invitation";
import SaveTheDatePage from "./pages/save-the-date";
import EventInvitationPage from "./pages/event-invitation";
import MemoryBookPage from "./pages/memory-book";
import DashboardPage from "./pages/dashboard";
import TemplatesPage from "./pages/templates-page";

const queryClient = new QueryClient();

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.25,
  ease: "easeInOut" as const,
};

function AnimatedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ width: "100%", minHeight: "100vh" }}
    >
      <Component />
    </motion.div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={() => <AnimatedRoute component={HomePage} />} />
        <Route path="/templates" component={() => <AnimatedRoute component={TemplatesPage} />} />
        <Route path="/create" component={() => <AnimatedRoute component={CreateInvitationPage} />} />
        <Route path="/i/:slug" component={() => <AnimatedRoute component={InvitationPage} />} />
        <Route path="/i/:slug/rsvp" component={() => <AnimatedRoute component={RSVPPage} />} />
        <Route path="/i/:slug/memory" component={() => <AnimatedRoute component={MemoryBookPage} />} />
        <Route path="/checkin/:invitationId" component={() => <AnimatedRoute component={CheckinPage} />} />
        <Route path="/i/:slug/video" component={() => <AnimatedRoute component={VideoInvitationPage} />} />
        <Route path="/save-the-date/:slug" component={() => <AnimatedRoute component={SaveTheDatePage} />} />
        <Route path="/i/:slug/event/:eventName" component={() => <AnimatedRoute component={EventInvitationPage} />} />
        <Route path="/dashboard" component={() => <AnimatedRoute component={DashboardPage} />} />
        <Route component={() => <AnimatedRoute component={NotFound} />} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
