import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/create" component={CreateInvitationPage} />
      <Route path="/i/:slug" component={InvitationPage} />
      <Route path="/i/:slug/rsvp" component={RSVPPage} />
      <Route path="/i/:slug/memory" component={MemoryBookPage} />
      <Route path="/checkin/:invitationId" component={CheckinPage} />
      <Route path="/i/:slug/video" component={VideoInvitationPage} />
      <Route path="/save-the-date/:slug" component={SaveTheDatePage} />
      <Route path="/i/:slug/event/:eventName" component={EventInvitationPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
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
