export interface UserProfile {
  email: string;
  name: string;
  photo?: string;
  gender: 'male' | 'female' | 'other';
  ageRange: string;
  height: number; // in cm
  weight: number; // in kg
  budget: string;
  allergies: string;
  skinType: string;
  hairType: string;
  activityLevel: string;
  solutionPreference: 'natural' | 'chemical' | 'mixed';
  skinGoals: string;
  hairGoals: string;
  bodyGoals: string;
}

export interface ProgressEntry {
  id: string;
  date: string;
  category: 'skincare' | 'haircare' | 'workout' | 'diet';
  notes: string;
  rating: number; // 1-5
  improvements: string[];
  caloriesConsumed?: number;
  waterIntake?: number; // in ml
}

export interface DailyCalorieLog {
  id: string;
  date: string;
  time: string;
  caloriesConsumed: number;
  waterIntake: number;
  targetCalories: number;
  targetWater: number;
}

export interface Reminder {
  id: string;
  title: string;
  time: string;
  category: 'skincare' | 'haircare' | 'workout' | 'diet' | 'hydration';
  isActive: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  whyItFits: string;
  ingredients: {
    prefer: string[];
    avoid: string[];
  };
  naturalSolution: {
    title: string;
    description: string;
    timeline: string;
    cost: string;
  };
  chemicalSolution: {
    title: string;
    description: string;
    timeline: string;
    cost: string;
  };
  budgetNote: string;
  timeline: string;
  image: string;
}
