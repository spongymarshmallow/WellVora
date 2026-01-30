import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, ProgressEntry } from '@/types/user';

interface UserContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  progress: ProgressEntry[];
  login: (email: string) => void;
  logout: () => void;
  setUserProfile: (profile: UserProfile) => void;
  addProgress: (entry: Omit<ProgressEntry, 'id'>) => void;
  hasCompletedProfile: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUser(prev => prev ? { ...prev, email } : {
      email,
      name: email.split('@')[0],
      gender: 'male',
      ageRange: '',
      height: 170,
      weight: 70,
      budget: '',
      allergies: '',
      skinType: '',
      hairType: '',
      activityLevel: '',
      solutionPreference: 'mixed',
      skinGoals: '',
      hairGoals: '',
      bodyGoals: '',
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setProgress([]);
  };

  const setUserProfile = (profile: UserProfile) => {
    setUser(profile);
  };

  const addProgress = (entry: Omit<ProgressEntry, 'id'>) => {
    const newEntry: ProgressEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setProgress(prev => [newEntry, ...prev]);
  };

  const hasCompletedProfile = !!(user?.ageRange && user?.skinType && user?.hairType);

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      user,
      progress,
      login,
      logout,
      setUserProfile,
      addProgress,
      hasCompletedProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
