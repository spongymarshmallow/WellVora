import React, { useState, useMemo } from 'react';
import { Sparkles, Scissors, Dumbbell, Utensils, Info } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import DashboardHeader from './DashboardHeader';
import ProfileSummary from './ProfileSummary';
import RecommendationCard from './RecommendationCard';
import ProgressTracker from './ProgressTracker';
import ProfileSetup from './ProfileSetup';
import {
  generateSkincareRecommendations,
  generateHaircareRecommendations,
  generateWorkoutRecommendations,
  generateDietRecommendations,
} from '@/utils/recommendations';

type TabType = 'skincare' | 'haircare' | 'workout' | 'diet';
type PageType = 'dashboard' | 'tracking' | 'profile';

const tabConfig = {
  skincare: { label: 'Skincare', icon: Sparkles, color: 'skincare' },
  haircare: { label: 'Haircare', icon: Scissors, color: 'haircare' },
  workout: { label: 'Workouts', icon: Dumbbell, color: 'workout' },
  diet: { label: 'Diet & Nutrition', icon: Utensils, color: 'diet' },
};

const Dashboard: React.FC = () => {
  const { user, hasCompletedProfile } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('skincare');
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const recommendations = useMemo(() => {
    if (!user) return { skincare: [], haircare: [], workout: [], diet: [] };
    
    return {
      skincare: generateSkincareRecommendations(user),
      haircare: generateHaircareRecommendations(user),
      workout: generateWorkoutRecommendations(user),
      diet: generateDietRecommendations(user),
    };
  }, [user]);

  if (!hasCompletedProfile) {
    return <ProfileSetup onComplete={() => {}} />;
  }

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen">
        <DashboardHeader onNavigate={setCurrentPage} currentPage={currentPage} />
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <ProfileSetup onComplete={() => setCurrentPage('dashboard')} />
        </div>
      </div>
    );
  }

  if (currentPage === 'tracking') {
    return (
      <div className="min-h-screen">
        <DashboardHeader onNavigate={setCurrentPage} currentPage={currentPage} />
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <ProgressTracker />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="max-w-7xl mx-auto px-4 pb-8">
        {/* Profile Summary */}
        <ProfileSummary />

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(tabConfig) as TabType[]).map((tab) => {
            const config = tabConfig[tab];
            const Icon = config.icon;
            const isActive = activeTab === tab;
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? `bg-${config.color}/10 text-${config.color} border border-${config.color}/30 shadow-lg`
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
                style={isActive ? { boxShadow: `0 0 20px -5px var(--${config.color})` } : {}}
              >
                <Icon className="w-4 h-4" />
                {config.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? `bg-${config.color}/20` : 'bg-muted'
                }`}>
                  {recommendations[tab].length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className={`text-2xl font-display font-bold text-${tabConfig[activeTab].color}`}>
            {tabConfig[activeTab].label} Recommendations
          </h2>
          <p className="text-muted-foreground mt-1">
            Personalized solutions based on your profile and goals
          </p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {recommendations[activeTab].map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} category={activeTab} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="glass-card p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Disclaimer</p>
            <p>
              This app provides general wellness guidance based on your inputs. Results may vary 
              and timelines are estimates based on typical experiences. Always patch test new 
              products and consult professionals for persistent issues.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
