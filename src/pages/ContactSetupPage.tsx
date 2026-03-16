import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface ContactSetupPageProps {
  user: User;
  onComplete: () => void;
}

const ContactSetupPage = ({ user, onComplete }: ContactSetupPageProps) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase
      .from('contacts')
      .insert({
        owner_id: user.id,
        contact_email: contactEmail.trim().toLowerCase(),
        contact_name: contactName.trim() || null,
      });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-xl font-light text-foreground mb-2">
            Add a trusted contact
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This person will receive your alerts. They must also have this app and an account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="bg-card rounded-2xl p-1">
            <input
              id="contact-name-input"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Their name (optional)"
              className="w-full bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-sm"
            />
          </div>

          <div className="bg-card rounded-2xl p-1">
            <input
              id="contact-email-input"
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Their email address"
              className="w-full bg-transparent px-4 py-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <button
            id="save-contact-button"
            type="submit"
            disabled={loading || !contactEmail}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-sm font-medium disabled:opacity-50 transition-opacity active:opacity-75 mt-2"
          >
            {loading ? 'Saving…' : 'Save contact'}
          </button>
        </form>

        <button
          onClick={onComplete}
          className="mt-4 text-sm text-muted-foreground/60 text-center w-full"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default ContactSetupPage;
