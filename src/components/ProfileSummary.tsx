import React from 'react';
import { User, Droplets, Activity, Scale, Ruler, Leaf, FlaskConical, AlertTriangle } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { calculateDailyNeeds } from '@/utils/recommendations';

const ProfileSummary: React.FC = () => {
  const { user } = useUser();
  
  if (!user) return null;

  const dailyNeeds = calculateDailyNeeds(user);
  const bmi = (user.weight / Math.pow(user.height / 100, 2)).toFixed(1);
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-500' };
    if (bmi < 25) return { label: 'Normal', color: 'text-natural' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-haircare' };
    return { label: 'Obese', color: 'text-destructive' };
  };

  const bmiCategory = getBMICategory(parseFloat(bmi));

  // Analyze problems from goals
  const problems: string[] = [];
  if (user.skinGoals.toLowerCase().includes('acne') || user.skinGoals.toLowerCase().includes('pimple')) {
    problems.push('Acne-prone skin requiring targeted treatment');
  }
  if (user.skinGoals.toLowerCase().includes('dark') || user.skinGoals.toLowerCase().includes('pigment')) {
    problems.push('Pigmentation concerns needing brightening solutions');
  }
  if (user.hairGoals.toLowerCase().includes('fall') || user.hairGoals.toLowerCase().includes('loss')) {
    problems.push('Hair fall issue requiring strengthening routine');
  }
  if (user.hairGoals.toLowerCase().includes('dandruff')) {
    problems.push('Scalp health needs attention');
  }
  if (parseFloat(bmi) > 25) {
    problems.push('Weight management would benefit overall health');
  }
  if (user.activityLevel === 'sedentary') {
    problems.push('Low activity level affecting energy and metabolism');
  }

  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Photo & Basic Info */}
        <div className="flex items-start gap-4">
          {user.photo ? (
            <img
              src={user.photo}
              alt={user.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-display font-bold">{user.name}</h2>
            <p className="text-muted-foreground capitalize">
              {user.gender} • {user.ageRange} years
            </p>
            <div className="flex items-center gap-2 mt-2">
              {user.solutionPreference === 'natural' && (
                <span className="natural-badge text-xs">
                  <Leaf className="w-3 h-3 mr-1" />
                  Natural Preference
                </span>
              )}
              {user.solutionPreference === 'chemical' && (
                <span className="chemical-badge text-xs">
                  <FlaskConical className="w-3 h-3 mr-1" />
                  Clinical Preference
                </span>
              )}
              {user.solutionPreference === 'mixed' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-primary">
                  Mixed Approach
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-secondary/50 text-center">
            <Ruler className="w-5 h-5 mx-auto text-skincare mb-1" />
            <p className="text-lg font-semibold">{user.height} cm</p>
            <p className="text-xs text-muted-foreground">Height</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 text-center">
            <Scale className="w-5 h-5 mx-auto text-haircare mb-1" />
            <p className="text-lg font-semibold">{user.weight} kg</p>
            <p className="text-xs text-muted-foreground">Weight</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 text-center">
            <Activity className="w-5 h-5 mx-auto text-workout mb-1" />
            <p className={`text-lg font-semibold ${bmiCategory.color}`}>{bmi}</p>
            <p className="text-xs text-muted-foreground">BMI ({bmiCategory.label})</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/50 text-center">
            <Droplets className="w-5 h-5 mx-auto text-diet mb-1" />
            <p className="text-lg font-semibold">{dailyNeeds.hydration}ml</p>
            <p className="text-xs text-muted-foreground">Daily Water</p>
          </div>
        </div>
      </div>

      {/* Daily Requirements */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-diet/10 to-workout/10 border border-diet/20">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-diet" />
          Your Daily Nutritional Requirements
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-diet">{dailyNeeds.calories}</p>
            <p className="text-xs text-muted-foreground">Calories (kcal)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-skincare">{dailyNeeds.hydration}ml</p>
            <p className="text-xs text-muted-foreground">Water Intake</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-workout">{dailyNeeds.protein}g</p>
            <p className="text-xs text-muted-foreground">Protein Minimum</p>
          </div>
        </div>
      </div>

      {/* Problems Summary */}
      {problems.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-haircare" />
            Areas We'll Address
          </h3>
          <ul className="space-y-2">
            {problems.map((problem, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {problem}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Allergies Note */}
      {user.allergies && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm">
            <span className="font-medium text-destructive">Allergies noted:</span>{' '}
            <span className="text-muted-foreground">{user.allergies}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileSummary;
