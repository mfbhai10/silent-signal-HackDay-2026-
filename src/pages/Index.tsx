import { useState } from 'react';
import DisguisedHome from '@/components/DisguisedHome';
import SignalSelection, { SignalType } from '@/components/SignalSelection';
import SignalConfirmation from '@/components/SignalConfirmation';
import ReceiverView from '@/components/ReceiverView';

type AppScreen = 'disguised' | 'signal-select' | 'confirmation' | 'receiver';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('disguised');
  const [selectedSignal, setSelectedSignal] = useState<SignalType | null>(null);

  const handleActivateSignal = () => {
    setCurrentScreen('signal-select');
  };

  const handleSelectSignal = (signal: SignalType) => {
    setSelectedSignal(signal);
    setCurrentScreen('confirmation');
  };

  const handleConfirmationComplete = () => {
    setCurrentScreen('receiver');
  };

  const handleDismiss = () => {
    setSelectedSignal(null);
    setCurrentScreen('disguised');
  };

  const handleBackToDisguised = () => {
    setCurrentScreen('disguised');
  };

  return (
    <div className="min-h-screen overflow-hidden">
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
          onComplete={handleConfirmationComplete}
        />
      )}

      {currentScreen === 'receiver' && selectedSignal && (
        <ReceiverView 
          signal={selectedSignal}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};

export default Index;
