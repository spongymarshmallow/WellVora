import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, ProgressEntry, DailyCalorieLog, Reminder, LocationData } from '@/types/user';

interface UserContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  progress: ProgressEntry[];
  calorieLogs: DailyCalorieLog[];
  reminders: Reminder[];
  locationData: LocationData | null;
  login: (email: string) => void;
  logout: () => void;
  setUserProfile: (profile: UserProfile) => void;
  addProgress: (entry: Omit<ProgressEntry, 'id'>) => void;
  addCalorieLog: (log: Omit<DailyCalorieLog, 'id'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  setLocationData: (data: LocationData) => void;
  hasCompletedProfile: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default reminders
const defaultReminders: Reminder[] = [
  { id: '1', title: 'Morning Skincare Routine', time: '07:00', category: 'skincare', isActive: true },
  { id: '2', title: 'Drink Water', time: '09:00', category: 'hydration', isActive: true },
  { id: '3', title: 'Lunch Time', time: '13:00', category: 'diet', isActive: true },
  { id: '4', title: 'Afternoon Hydration', time: '15:00', category: 'hydration', isActive: true },
  { id: '5', title: 'Evening Workout', time: '18:00', category: 'workout', isActive: true },
  { id: '6', title: 'Night Skincare Routine', time: '21:00', category: 'skincare', isActive: true },
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);
  const [calorieLogs, setCalorieLogs] = useState<DailyCalorieLog[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [locationData, setLocationDataState] = useState<LocationData | null>(null);

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
    setCalorieLogs([]);
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

  const addCalorieLog = (log: Omit<DailyCalorieLog, 'id'>) => {
    const newLog: DailyCalorieLog = {
      ...log,
      id: Date.now().toString(),
    };
    setCalorieLogs(prev => [newLog, ...prev]);
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const setLocationData = (data: LocationData) => {
    setLocationDataState(data);
  };

  const hasCompletedProfile = !!(user?.ageRange && user?.skinType && user?.hairType);

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      user,
      progress,
      calorieLogs,
      reminders,
      locationData,
      login,
      logout,
      setUserProfile,
      addProgress,
      addCalorieLog,
      addReminder,
      toggleReminder,
      deleteReminder,
      setLocationData,
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
