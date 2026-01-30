import React, { useState } from 'react';
import { UserProvider, useUser } from '@/context/UserContext';
import LoginScreen from '@/components/LoginScreen';
import ProfileSetup from '@/components/ProfileSetup';
import Dashboard from '@/components/Dashboard';

const AppContent: React.FC = () => {
  const { isLoggedIn, hasCompletedProfile } = useUser();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onComplete={() => setShowProfileSetup(true)} />;
  }

  if (!hasCompletedProfile || showProfileSetup) {
    return <ProfileSetup onComplete={() => setShowProfileSetup(false)} />;
  }

  return <Dashboard />;
};

const Index: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default Index;
