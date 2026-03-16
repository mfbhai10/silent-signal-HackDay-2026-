import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ReceiverPage from "./pages/ReceiverPage";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes (magic link, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Still loading session — show nothing to avoid flash
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-background" />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public — only for unauthenticated users */}
            <Route
              path="/login"
              element={
                session ? <Navigate to="/" replace /> : <AuthPage />
              }
            />

            {/* Protected — require auth */}
            <Route
              path="/"
              element={
                session ? (
                  <Index user={session.user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/receiver"
              element={
                session ? (
                  <ReceiverPage user={session.user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
