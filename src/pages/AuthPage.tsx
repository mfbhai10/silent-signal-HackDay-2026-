import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cloud, Sun } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Weather disguise header */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center animate-soft-pulse">
            <Sun className="w-10 h-10 text-primary" />
          </div>
          <Cloud className="absolute -right-2 top-2 w-7 h-7 text-muted-foreground/60" />
        </div>
        <h1 className="text-2xl font-light text-foreground">Weather</h1>
        <p className="text-sm text-muted-foreground">Sign in to sync your locations</p>
      </div>

      {sent ? (
        <div className="w-full max-w-sm text-center space-y-3">
          <div className="bg-card rounded-2xl p-6">
            <p className="text-foreground font-medium mb-2">Check your email</p>
            <p className="text-sm text-muted-foreground">
              We sent a sign-in link to <span className="text-primary">{email}</span>
            </p>
          </div>
          <button
            onClick={() => { setSent(false); setEmail(''); }}
            className="text-sm text-muted-foreground underline underline-offset-2"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="bg-card rounded-2xl p-1">
            <input
              id="email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <button
            id="signin-button"
            type="submit"
            disabled={loading || !email}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-medium disabled:opacity-50 transition-opacity active:opacity-75"
          >
            {loading ? 'Sending link…' : 'Continue with email'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthPage;
