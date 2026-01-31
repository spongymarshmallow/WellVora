import React, { useState } from 'react';
import { Brain, Moon, Zap, Target, Heart, ChevronRight, ChevronLeft, Sparkles, Wind, Flower2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';

interface QuizQuestion {
  id: string;
  category: 'sleep' | 'stress' | 'focus' | 'motivation';
  question: string;
  options: { value: number; label: string; emoji: string }[];
  icon: React.ElementType;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'sleep-1',
    category: 'sleep',
    question: 'How would you describe your sleep quality over the past week?',
    icon: Moon,
    options: [
      { value: 4, label: 'Excellent - I wake up refreshed', emoji: '😴' },
      { value: 3, label: 'Good - Mostly restful nights', emoji: '🙂' },
      { value: 2, label: 'Fair - Some restless nights', emoji: '😐' },
      { value: 1, label: 'Poor - Frequent disturbances', emoji: '😞' },
    ],
  },
  {
    id: 'sleep-2',
    category: 'sleep',
    question: 'How many hours of sleep do you typically get?',
    icon: Moon,
    options: [
      { value: 4, label: '7-9 hours consistently', emoji: '⭐' },
      { value: 3, label: '6-7 hours most nights', emoji: '👍' },
      { value: 2, label: '5-6 hours on average', emoji: '😔' },
      { value: 1, label: 'Less than 5 hours', emoji: '😴' },
    ],
  },
  {
    id: 'stress-1',
    category: 'stress',
    question: 'How often do you feel overwhelmed by daily responsibilities?',
    icon: Zap,
    options: [
      { value: 4, label: 'Rarely - I manage well', emoji: '💪' },
      { value: 3, label: 'Sometimes - It varies', emoji: '🤔' },
      { value: 2, label: 'Often - Most days', emoji: '😓' },
      { value: 1, label: 'Almost always', emoji: '😰' },
    ],
  },
  {
    id: 'stress-2',
    category: 'stress',
    question: 'How do you typically respond to unexpected challenges?',
    icon: Zap,
    options: [
      { value: 4, label: 'Stay calm and problem-solve', emoji: '🧘' },
      { value: 3, label: 'Feel stressed but cope', emoji: '💭' },
      { value: 2, label: 'Get anxious but manage', emoji: '😟' },
      { value: 1, label: 'Feel very overwhelmed', emoji: '😫' },
    ],
  },
  {
    id: 'focus-1',
    category: 'focus',
    question: 'How well can you concentrate on tasks?',
    icon: Target,
    options: [
      { value: 4, label: 'Excellent focus for hours', emoji: '🎯' },
      { value: 3, label: 'Good with occasional breaks', emoji: '👀' },
      { value: 2, label: 'Frequently distracted', emoji: '🤯' },
      { value: 1, label: 'Very difficult to focus', emoji: '😵' },
    ],
  },
  {
    id: 'focus-2',
    category: 'focus',
    question: 'How often do you complete tasks on your to-do list?',
    icon: Target,
    options: [
      { value: 4, label: 'Almost always', emoji: '✅' },
      { value: 3, label: 'Usually get most done', emoji: '📝' },
      { value: 2, label: 'Sometimes struggle', emoji: '📋' },
      { value: 1, label: 'Rarely complete them', emoji: '❌' },
    ],
  },
  {
    id: 'motivation-1',
    category: 'motivation',
    question: 'How energized do you feel to start your day?',
    icon: Heart,
    options: [
      { value: 4, label: 'Very motivated and excited', emoji: '🚀' },
      { value: 3, label: 'Fairly energized', emoji: '☀️' },
      { value: 2, label: 'Takes effort to get going', emoji: '🌤️' },
      { value: 1, label: 'Very low energy', emoji: '🌧️' },
    ],
  },
  {
    id: 'motivation-2',
    category: 'motivation',
    question: 'How passionate do you feel about your daily activities?',
    icon: Heart,
    options: [
      { value: 4, label: 'Very passionate and engaged', emoji: '❤️‍🔥' },
      { value: 3, label: 'Mostly interested', emoji: '💙' },
      { value: 2, label: 'Going through motions', emoji: '💤' },
      { value: 1, label: 'Feel disconnected', emoji: '💔' },
    ],
  },
];

interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  icon: React.ElementType;
}

interface WellnessResult {
  overallScore: number;
  level: 'thriving' | 'balanced' | 'needs-attention' | 'needs-support';
  categoryScores: CategoryScore[];
  habits: string[];
  routines: string[];
  breathingYoga: string[];
  skinHairBodyLink: string[];
}

const categoryIcons: Record<string, React.ElementType> = {
  sleep: Moon,
  stress: Zap,
  focus: Target,
  motivation: Heart,
};

const categoryColors: Record<string, string> = {
  sleep: 'text-[hsl(var(--skincare))]',
  stress: 'text-[hsl(var(--haircare))]',
  focus: 'text-[hsl(var(--workout))]',
  motivation: 'text-[hsl(var(--diet))]',
};

const calculateResults = (answers: Record<string, number>): WellnessResult => {
  const categories = ['sleep', 'stress', 'focus', 'motivation'];
  const categoryScores: CategoryScore[] = categories.map((cat) => {
    const catAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith(cat))
      .map(([, val]) => val);
    const score = catAnswers.reduce((a, b) => a + b, 0);
    const maxScore = catAnswers.length * 4;
    return {
      category: cat,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      icon: categoryIcons[cat],
    };
  });

  const totalScore = categoryScores.reduce((a, b) => a + b.score, 0);
  const maxTotal = categoryScores.reduce((a, b) => a + b.maxScore, 0);
  const overallPercentage = Math.round((totalScore / maxTotal) * 100);

  let level: WellnessResult['level'];
  if (overallPercentage >= 80) level = 'thriving';
  else if (overallPercentage >= 60) level = 'balanced';
  else if (overallPercentage >= 40) level = 'needs-attention';
  else level = 'needs-support';

  // Generate personalized recommendations
  const habits: string[] = [];
  const routines: string[] = [];
  const breathingYoga: string[] = [];
  const skinHairBodyLink: string[] = [];

  const sleepScore = categoryScores.find((c) => c.category === 'sleep')?.percentage || 0;
  const stressScore = categoryScores.find((c) => c.category === 'stress')?.percentage || 0;
  const focusScore = categoryScores.find((c) => c.category === 'focus')?.percentage || 0;
  const motivationScore = categoryScores.find((c) => c.category === 'motivation')?.percentage || 0;

  // Sleep-related recommendations
  if (sleepScore < 60) {
    habits.push('Set a consistent bedtime and wake time, even on weekends');
    habits.push('Avoid screens 1 hour before bed');
    routines.push('Create a calming evening routine: warm shower, herbal tea, light reading');
    breathingYoga.push('Try 4-7-8 breathing technique before sleep');
    skinHairBodyLink.push('Poor sleep increases cortisol, which can trigger acne and hair thinning. Prioritizing rest supports your skin renewal cycle.');
  }

  // Stress-related recommendations
  if (stressScore < 60) {
    habits.push('Take 5-minute breaks every hour during work');
    habits.push('Practice gratitude journaling - write 3 things you\'re thankful for daily');
    routines.push('Start mornings with 10 minutes of quiet time before checking phones');
    breathingYoga.push('Box breathing (4 counts in, hold, out, hold) for instant calm');
    breathingYoga.push('Gentle yoga poses: Child\'s pose, Cat-cow stretches');
    skinHairBodyLink.push('High stress triggers inflammation, worsening skin conditions and hair fall. Managing stress directly benefits your appearance.');
  }

  // Focus-related recommendations
  if (focusScore < 60) {
    habits.push('Use the Pomodoro technique: 25 min focus, 5 min break');
    habits.push('Keep your workspace clutter-free');
    routines.push('Plan your top 3 priorities each morning');
    breathingYoga.push('Alternate nostril breathing to balance mental energy');
    skinHairBodyLink.push('Mental fog often correlates with nutritional deficiencies that also affect skin and hair health. Consider omega-3 rich foods.');
  }

  // Motivation-related recommendations
  if (motivationScore < 60) {
    habits.push('Set small, achievable daily goals to build momentum');
    habits.push('Celebrate small wins - acknowledge your progress');
    routines.push('Move your body for 10 minutes each morning');
    breathingYoga.push('Energizing breath of fire technique (in moderation)');
    breathingYoga.push('Sun salutations to boost morning energy');
    skinHairBodyLink.push('Low motivation often comes with reduced self-care. A consistent skincare routine can be a form of self-love that improves mood.');
  }

  // General recommendations for everyone
  if (habits.length === 0) {
    habits.push('Maintain your excellent habits with consistency');
    habits.push('Consider helping others on their wellness journey');
  }
  if (routines.length === 0) {
    routines.push('Your current routines are working well - keep them up!');
  }
  if (breathingYoga.length === 0) {
    breathingYoga.push('Continue any mindfulness practices you enjoy');
  }
  if (skinHairBodyLink.length === 0) {
    skinHairBodyLink.push('Your balanced mental state supports healthy skin cell turnover and strong hair growth. Keep it up!');
  }

  return {
    overallScore: overallPercentage,
    level,
    categoryScores,
    habits,
    routines,
    breathingYoga,
    skinHairBodyLink,
  };
};

const levelConfig = {
  thriving: {
    label: 'Thriving',
    color: 'bg-[hsl(var(--workout))]/20 text-[hsl(var(--workout))] border-[hsl(var(--workout))]/50',
    description: 'You\'re doing wonderfully! Your wellness practices are supporting your overall health.',
  },
  balanced: {
    label: 'Balanced',
    color: 'bg-[hsl(var(--skincare))]/20 text-[hsl(var(--skincare))] border-[hsl(var(--skincare))]/50',
    description: 'You\'re maintaining good balance. A few adjustments could help you thrive even more.',
  },
  'needs-attention': {
    label: 'Needs Attention',
    color: 'bg-[hsl(var(--haircare))]/20 text-[hsl(var(--haircare))] border-[hsl(var(--haircare))]/50',
    description: 'Some areas could use more focus. Small changes can make a big difference.',
  },
  'needs-support': {
    label: 'Needs Support',
    color: 'bg-[hsl(var(--diet))]/20 text-[hsl(var(--diet))] border-[hsl(var(--diet))]/50',
    description: 'It looks like you could benefit from some extra care. Consider starting with one small habit.',
  },
};

interface MentalHealthQuizProps {
  onBack: () => void;
}

const MentalHealthQuiz: React.FC<MentalHealthQuizProps> = ({ onBack }) => {
  const { user } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<WellnessResult | null>(null);

  const progress = (currentQuestion / quizQuestions.length) * 100;
  const currentQ = quizQuestions[currentQuestion];

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      const calculatedResults = calculateResults(newAnswers);
      setResults(calculatedResults);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                <Brain className="w-8 h-8 text-primary" />
                Your Wellness Assessment
              </h1>
              <p className="text-muted-foreground mt-1">Personalized insights based on your responses</p>
            </div>
          </div>

          {/* Overall Score Card */}
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <svg className="w-32 h-32" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${results.overallScore * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{results.overallScore}%</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <Badge className={`${levelConfig[results.level].color} text-sm px-4 py-1.5 mb-3`}>
                    {levelConfig[results.level].label}
                  </Badge>
                  <p className="text-muted-foreground max-w-md">
                    {levelConfig[results.level].description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {results.categoryScores.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card key={cat.category} className="glass-card card-hover">
                  <CardContent className="p-4 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${categoryColors[cat.category]}`} />
                    <h3 className="text-sm font-medium capitalize text-foreground">{cat.category}</h3>
                    <p className={`text-2xl font-bold ${categoryColors[cat.category]}`}>{cat.percentage}%</p>
                    <Progress value={cat.percentage} className="h-1.5 mt-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recommendations Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Habits */}
            <Card className="glass-card glow-border-workout">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--workout))]">
                  <Sparkles className="w-5 h-5" />
                  Suggested Habits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.habits.map((habit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-[hsl(var(--workout))] mt-0.5">•</span>
                      {habit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Routines */}
            <Card className="glass-card glow-border-skincare">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--skincare))]">
                  <Target className="w-5 h-5" />
                  Daily Routines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.routines.map((routine, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-[hsl(var(--skincare))] mt-0.5">•</span>
                      {routine}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Breathing & Yoga */}
            <Card className="glass-card glow-border-diet">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--diet))]">
                  <Wind className="w-5 h-5" />
                  Breathing & Yoga
                </CardTitle>
                <CardDescription className="text-xs">Optional calming exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.breathingYoga.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Flower2 className="w-4 h-4 text-[hsl(var(--diet))] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Skin, Hair & Body Connection */}
            <Card className="glass-card glow-border-haircare">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--haircare))]">
                  <Heart className="w-5 h-5" />
                  Mind-Body Connection
                </CardTitle>
                <CardDescription className="text-xs">How mental wellness affects appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.skinHairBodyLink.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-[hsl(var(--haircare))] mt-0.5">💡</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={restartQuiz} variant="outline" className="gap-2">
              Retake Quiz
            </Button>
            <Button onClick={onBack} className="btn-primary gap-2">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <Brain className="w-7 h-7 text-primary" />
              Mental Wellness Check
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Answer honestly - there are no right or wrong answers
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${
                currentQ.category === 'sleep' ? 'bg-[hsl(var(--skincare))]/20' :
                currentQ.category === 'stress' ? 'bg-[hsl(var(--haircare))]/20' :
                currentQ.category === 'focus' ? 'bg-[hsl(var(--workout))]/20' :
                'bg-[hsl(var(--diet))]/20'
              }`}>
                <currentQ.icon className={`w-5 h-5 ${categoryColors[currentQ.category]}`} />
              </div>
              <Badge variant="secondary" className="capitalize">{currentQ.category}</Badge>
            </div>
            <CardTitle className="text-xl text-foreground">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                  answers[currentQ.id] === option.value
                    ? 'bg-primary/20 border-primary text-foreground'
                    : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50 hover:border-border hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-medium">{option.label}</span>
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex gap-2">
            {quizQuestions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentQuestion ? 'bg-primary' :
                  i < currentQuestion ? 'bg-primary/50' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>
      </div>
    </div>
  );
};

export default MentalHealthQuiz;
