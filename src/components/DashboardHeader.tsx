import React from 'react';
import { LogOut, User, Settings, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { calculateDailyNeeds } from '@/utils/recommendations';

interface DashboardHeaderProps {
  onNavigate: (page: 'dashboard' | 'tracking' | 'profile') => void;
  currentPage: 'dashboard' | 'tracking' | 'profile';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useUser();
  const dailyNeeds = user ? calculateDailyNeeds(user) : { calories: 2000, hydration: 2500, protein: 100 };

  return (
    <header className="glass-card sticky top-0 z-50 px-6 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold">Wellvora</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'dashboard'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('tracking')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              currentPage === 'tracking'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Progress Tracker
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              currentPage === 'profile'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Settings className="w-4 h-4" />
            Edit Profile
          </button>
        </nav>

        {/* Daily Stats (compact) */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          <div className="px-3 py-1.5 rounded-full bg-diet/10 border border-diet/30">
            <span className="text-diet font-medium">{dailyNeeds.calories} kcal</span>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-skincare/10 border border-skincare/30">
            <span className="text-skincare font-medium">{dailyNeeds.hydration}ml water</span>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-primary/30" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentPage === 'dashboard'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('tracking')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentPage === 'tracking'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Tracker
        </button>
        <button
          onClick={() => onNavigate('profile')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentPage === 'profile'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Profile
        </button>
      </nav>
    </header>
  );
};

export default DashboardHeader;
