import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import DisguisedHome from '@/components/DisguisedHome';
import SignalSelection, { SignalType } from '@/components/SignalSelection';
import SignalConfirmation from '@/components/SignalConfirmation';
import ReceiverView from '@/components/ReceiverView';
import ContactSetupPage from './ContactSetupPage';

type AppScreen = 'loading' | 'contact-setup' | 'disguised' | 'signal-select' | 'confirmation' | 'sent';

interface IndexProps {
  user: User;
}

const Index = ({ user }: IndexProps) => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('loading');
  const [selectedSignal, setSelectedSignal] = useState<SignalType | null>(null);

  // Check if user has at least one contact configured
  useEffect(() => {
    const checkContacts = async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (!error && data && data.length > 0) {
        setCurrentScreen('disguised');
      } else {
        setCurrentScreen('contact-setup');
      }
    };
    checkContacts();
  }, [user.id]);

  const handleActivateSignal = useCallback(() => {
    setCurrentScreen('signal-select');
  }, []);

  const handleSelectSignal = useCallback((signal: SignalType) => {
    setSelectedSignal(signal);
    setCurrentScreen('confirmation');
  }, []);

  const handleConfirmationComplete = useCallback(() => {
    setCurrentScreen('sent');
  }, []);

  const handleDismiss = useCallback(() => {
    setSelectedSignal(null);
    setCurrentScreen('disguised');
  }, []);

  const handleBackToDisguised = useCallback(() => {
    setCurrentScreen('disguised');
  }, []);

  const handleCancelSignal = useCallback(() => {
    setSelectedSignal(null);
    setCurrentScreen('disguised');
  }, []);

  const handleContactSetupComplete = useCallback(() => {
    setCurrentScreen('disguised');
  }, []);

  if (currentScreen === 'loading') {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {currentScreen === 'contact-setup' && (
        <ContactSetupPage user={user} onComplete={handleContactSetupComplete} />
      )}

      {currentScreen === 'disguised' && (
        <DisguisedHome onActivateSignal={handleActivateSignal} />
      )}

      {currentScreen === 'signal-select' && (
        <SignalSelection
          onSelectSignal={handleSelectSignal}
          onBack={handleBackToDisguised}
        />
      )}

      {currentScreen === 'confirmation' && selectedSignal && (
        <SignalConfirmation
          signal={selectedSignal}
          user={user}
          onComplete={handleConfirmationComplete}
          onCancel={handleCancelSignal}
        />
      )}

      {currentScreen === 'sent' && selectedSignal && (
        <ReceiverView
          signal={selectedSignal}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};

export default Index;
